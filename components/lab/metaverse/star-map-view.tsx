"use client"

import { useState } from "react"
import { generateStarMap } from "@/lib/lab/metaverse/star-map"
import { Lock } from "lucide-react"

export function StarMapView({ completedCount = 0 }: { completedCount?: number }) {
  const nodes = generateStarMap(completedCount)
  const [selectedNode, setSelectedNode] = useState<string | null>(null)

  return (
    <div className="h-full w-full bg-background p-4 overflow-auto">
      <h2 className="text-primary lab-glow text-lg mb-4">STELLAR CARTOGRAPHY</h2>

      <svg
        viewBox="-20 -15 40 30"
        className="w-full rounded-lg border border-border bg-background/60"
        style={{ aspectRatio: "16/9" }}
      >
        {nodes.map((node) => (
          <g key={node.id}>
            {node.connections.map((connId) => {
              const connNode = nodes.find((n) => n.id === connId)
              if (!connNode) return null
              return (
                <line
                  key={`${node.id}-${connId}`}
                  x1={node.x}
                  y1={node.y}
                  x2={connNode.x}
                  y2={connNode.y}
                  stroke={node.completed ? "#00ff88" : "#1a2f4a"}
                  strokeWidth="0.2"
                  opacity={node.completed ? 0.8 : 0.3}
                />
              )
            })}
          </g>
        ))}

        {nodes.map((node) => (
          <g
            key={node.id}
            onClick={() => setSelectedNode(node.id)}
            style={{ cursor: "pointer" }}
          >
            <circle
              cx={node.x}
              cy={node.y}
              r="0.3"
              fill={
                node.completed
                  ? "#00ff88"
                  : node.visited
                    ? "#00ffff"
                    : "#1a2f4a"
              }
              opacity={0.8}
            />
            <circle
              cx={node.x}
              cy={node.y}
              r="0.5"
              fill="none"
              stroke={node.completed ? "#00ff88" : "#00ffff"}
              strokeWidth="0.1"
              opacity={selectedNode === node.id ? 1 : 0.2}
            />
          </g>
        ))}
      </svg>

      {selectedNode && (
        <div className="mt-4 p-3 border border-border bg-card/80 rounded">
          {(() => {
            const node = nodes.find((n) => n.id === selectedNode)
            return (
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-primary">{node?.id}</span>
                  {!node?.visited && (
                    <Lock className="h-4 w-4 text-muted-foreground" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground">
                  Difficulty: {node?.difficulty} | XP: {node?.reward.xp} | LAB:{" "}
                  {node?.reward.lab}
                </p>
                {node?.completed && (
                  <p className="text-xs text-primary mt-2">✓ COMPLETED</p>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
