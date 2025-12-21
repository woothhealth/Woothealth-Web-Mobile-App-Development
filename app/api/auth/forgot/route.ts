import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'

const TOKENS_FILE = path.join(process.cwd(), 'data', 'passwordResetTokens.json')

async function readJSON(filePath: string): Promise<Record<string, unknown>[]> {
  try {
    const raw = await fs.readFile(filePath, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

async function writeJSON(filePath: string, data: unknown): Promise<void> {
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8')
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()
    if (!email) return NextResponse.json({ message: 'Email is required' }, { status: 400 })

    // Create token entry regardless of whether user exists to avoid leaking
    const token = (globalThis as unknown as { crypto?: { randomUUID?: () => string } }).crypto?.randomUUID?.() || Math.random().toString(36).slice(2)
    const expiresAt = Date.now() + 1000 * 60 * 60 // 1 hour

    const tokens = await readJSON(TOKENS_FILE)
    tokens.push({ token, email: email.toLowerCase(), expiresAt })
    await writeJSON(TOKENS_FILE, tokens)

    // Build reset URL
    const host = req.headers.get('host') || process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000'
    const protocol = host.includes('localhost') ? 'http' : 'https'
    const resetLink = `${protocol}://${host}/auth/reset-password/${token}`

    // Try to send email if SMTP config exists, otherwise log link
    if (process.env.EMAIL_SMTP_HOST) {
      try {
        // dynamic import to avoid requiring nodemailer if not installed
        const nodemailer = (await import('nodemailer')).default
        const transporter = nodemailer.createTransport({
          host: process.env.EMAIL_SMTP_HOST,
          port: Number(process.env.EMAIL_SMTP_PORT) || 587,
          secure: false,
          auth: process.env.EMAIL_SMTP_USER
            ? { user: process.env.EMAIL_SMTP_USER, pass: process.env.EMAIL_SMTP_PASS }
            : undefined,
        })

        await transporter.sendMail({
          from: process.env.EMAIL_FROM || 'no-reply@example.com',
          to: email,
          subject: 'Password reset',
          text: `Use this link to reset your password: ${resetLink}`,
          html: `<p>Use this link to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p>`,
        })
      } catch (e) {
        console.error('Failed sending email', e)
      }
    } else {
      console.log('Password reset link:', resetLink)
    }

    // Always return success to not reveal whether email was registered
    return NextResponse.json({ message: 'If that email is registered, a reset link has been sent.' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
}