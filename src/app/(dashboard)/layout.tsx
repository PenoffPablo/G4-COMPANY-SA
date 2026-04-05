'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { OfflineProvider } from '@/context/OfflineContext';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import OfflineIndicator from '@/components/OfflineIndicator';
import { useUI } from '@/context/UIContext';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const { sidebarOpen, setSidebarOpen } = useUI();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-primary">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-g4-red to-g4-red-dark flex items-center justify-center font-bold text-white animate-pulse">
            G4
          </div>
          <p className="text-sm text-text-muted">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <OfflineProvider>
      <div className="min-h-screen flex flex-col bg-surface-primary">
        <div className="flex flex-1">
          <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
          <main className="flex-1 p-6 overflow-x-hidden">
            {children}
          </main>
        </div>
        <Footer />
        <OfflineIndicator />
      </div>
    </OfflineProvider>
  );
}
