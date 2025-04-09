"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trophy } from "lucide-react"

export default function RankingPage() {
  const [timeFilter, setTimeFilter] = useState("all")
  const [levelFilter, setLevelFilter] = useState("all")
  const [genreFilter, setGenreFilter] = useState("all")

  // Sample ranking data - empty for this example
  const rankings = []

  return (
    <div className="max-w-5xl mx-auto">
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-beatquest-purple-light mb-2 flex items-center gap-2">
          <Trophy className="w-8 h-8 text-yellow-400" />
          Ranking Graczy
        </h1>
        <p className="text-muted-foreground">Sprawdź, kto jest najlepszy w BeatQuest</p>
      </motion.div>

      <motion.div
        className="flex flex-wrap gap-4 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Select value={timeFilter} onValueChange={setTimeFilter}>
          <SelectTrigger className="w-[180px] bg-beatquest-dark-lighter border-beatquest-dark-light">
            <SelectValue placeholder="Okres czasu" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Cały czas</SelectItem>
            <SelectItem value="week">Ostatni tydzień</SelectItem>
            <SelectItem value="month">Ostatni miesiąc</SelectItem>
            <SelectItem value="year">Ostatni rok</SelectItem>
          </SelectContent>
        </Select>

        <Select value={levelFilter} onValueChange={setLevelFilter}>
          <SelectTrigger className="w-[180px] bg-beatquest-dark-lighter border-beatquest-dark-light">
            <SelectValue placeholder="Poziom trudności" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie poziomy</SelectItem>
            <SelectItem value="easy">Łatwy</SelectItem>
            <SelectItem value="medium">Średni</SelectItem>
            <SelectItem value="hard">Trudny</SelectItem>
          </SelectContent>
        </Select>

        <Select value={genreFilter} onValueChange={setGenreFilter}>
          <SelectTrigger className="w-[180px] bg-beatquest-dark-lighter border-beatquest-dark-light">
            <SelectValue placeholder="Gatunek muzyczny" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Wszystkie gatunki</SelectItem>
            <SelectItem value="rock">Rock</SelectItem>
            <SelectItem value="metal">Metal</SelectItem>
            <SelectItem value="pop">Pop</SelectItem>
            <SelectItem value="electronic">Elektroniczna</SelectItem>
          </SelectContent>
        </Select>
      </motion.div>

      <motion.div
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <AnimatePresence>
          {rankings.length > 0 ? (
            rankings.map((ranking, index) => (
              <motion.div
                key={ranking.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <Card className="bg-beatquest-dark-lighter border-beatquest-dark-light overflow-hidden">
                  <CardContent className="p-4">{/* Ranking item content */}</CardContent>
                </Card>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center py-16 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-beatquest-dark-light flex items-center justify-center mb-4">
                <Trophy className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-medium mb-2">Brak wyników spełniających wybrane kryteria</h3>
              <p className="text-muted-foreground max-w-md">
                Spróbuj zmienić filtry lub zagraj więcej rund, aby pojawić się w rankingu
              </p>
              <Button className="mt-6 bg-beatquest-purple hover:bg-beatquest-purple-dark">Zagraj teraz</Button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

