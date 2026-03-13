import { MdHome } from "react-icons/md"
import { useChat } from "../ChatProvider"

export default function ChatContainer({
  children,
}: {
  children: React.ReactNode
}) {
  const { navigate, messages } = useChat()
  return (
    <div className="fixed bottom-6 right-6 w-[350px] h-[500px] bg-white shadow-2xl rounded-2xl overflow-hidden border z-40">
      {children}
    </div>
  )
}