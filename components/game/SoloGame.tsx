import React, { useState, useEffect } from 'react';
import { useGameContext } from '@/hooks/useGameContext';
import { YouTubePlayer } from './YouTubePlayer';
import { SongSearch } from './SongSearch';
import { GameControls } from './GameControls';
import { ScoreDisplay } from './ScoreDisplay';

export const SoloGame: React.FC = () => {
  const [currentSong, setCurrentSong] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-4">
      <div className="w-full max-w-4xl">
        <ScoreDisplay score={score} timeLeft={timeLeft} />
        
        <div className="my-8">
          <YouTubePlayer videoId={currentSong} />
        </div>

        <div className="my-8">
          <SongSearch onSongSelect={(songId) => setCurrentSong(songId)} />
        </div>

        <GameControls />
      </div>
    </div>
  );
}; 