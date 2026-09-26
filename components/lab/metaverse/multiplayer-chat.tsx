"use client"

import { useState } from "react"
import { Send, Users } from "lucide-react"
import type { ChatMessage } from "@/lib/lab/metaverse/multiplayer"
import { createChatMessage } from "@/lib/lab/metaverse/multiplayer"

export function MultiplayerChat({ userId = "user1" }: { userId?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    createChatMessage(
      "ai",
      "LAB-AI",
      "Welcome to the ArduinoLab Community! Chat with fellow learners."
    ),
  ])
  const [input, setInput] = useState("")

  const sendMessage = () => {
    if (!input.trim()) return
    const msg = createChatMessage(userId, "You", input)
    setMessages((prev) => [...prev, msg])
    setInput("")
  }

  return (
    <div className="flex flex-col h-full bg-card border border-border rounded">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="text-primary text-sm">COMMUNITY NEXUS</span>
      </div>

      <div className="flex-1 overflow-auto p-3 space-y-2">
        {messages.map((msg) => (
          <div key={msg.id} className="text-xs">
            <span className="text-accent">{msg.username}:</span>
            <span className="text-muted-foreground ml-1">{msg.content}</span>
          </div>
        ))}
      </div>

      <div className="p-2 border-t border-border flex gap-2">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type message..."
          className="flex-1 bg-input border border-border px-2 py-1 text-xs text-foreground placeholder-muted-foreground rounded"
        />
        <button
          onClick={sendMessage}
          className="bg-primary text-primary-foreground px-2 py-1 rounded hover:opacity-80 transition"
        >
          <Send className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
