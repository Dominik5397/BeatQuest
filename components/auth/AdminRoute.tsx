'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useAdmin } from '@/hooks/useAdmin';
import { MusicVisualizer } from '@/components/music-visualizer';

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, isLoading: adminLoading, isInitialized, checkedAt } = useAdmin();

  useEffect(() => {
    // Logujemy aktualny stan
    console.log('AdminRoute - aktualny stan:', JSON.stringify({
      userEmail: user?.email,
      userId: user?.uid,
      authLoading,
      adminLoading,
      isAdmin,
      isInitialized,
      checkedAt,
      timestamp: new Date().toISOString()
    }, null, 2));

    // Sprawdzamy uprawnienia tylko gdy wszystkie dane są gotowe
    if (!authLoading && !adminLoading && isInitialized && checkedAt) {
      if (!isAdmin) {
        console.log('AdminRoute - brak uprawnień:', JSON.stringify({
          userEmail: user?.email,
          isAdmin,
          checkedAt,
          timestamp: new Date().toISOString()
        }, null, 2));
        
        router.push('/');
      } else {
        console.log('AdminRoute - potwierdzono uprawnienia:', JSON.stringify({
          userEmail: user?.email,
          isAdmin,
          checkedAt,
          timestamp: new Date().toISOString()
        }, null, 2));
      }
    }
  }, [user, isAdmin, authLoading, adminLoading, isInitialized, checkedAt, router]);

  // Pokazujemy loading podczas sprawdzania
  if (authLoading || adminLoading || !isInitialized) {
    return (
      <div className="container py-8 text-center">
        <div className="flex items-center justify-center gap-4">
          <MusicVisualizer className="h-8" />
          <p className="text-muted-foreground">Sprawdzanie uprawnień administratora...</p>
        </div>
      </div>
    );
  }

  // Renderujemy zawartość tylko dla admina
  return isAdmin ? <>{children}</> : null;
}
