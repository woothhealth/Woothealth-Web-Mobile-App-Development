/**
 * Chat Visibility Context
 * Manages open/close state of the chat widget
 * Integrates with Bitrix24 show/hide methods
 * Can be called and controlled from anywhere in the app
 */

"use client"

import { createContext, useContext, useState, ReactNode, useCallback } from "react"
import bitrix24Integration from "./services/bitrix24Integration"

interface ChatVisibilityContextType {
  isOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
}

const ChatVisibilityContext = createContext<ChatVisibilityContextType | undefined>(undefined)

export function ChatVisibilityProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openChat = useCallback(() => {
    setIsOpen(true)
    // Try to show Bitrix24 widget if available
    if (bitrix24Integration.isBitrixReady()) {
      bitrix24Integration.show()
    }
  }, [])

  const closeChat = useCallback(() => {
    setIsOpen(false)
    // Try to hide Bitrix24 widget if available
    if (bitrix24Integration.isBitrixReady()) {
      bitrix24Integration.hide()
    }
  }, [])

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      const newState = !prev
      if (newState && bitrix24Integration.isBitrixReady()) {
        bitrix24Integration.show()
      } else if (!newState && bitrix24Integration.isBitrixReady()) {
        bitrix24Integration.hide()
      }
      return newState
    })
  }, [])

  return (
    <ChatVisibilityContext.Provider
      value={{
        isOpen,
        openChat,
        closeChat,
        toggleChat,
      }}
    >
      {children}
    </ChatVisibilityContext.Provider>
  )
}

export function useChatVisibility(): ChatVisibilityContextType {
  const context = useContext(ChatVisibilityContext)
  if (!context) {
    throw new Error("useChatVisibility must be used within ChatVisibilityProvider")
  }
  return context
}
