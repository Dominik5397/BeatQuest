"use client"

import { cn } from "@/lib/utils"

interface MusicVisualizerProps {
  className?: string
}

export function MusicVisualizer({ className }: MusicVisualizerProps) {
  return (
    <div className={cn("music-visualizer", className)}>
      <span className="h-3 animate-wave-1" />
      <span className="h-4 animate-wave-2" />
      <span className="h-2 animate-wave-3" />
      <span className="h-3 animate-wave-1" />
    </div>
  )
}

