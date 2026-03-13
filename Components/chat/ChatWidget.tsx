"use client"

import { useState } from "react"
import { HiOutlineChatAlt2 } from "react-icons/hi"
import { FaTimes } from "react-icons/fa"
import { ChatProvider } from "./ChatProvider"
import HomeScreen from "./screens/HomeScreen"
import MessagesScreen from "./screens/MessageScreen"
import { useChat } from "./ChatProvider"

function ChatContent() {
  const { view } = useChat()

  switch (view) {
    case "home":
      return <HomeScreen />
    case "messages":
      return <MessagesScreen />
    default:
      return <HomeScreen />
  }
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div className="fixed bottom-2 right-1 md:bottom-5 md:right-5 z-50 flex flex-col items-end gap-2">
      
      {isOpen && (
        <ChatProvider>
          <div className="">
            <ChatContent />
            
          </div>
        </ChatProvider>
      )}

      <div
        className="shadow-lg bg-[#49A5EF] p-3 rounded-full cursor-pointer"
        onClick={() => setIsOpen(prev => !prev)}
      >
        {!isOpen ? (
          <HiOutlineChatAlt2 className="w-9 h-9 text-white" />
        ) : (
          <FaTimes className="w-6 h-6 text-white" />
        )}
      </div>
    </div>
  )
}