"use client"

import { useState, FormEvent } from "react"
import { useChat } from "../ChatProvider"
import { FaTimes } from "react-icons/fa"
import { MdHome } from "react-icons/md"
import { TbMessage } from "react-icons/tb"
import { PiHandWavingFill, PiPaperPlaneRightFill } from "react-icons/pi"

export default function HomeScreen() {
  const { navigate, sendMessage } = useChat()
  const [message, setMessage] = useState<string>("")
  
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const open = () => setIsOpen(prev => !prev)


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!message.trim()) return

    sendMessage(message)
    navigate("messages")
  }

  return (
    <div className="shadow-lg chat py-4 md:px-6 px-3 rounded-4xl w-[90svw] md:w-90 h-120 flex flex-col justify-between">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center pt-4">
          <div className="-space-x-4">
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300">Q</span>
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300">A</span>
            <span className="p-2 border border-amber-50 rounded-full bg-amber-300">D</span>
          </div>
          <FaTimes className="text-2xl text-[#ffffff] rounded-full cursor-pointer" onClick={open}/>
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
          className="w-full bg-white py-2 px-4 rounded-2xl flex items-center gap-2 shadow-lg"
        >
          <div className="grow">
            <h2>Send us a message</h2>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              className="w-full py-2 border-b text-[0.95rem] border-gray-300 focus:outline-none"
            />
          </div>

          <button type="submit">
            <PiPaperPlaneRightFill className="w-6 h-6 text-[#49A5EF]" />
          </button>
        </form>
      </div>

      <div className="flex items-center justify-between px-6 text-[#4A4A4A] border-t border-[#4A4A4A]/50 pt-2">
        <button
          onClick={() => navigate("home")}
          className={`flex flex-col items-center text-[0.95rem]`}
        >
          <MdHome className="text-2xl" />
          Home
        </button>

        <button
          onClick={() => navigate("messages")}
          className="flex flex-col items-center text-[0.95rem]"
        >
          <TbMessage className="text-2xl" />
          Messages
        </button>
      </div>
    </div>
  )
}