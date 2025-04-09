import { useState, useCallback, useRef } from 'react';
import debounce from 'lodash/debounce';

const CACHE_DURATION = 5 * 60 * 1000; // 5 minut

interface CacheItem {
  results: YoutubeSearchResult[];
  timestamp: number;
}

export interface YoutubeSearchResult {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
}

export function useYoutubeSearch() {
  const [results, setResults] = useState<YoutubeSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const cache = useRef<Record<string, CacheItem>>({});

  const searchYoutube = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    // Sprawdź cache
    const cacheKey = query.toLowerCase();
    const cachedData = cache.current[cacheKey];
    const now = Date.now();

    if (cachedData && (now - cachedData.timestamp) < CACHE_DURATION) {
      setResults(cachedData.results);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&type=video&q=${encodeURIComponent(
          query
        )}&key=${YOUTUBE_API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Błąd podczas pobierania danych z YouTube API');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error.message);
      }

      const newResults = data.items.map((item: any) => ({
        id: item.id.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails.default.url,
        channelTitle: item.snippet.channelTitle
      }));

      // Zapisz w cache
      cache.current[cacheKey] = {
        results: newResults,
        timestamp: now
      };

      setResults(newResults);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Wystąpił nieznany błąd';
      setError(errorMessage);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Funkcja do czyszczenia cache
  const clearCache = useCallback(() => {
    const now = Date.now();
    Object.keys(cache.current).forEach(key => {
      if (now - cache.current[key].timestamp > CACHE_DURATION) {
        delete cache.current[key];
      }
    });
  }, []);

  // Czyść stary cache co jakiś czas
  useRef<NodeJS.Timeout | null>(null).current = setInterval(clearCache, CACHE_DURATION);

  return { searchYoutube, results, isLoading, error };
} 