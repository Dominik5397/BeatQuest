"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Card } from "@/components/ui/card"
import { MusicVisualizer } from "@/components/music-visualizer"

export default function GamePage() {
  const [progress, setProgress] = useState(0)
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(10)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentNote, setCurrentNote] = useState<number | null>(null)

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 100
          }
          return prev + 1
        })

        if (Math.random() > 0.8 && currentNote === null) {
          setCurrentNote(Math.floor(Math.random() * 4))
        }

        setTimeLeft((prev) => Math.max(0, prev - 0.1))
      }, 100)

      return () => clearInterval(interval)
    }
  }, [isPlaying, currentNote])

  const handleStart = () => {
    setProgress(0)
    setScore(0)
    setTimeLeft(10)
    setIsPlaying(true)
    setCurrentNote(null)
  }

  const handleNoteClick = (index: number) => {
    if (index === currentNote) {
      setScore((prev) => prev + 100)
      setCurrentNote(null)
    } else {
      setScore((prev) => Math.max(0, prev - 50))
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div
        className="mb-8 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-beatquest-purple-light mb-2">Tryb Gry</h1>
      </motion.div>

      <div className="grid grid-cols-1 gap-8">
        <motion.div
          className="bg-beatquest-dark-lighter rounded-xl p-6 border border-beatquest-dark-light"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex justify-between items-center mb-4">
            <div>
              <h2 className="text-2xl font-bold">Punkty: {score}</h2>
            </div>
            <div>
              <h2 className="text-2xl font-bold">Czas: {timeLeft.toFixed(1)}s</h2>
            </div>
          </div>

          <Progress value={progress} className="h-2 mb-8" />

          <div className="grid grid-cols-4 gap-4 mb-8">
            {[0, 1, 2, 3].map((index) => (
              <motion.div key={index} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Card
                  className={`aspect-square flex items-center justify-center cursor-pointer transition-all duration-300 ${
                    currentNote === index
                      ? "bg-beatquest-purple border-beatquest-purple-light"
                      : "bg-beatquest-dark-light border-beatquest-dark"
                  }`}
                  onClick={() => isPlaying && handleNoteClick(index)}
                >
                  <AnimatePresence>
                    {currentNote === index && (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}>
                        <MusicVisualizer className="h-12" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="flex justify-center">
            <Button
              onClick={handleStart}
              disabled={isPlaying}
              className="bg-gradient-to-r from-beatquest-purple to-beatquest-purple-light hover:from-beatquest-purple-dark hover:to-beatquest-purple text-white font-bold px-8 py-6 text-lg rounded-full"
            >
              {isPlaying ? "Gra w toku..." : "Rozpocznij grę"}
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  )
}

