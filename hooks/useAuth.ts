'use client';

import { useState, useEffect } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  User
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Sprawdź czy użytkownik ma dokument w kolekcji users
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (!userDoc.exists()) {
          // Jeśli nie ma dokumentu, utwórz go
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: user.email === 'admin@beatquest.com' ? 'admin' : 'user',
            createdAt: new Date().toISOString()
          });
        }
      }
      setUser(user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      // Sprawdź czy użytkownik ma dokument w kolekcji users
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      if (!userDoc.exists()) {
        // Jeśli nie ma dokumentu, utwórz go
        await setDoc(doc(db, 'users', result.user.uid), {
          email: email,
          role: email === 'admin@beatquest.com' ? 'admin' : 'user',
          createdAt: new Date().toISOString()
        });
      }
      return result;
    } catch (error) {
      console.error('Błąd logowania:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      // Tworzenie dokumentu użytkownika w kolekcji users
      await setDoc(doc(db, 'users', result.user.uid), {
        email: email,
        role: email === 'admin@beatquest.com' ? 'admin' : 'user',
        createdAt: new Date().toISOString()
      });
      return result;
    } catch (error) {
      console.error('Błąd rejestracji:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
    } catch (error) {
      console.error('Błąd wylogowania:', error);
      throw error;
    }
  };

  return {
    user,
    loading,
    signIn,
    signUp,
    signOut
  };
} 