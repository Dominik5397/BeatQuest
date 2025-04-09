"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Users, Trophy } from "lucide-react"
import { MusicVisualizer } from "@/components/music-visualizer"
import { useRouter } from "next/navigation"

export default function PlayPage() {
  const router = useRouter()
  const [selectedMode, setSelectedMode] = useState<string | null>(null)
  const [difficulty, setDifficulty] = useState("medium")
  const [genre, setGenre] = useState("all")
  const [songCount, setSongCount] = useState("5")

  const handleStartGame = () => {
    if (!selectedMode) return;

    const gameSettings = {
      mode: selectedMode,
      difficulty,
      genre,
      songCount: parseInt(songCount)
    };

    // Przekierowanie do odpowiedniego trybu gry
    switch (selectedMode) {
      case "solo":
        router.push(`/play/solo?settings=${encodeURIComponent(JSON.stringify(gameSettings))}`);
        break;
      case "multiplayer":
        router.push(`/play/multiplayer?settings=${encodeURIComponent(JSON.stringify(gameSettings))}`);
        break;
      case "tournament":
        router.push(`/play/tournament?settings=${encodeURIComponent(JSON.stringify(gameSettings))}`);
        break;
    }
  };

  const gameModes = [
    {
      id: "solo",
      icon: Play,
      title: "Tryb Solo",
      description: "Graj samodzielnie i pobij swój rekord punktów",
    },
    {
      id: "multiplayer",
      icon: Users,
      title: "Multiplayer",
      description: "Rywalizuj z innymi graczami w czasie rzeczywistym",
    },
    {
      id: "tournament",
      icon: Trophy,
      title: "Turniej",
      description: "Weź udział w turniejach i zdobywaj nagrody",
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
    <div className="max-w-5xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-beatquest-purple-light mb-2">Wybierz Tryb Gry</h1>
        <p className="text-muted-foreground">Wybierz tryb gry, który najbardziej Ci odpowiada</p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        variants={container}
        initial="hidden"
        animate="show"
      >
        {gameModes.map((mode) => (
          <motion.div key={mode.id} variants={item}>
            <Card
              className={`card-hover cursor-pointer h-full transition-all duration-300 ${
                selectedMode === mode.id
                  ? "border-beatquest-purple bg-beatquest-dark-lighter/80"
                  : "bg-beatquest-dark-lighter border-beatquest-dark-light"
              }`}
              onClick={() => setSelectedMode(mode.id)}
            >
              <CardHeader>
                <motion.div
                  className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${
                    selectedMode === mode.id
                      ? "bg-beatquest-purple text-white"
                      : "bg-beatquest-purple/20 text-beatquest-purple-light"
                  }`}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <mode.icon className="w-8 h-8" />
                </motion.div>
                <CardTitle className="text-2xl">{mode.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground text-base">{mode.description}</CardDescription>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="bg-beatquest-dark-lighter rounded-xl p-6 border border-beatquest-dark-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h2 className="text-2xl font-bold mb-6">Ustawienia</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Poziom trudności</label>
            <Select value={difficulty} onValueChange={setDifficulty}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz poziom trudności" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy">Łatwy</SelectItem>
                <SelectItem value="medium">Średni</SelectItem>
                <SelectItem value="hard">Trudny</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gatunek muzyczny</label>
            <Select value={genre} onValueChange={setGenre}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz gatunek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Wszystkie</SelectItem>
                <SelectItem value="rock">Rock</SelectItem>
                <SelectItem value="metal">Metal</SelectItem>
                <SelectItem value="pop">Pop</SelectItem>
                <SelectItem value="electronic">Elektroniczna</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Liczba piosenek</label>
            <Select value={songCount} onValueChange={setSongCount}>
              <SelectTrigger>
                <SelectValue placeholder="Wybierz liczbę piosenek" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="3">3 piosenki</SelectItem>
                <SelectItem value="5">5 piosenek</SelectItem>
                <SelectItem value="10">10 piosenek</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-8 flex justify-center">
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button
              size="lg"
              disabled={!selectedMode}
              onClick={handleStartGame}
              className="bg-gradient-to-r from-beatquest-purple to-beatquest-purple-light hover:from-beatquest-purple-dark hover:to-beatquest-purple text-white font-bold px-8 py-6 text-lg rounded-full flex items-center gap-2"
            >
              <Play className="w-5 h-5" />
              Rozpocznij Grę
              <MusicVisualizer className="ml-2" />
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}

