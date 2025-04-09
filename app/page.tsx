"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Gamepad2, Music, Trophy, Users } from "lucide-react"
import { MusicVisualizer } from "@/components/music-visualizer"
import { useAuth } from "@/hooks/useAuth"

export default function Home() {
  const [isHovering, setIsHovering] = useState<string | null>(null)
  const { user } = useAuth()

  const features = [
    {
      id: "play",
      icon: Gamepad2,
      title: "Graj i Baw się",
      description: "Testuj swoją wiedzę muzyczną w ekscytującej grze rytmicznej",
    },
    {
      id: "library",
      icon: Music,
      title: "Bogata Biblioteka",
      description: "Tysiące utworów z YouTube i Spotify do wyboru",
    },
    {
      id: "competition",
      icon: Trophy,
      title: "Rywalizacja",
      description: "Konkuruj z innymi graczami i zdobywaj miejsca w rankingu",
    },
    {
      id: "community",
      icon: Users,
      title: "Społeczność",
      description: "Dołącz do rosnącej społeczności miłośników muzyki",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  }

  return (
    <div className="flex flex-col items-center justify-center gap-12 py-12">
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <motion.div
          className="flex items-center justify-center gap-4 mb-4"
          animate={{ scale: [1, 1.02, 1], rotate: [0, 1, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse" }}
        >
          <h1 className="text-6xl font-bold text-beatquest-purple-light glow-text">BeatQuest</h1>
          <MusicVisualizer className="h-12" />
        </motion.div>
        <p className="text-xl text-muted-foreground mb-8">Twoja muzyczna przygoda zaczyna się tutaj!</p>

        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            asChild
            size="lg"
            className="bg-gradient-to-r from-beatquest-purple to-beatquest-purple-light hover:from-beatquest-purple-dark hover:to-beatquest-purple text-white font-bold px-8 py-6 text-lg rounded-full"
          >
            <Link href={user ? "/play" : "/login"}>
              {user ? "Rozpocznij Grę!" : "Zaloguj się, aby grać"}
            </Link>
          </Button>
        </motion.div>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {features.map((feature) => (
          <motion.div
            key={feature.id}
            variants={item}
            onMouseEnter={() => setIsHovering(feature.id)}
            onMouseLeave={() => setIsHovering(null)}
          >
            <Card className="card-hover h-full bg-beatquest-dark-lighter border-beatquest-dark-light">
              <CardHeader>
                <motion.div
                  className="w-12 h-12 rounded-full bg-beatquest-purple/20 flex items-center justify-center mb-2"
                  animate={
                    isHovering === feature.id
                      ? {
                          scale: [1, 1.1, 1],
                          rotate: [0, 5, 0],
                        }
                      : {}
                  }
                  transition={{ duration: 0.5 }}
                >
                  <feature.icon className="w-6 h-6 text-beatquest-purple-light" />
                </motion.div>
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

