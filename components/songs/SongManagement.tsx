'use client';

import { useState, useCallback, memo, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useYoutubeSearch } from '@/hooks/useYoutubeSearch';
import { Search, Plus, Loader2, Trash2, Music } from 'lucide-react';
import { addDoc, collection, getDocs, deleteDoc, doc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MusicVisualizer } from '@/components/music-visualizer';

interface Song {
  id: string;
  title: string;
  artist: string;
  youtubeId: string;
  genre: string;
  difficulty: string;
  createdAt: Timestamp | string;
}

// Komponent dla pojedynczego wyniku wyszukiwania
const SearchResult = memo(({ song, onAdd, isAdding }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    className="flex items-center justify-between p-3 rounded-lg bg-card hover:bg-accent/50 transition-colors"
  >
    <div className="flex items-center space-x-3">
      <img
        src={song.thumbnail}
        alt={song.title}
        className="w-12 h-12 rounded object-cover"
        loading="lazy"
      />
      <div>
        <h3 className="font-medium line-clamp-1">{song.title}</h3>
        <p className="text-sm text-muted-foreground">
          {song.channelTitle}
        </p>
      </div>
    </div>
    <Button
      variant="ghost"
      size="icon"
      onClick={() => onAdd(song)}
      disabled={isAdding}
    >
      {isAdding ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Plus className="h-4 w-4" />
      )}
    </Button>
  </motion.div>
));

SearchResult.displayName = 'SearchResult';

// Komponent dla pojedynczej piosenki w bibliotece
const SongItem = memo(({ song, onDelete, onUpdate }: { 
  song: Song, 
  onDelete: (id: string) => void,
  onUpdate: (id: string, field: "genre" | "difficulty", value: string) => void 
}) => {
  const genres = ["pop", "rock", "metal", "rap", "classical", "electronic"];
  const difficulties = ["easy", "medium", "hard"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className="bg-card">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <MusicVisualizer />
              </div>
              <div>
                <h3 className="font-medium line-clamp-1">{song.title}</h3>
                <p className="text-sm text-muted-foreground">{song.artist}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2">
                <Select
                  value={song.genre}
                  onValueChange={(value) => onUpdate(song.id, "genre", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Gatunek" />
                  </SelectTrigger>
                  <SelectContent>
                    {genres.map((genre) => (
                      <SelectItem key={genre} value={genre}>
                        {genre.charAt(0).toUpperCase() + genre.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={song.difficulty}
                  onValueChange={(value) => onUpdate(song.id, "difficulty", value)}
                >
                  <SelectTrigger className="w-[120px]">
                    <SelectValue placeholder="Poziom" />
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

              <Button
                variant="ghost"
                size="icon"
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => onDelete(song.id)}
              >
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
});

SongItem.displayName = 'SongItem';

export function SongManagement() {
  const [query, setQuery] = useState('');
  const { searchYoutube, results, isLoading, error } = useYoutubeSearch();
  const { toast } = useToast();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [songs, setSongs] = useState<Song[]>([]);
  const [isLoadingSongs, setIsLoadingSongs] = useState(true);

  const fetchSongs = useCallback(async () => {
    try {
      setIsLoadingSongs(true);
      const songsCollection = collection(db, "songs");
      const songsSnapshot = await getDocs(songsCollection);
      const songsList = songsSnapshot.docs.map(doc => {
        const data = doc.data();
        console.log("Pobrana piosenka:", { id: doc.id, ...data });
        return {
          id: doc.id,
          ...data
        };
      }) as Song[];
      
      console.log("Wszystkie piosenki:", songsList);
      
      // Sortowanie po timestamp
      setSongs(songsList.sort((a, b) => {
        const timeA = a.createdAt instanceof Timestamp ? a.createdAt.toMillis() : new Date(a.createdAt as string).getTime();
        const timeB = b.createdAt instanceof Timestamp ? b.createdAt.toMillis() : new Date(b.createdAt as string).getTime();
        return timeB - timeA;
      }));
    } catch (error) {
      console.error("Błąd podczas pobierania piosenek:", error);
      toast({
        title: "Błąd",
        description: "Nie udało się pobrać listy piosenek",
        variant: "destructive",
      });
    } finally {
      setIsLoadingSongs(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchSongs();
  }, [fetchSongs]);

  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
  }, []);

  const handleSearchClick = useCallback(() => {
    if (query.trim()) {
      searchYoutube(query);
    }
  }, [query, searchYoutube]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearchClick();
    }
  }, [handleSearchClick]);

  const handleAddSong = useCallback(async (song: any) => {
    try {
      setAddingId(song.id);
      const newSong = {
        title: song.title,
        artist: song.channelTitle,
        youtubeId: song.id,
        genre: "pop",
        difficulty: "medium",
        createdAt: serverTimestamp(),
        channelTitle: song.channelTitle,
        videoId: song.id,
        thumbnail: song.thumbnail
      };

      await addDoc(collection(db, "songs"), newSong);
      await fetchSongs();
      
      toast({
        title: "Sukces!",
        description: "Piosenka została dodana do bazy danych.",
        variant: "default"
      });
    } catch (error) {
      console.error("Błąd podczas dodawania piosenki:", error);
      toast({
        title: "Błąd!",
        description: "Nie udało się dodać piosenki.",
        variant: "destructive"
      });
    } finally {
      setAddingId(null);
    }
  }, [toast, fetchSongs]);

  const handleDeleteSong = useCallback(async (songId: string) => {
    try {
      await deleteDoc(doc(db, "songs", songId));
      await fetchSongs();
      toast({
        title: "Sukces",
        description: "Piosenka została usunięta",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się usunąć piosenki",
        variant: "destructive",
      });
    }
  }, [fetchSongs, toast]);

  const handleUpdateSong = useCallback(async (songId: string, field: "genre" | "difficulty", value: string) => {
    try {
      const songRef = doc(db, "songs", songId);
      await updateDoc(songRef, { [field]: value });
      await fetchSongs();
      toast({
        title: "Sukces",
        description: "Piosenka została zaktualizowana",
      });
    } catch (error) {
      toast({
        title: "Błąd",
        description: "Nie udało się zaktualizować piosenki",
        variant: "destructive",
      });
    }
  }, [fetchSongs, toast]);

  return (
    <div className="w-full space-y-8">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Input
            type="text"
            placeholder="Wyszukaj piosenkę..."
            value={query}
            onChange={handleSearch}
            onKeyPress={handleKeyPress}
            className="pl-10"
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
        </div>
        <Button 
          onClick={handleSearchClick}
          disabled={!query.trim() || isLoading}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Szukaj
        </Button>
      </div>

      {error && (
        <div className="text-sm text-destructive">
          Wystąpił błąd podczas wyszukiwania: {error}
        </div>
      )}

      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-2 border-b pb-8"
            key="search-results"
          >
            <h2 className="text-lg font-semibold mb-4">Wyniki wyszukiwania</h2>
            {results.map((song: any) => (
              <SearchResult
                key={`search-${song.id}`}
                song={song}
                onAdd={handleAddSong}
                isAdding={addingId === song.id}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Twoja kolekcja</h2>
        {isLoadingSongs ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : songs.length > 0 ? (
          <AnimatePresence>
            <div className="space-y-4">
              {songs.map((song) => (
                <SongItem
                  key={`library-${song.id}`}
                  song={song}
                  onDelete={handleDeleteSong}
                  onUpdate={handleUpdateSong}
                />
              ))}
            </div>
          </AnimatePresence>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            Brak piosenek w kolekcji
          </div>
        )}
      </div>
    </div>
  );
} 