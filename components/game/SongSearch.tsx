import React, { useState, useEffect } from 'react';
import { config } from '@/lib/config';

interface SongSearchProps {
  onSongSelect: (songId: string) => void;
}

export const SongSearch: React.FC<SongSearchProps> = ({ onSongSelect }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<any[]>([]);

  useEffect(() => {
    const searchSongs = async () => {
      if (searchTerm.length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await fetch(
          `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchTerm}&type=video&key=${config.youtube.apiKey}`
        );
        const data = await response.json();
        setSuggestions(data.items || []);
      } catch (error) {
        console.error('Błąd podczas wyszukiwania:', error);
      }
    };

    const timeoutId = setTimeout(searchSongs, 300);
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  return (
    <div className="relative">
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Wpisz tytuł piosenki..."
        className="w-full p-4 bg-gray-800 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      {suggestions.length > 0 && (
        <div className="absolute w-full mt-2 bg-gray-800 rounded-lg shadow-lg">
          {suggestions.map((song) => (
            <div
              key={song.id.videoId}
              onClick={() => onSongSelect(song.id.videoId)}
              className="p-3 hover:bg-gray-700 cursor-pointer"
            >
              <p className="text-white">{song.snippet.title}</p>
              <p className="text-gray-400 text-sm">{song.snippet.channelTitle}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}; 