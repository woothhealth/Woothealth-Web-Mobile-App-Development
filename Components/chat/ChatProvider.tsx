"use client"

import {
  createContext,
  useContext,
  useState,
  ReactNode,
  useCallback,
  useEffect,
} from "react"
import { ChatView, Message } from "./types"
import { sendMessageToBitrix24, type BitrixMessage } from "./services/bitrix24Service"
import { useBitrix24Script } from "./hooks"

interface ChatContextType {
  view: ChatView
  navigate: (view: ChatView) => void
  messages: Message[]
  sendMessage: (content: string, email: string, name: string) => Promise<void>
  userEmail: string
  setUserEmail: (email: string) => void
  userName: string
  setUserName: (name: string) => void
  isLoading: boolean
  error: string | null
  bitrix24Ready: boolean
  bitrix24Error: string | null
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: ReactNode }) {
  const [view, setView] = useState<ChatView>("home")
  const [messages, setMessages] = useState<Message[]>([])
  const [userEmail, setUserEmail] = useState<string>("")
  const [userName, setUserName] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [bitrix24Ready, setBitrix24Ready] = useState<boolean>(false)
  const [bitrix24Error, setBitrix24Error] = useState<string | null>(null)

  // Load Bitrix24 script
  const { isReady: bitrixReady, error: bitrixInitError } = useBitrix24Script({
    autoLoad: true,
    onReady: () => {
      setBitrix24Ready(true)
      console.log("✅ Bitrix24 ready in ChatProvider")
    },
  })

  // Update Bitrix24 state when it changes
  useEffect(() => {
    setBitrix24Ready(bitrixReady)
    if (bitrixInitError) {
      setBitrix24Error(bitrixInitError)
    }
  }, [bitrixReady, bitrixInitError])

  const navigate = useCallback((nextView: ChatView) => {
    setView(nextView)
  }, [])

  const sendMessage = useCallback(async (content: string, email: string, name: string) => {
    if (!content.trim()) return

    try {
      setIsLoading(true)
      setError(null)

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

      // 3️⃣ Send to Bitrix24
      const bitrixPayload: BitrixMessage = {
        text: content,
        email: email || "unknown@woothealth.com",
        name: name || "Website Visitor",
      }

      const response = await sendMessageToBitrix24(bitrixPayload)

      // 4️⃣ Replace typing message with response
      const responseMessage = response.success
        ? "Thank you for your message! We've received it and will get back to you soon."
        : response.error || "There was an error sending your message. Please try again."

      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === typingId
            ? {
                ...msg,
                content: responseMessage,
                isTyping: false,
              }
            : msg
        )
      )

      if (!response.success) {
        setError(response.error || "Failed to send message")
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("An error occurred while sending your message")

      // Replace typing message with error message
      setMessages((prev) =>
        prev.filter((msg) => !msg.isTyping)
      )
    } finally {
      setIsLoading(false)
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        view,
        navigate,
        messages,
        sendMessage,
        userEmail,
        setUserEmail,
        userName,
        setUserName,
        isLoading,
        error,
        bitrix24Ready,
        bitrix24Error,
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