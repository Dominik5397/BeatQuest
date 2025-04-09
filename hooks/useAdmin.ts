'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function useAdmin() {
  const { user, loading: authLoading } = useAuth();
  const [adminState, setAdminState] = useState({
    isAdmin: false,
    isLoading: true,
    isInitialized: false,
    checkedAt: null
  });

  useEffect(() => {
    let isMounted = true;

    const checkAdminStatus = async () => {
      // Resetujemy stan ładowania przy każdej zmianie użytkownika
      if (isMounted) {
        setAdminState(prev => ({
          ...prev,
          isLoading: true,
          isInitialized: false
        }));
      }

      if (!user) {
        if (isMounted) {
          setAdminState({
            isAdmin: false,
            isLoading: false,
            isInitialized: true,
            checkedAt: new Date().toISOString()
          });
        }
        return;
      }

      try {
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        
        if (!isMounted) return;

        const isUserAdmin = userDoc.exists() && userDoc.data()?.role === 'admin';
        const timestamp = new Date().toISOString();
        
        console.log('useAdmin - sprawdzanie:', JSON.stringify({
          userId: user.uid,
          email: user.email,
          exists: userDoc.exists(),
          role: userDoc.data()?.role,
          isAdmin: isUserAdmin,
          timestamp
        }, null, 2));
        
        setAdminState({
          isAdmin: isUserAdmin,
          isLoading: false,
          isInitialized: true,
          checkedAt: timestamp
        });
      } catch (error) {
        console.error('Błąd podczas sprawdzania uprawnień:', error);
        if (isMounted) {
          setAdminState({
            isAdmin: false,
            isLoading: false,
            isInitialized: true,
            checkedAt: new Date().toISOString()
          });
        }
      }
    };

    if (!authLoading) {
      checkAdminStatus();
    }

    return () => {
      isMounted = false;
    };
  }, [user, authLoading]);

  return adminState;
}
