"use client"

import { useState, FormEvent } from "react"
import { useChat } from "../ChatProvider"
import { useChatVisibility } from "../ChatVisibilityContext"
import { FaTimes } from "react-icons/fa"
import { MdHome } from "react-icons/md"
import { TbMessage } from "react-icons/tb"
import { PiHandWavingFill, PiPaperPlaneRightFill } from "react-icons/pi"

export default function HomeScreen() {
  const { navigate, sendMessage, userName, setUserName, isLoading } = useChat()
  const { closeChat } = useChatVisibility()
  const [message, setMessage] = useState<string>("")

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim() || !userName.trim()) return

    // Send message with name (email will be collected in next screen)
    await sendMessage(message, "", userName)
    setMessage("")
    navigate("messages")
  }

  return (
    <div className="shadow-lg chat py-4 md:px-6 px-3 rounded-4xl w-[90svw] md:w-90 h-120 flex flex-col justify-between bg-gradient-to-br from-[#49A5EF] to-[#2E7BC1]">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4">
          <div className="-space-x-4">
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">Q</span>
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">A</span>
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300 text-xs font-bold">D</span>
          </div>
          <button
            onClick={closeChat}
            className="text-2xl text-white hover:opacity-75 transition-opacity"
            aria-label="Close chat"
          >
            <FaTimes />
          </button>
        </div>

        <div className="text-lg text-white leading-tight">
          <p>
            Hello{" "}
            <PiHandWavingFill className="text-[#FFDC5D] inline-flex text-2xl" />
          </p>
          <p>We&apos;re here to help</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="w-full bg-white py-3 px-4 rounded-2xl flex flex-col gap-3 shadow-lg"
        >
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Your Name</label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full py-2 px-3 border border-gray-300 rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700">Your Message</label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 py-2 px-3 border border-gray-300 rounded-lg text-[0.95rem] focus:outline-none focus:ring-2 focus:ring-[#49A5EF]"
                required
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-[#49A5EF] hover:bg-[#3a8fd6] disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <PiPaperPlaneRightFill className="w-6 h-6" />
              </button>
            </div>
          </div>
        </form>
      </div>

      <div className="flex items-center justify-center gap-4 px-6 text-[#ffffff] border-t border-white/30 pt-3">
        <button
          onClick={() => navigate("home")}
          className="flex flex-col items-center text-[0.85rem] hover:opacity-75 transition-opacity"
        >
          <MdHome className="text-2xl" />
          Home
        </button>

        <button
          onClick={() => navigate("messages")}
          className="flex flex-col items-center text-[0.85rem] hover:opacity-75 transition-opacity"
        >
          <TbMessage className="text-2xl" />
          Messages
        </button>
      </div>
    </div>
  )
}