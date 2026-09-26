"use client"

import { useState } from "react"
import { Download, Copy, Check } from "lucide-react"
import {
  generateNFTMetadata,
  createNFTExportData,
} from "@/lib/lab/metaverse/nft-export"

export function NFTExportDialog({
  projectName,
  projectDescription,
  creator,
  circuitCode,
  difficulty,
  xpReward,
  labReward,
  components,
}: {
  projectName: string
  projectDescription: string
  creator: string
  circuitCode: string[]
  difficulty: string
  xpReward: number
  labReward: number
  components: string[]
}) {
  const [copied, setCopied] = useState(false)

  const nft = generateNFTMetadata(
    projectName,
    projectDescription,
    creator,
    circuitCode,
    difficulty,
    xpReward,
    labReward,
    components
  )

  const exportJSON = () => {
    const data = createNFTExportData(nft)
    const url = URL.createObjectURL(data)
    const a = document.createElement("a")
    a.href = url
    a.download = `${projectName}.nft.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const copyTokenId = () => {
    navigator.clipboard.writeText(nft.tokenId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-3">
      <div className="bg-black/50 p-3 rounded border border-border">
        <p className="text-xs text-muted-foreground mb-2">TOKEN ID</p>
        <div className="flex items-center gap-2">
          <code className="text-xs text-primary flex-1 break-all">
            {nft.tokenId}
          </code>
          <button
            onClick={copyTokenId}
            className="p-1 hover:opacity-80 transition"
          >
            {copied ? (
              <Check className="h-3 w-3 text-primary" />
            ) : (
              <Copy className="h-3 w-3 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-black/50 p-2 rounded">
          <p className="text-muted-foreground">DIFFICULTY</p>
          <p className="text-primary">{difficulty}</p>
        </div>
        <div className="bg-black/50 p-2 rounded">
          <p className="text-muted-foreground">REWARDS</p>
          <p className="text-primary">{xpReward} XP / {labReward} LAB</p>
        </div>
      </div>

      <button
        onClick={exportJSON}
        className="w-full bg-primary text-primary-foreground py-2 px-3 rounded text-sm hover:opacity-80 transition flex items-center justify-center gap-2"
      >
        <Download className="h-4 w-4" />
        EXPORT NFT JSON
      </button>
    </div>
  )
}
