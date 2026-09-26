'use client'

import { useEffect, useState } from 'react'
import { learningJournal, type JournalSummary, type LearningEntry } from '@/lib/lab/neuro/learning-journal'
import { BookOpen, TrendingUp, Zap, Trophy } from 'lucide-react'

export function JournalView() {
  const [summary, setSummary] = useState<JournalSummary | null>(null)
  const [recentEntries, setRecentEntries] = useState<LearningEntry[]>([])

  useEffect(() => {
    learningJournal.loadFromStorage()
    setSummary(learningJournal.generateWeeklySummary())
    setRecentEntries(learningJournal.getRecentEntries(5))
  }, [])

  if (!summary) {
    return (
      <div className="flex items-center justify-center p-8 text-muted-foreground">
        <p>No learning data yet. Complete missions to build your journal.</p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <div className="border border-border rounded p-4 bg-card/50">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-bold text-primary">Learning Journal</h2>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="p-3 bg-background/50 rounded border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Total Sessions</p>
            <p className="text-2xl font-bold text-primary">{summary.totalSessions}</p>
          </div>

          <div className="p-3 bg-background/50 rounded border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Learning Time</p>
            <p className="text-2xl font-bold text-primary">{Math.round(summary.totalLearningTime / 60)}m</p>
          </div>

          <div className="p-3 bg-background/50 rounded border border-border/50">
            <p className="text-xs text-muted-foreground mb-1">Avg Difficulty</p>
            <p className="text-2xl font-bold text-primary">{summary.averageDifficulty.toFixed(1)}/5</p>
          </div>

          <div className="p-3 bg-background/50 rounded border border-border/50 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${summary.improvementTrend > 0 ? 'text-primary' : 'text-muted-foreground'}`} />
            <div>
              <p className="text-xs text-muted-foreground">Improvement</p>
              <p className="text-sm font-bold text-primary">{Math.round(summary.improvementTrend * 100)}%</p>
            </div>
          </div>
        </div>

        {/* Insights */}
        {summary.weeklyInsights.length > 0 && (
          <div className="p-3 bg-primary/5 rounded border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-primary" />
              <p className="text-xs font-bold text-primary uppercase">Weekly Insights</p>
            </div>
            <ul className="space-y-1">
              {summary.weeklyInsights.map((insight, i) => (
                <li key={i} className="text-xs text-muted-foreground">
                  • {insight}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Concepts */}
        {summary.conceptsMastered.length > 0 && (
          <div className="mt-4">
            <p className="text-xs font-bold text-primary mb-2 flex items-center gap-2">
              <Trophy className="w-3.5 h-3.5" /> Concepts Covered
            </p>
            <div className="flex flex-wrap gap-2">
              {summary.conceptsMastered.slice(0, 5).map((concept, i) => (
                <span key={i} className="px-2 py-1 text-xs bg-primary/10 text-primary rounded">
                  {concept.replace(/_/g, ' ')}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Entries */}
      {recentEntries.length > 0 && (
        <div className="border border-border rounded p-4 bg-card/50">
          <h3 className="text-sm font-bold text-primary mb-3">Recent Sessions</h3>
          <div className="space-y-2">
            {recentEntries.map((entry, i) => (
              <div key={i} className="p-2 bg-background/50 rounded border border-border/30 text-xs">
                <p className="text-primary font-mono">{entry.summary}</p>
                <p className="text-muted-foreground text-xs mt-1">
                  {entry.duration}min • Success: {Math.round(entry.successRate * 100)}%
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
