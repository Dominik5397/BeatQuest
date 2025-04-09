'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import YouTube from 'react-youtube';

interface YouTubePlayerProps {
  videoId: string;
  isPlaying: boolean;
  duration: number;
  onEnd: () => void;
}

export function YouTubePlayer({ videoId, isPlaying, duration, onEnd }: YouTubePlayerProps) {
  const playerRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const playbackAttemptRef = useRef<number>(0);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [isPlaybackInProgress, setIsPlaybackInProgress] = useState(false);

  // Bezpieczne wywołanie metod odtwarzacza
  const safePlayerCall = useCallback(async (method: string, ...args: any[]) => {
    try {
      if (
        playerRef.current && 
        typeof playerRef.current[method] === 'function' && 
        isInitialized
      ) {
        return await playerRef.current[method](...args);
      }
      return null;
    } catch (error) {
      console.error(`Błąd podczas wywoływania ${method}:`, error);
      return null;
    }
  }, [isInitialized]);

  const stopPlayback = useCallback(async () => {
    try {
      console.log('Próba zatrzymania odtwarzania...');
      
      // Bezpieczne zatrzymanie odtwarzania - dodaj więcej prób
      let stopAttempts = 0;
      const maxAttempts = 3;
      
      while (stopAttempts < maxAttempts) {
        await safePlayerCall('pauseVideo');
        
        // Sprawdź, czy odtwarzanie faktycznie zostało zatrzymane
        const playerState = await safePlayerCall('getPlayerState');
        console.log('Stan odtwarzacza po próbie zatrzymania:', playerState);
        
        if (playerState === 2) { // 2 oznacza PAUSED
          console.log('Odtwarzanie zatrzymane pomyślnie');
          break;
        }
        
        stopAttempts++;
        console.log(`Próba zatrzymania ${stopAttempts}/${maxAttempts}`);
        
        // Krótkie opóźnienie przed kolejną próbą
        await new Promise(resolve => setTimeout(resolve, 100));
      }
      
      setIsPlaybackInProgress(false);
      
      // Wyczyść timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      
      // Zawsze wywołaj onEnd, nawet jeśli zatrzymanie się nie powiodło
      onEnd();
    } catch (error) {
      console.error('Błąd podczas zatrzymywania odtwarzania:', error);
      setIsPlaybackInProgress(false);
      onEnd();
    }
  }, [safePlayerCall, onEnd]);

  // Resetuj stan gotowości odtwarzacza przy zmianie videoId
  useEffect(() => {
    console.log('Zmiana videoId, resetowanie stanu odtwarzacza');
    setIsPlayerReady(false);
    setStartTime(null);
    setIsInitialized(false);
    setIsPlaybackInProgress(false);
    playbackAttemptRef.current = 0;
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [videoId]);

  useEffect(() => {
    // Nie wykonuj nic, jeśli odtwarzacz nie jest gotowy
    if (!isPlayerReady || !isInitialized) {
      console.log('Odtwarzacz nie jest gotowy, pomijam efekt odtwarzania');
      return;
    }

    // Zabezpieczenie przed zbyt wieloma próbami odtwarzania
    if (playbackAttemptRef.current > 5) {
      console.error('Zbyt wiele prób odtwarzania, przerywam');
      return;
    }

    // Sprawdź czy duration jest prawidłowe
    const effectiveDuration = duration > 0 ? duration : 10; // Domyślnie 10 sekund jeśli duration jest nieprawidłowe

    const handlePlayback = async () => {
      try {
        // Jeśli odtwarzanie jest już w trakcie, nie rozpoczynaj nowego
        if (isPlaybackInProgress && isPlaying) {
          console.log('Odtwarzanie już w trakcie, pomijam');
          return;
        }

        if (isPlaying) {
          console.log(`Rozpoczynam odtwarzanie... (próba ${playbackAttemptRef.current + 1})`);
          playbackAttemptRef.current += 1;
          setIsPlaybackInProgress(true);
          
          // Ustaw punkt startowy tylko jeśli nie został jeszcze ustawiony
          if (startTime === null) {
            const videoDuration = await safePlayerCall('getDuration');
            console.log('Pobrana długość filmu:', videoDuration);
            
            if (videoDuration && videoDuration > effectiveDuration) {
              const maxStartTime = Math.max(0, videoDuration - effectiveDuration - 5);
              const randomStart = Math.floor(Math.random() * maxStartTime);
              console.log(`Odtwarzam od ${randomStart}s do ${randomStart + effectiveDuration}s (całość: ${videoDuration}s)`);
              setStartTime(randomStart);
              await safePlayerCall('seekTo', randomStart, true);
            } else {
              console.log('Film zbyt krótki lub nie udało się pobrać długości, odtwarzam od początku');
              setStartTime(0);
              await safePlayerCall('seekTo', 0, true);
            }
          }
          
          // Rozpocznij odtwarzanie
          await safePlayerCall('playVideo');
          console.log(`Rozpoczęto odtwarzanie, będzie trwać ${effectiveDuration} sekund`);

          // Ustaw nowy timeout
          if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
          }
          
          timeoutRef.current = setTimeout(() => {
            console.log(`Timeout - zatrzymywanie odtwarzania po ${effectiveDuration} sekundach`);
            stopPlayback();
            
            // Dodatkowe zabezpieczenie - sprawdź po krótkim czasie, czy odtwarzanie zostało zatrzymane
            setTimeout(async () => {
              const playerState = await safePlayerCall('getPlayerState');
              if (playerState === 1) { // 1 oznacza PLAYING
                console.log('Odtwarzanie nadal trwa mimo próby zatrzymania, próbuję ponownie');
                stopPlayback();
              }
            }, 500);
          }, effectiveDuration * 1000);
        } else if (isPlaybackInProgress) {
          console.log('isPlaying jest false, zatrzymuję odtwarzanie');
          await stopPlayback();
        }
      } catch (error) {
        console.error('Błąd podczas obsługi odtwarzacza:', error);
        setIsPlaybackInProgress(false);
        await stopPlayback();
      }
    };

    // Dodaj małe opóźnienie przed rozpoczęciem odtwarzania
    const playbackTimeout = setTimeout(handlePlayback, 500);

    return () => {
      clearTimeout(playbackTimeout);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [isPlaying, duration, onEnd, isPlayerReady, startTime, isInitialized, stopPlayback, safePlayerCall, isPlaybackInProgress]);

  const onReady = (event: any) => {
    console.log('Odtwarzacz YouTube gotowy');
    playerRef.current = event.target;
    
    // Poczekaj chwilę przed ustawieniem stanu gotowości
    setTimeout(() => {
      setIsPlayerReady(true);
      setIsInitialized(true);
      console.log('Odtwarzacz w pełni zainicjalizowany');
    }, 1000);
  };

  const onError = (event: any) => {
    console.error('Błąd odtwarzacza YouTube:', event.data);
    setIsPlayerReady(false);
    setIsPlaybackInProgress(false);
    // Nie wywołuj stopPlayback bezpośrednio, aby uniknąć pętli błędów
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    onEnd();
  };

  const onStateChange = (event: any) => {
    console.log('Zmiana stanu odtwarzacza:', event.data);
    
    // Sprawdź czy odtwarzacz nie kontynuuje odtwarzania po zatrzymaniu
    if (!isPlaying && event.data === 1) { // 1 to stan PLAYING
      console.log('Odtwarzacz odtwarza mimo isPlaying=false, zatrzymuję');
      stopPlayback();
    }
    
    // Jeśli odtwarzacz zakończył odtwarzanie (stan 0), wywołaj onEnd
    if (event.data === 0) {
      console.log('Odtwarzanie zakończone automatycznie');
      setIsPlaybackInProgress(false);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      onEnd();
    }
  };

  return (
    <div className="hidden">
      <YouTube
        videoId={videoId}
        onReady={onReady}
        onError={onError}
        onStateChange={onStateChange}
        opts={{
          height: '0',
          width: '0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            rel: 0
          },
        }}
      />
    </div>
  );
} 