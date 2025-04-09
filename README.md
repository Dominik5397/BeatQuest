# 🎵 BeatQuest

BeatQuest to interaktywna aplikacja muzyczno-rytmiczna, która łączy w sobie elementy gry rytmicznej z odkrywaniem nowej muzyki. Projekt jest obecnie w fazie aktywnego rozwoju.

## ✨ Główne funkcje

- 🎮 Rozgrywka rytmiczna z dynamicznym systemem punktacji
- 🎵 Integracja ze Spotify i YouTube do wyszukiwania i odtwarzania utworów
- 📊 System rankingowy i tabele wyników
- 👥 Funkcje społecznościowe
- 🏆 System progresji (poziomy i osiągnięcia)

## 🛠️ Technologie

### Frontend
- **React 18** z **Next.js 14** (App Router)
- **TypeScript** dla bezpiecznego typowania
- **Tailwind CSS** i **ShadcN UI** dla nowoczesnego interfejsu
- **Framer Motion** dla płynnych animacji

### Backend
- **FireBase**
  - Autentykacja użytkowników
  - Baza danych PostgreSQL
  - Realtime subscriptions
  - Storage dla zasobów

### Integracje
- Spotify API
- YouTube API

## 🗺️ Struktura projektu

### Strony
- `/` - Strona główna
- `/dashboard` - Panel użytkownika
- `/auth/login`, `/auth/signup` - Logowanie i rejestracja
- `/search` - Wyszukiwarka piosenek
- `/play/[songId]` - Rozgrywka rytmiczna
- `/profile` - Profil użytkownika

### Główne komponenty
- Silnik gry (GameEngine)
- System wyszukiwania utworów
- Komponenty UI
- System nawigacji

## 📝 Stan projektu

Projekt jest obecnie w fazie aktywnego rozwoju. Implementowane są kolejne funkcje i ulepszenia.

## 🚀 Jak uruchomić

1. Sklonuj repozytorium
2. Zainstaluj zależności:
```bash
npm install
```
3. Skonfiguruj zmienne środowiskowe w pliku `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=twój_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=twój_klucz
SPOTIFY_CLIENT_ID=twój_id
SPOTIFY_CLIENT_SECRET=twój_secret
YOUTUBE_API_KEY=twój_klucz
```
4. Uruchom serwer deweloperski:
```bash
npm run dev
```

## 📈 Co dalej?

- [ ] Rozbudowa systemu osiągnięć
- [ ] Dodanie większej liczby trybów gry
- [ ] Rozszerzenie funkcji społecznościowych
- [ ] Optymalizacja wydajności silnika gry
- [ ] Dodanie trybu offline

## 📄 Licencja

Ten projekt jest prywatny i wszystkie prawa są zastrzeżone.

---

Projekt rozwijany z ❤️ w Polsce
