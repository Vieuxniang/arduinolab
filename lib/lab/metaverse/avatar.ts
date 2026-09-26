export interface AvatarSkin {
  id: string
  name: string
  model: string
  color: string
  price: number
  owned: boolean
}

export interface Avatar {
  id: string
  username: string
  skin: AvatarSkin
  position: { x: number; y: number; z: number }
  rotation: number
  level: number
  reputation: number
  online: boolean
  lastSeen: number
}

const DEFAULT_SKIN: AvatarSkin = {
  id: "default_hacker",
  name: "Default Hacker",
  model: "capsule",
  color: "#00ff88",
  price: 0,
  owned: true,
}

export const AVATAR_SKINS: AvatarSkin[] = [
  DEFAULT_SKIN,
  {
    id: "neon_cyborg",
    name: "Neon Cyborg",
    model: "box",
    color: "#ff00ff",
    price: 500,
    owned: false,
  },
  {
    id: "hologram_ghost",
    name: "Hologram Ghost",
    model: "sphere",
    color: "#00ffff",
    price: 750,
    owned: false,
  },
  {
    id: "chrome_sentinel",
    name: "Chrome Sentinel",
    model: "cone",
    color: "#ffaa00",
    price: 1000,
    owned: false,
  },
]

export function createAvatar(username: string): Avatar {
  return {
    id: Math.random().toString(36).slice(2, 10),
    username,
    skin: DEFAULT_SKIN,
    position: { x: 0, y: 0, z: 0 },
    rotation: 0,
    level: 1,
    reputation: 0,
    online: true,
    lastSeen: Date.now(),
  }
}

export function getAvatarSkinById(id: string): AvatarSkin | undefined {
  return AVATAR_SKINS.find((s) => s.id === id)
}
