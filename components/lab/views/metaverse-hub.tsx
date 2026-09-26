"use client"

import { useState } from "react"
import dynamic from "next/dynamic"
import { Users, Map, Wallet, Clock, Award, Zap } from "lucide-react"

// Lazy-load metaverse components to prevent startup failures
const Metaverse3D = dynamic(() => import("@/components/lab/metaverse/metaverse-3d").then(m => ({ default: m.Metaverse3D })))
const StarMapView = dynamic(() => import("@/components/lab/metaverse/star-map-view").then(m => ({ default: m.StarMapView })))
const MultiplayerChat = dynamic(() => import("@/components/lab/metaverse/multiplayer-chat").then(m => ({ default: m.MultiplayerChat })))
const EconomyDashboard = dynamic(() => import("@/components/lab/metaverse/economy-dashboard").then(m => ({ default: m.EconomyDashboard })))
const TemporalChallenges = dynamic(() => import("@/components/lab/metaverse/temporal-challenges").then(m => ({ default: m.TemporalChallenges })))
const ReputationView = dynamic(() => import("@/components/lab/metaverse/reputation-view").then(m => ({ default: m.ReputationView })))

export function MetaverseHub() {
  const [activeTab, setActiveTab] = useState("environment")

  const tabs = [
    { id: "environment", icon: Zap, label: "3D" },
    { id: "starmap", icon: Map, label: "Map" },
    { id: "community", icon: Users, label: "Chat" },
    { id: "economy", icon: Wallet, label: "Eco" },
    { id: "cycles", icon: Clock, label: "Time" },
    { id: "reputation", icon: Award, label: "Rep" },
  ]

  return (
    <div className="h-full w-full flex flex-col overflow-hidden">
      <div className="w-full grid grid-cols-6 border-b border-border">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-2 flex items-center justify-center transition text-xs font-mono ${
                activeTab === tab.id 
                  ? "bg-primary text-background" 
                  : "bg-card/50 text-primary/70 hover:bg-card hover:text-primary"
              }`}
            >
              <Icon className="h-4 w-4" />
            </button>
          )
        })}
      </div>

      <div className="flex-1 overflow-auto p-3">
        {activeTab === "environment" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} METAVERSE_3D_ENGINE</div>
            <div className="text-muted-foreground">initializing holographic environment...</div>
            <div className="mt-2 flex h-48 items-center justify-center rounded-lg border border-border bg-background">
              <div className="text-center">
                <Zap className="w-12 h-12 text-primary mx-auto mb-2 animate-pulse" />
                <div className="text-xs text-primary">Virtual Lab Loading...</div>
              </div>
            </div>
            <Metaverse3D />
          </div>
        )}
        {activeTab === "starmap" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} STELLAR_MAP_v2.1</div>
            <div className="text-muted-foreground">45 missions detected</div>
            <div className="mt-3 space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="rounded-md border border-border/50 bg-background p-2 text-xs text-muted-foreground">
                  {"◆"} NODE_{i + 1}: Mission_Chain_{i + 1}
                </div>
              ))}
            </div>
            <StarMapView completedCount={5} />
          </div>
        )}
        {activeTab === "community" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} VOICE_CHAT_BETA</div>
            <div className="text-muted-foreground">3 learners online</div>
            <div className="mt-3 h-32 rounded-md border border-border bg-background p-2">
              <div className="text-xs text-primary/50">Waiting for voice connection...</div>
            </div>
            <MultiplayerChat />
          </div>
        )}
        {activeTab === "economy" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} LAB_ECONOMY_DASHBOARD</div>
            <div className="text-muted-foreground">Mining active...</div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-md border border-border bg-background p-2 text-xs">
                <div className="text-muted-foreground">Balance</div>
                <div className="text-primary font-bold">125.5 LAB</div>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-xs">
                <div className="text-muted-foreground">Rate</div>
                <div className="text-primary font-bold">+2.1/min</div>
              </div>
            </div>
            <EconomyDashboard />
          </div>
        )}
        {activeTab === "cycles" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} TEMPORAL_CYCLES</div>
            <div className="text-muted-foreground">Current cycle: DAWN</div>
            <div className="mt-3 space-y-2">
              <div className="rounded-md border border-border bg-background p-2 text-xs">⏳ Dawn Challenges (5★) - 200 LAB</div>
              <div className="rounded-md border border-border bg-background p-2 text-xs">🌞 Day Missions (3★) - 150 LAB</div>
              <div className="rounded-md border border-border bg-background p-2 text-xs">🌙 Night Sprint (4★) - 175 LAB</div>
            </div>
            <TemporalChallenges />
          </div>
        )}
        {activeTab === "reputation" && (
          <div className="border border-primary bg-card p-4 font-mono text-sm text-primary">
            <div className="lab-glow mb-2">{">"} REPUTATION_MATRIX</div>
            <div className="text-muted-foreground">Your rank: Pioneer_LVL5</div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="text-muted-foreground">Trust</div>
                <div className="text-primary font-bold">4.8★</div>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="text-muted-foreground">Missions</div>
                <div className="text-primary font-bold">23</div>
              </div>
              <div className="rounded-md border border-border bg-background p-2 text-center">
                <div className="text-muted-foreground">Badges</div>
                <div className="text-primary font-bold">7</div>
              </div>
            </div>
            <ReputationView />
          </div>
        )}
      </div>
    </div>
  )
}
