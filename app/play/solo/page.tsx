'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PlayCircle, SkipForward, FastForward, Trophy, Timer, Music2 } from 'lucide-react';
import { useGameLogic } from '@/hooks/useGameLogic';
import { YouTubePlayer } from '@/components/youtube-player';
import { useToast } from '@/components/ui/use-toast';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useSearchParams } from 'next/navigation';

interface GameSettings {
  genre: string;
  difficulty: string;
  songsCount: number;
}

export default function SoloGame() {
  const searchParams = useSearchParams();
  const [settings, setSettings] = useState<GameSettings>({
    genre: '',
    difficulty: '',
    songsCount: 5
  });

  const [answer, setAnswer] = useState('');
  const [showPopover, setShowPopover] = useState(false);
  const { toast } = useToast();
  
  // Odczytaj ustawienia z URL jeśli są dostępne
  useEffect(() => {
    const settingsParam = searchParams.get('settings');
    if (settingsParam) {
      try {
        const parsedSettings = JSON.parse(decodeURIComponent(settingsParam));
        setSettings({
          genre: parsedSettings.genre || 'pop',
          difficulty: parsedSettings.difficulty || 'medium',
          songsCount: parsedSettings.songCount || 5
        });
      } catch (error) {
        console.error('Błąd podczas parsowania ustawień:', error);
      }
    }
  }, [searchParams]);
  
  const {
    gameState,
    startPlaying,
    nextStage,
    nextSong,
    checkAnswer,
    surrender,
    searchSuggestions,
    fetchSongs
  } = useGameLogic(settings);

  const genres = ["pop", "rock", "metal", "rap", "classical", "electronic"];
  const difficulties = ["easy", "medium", "hard"];
  const songCounts = [3, 5, 10];

  const handleStartGame = async () => {
    try {
      console.log('Rozpoczynanie gry z ustawieniami:', settings);
      
      if (!settings.genre || !settings.difficulty) {
        toast({
          title: "Błąd",
          description: "Wybierz gatunek muzyczny i poziom trudności",
          variant: "destructive"
        });
        return;
      }

      toast({
        title: "Ładowanie",
        description: "Trwa wczytywanie piosenek...",
      });

      const songs = await fetchSongs();
      console.log('Pobrane piosenki:', songs);

      if (!songs || songs.length === 0) {
        toast({
          title: "Błąd",
          description: "Nie znaleziono piosenek dla wybranych kryteriów",
          variant: "destructive"
        });
        return;
      }

      if (songs.length < settings.songsCount) {
        toast({
          title: "Uwaga",
          description: `Znaleziono tylko ${songs.length} piosenek dla wybranych kryteriów`,
          variant: "default"
        });
      }

      startPlaying();
      
      toast({
        title: "Gotowe!",
        description: "Gra rozpoczęta",
        variant: "default"
      });
    } catch (error) {
      console.error('Błąd podczas rozpoczynania gry:', error);
      toast({
        title: "Błąd",
        description: "Wystąpił błąd podczas rozpoczynania gry",
        variant: "destructive"
      });
    }
  };

  const handleAnswerChange = (value: string) => {
    setAnswer(value);
    searchSuggestions(value);
    setShowPopover(value.length > 0);
  };

  const handleAnswerSubmit = () => {
    if (!answer.trim()) {
      toast({
        title: "Błąd",
        description: "Wprowadź odpowiedź",
        variant: "destructive"
      });
      return;
    }
    
    if (checkAnswer(answer)) {
      toast({
        title: "Gratulacje!",
        description: "Poprawna odpowiedź!",
        variant: "default"
      });
      setAnswer('');
      nextSong();
    } else {
      toast({
        title: "Błędna odpowiedź",
        description: "Spróbuj ponownie lub przejdź do następnego etapu",
        variant: "destructive"
      });
    }
  };

  const handleSurrender = () => {
    const currentSong = gameState.currentSongData;
    if (currentSong) {
      toast({
        title: "Szkoda!",
        description: `To była piosenka "${currentSong.title}" wykonywana przez ${currentSong.artist}`,
        variant: "destructive"
      });
    }
    surrender();
    setAnswer('');
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && answer && gameState.gameStarted) {
        handleAnswerSubmit();
      }
    };

    window.addEventListener('keypress', handleKeyPress);
    return () => window.removeEventListener('keypress', handleKeyPress);
  }, [answer, gameState.gameStarted]);

  return (
    <div className="container mx-auto py-8 space-y-8">
      {!gameState.gameStarted ? (
        // Ekran ustawień gry
        <Card>
          <CardHeader>
            <CardTitle>Ustawienia gry - Tryb Solo</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Gatunek muzyczny</Label>
              <Select
                value={settings.genre}
                onValueChange={(value) => setSettings({ ...settings, genre: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz gatunek" />
                </SelectTrigger>
                <SelectContent>
                  {genres.map((genre) => (
                    <SelectItem key={genre} value={genre}>
                      {genre.charAt(0).toUpperCase() + genre.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Poziom trudności</Label>
              <Select
                value={settings.difficulty}
                onValueChange={(value) => setSettings({ ...settings, difficulty: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz poziom trudności" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Liczba piosenek</Label>
              <Select
                value={settings.songsCount.toString()}
                onValueChange={(value) => setSettings({ ...settings, songsCount: parseInt(value) })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Wybierz liczbę piosenek" />
                </SelectTrigger>
                <SelectContent>
                  {songCounts.map((count) => (
                    <SelectItem key={count} value={count.toString()}>
                      {count} piosenek
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <Button 
              className="w-full"
              onClick={handleStartGame}
              disabled={!settings.genre || !settings.difficulty}
            >
              Rozpocznij grę
            </Button>
          </CardContent>
        </Card>
      ) : (
        // Ekran gry
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>
                Piosenka {gameState.currentSong + 1}/{settings.songsCount}
              </CardTitle>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  <span>{gameState.timeLeft}s</span>
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5" />
                  <span>{gameState.score} pkt</span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-4">
              <Button 
                variant="outline" 
                size="lg"
                className="flex-1"
                onClick={() => startPlaying()}
                disabled={gameState.isPlaying || !gameState.currentSongData}
              >
                <PlayCircle className="w-6 h-6 mr-2" />
                Start
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={nextStage}
                disabled={gameState.currentStage >= 5 || !gameState.currentSongData}
              >
                <SkipForward className="w-6 h-6 mr-2" />
                Następny etap
              </Button>
              <Button 
                variant="outline"
                size="lg"
                className="flex-1"
                onClick={nextSong}
                disabled={!gameState.currentSongData}
              >
                <FastForward className="w-6 h-6 mr-2" />
                Następna piosenka
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label>Zgadnij piosenkę</Label>
              <div className="relative">
                <div className="relative">
                  <Music2 className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input 
                    type="text" 
                    value={answer}
                    onChange={(e) => {
                      const value = e.target.value;
                      setAnswer(value);
                      // Automatycznie pokazuj podpowiedzi po wpisaniu co najmniej 2 znaków
                      if (value.trim().length >= 2) {
                        searchSuggestions(value);
                        setShowPopover(true);
                      } else {
                        setShowPopover(false);
                      }
                    }}
                    onFocus={() => {
                      // Pokaż podpowiedzi również przy kliknięciu, jeśli jest już tekst
                      if (answer.trim().length >= 2) {
                        searchSuggestions(answer);
                        setShowPopover(true);
                      }
                    }}
                    onBlur={(e) => {
                      // Opóźnij ukrycie podpowiedzi, aby umożliwić kliknięcie na nie
                      setTimeout(() => {
                        if (!e.currentTarget.contains(document.activeElement)) {
                          setShowPopover(false);
                        }
                      }, 200);
                    }}
                    className="pl-10 w-full"
                    placeholder="Wpisz tytuł lub wykonawcę..."
                    disabled={!gameState.currentSongData}
                  />
                </div>
                {showPopover && answer.trim() && (
                  <div className="absolute w-full mt-1 bg-popover border rounded-md shadow-md z-50">
                    <div className="p-0">
                      {gameState.suggestions.length === 0 ? (
                        <div className="p-2 text-sm text-muted-foreground">
                          Brak podpowiedzi
                        </div>
                      ) : (
                        <div className="max-h-[200px] overflow-y-auto">
                          {gameState.suggestions.map((song) => (
                            <div
                              key={song.id}
                              className="flex items-center px-2 py-1.5 hover:bg-accent cursor-pointer"
                              onMouseDown={(e) => {
                                // Używamy onMouseDown zamiast onClick, aby zapobiec utracie fokusu
                                e.preventDefault();
                                setAnswer(`${song.artist} - ${song.title}`);
                                setShowPopover(false);
                              }}
                            >
                              <Music2 className="mr-2 h-4 w-4" />
                              <span>{song.artist} - {song.title}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
              
              <Button 
                className="w-full mt-2"
                onClick={handleAnswerSubmit}
                disabled={!answer.trim() || !gameState.currentSongData}
              >
                Sprawdź odpowiedź
              </Button>
            </div>

            <Button 
              variant="destructive" 
              className="w-full"
              onClick={handleSurrender}
              disabled={!gameState.currentSongData}
            >
              Poddaj się
            </Button>

            {gameState.currentSongData && (
              <YouTubePlayer
                videoId={gameState.currentSongData.youtubeId}
                isPlaying={gameState.isPlaying}
                duration={gameState.timeLeft}
                onEnd={() => {
                  toast({
                    title: "Koniec czasu!",
                    description: "Spróbuj zgadnąć lub przejdź do następnego etapu",
                    variant: "default"
                  });
                }}
              />
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
} 