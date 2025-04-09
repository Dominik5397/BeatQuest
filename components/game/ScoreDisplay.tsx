import React from 'react';

interface ScoreDisplayProps {
  score: number;
  timeLeft: number;
}

export const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ score, timeLeft }) => {
  return (
    <div className="flex justify-between items-center p-4 bg-gray-800 rounded-lg">
      <div className="text-2xl font-bold">
        Wynik: <span className="text-blue-500">{score}</span>
      </div>
      
      <div className="text-2xl font-bold">
        Czas: <span className={timeLeft < 10 ? 'text-red-500' : 'text-green-500'}>
          {timeLeft}s
        </span>
      </div>
    </div>
  );
}; 