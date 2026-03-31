"use client"

import { useChat } from "../ChatProvider"
import { useChatVisibility } from "../ChatVisibilityContext"
import TypingIndicator from "../TypingIndicator"
import { FaTimes } from "react-icons/fa"
import { IoChevronBack } from "react-icons/io5"
import { FaClock } from "react-icons/fa6"
import { PiPaperPlaneRightFill } from "react-icons/pi"
import { FormEvent, useState } from "react"

export default function MessagesScreen() {
  const { navigate, sendMessage, messages, userEmail, setUserEmail, userName, isLoading } = useChat()
  const { closeChat } = useChatVisibility()
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim() || !userEmail.trim()) return

    // Send message with name and email
    await sendMessage(message, userEmail, userName)
    setMessage("")
  }

  return (
    <div className="shadow-lg bg-white py-4 rounded-4xl w-[90svw] md:w-90 h-120 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        {/* Header */}
        <div className="flex items-center border-b border-gray-200 py-4 px-6 justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => navigate("home")}
              className="hover:opacity-75 transition-opacity"
              aria-label="Go back"
            >
              <IoChevronBack className="text-2xl text-gray-700" />
            </button>
            <div className="-space-x-3">
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">Q</span>
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">A</span>
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">D</span>
            </div>
            <div className="flex flex-col leading-3">
              <h3 className="text-lg font-semibold text-gray-900">Woot Health</h3>
              <p className="text-gray-500 flex items-center text-[0.8rem]">
                <FaClock className="text-[0.7rem] mr-1" />
                Back later today
              </p>
            </div>
          </div>
          <button
            onClick={closeChat}
            className="text-2xl text-gray-700 hover:opacity-75 transition-opacity"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        {/* Messages */}
        <div className="flex flex-col flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p>No messages yet. Start the conversation!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`p-3 rounded-lg text-sm max-w-[80%] ${
                  msg.role === "user"
                    ? "bg-[#49A5EF] text-white ml-auto shadow-md"
                    : "bg-gray-100 text-gray-900 shadow-sm"
                }`}
              >
                {msg.isTyping ? <TypingIndicator /> : msg.content}
              </div>
            ))
          )}
        </div>

        {/* Email Input & Message Form */}
        <div className="border-t border-gray-200 pt-4 px-4 space-y-2">
          {/* Email Input */}
          <div className="flex items-center gap-2">
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="your.email@example.com"
              className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-[0.9rem] focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              required
            />
          </div>

          {/* Message Input Form */}
          <form onSubmit={handleSubmit} className="w-full bg-gray-50 py-2 px-3 rounded-2xl flex items-center gap-2 shadow-sm border border-gray-200">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 py-2 text-[0.95rem] focus:outline-none bg-transparent"
              disabled={isLoading || !userEmail.trim()}
            />
            <button
              type="submit"
              disabled={isLoading || !userEmail.trim()}
              className="bg-[#49A5EF] hover:bg-[#3a8fd6] disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              aria-label="Send message"
            >
              <PiPaperPlaneRightFill className="w-5 h-5" />
            </button>
          </form>
          {!userEmail.trim() && (
            <p className="text-xs text-gray-500">Please enter your email to send a message</p>
          )}
        </div>
      </div>
    </div>
  )
}