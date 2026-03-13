"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
} from "react"
import { ChatView, Message } from "./types"

interface ChatContextType {
  view: ChatView
  navigate: (view: ChatView) => void
  messages: Message[]
  sendMessage: (content: string) => Promise<void>
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ChatView>("home")
  const [messages, setMessages] = useState<Message[]>([])

  const navigate = useCallback((nextView: ChatView) => {
    setView(nextView)
  }, [])

  const sendMessage = useCallback(async (content: string) => {
  // 1️⃣ Add user message immediately
  const userMessage: Message = {
    id: crypto.randomUUID(),
    role: "user",
    content,
    createdAt: new Date(),
  }

  setMessages((prev) => [...prev, userMessage])

  // 2️⃣ Add temporary assistant typing message
  const typingId = crypto.randomUUID()

  const typingMessage: Message = {
    id: typingId,
    role: "assistant",
    content: "",
    createdAt: new Date(),
    isTyping: true,
  }

  setMessages((prev) => [...prev, typingMessage])

  // 3️⃣ Call API
  const response = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: content }),
  })

  const data: { reply: string } = await response.json()

  // 4️⃣ Replace typing message with real response
  setMessages((prev) =>
    prev.map((msg) =>
      msg.id === typingId
        ? { ...msg, content: data.reply, isTyping: false }
        : msg
    )
  )
}, [])

  return (
    <ChatContext.Provider
      value={{
        view,
        navigate,
        messages,
        sendMessage,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat(): ChatContextType {
  const context = useContext(ChatContext)
  if (!context) {
    throw new Error("useChat must be used within ChatProvider")
  }
  return context
}