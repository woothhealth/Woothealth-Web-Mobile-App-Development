"use client"

import { useChat } from "../ChatProvider"
import TypingIndicator from "../TypingIndicator"
import { FaTimes } from "react-icons/fa"
import { IoChevronBack } from "react-icons/io5"
import { FaClock } from "react-icons/fa6"
import { PiPaperPlaneRightFill } from "react-icons/pi"
import { FormEvent, useState } from "react"

export default function MessagesScreen() {
  const { navigate, sendMessage, messages } = useChat()
    const [message, setMessage] = useState<string>("")
    const [email, setEmail] = useState<string>("")

  
  
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (!message.trim()) return
  
      sendMessage(message)
      navigate("messages")
    }

  return (
    <div className="shadow-lg bg-[#ffffff] py-4 rounded-4xl w-[90svw] md:w-90 h-120 flex flex-col justify-between">
      <div className="flex flex-col h-full justify-between">
        <div className="flex items-center border-b border-[#4A4A4A] py-4 px-6 justify-between">
          <div className="flex items-center space-x-2">
          <IoChevronBack onClick={() => navigate("home")} className="text-2xl"/>
          <div className="-space-x-3">
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300">Q</span>
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300">A</span>
              <span className="p-2.5 border border-amber-50 rounded-full bg-amber-300">D</span>
            </div>
            <div className="flex flex-col leading-3">
              <h3 className="text-lg font-semibold">Woot Health</h3>
              <p className="text-[#4A4A4A] flex items-center text-[0.8rem]"><FaClock className="text-[0.7rem] mr-1"/>Back later today</p>
            </div>
          </div>
          <FaTimes className="text-2xl cursor-pointer"/>
        </div>

        <div className="flex flex-col h-fit overflow-y-auto p-4 space-y-3">
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
        <div className="flex items-center justify-between px-8 text-[#4A4A4A] border-t border-[#4A4A4A]/50 pt-2">
          <form onSubmit={handleSubmit} className="w-full bg-white py-2 px-4 rounded-2xl flex items-center gap-2 shadow-lg">
            <div className="grow">
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full py-2 border-b text-[0.95rem] border-gray-300 focus:outline-none" placeholder="email@example.com"/>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Message..."
                className="w-full py-2 text-[0.95rem] focus:outline-none"
                />
            </div>
            <button type="submit">
              <PiPaperPlaneRightFill className="w-6 h-6 text-[#49A5EF]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}