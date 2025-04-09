# BeatQuest - Aplikacja do Gry w Odgadywanie Piosenek

## Opis Projektu

BeatQuest to interaktywna aplikacja webowa do gry w odgadywanie piosenek. Użytkownicy mogą grać w trybie jednoosobowym lub wieloosobowym, odgadując tytuły piosenek na podstawie fragmentów muzycznych odtwarzanych z YouTube. Aplikacja oferuje różne poziomy trudności, kategorie muzyczne oraz system punktacji.

## Główne Funkcjonalności

### 1. System Gry
- **Tryb jednoosobowy** - gracz samodzielnie odgaduje piosenki
- **Tryb wieloosobowy** - rywalizacja z innymi graczami w czasie rzeczywistym
- **Różne poziomy trudności** - łatwy, średni, trudny
- **Kategoryzacja muzyki** - filtrowanie piosenek według gatunków
- **System punktacji** - przyznawanie punktów za poprawne odpowiedzi
- **Timer** - ograniczony czas na odgadnięcie piosenki

### 2. Odtwarzanie Muzyki
- **Integracja z YouTube** - odtwarzanie fragmentów piosenek
- **Kontrolki odtwarzania** - play/pause, regulacja głośności, pomijanie
- **Wizualizacja muzyki** - animowany wizualizer podczas ładowania

### 3. Wyszukiwanie i Podpowiedzi
- **Autouzupełnianie** - system podpowiedzi podczas wpisywania tytułu
- **Filtrowanie wyników** - wyświetlanie pasujących piosenek
- **Nawigacja klawiaturą** - możliwość wyboru podpowiedzi za pomocą strzałek
- **Informacje o trudności** - oznaczenie poziomu trudności każdej piosenki

### 4. Interfejs Użytkownika
- **Responsywny design** - dostosowanie do różnych urządzeń
- **Animacje** - płynne przejścia i efekty wizualne
- **Ciemny motyw** - przyjazny dla oczu interfejs
- **Komunikaty** - informacje o sukcesie, błędach i statusie gry

### 5. Autoryzacja i Profil
- **Rejestracja i logowanie** - system kont użytkowników
- **Profil użytkownika** - statystyki i historia gier
- **Osiągnięcia** - system nagród i odznak

### 6. Panel Administracyjny
- **Zarządzanie utworami** - dodawanie, edycja, usuwanie piosenek
- **Monitoring użytkowników** - statystyki i aktywność
- **Zarządzanie zawartością** - kategoryzacja i moderacja



## Technologie

- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Firebase (Firestore, Authentication)
- **API**: YouTube API, Spotify API
- **Stylowanie**: Tailwind CSS, styled-components
- **Animacje**: Framer Motion, GSAP
- **Routing**: React Router
- **Zarządzanie stanem**: React Context API



### SoloGame.tsx
Główny komponent gry jednoosobowej, zawierający:
- Odtwarzacz YouTube
- Formularz do wprowadzania odpowiedzi
- System podpowiedzi
- Kontrolki odtwarzania
- Wyświetlanie wyniku i czasu

### GameContext.tsx
Kontekst zarządzający stanem gry:
- Ładowanie piosenek
- Obsługa odpowiedzi
- System punktacji
- Zarządzanie czasem

### AudioContext.tsx
Kontekst zarządzający odtwarzaniem audio:
- Kontrola odtwarzacza YouTube
- Zarządzanie stanem odtwarzania
- Obsługa błędów odtwarzania

## Przyszłe Rozwinięcia

- **Tryb turniejowy** - organizacja turniejów z nagrodami
- **Integracja z serwisami społecznościowymi** - dzielenie się wynikami
- **Tryb quiz** - pytania dotyczące artystów i albumów
- **Aplikacja mobilna** - wersja na iOS i Android
