'use client';

import { motion } from 'framer-motion';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { MusicVisualizer } from '@/components/music-visualizer';
import { Gamepad2, Trophy, Music, Star } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user } = useAuth();

  const stats = [
    {
      title: 'Rozegrane gry',
      value: '0',
      icon: Gamepad2,
      color: 'text-green-500',
    },
    {
      title: 'Najlepszy wynik',
      value: '0',
      icon: Trophy,
      color: 'text-yellow-500',
    },
    {
      title: 'Ulubione utwory',
      value: '0',
      icon: Star,
      color: 'text-pink-500',
    },
    {
      title: 'Poziom trudności',
      value: 'Początkujący',
      icon: Music,
      color: 'text-blue-500',
    },
  ];

  return (
    <div className="container py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-beatquest-purple-light mb-4">
          Witaj, {user?.email?.split('@')[0]}!
        </h1>
        <p className="text-muted-foreground text-lg">
          Rozpocznij swoją muzyczną przygodę z BeatQuest
        </p>
      </motion.div>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.1,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={stat.title}
            variants={{
              hidden: { opacity: 0, y: 20 },
              show: { opacity: 1, y: 0 },
            }}
          >
            <Card className="bg-beatquest-dark-lighter border-beatquest-dark-light">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <Card className="bg-beatquest-dark-lighter border-beatquest-dark-light overflow-hidden">
          <CardHeader>
            <CardTitle>Szybki start</CardTitle>
            <CardDescription>Rozpocznij nową grę lub sprawdź ranking</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-4">
            <Link
              href="/play"
              className="flex items-center justify-center p-4 bg-beatquest-purple/20 rounded-lg hover:bg-beatquest-purple/30 transition-colors"
            >
              <Gamepad2 className="w-6 h-6 mr-2 text-beatquest-purple-light" />
              <span>Graj teraz</span>
            </Link>
            <Link
              href="/ranking"
              className="flex items-center justify-center p-4 bg-beatquest-purple/20 rounded-lg hover:bg-beatquest-purple/30 transition-colors"
            >
              <Trophy className="w-6 h-6 mr-2 text-beatquest-purple-light" />
              <span>Ranking</span>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-beatquest-dark-lighter border-beatquest-dark-light">
          <CardHeader>
            <CardTitle>Aktywność</CardTitle>
            <CardDescription>Twoja ostatnia aktywność w grze</CardDescription>
          </CardHeader>
          <CardContent className="flex items-center justify-center p-6 text-muted-foreground">
            <MusicVisualizer className="h-8 mr-2" />
            <span>Brak ostatniej aktywności</span>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
} 