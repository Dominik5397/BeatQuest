'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { MusicVisualizer } from '@/components/music-visualizer';
import { Info } from 'lucide-react';
import { FirebaseError } from 'firebase/app';

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, signUp } = useAuth();

  const getErrorMessage = (error: FirebaseError) => {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Nieprawidłowy email lub hasło';
      case 'auth/user-not-found':
        return 'Nie znaleziono użytkownika o podanym adresie email';
      case 'auth/wrong-password':
        return 'Nieprawidłowe hasło';
      case 'auth/email-already-in-use':
        return 'Konto z tym adresem email już istnieje';
      case 'auth/weak-password':
        return 'Hasło jest za słabe - powinno mieć co najmniej 6 znaków';
      case 'auth/invalid-email':
        return 'Nieprawidłowy format adresu email';
      default:
        return 'Wystąpił błąd podczas ' + (isRegistering ? 'rejestracji' : 'logowania');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      if (isRegistering) {
        await signUp(email, password);
      } else {
        await signIn(email, password);
      }
      router.push('/dashboard');
    } catch (err) {
      if (err instanceof FirebaseError) {
        setError(getErrorMessage(err));
      } else {
        setError('Wystąpił nieoczekiwany błąd');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md mx-auto"
    >
      <Card className="bg-beatquest-dark-lighter border-beatquest-dark-light">
        <CardHeader>
          <div className="flex items-center justify-center gap-4 mb-4">
            <CardTitle className="text-3xl font-bold text-beatquest-purple-light">
              {isRegistering ? 'Rejestracja' : 'Logowanie'}
            </CardTitle>
            <MusicVisualizer className="h-8" />
          </div>
          <CardDescription className="text-center text-muted-foreground">
            {isRegistering
              ? 'Dołącz do społeczności BeatQuest!'
              : 'Zaloguj się, aby kontynuować swoją muzyczną przygodę'}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-beatquest-dark border-beatquest-dark-light focus:border-beatquest-purple"
                disabled={isLoading}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Hasło</Label>
              <Input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-beatquest-dark border-beatquest-dark-light focus:border-beatquest-purple"
                disabled={isLoading}
                required
              />
            </div>

            {isRegistering && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-start gap-2 p-3 bg-beatquest-purple/10 border border-beatquest-purple/20 rounded-lg"
              >
                <Info className="w-5 h-5 text-beatquest-purple-light flex-shrink-0 mt-0.5" />
                <p className="text-sm text-muted-foreground">
                  Aby uzyskać uprawnienia administratora, użyj adresu email: admin@beatquest.com
                </p>
              </motion.div>
            )}

            <div className="pt-2">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-beatquest-purple to-beatquest-purple-light hover:from-beatquest-purple-dark hover:to-beatquest-purple text-white font-bold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="flex items-center justify-center">
                    <MusicVisualizer className="h-5 mr-2" />
                    {isRegistering ? 'Rejestrowanie...' : 'Logowanie...'}
                  </span>
                ) : (
                  isRegistering ? 'Zarejestruj się' : 'Zaloguj się'
                )}
              </Button>
            </div>

            <div className="text-center pt-4">
              <button
                type="button"
                onClick={() => {
                  setIsRegistering(!isRegistering);
                  setError('');
                }}
                className="text-beatquest-purple-light hover:text-beatquest-purple transition-colors"
                disabled={isLoading}
              >
                {isRegistering
                  ? 'Masz już konto? Zaloguj się'
                  : 'Nie masz konta? Zarejestruj się'}
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}; 