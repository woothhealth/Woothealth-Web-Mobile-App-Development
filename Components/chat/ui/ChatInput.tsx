"use client"

import { FormEvent, useState } from "react"
import { useChat } from "../ChatProvider"

export default function ChatInput() {
  const { sendMessage } = useChat()
  const [value, setValue] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!value.trim()) return

    await sendMessage(value)
    setValue("")
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t p-3 flex gap-2"
    >
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        className="flex-1 border rounded-lg px-3 py-2 text-sm"
        placeholder="Type a message..."
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 rounded-lg"
      >
        Send
      </button>
    </form>
  )
}