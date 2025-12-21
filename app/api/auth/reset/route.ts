import { NextResponse } from 'next/server'
import fs from 'fs/promises'
import path from 'path'
const USERS_FILE = path.join(process.cwd(), 'data', 'users.json')
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
    const { token, password } = await req.json()
    if (!token || !password) return NextResponse.json({ message: 'Token and password are required' }, { status: 400 })

    const tokens = await readJSON(TOKENS_FILE)
    const tokenEntry = tokens.find((t) => t.token === token)
    if (!tokenEntry) return NextResponse.json({ message: 'Invalid or expired token' }, { status: 400 })

    if (tokenEntry.expiresAt < Date.now()) return NextResponse.json({ message: 'Token expired' }, { status: 400 })

    const users = await readJSON(USERS_FILE)
    const userIndex = users.findIndex((u) => u.email.toLowerCase() === tokenEntry.email.toLowerCase())
    if (userIndex === -1) return NextResponse.json({ message: 'User not found' }, { status: 400 })

    const bcrypt = (await import('bcryptjs')).default
    const hashed = await bcrypt.hash(password, 10)
    users[userIndex].password = hashed
    await writeJSON(USERS_FILE, users)

    // remove token
    const remaining = tokens.filter((t) => t.token !== token)
    await writeJSON(TOKENS_FILE, remaining)

    return NextResponse.json({ message: 'Password reset successful' })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ message: 'Internal error' }, { status: 500 })
  }
}