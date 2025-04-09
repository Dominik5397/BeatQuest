'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

interface GameContextType {
  score: number;
  timeLeft: number;
  currentSong: string | null;
  setScore: (score: number) => void;
  setTimeLeft: (time: number) => void;
  setCurrentSong: (songId: string | null) => void;
  checkAnswer: (answer: string) => boolean;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export function GameProvider({ children }: { children: ReactNode }) {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [currentSong, setCurrentSong] = useState<string | null>(null);

  const checkAnswer = (answer: string): boolean => {
    // TODO: Implementacja sprawdzania odpowiedzi
    return false;
  };

  const value: GameContextType = {
    score,
    timeLeft,
    currentSong,
    setScore,
    setTimeLeft,
    setCurrentSong,
    checkAnswer,
  };

  return (
    <GameContext.Provider value={value}>
      {children}
    </GameContext.Provider>
  );
}

export function useGameContext() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGameContext must be used within a GameProvider');
  }
  return context;
}