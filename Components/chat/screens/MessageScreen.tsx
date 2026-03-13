"use client"

import { MdHome } from "react-icons/md"
import { useChat } from "../ChatProvider"
import TypingIndicator from "../TypingIndicator"
import { TbMessage } from "react-icons/tb"

export default function MessagesScreen() {
  const { navigate, messages } = useChat()

  return (
    <div className="shadow-lg bg-[#ffffff] py-4 md:px-6 px-3 rounded-4xl w-[90svw] md:w-90 h-120 flex flex-col justify-between">
    <div className="flex flex-col h-full">
      <div className="flex items-center border-b p-4">
        <button
          onClick={() => navigate("home")}
          className="text-blue-500 text-sm"
        >
          ← Back
        </button>
        <h2 className="mx-auto font-semibold">Messages</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-3 rounded-lg text-sm max-w-[80%] ${
              msg.role === "user"
                ? "bg-blue-500 text-white ml-auto"
                : "bg-gray-100 text-black"
            }`}
          >
            {msg.isTyping ? (
              <TypingIndicator />
            ) : (
              msg.content
            )}
          </div>
        ))}
      </div>
    </div>

        <div className="flex items-center justify-between px-6 text-[#4A4A4A] border-t border-[#4A4A4A]/50 pt-2">
          <button onClick={() => navigate("home")} className="flex flex-col items-center text-[0.95rem]">
            <MdHome className="text-2xl" />
            Home
          </button>
        
          <button onClick={() => navigate("messages")} className="flex flex-col items-center text-[0.95rem]">
            <TbMessage className="text-2xl" />
            Messages
          </button>
        </div>
    </div>
  )
}