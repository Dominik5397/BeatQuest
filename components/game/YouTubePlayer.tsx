import React from 'react';
import { config } from '@/lib/config';

interface YouTubePlayerProps {
  videoId: string | null;
}

export const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId }) => {
  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-800 flex items-center justify-center">
        <p className="text-gray-400">Wybierz piosenkę, aby rozpocząć grę</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video">
      <iframe
        width="100%"
        height="100%"
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1&controls=0`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>
  );
}; 