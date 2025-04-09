'use client';

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  genre: string;
  difficulty: string;
}

interface GameSettings {
  genre: string;
  difficulty: string;
  songsCount: number;
}

interface GameState {
  isPlaying: boolean;
  currentSong: number;
  currentStage: number;
  score: number;
  timeLeft: number;
  gameStarted: boolean;
  songs: Song[];
  suggestions: Song[];
  currentSongData: Song | null;
}

const STAGES: Record<number, { time: number; points: number }> = {
  1: { time: 3, points: 100 },
  2: { time: 5, points: 80 },
  3: { time: 10, points: 60 },
  4: { time: 15, points: 40 },
  5: { time: 20, points: 20 }
} as const;

export function useGameLogic(initialSettings: GameSettings) {
  const [gameState, setGameState] = useState<GameState>({
    isPlaying: false,
    currentSong: 0,
    currentStage: 1,
    score: 0,
    timeLeft: 0,
    gameStarted: false,
    songs: [],
    suggestions: [],
    currentSongData: null
  });

  // Pobieranie piosenek z bazy danych
  const fetchSongs = useCallback(async () => {
    try {
      if (!initialSettings.genre || !initialSettings.difficulty) {
        console.error('Brak wymaganych ustawień:', initialSettings);
        return [];
      }

      console.log('Rozpoczynam pobieranie piosenek z ustawieniami:', initialSettings);
      
      if (!db) {
        console.error('Firebase nie zostało zainicjalizowane');
        throw new Error('Firebase nie zostało zainicjalizowane');
      }

      const songsRef = collection(db, 'songs');
      console.log('Kolekcja songs:', songsRef);

      // Pobierz wszystkie piosenki i filtruj lokalnie
      const querySnapshot = await getDocs(songsRef);
      console.log('Liczba wszystkich dokumentów:', querySnapshot.size);
      
      const allSongs = querySnapshot.docs.map(doc => {
        const data = doc.data();
        console.log('Dokument:', doc.id, data);
        return {
          id: doc.id,
          title: data.title || '',
          artist: data.artist || data.channelTitle || '',
          youtubeId: data.youtubeId || data.videoId || '',
          genre: data.genre || '',
          difficulty: data.difficulty || ''
        };
      }) as Song[];

      console.log('Wszystkie pobrane piosenki:', allSongs);

      // Filtruj piosenki lokalnie
      const filteredSongs = allSongs.filter(song => 
        song.genre?.toLowerCase() === initialSettings.genre.toLowerCase() &&
        song.difficulty?.toLowerCase() === initialSettings.difficulty.toLowerCase()
      );

      console.log('Przefiltrowane piosenki:', filteredSongs);

      if (filteredSongs.length === 0) {
        console.log('Nie znaleziono piosenek dla kryteriów:', initialSettings);
        return [];
      }

      // Losowe wybieranie piosenek
      const shuffled = [...filteredSongs].sort(() => 0.5 - Math.random());
      const selectedSongs = shuffled.slice(0, Math.min(initialSettings.songsCount, filteredSongs.length));
      console.log('Wybrane piosenki:', selectedSongs);

      setGameState(prev => ({
        ...prev,
        songs: selectedSongs,
        currentSongData: selectedSongs[0],
        gameStarted: true,
        currentStage: 1,
        timeLeft: STAGES[1].time,
        score: 0,
        isPlaying: false
      }));

      return selectedSongs;
    } catch (error) {
      console.error('Błąd podczas pobierania piosenek:', error);
      throw error;
    }
  }, [initialSettings]);

  // Timer dla etapu
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (gameState.isPlaying && gameState.timeLeft > 0) {
      timer = setInterval(() => {
        setGameState(prev => ({
          ...prev,
          timeLeft: prev.timeLeft - 1
        }));
      }, 1000);
    }

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [gameState.isPlaying, gameState.timeLeft]);

  // Rozpoczęcie odtwarzania
  const startPlaying = useCallback(() => {
    if (!gameState.currentSongData) return;

    setGameState(prev => ({
      ...prev,
      isPlaying: true,
      timeLeft: STAGES[prev.currentStage].time
    }));

    // TODO: Implementacja odtwarzania YouTube
  }, [gameState.currentSongData]);

  // Przejście do następnego etapu
  const nextStage = useCallback(() => {
    if (gameState.currentStage >= 5) return;

    setGameState(prev => ({
      ...prev,
      currentStage: prev.currentStage + 1,
      isPlaying: false,
      timeLeft: STAGES[prev.currentStage + 1].time
    }));
  }, [gameState.currentStage]);

  // Przejście do następnej piosenki
  const nextSong = useCallback(() => {
    if (gameState.currentSong >= gameState.songs.length - 1) {
      // Koniec gry
      setGameState(prev => ({
        ...prev,
        gameStarted: false
      }));
      return;
    }

    setGameState(prev => ({
      ...prev,
      currentSong: prev.currentSong + 1,
      currentStage: 1,
      isPlaying: false,
      timeLeft: STAGES[1].time,
      currentSongData: prev.songs[prev.currentSong + 1]
    }));
  }, [gameState.currentSong, gameState.songs.length]);

  // Sprawdzanie odpowiedzi
  const checkAnswer = useCallback((input: string) => {
    if (!gameState.currentSongData) return;

    const normalizedInput = input.toLowerCase().trim();
    const normalizedTitle = gameState.currentSongData.title.toLowerCase().trim();
    const normalizedArtist = gameState.currentSongData.artist.toLowerCase().trim();

    if (
      normalizedInput === normalizedTitle ||
      normalizedInput === normalizedArtist ||
      `${normalizedArtist} - ${normalizedTitle}`.includes(normalizedInput) ||
      `${normalizedTitle} - ${normalizedArtist}`.includes(normalizedInput)
    ) {
      // Poprawna odpowiedź
      const points = STAGES[gameState.currentStage].points;
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        isPlaying: false
      }));
      return true;
    }

    return false;
  }, [gameState.currentSongData, gameState.currentStage]);

  // Poddanie się
  const surrender = useCallback(() => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false
    }));
    nextSong();
  }, [nextSong]);

  // Wyszukiwanie podpowiedzi
  const searchSuggestions = (input: string) => {
    if (!input.trim()) {
      setGameState(prev => ({ ...prev, suggestions: [] }));
      return;
    }

    const normalizeText = (text: string) => text.toLowerCase().trim();
    const inputNormalized = normalizeText(input);

    // Funkcja obliczająca podobieństwo między dwoma stringami
    const calculateSimilarity = (str1: string, str2: string): number => {
      str1 = normalizeText(str1);
      str2 = normalizeText(str2);

      // Sprawdź dokładne zawieranie
      if (str2.includes(str1)) return 100;
      if (str1.includes(str2)) return 90;

      // Sprawdź każde słowo osobno
      const words1 = str1.split(' ');
      const words2 = str2.split(' ');

      let maxWordSimilarity = 0;
      for (const word1 of words1) {
        for (const word2 of words2) {
          if (word2.includes(word1) || word1.includes(word2)) {
            maxWordSimilarity = Math.max(maxWordSimilarity, 80);
          }
        }
      }

      // Sprawdź podobieństwo znaków
      const commonChars = str1.split('').filter(char => str2.includes(char)).length;
      const charSimilarity = (commonChars * 2) / (str1.length + str2.length) * 70;

      return Math.max(maxWordSimilarity, charSimilarity);
    };

    const matches = gameState.songs.map(song => {
      const titleSimilarity = calculateSimilarity(inputNormalized, song.title);
      const artistSimilarity = calculateSimilarity(inputNormalized, song.artist);
      const combinedSimilarity = calculateSimilarity(
        inputNormalized,
        `${song.artist} ${song.title}`
      );

      return {
        song,
        similarity: Math.max(titleSimilarity, artistSimilarity, combinedSimilarity)
      };
    });

    // Filtruj i sortuj wyniki
    const threshold = 50; // Minimalny próg podobieństwa (50%)
    const filteredMatches = matches
      .filter(match => match.similarity >= threshold)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5) // Limit do 5 najlepszych dopasowań
      .map(match => match.song);

    setGameState(prev => ({ ...prev, suggestions: filteredMatches }));
  };

  return {
    gameState,
    startPlaying,
    nextStage,
    nextSong,
    checkAnswer,
    surrender,
    searchSuggestions,
    fetchSongs
  };
} 