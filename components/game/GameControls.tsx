import React from 'react';
import { useGameContext } from '@/hooks/useGameContext';

export const GameControls: React.FC = () => {
  const { timeLeft, setTimeLeft } = useGameContext();

  return (
    <div className="flex justify-center space-x-4">
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        onClick={() => setTimeLeft(30)}
      >
        Nowa Gra
      </button>
      
      <button
        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        onClick={() => setTimeLeft(0)}
      >
        Zakończ Grę
      </button>
    </div>
  );
}; 