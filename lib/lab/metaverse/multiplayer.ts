export interface ChatMessage {
  id: string
  userId: string
  username: string
  content: string
  timestamp: number
  type: "text" | "voice"
}

export interface CoopMission {
  id: string
  missionId: string
  player1: string
  player2: string
  progress: number
  sharedCircuit: string[]
  startTime: number
  completed: boolean
}

export interface OnlineSession {
  userId: string
  username: string
  joinedAt: number
  currentMission?: string
  status: "idle" | "in_mission" | "in_coop"
}

export function createChatMessage(
  userId: string,
  username: string,
  content: string
): ChatMessage {
  return {
    id: Math.random().toString(36).slice(2, 10),
    userId,
    username,
    content,
    timestamp: Date.now(),
    type: "text",
  }
}

export function createCoopMission(
  missionId: string,
  player1: string,
  player2: string
): CoopMission {
  return {
    id: Math.random().toString(36).slice(2, 10),
    missionId,
    player1,
    player2,
    progress: 0,
    sharedCircuit: [],
    startTime: Date.now(),
    completed: false,
  }
}

export interface MultiplayerStore {
  onlineSessions: Map<string, OnlineSession>
  chatMessages: ChatMessage[]
  coopMissions: Map<string, CoopMission>
  addSession: (session: OnlineSession) => void
  removeSession: (userId: string) => void
  sendMessage: (message: ChatMessage) => void
  startCoop: (missionId: string, p1: string, p2: string) => CoopMission
}
