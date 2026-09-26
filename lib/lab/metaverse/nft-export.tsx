export interface ProjectNFT {
  tokenId: string
  projectName: string
  projectDescription: string
  creator: string
  createdAt: number
  circuitCode: string[]
  metadata: {
    difficulty: string
    xpReward: number
    labReward: number
    components: string[]
    simulationType: string
  }
  ipfsHash?: string
  contractAddress?: string
  chainId?: number
}

export function generateNFTMetadata(
  projectName: string,
  projectDescription: string,
  creator: string,
  circuitCode: string[],
  difficulty: string,
  xpReward: number,
  labReward: number,
  components: string[]
): ProjectNFT {
  return {
    tokenId: "0x" + Math.random().toString(16).slice(2),
    projectName,
    projectDescription,
    creator,
    createdAt: Date.now(),
    circuitCode,
    metadata: {
      difficulty,
      xpReward,
      labReward,
      components,
      simulationType: "arduino_educational",
    },
  }
}

export function generateNFTJSON(nft: ProjectNFT): string {
  return JSON.stringify(
    {
      name: `${nft.projectName} - ArduinoLab Educational NFT`,
      description: `Educational electronics project: ${nft.projectDescription}. Created by ${nft.creator} on ArduinoLab Metaverse.`,
      image: `data:image/svg+xml;base64,${Buffer.from(generateCircuitSVG(nft.metadata.components)).toString("base64")}`,
      attributes: [
        { trait_type: "Difficulty", value: nft.metadata.difficulty },
        { trait_type: "XP Reward", value: nft.metadata.xpReward },
        { trait_type: "LAB Reward", value: nft.metadata.labReward },
        {
          trait_type: "Components",
          value: nft.metadata.components.join(", "),
        },
        { trait_type: "Creator", value: nft.creator },
        { trait_type: "Created", value: new Date(nft.createdAt).toISOString() },
      ],
      properties: {
        circuit_code: nft.circuitCode,
        simulation_type: nft.metadata.simulationType,
      },
    },
    null,
    2
  )
}

function generateCircuitSVG(components: string[]): string {
  return `<svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="400" fill="#0a0e27"/>
    <circle cx="200" cy="200" r="150" fill="none" stroke="#00ff88" stroke-width="2"/>
    ${components
      .map(
        (comp, i) => `
    <circle cx="${200 + 120 * Math.cos((i * 360) / components.length * (Math.PI / 180))}" 
            cy="${200 + 120 * Math.sin((i * 360) / components.length * (Math.PI / 180))}" 
            r="20" fill="#00ffff" opacity="0.6"/>
    <text x="${200 + 120 * Math.cos((i * 360) / components.length * (Math.PI / 180))}" 
          y="${200 + 120 * Math.sin((i * 360) / components.length * (Math.PI / 180))}" 
          text-anchor="middle" fill="#000" font-size="10">${comp}</text>
    `
      )
      .join("")}
    <text x="200" y="380" text-anchor="middle" fill="#00ff88" font-size="12">ArduinoLab EDU NFT</text>
  </svg>`
}

export function createNFTExportData(nft: ProjectNFT): Blob {
  const json = generateNFTJSON(nft)
  return new Blob([json], { type: "application/json" })
}
