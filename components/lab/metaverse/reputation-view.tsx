"use client"

import { Award, Star } from "lucide-react"
import type { ReputationProfile } from "@/lib/lab/metaverse/reputation"
import { calculateTrustScore, REPUTATION_BADGES } from "@/lib/lab/metaverse/reputation"

export function ReputationView({
  profile,
}: {
  profile?: ReputationProfile
}) {
  const defaultProfile: ReputationProfile = {
    userId: "user1",
    totalRating: 32,
    reviewCount: 8,
    averageRating: 4,
    trustScore: 0,
    badges: ["first_nft", "collaborator"],
    projects: ["proj1", "proj2", "proj3"],
  }

  const p = profile || defaultProfile
  const trustScore = calculateTrustScore(p)

  return (
    <div className="space-y-4">
      <div className="bg-card border border-border p-4 rounded">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-primary text-sm font-mono">TRUST SCORE</h3>
          <span className="text-2xl text-accent lab-glow">{trustScore}</span>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Average Rating</span>
            <span className="text-foreground">
              {p.averageRating.toFixed(1)}/5
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Reviews</span>
            <span className="text-foreground">{p.reviewCount}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Projects</span>
            <span className="text-foreground">{p.projects.length}</span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-primary text-sm font-mono mb-2 flex items-center gap-2">
          <Award className="h-4 w-4" />
          BADGES EARNED
        </h3>
        <div className="grid grid-cols-2 gap-2">
          {REPUTATION_BADGES.map((badge) => (
            <div
              key={badge.id}
              className={`p-2 rounded text-xs border ${
                p.badges.includes(badge.id)
                  ? "border-primary bg-primary/10"
                  : "border-border bg-black/30 opacity-50"
              }`}
            >
              <div className="flex items-center gap-1 mb-1">
                <Star className="h-3 w-3" />
                <span className="font-mono">{badge.name}</span>
              </div>
              <p className="text-xs text-muted-foreground">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
