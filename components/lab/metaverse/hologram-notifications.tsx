"use client"

import { useState, useEffect } from "react"
import { AlertCircle, Zap, Trophy, Coins } from "lucide-react"

export interface HologramNotification {
  id: string
  type: "success" | "warning" | "info" | "achievement"
  title: string
  message: string
  duration?: number
}

export function HologramNotifications() {
  const [notifications, setNotifications] = useState<HologramNotification[]>([])

  useEffect(() => {
    const demo = [
      {
        id: "1",
        type: "success" as const,
        title: "MISSION COMPLETE",
        message: "Earned 100 XP and 25 LAB tokens",
        duration: 3000,
      },
      {
        id: "2",
        type: "achievement" as const,
        title: "NEW BADGE UNLOCKED",
        message: "Collaborator - Completed 5 cooperative missions",
        duration: 4000,
      },
    ]

    demo.forEach((notif, i) => {
      setTimeout(() => {
        setNotifications((prev) => [...prev, notif])
        setTimeout(
          () => setNotifications((prev) => prev.filter((n) => n.id !== notif.id)),
          notif.duration || 3000
        )
      }, i * 500)
    })
  }, [])

  const getIcon = (type: string) => {
    switch (type) {
      case "success":
        return <Zap className="h-4 w-4" />
      case "achievement":
        return <Trophy className="h-4 w-4" />
      case "warning":
        return <AlertCircle className="h-4 w-4" />
      default:
        return <Coins className="h-4 w-4" />
    }
  }

  const getColors = (type: string) => {
    switch (type) {
      case "success":
        return "border-primary text-primary"
      case "achievement":
        return "border-accent text-accent"
      case "warning":
        return "border-destructive text-destructive"
      default:
        return "border-chart-2 text-chart-2"
    }
  }

  return (
    <div className="fixed top-20 left-4 right-4 z-50 pointer-events-none space-y-2">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`border-2 p-3 rounded backdrop-blur-sm bg-background/80 animation hologram pointer-events-auto ${getColors(notif.type)}`}
        >
          <div className="flex items-start gap-2">
            {getIcon(notif.type)}
            <div className="flex-1">
              <p className="font-mono text-sm">{notif.title}</p>
              <p className="text-xs opacity-80">{notif.message}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
