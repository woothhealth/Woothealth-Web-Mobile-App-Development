"use client"

import { useEffect, useState } from "react"
import { ChatProvider } from "./ChatProvider"
import { ChatVisibilityProvider, useChatVisibility } from "./ChatVisibilityContext"
import { useBitrix24Ready } from "./hooks"
import { HiOutlineChatAlt2 } from "react-icons/hi"
import { FaTimes } from "react-icons/fa"
import HomeScreen from "./screens/HomeScreen"
import MessagesScreen from "./screens/MessageScreen"
import { useChat } from "./ChatProvider"

/**
 * Inner chat widget component that renders custom UI or Bitrix24
 */
function ChatWidgetInner() {
  const { isOpen, toggleChat, closeChat } = useChatVisibility()
  const { view } = useChat()
  const bitrix24Ready = useBitrix24Ready()

  // If Bitrix24 is ready, let it handle the chat UI completely
  if (bitrix24Ready) {
    return (
      <div className="fixed bottom-5 right-5 z-50">
        {/* Bitrix24 widget will render here automatically */}
      </div>
    )
  }

  // Fallback to custom chat UI if Bitrix24 is not ready
  return (
    <div className="fixed bottom-2 right-1 md:bottom-5 md:right-5 z-50 flex flex-col items-end gap-2">
      {isOpen && (
        <div className="shadow-2xl rounded-3xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
          {view === "home" && <HomeScreen />}
          {view === "messages" && <MessagesScreen />}
        </div>
      )}

      <button
        onClick={toggleChat}
        className="shadow-lg bg-gradient-to-r from-[#49A5EF] to-[#2E7BC1] hover:shadow-xl text-white p-3 rounded-full cursor-pointer transition-all duration-200 transform hover:scale-110"
        aria-label={isOpen ? "Close chat" : "Open chat"}
        title={isOpen ? "Close chat" : "Open chat"}
      >
        {!isOpen ? (
          <HiOutlineChatAlt2 className="w-6 h-6" />
        ) : (
          <FaTimes className="w-5 h-5" />
        )}
      </button>
    </div>
  )
}

/**
 * Main chat widget component wrapped with providers
 */
export default function ChatWidget() {
  const [isMounted, setIsMounted] = useState(false)

  // Only render on client to avoid hydration mismatches
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <ChatVisibilityProvider>
      <ChatProvider>
        <ChatWidgetInner />
      </ChatProvider>
    </ChatVisibilityProvider>
  )
}

/**
 * Export hooks for use in other components
 */
export { useChatVisibility, useChat }
