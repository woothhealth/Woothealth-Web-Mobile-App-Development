export type ChatView = "home" | "messages"

export type Role = "user" | "assistant"

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: Date
  isTyping?: boolean
}

export interface ChatState {
  view: ChatView
  messages: Message[]
}