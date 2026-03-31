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

/**
 * Bitrix24 related types
 */
export interface Bitrix24Config {
  scriptUrl: string
  autoLoad?: boolean
  onReady?: () => void
}

export interface Bitrix24State {
  isLoading: boolean
  isReady: boolean
  error: string | null
}

export interface ChatVisibilityState {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}