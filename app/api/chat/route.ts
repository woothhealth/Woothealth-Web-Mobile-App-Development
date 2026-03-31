import { NextRequest, NextResponse } from "next/server"
import OpenAI from 'openai'

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  // Initialize OpenAI client inside the function to avoid build-time errors
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })

  const body: { message: string } = await req.json()

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful assistant for HMO users" + "you address people as potential clients for Woothealth" + "You go straight to the point, your replies are under 500 characters." },
      { role: "user", content: body.message },
    ],
    // stream: true,
    temperature: 1,
  })

  return NextResponse.json({
    reply: completion.choices[0].message.content,
  })
}