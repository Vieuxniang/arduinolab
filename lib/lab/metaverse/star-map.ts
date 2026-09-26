export interface StarNode {
  id: string
  missionId: string
  x: number
  y: number
  z: number
  difficulty: "beginner" | "intermediate" | "expert"
  completed: boolean
  visited: boolean
  connections: string[]
  reward: { xp: number; lab: number }
}

export function generateStarMap(completedCount: number): StarNode[] {
  const nodes: StarNode[] = []
  const difficulties = ["beginner", "intermediate", "expert"] as const

  for (let i = 0; i < 45; i++) {
    const row = Math.floor(i / 9)
    const col = i % 9
    const difficulty = difficulties[Math.floor(i / 15)]
    const visited = i <= completedCount
    const completed = i < completedCount

    nodes.push({
      id: `node_${i}`,
      missionId: `mission_${i}`,
      x: (col - 4) * 3,
      y: (row - 2) * 3,
      z: Math.sin(i * 0.5) * 1.5,
      difficulty: difficulty as typeof difficulties[number],
      completed,
      visited,
      connections: [
        ...(i > 0 ? [`node_${i - 1}`] : []),
        ...(i < 44 ? [`node_${i + 1}`] : []),
      ],
      reward: {
        xp: (Math.floor(i / 15) + 1) * 50,
        lab: (Math.floor(i / 15) + 1) * 10,
      },
    })
  }

  return nodes
}

export function calculateStarDistance(a: StarNode, b: StarNode): number {
  return Math.sqrt(
    Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2) + Math.pow(a.z - b.z, 2)
  )
}
