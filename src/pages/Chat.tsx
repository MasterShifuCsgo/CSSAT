// No third-party API usage here
import React, { useState, type JSX } from 'react'
import { mockMessages } from '@/data/mockMessages'
import type { MessageProps } from '@/types'
import ChatMessage from '@/components/ChatMessage'

const Chat: React.FC = () => {
  const [messages, setMessages] = useState<MessageProps[]>(mockMessages)
  const [input, setInput] = useState<string>('')

  // --- MARKED: modifies messages
  const addMessage = (msg: MessageProps) => setMessages((prev) => [...prev, msg]) // <-- CHANGE POINT #1

  // --- MARKED: modifies messages when user sends text
  const handleSend = () => {
    if (!input.trim()) return
    addMessage({ side: 'left', content: input }) // <-- CHANGE POINT #2
    setInput('')
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSend()
  }

  return (
    <div className="flex flex-col w-full h-screen bg-black text-white">
      {/* Chat area (fills most of screen) */}
      <div className="flex-1 overflow-y-auto bg-gray-900 flex justify-center">
        <div className="w-full max-w-5xl px-2 md:px-8 py-4">
          {messages.map((msg, i) => (
            <ChatMessage key={i} side={msg.side} content={msg.content} />
          ))}
        </div>
      </div>

      {/* Input area (fixed bottom bar) */}
      <div className="w-full flex gap-2 p-4 bg-gray-950 border-t border-gray-800">
        <input
          className="flex-grow border border-gray-700 bg-gray-800 text-white rounded px-3 py-2 focus:outline-none focus:border-blue-500"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
          Send
        </button>
      </div>
    </div>
  )
}

export default Chat
