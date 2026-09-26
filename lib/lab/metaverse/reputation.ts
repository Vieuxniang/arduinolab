export interface PeerReview {
  id: string
  reviewer: string
  reviewed: string
  projectId: string
  rating: number
  comment: string
  timestamp: number
  categories: {
    creativity: number
    correctness: number
    complexity: number
  }
}

export interface ReputationProfile {
  userId: string
  totalRating: number
  reviewCount: number
  averageRating: number
  trustScore: number
  badges: string[]
  projects: string[]
}

export function calculateTrustScore(profile: ReputationProfile): number {
  const ratingScore = Math.min(profile.averageRating * 20, 100)
  const consistencyBonus = Math.min(profile.reviewCount * 2, 30)
  return Math.min(ratingScore + consistencyBonus, 100)
}

export function createPeerReview(
  reviewer: string,
  reviewed: string,
  projectId: string,
  rating: number,
  comment: string,
  categories: { creativity: number; correctness: number; complexity: number }
): PeerReview {
  return {
    id: Math.random().toString(36).slice(2, 10),
    reviewer,
    reviewed,
    projectId,
    rating: Math.max(1, Math.min(5, rating)),
    comment,
    timestamp: Date.now(),
    categories: {
      creativity: Math.max(1, Math.min(5, categories.creativity)),
      correctness: Math.max(1, Math.min(5, categories.correctness)),
      complexity: Math.max(1, Math.min(5, categories.complexity)),
    },
  }
}

export const REPUTATION_BADGES = [
  { id: "first_nft", name: "First Mint", description: "Export first project as NFT" },
  {
    id: "collaborator",
    name: "Collaborator",
    description: "Complete 5 cooperative missions",
  },
  {
    id: "builder",
    name: "Master Builder",
    description: "Complete all 45 missions",
  },
  {
    id: "trusted",
    name: "Trusted Member",
    description: "Reach 4.5+ trust score",
  },
  {
    id: "miner",
    name: "LAB Miner",
    description: "Mine 1000+ LAB tokens",
  },
  {
    id: "night_owl",
    name: "Night Owl",
    description: "Complete 10 night cycles",
  },
]
