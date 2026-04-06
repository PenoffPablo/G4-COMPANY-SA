'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useData } from '@/context/DataContext';
import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import Footer from '@/components/Footer';
import OfflineIndicator from '@/components/OfflineIndicator';
import ThemeToggle from '@/components/ThemeToggle';
import ThemeLogo from '@/components/ThemeLogo';
import { useUI } from '@/context/UIContext';

export default function Header() {
  const { user, logout } = useAuth();
  const { lowStockProducts } = useData();
  const { toggleSidebar } = useUI();
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isAuthPage = pathname === '/login' || pathname === '/register';
  const isDashboard = pathname.startsWith('/admin') || pathname.startsWith('/operario') || pathname.startsWith('/inventario');

  return (
    <header className="sticky top-0 z-50 border-b border-border-primary bg-surface-primary overflow-visible">
      <div className="flex items-center justify-between h-20 px-6 relative w-full">
        {/* Left: Mobile Menu (Dashboard only) + Logo */}
        <div className="flex items-center gap-4">
          {isDashboard && (
            <button
              onClick={toggleSidebar}
              className="lg:hidden p-2 -ml-2 rounded-none hover:bg-surface-hover transition-colors text-text-secondary border border-border-primary"
              aria-label="Abrir menú"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          )}
          <Link href="/" className="flex items-center group relative">
            <ThemeLogo className="h-32 w-auto object-contain -translate-y-0.5" />
          </Link>
        </div>

        {/* Right side: Actions (Desktop) */}
        <div className="hidden md:flex items-center gap-3">
          <ThemeToggle />

          {user ? (
            <div className="flex items-center gap-3">
              {/* Notifications (Admin only) */}
              {isAdmin && lowStockProducts.length > 0 && (
                <div className="relative">
                  <button
                    onClick={() => setShowNotif(!showNotif)}
                    className="relative p-2 rounded-none border border-border-primary hover:bg-surface-hover transition-colors"
                  >
                    <svg className="w-5 h-5 text-text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-g4-red text-white text-[10px] font-bold rounded-none flex items-center justify-center animate-pulse-alert">
                      {lowStockProducts.length}
                    </span>
                  </button>
                  {showNotif && (
                    <div className="absolute right-0 top-14 w-80 bg-surface-card border border-border-primary rounded-none shadow-2xl p-4 animate-scale-in">
                      <p className="text-sm font-bold text-text-primary mb-3">⚠️ ALERTAS DE STOCK</p>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {lowStockProducts.map(p => (
                          <div key={p.id} className="flex items-center justify-between p-2 rounded-none bg-danger-bg border-l-4 border-danger">
                            <span className="text-sm text-text-primary">{p.name}</span>
                            <span className="text-xs font-mono text-danger font-bold">{p.stock}/{p.minStock}</span>
                          </div>
                        ))}
                      </div>
                      <Link href="/inventario" onClick={() => setShowNotif(false)}
                        className="block mt-4 text-center text-xs font-bold uppercase tracking-widest text-g4-red hover:text-g4-red-dark transition-colors">
                        Ver Inventario →
                      </Link>
                    </div>
                  )}
                </div>
              )}

              {/* User Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-none border border-border-primary hover:bg-surface-hover transition-colors"
                >
                  <div className="w-8 h-8 rounded-none bg-g4-red flex items-center justify-center text-white text-sm font-black">
                    {user.name.charAt(0)}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-xs font-black text-text-primary leading-tight uppercase">{user.name}</p>
                    <p className="text-[10px] text-text-muted uppercase tracking-tighter">{user.role}</p>
                  </div>
                  <svg className="w-4 h-4 text-text-muted" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showDropdown && (
                  <div className="absolute right-0 top-14 w-56 bg-surface-card border border-border-primary rounded-none shadow-2xl overflow-hidden animate-scale-in">
                    <div className="p-4 border-b border-border-primary bg-surface-secondary/30">
                      <p className="text-xs font-black text-text-primary uppercase">{user.name}</p>
                      <p className="text-[10px] text-text-muted truncate">{user.email}</p>
                    </div>
                    {(user.role === 'admin' || user.role === 'operario') && !isDashboard && (
                      <Link
                        href={user.role === 'admin' ? '/admin' : '/operario'}
                        className="flex items-center gap-2 px-4 py-3 text-xs font-bold uppercase text-text-primary hover:bg-surface-hover transition-colors"
                      >
                        Panel de Control →
                      </Link>
                    )}
                    <button
                      onClick={() => { logout(); setShowDropdown(false); }}
                      className="w-full px-4 py-3 text-xs font-bold uppercase text-left text-danger hover:bg-danger-bg transition-colors flex items-center gap-2 border-t border-border-primary"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            !isAuthPage && (
              <Link href="/login" className="px-4 py-2 text-sm font-bold uppercase tracking-wide text-text-secondary hover:text-text-primary transition-colors">
                Acceso Privado
              </Link>
            )
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-none border border-border-primary hover:bg-surface-hover transition-colors text-text-secondary"
            aria-label="Menú de ajustes"
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {isMobileMenuOpen && (
          <div className="absolute top-20 left-0 right-0 bg-surface-primary border-b border-border-primary animate-fade-in md:hidden overflow-hidden z-50">
            <div className="p-6 space-y-4 shadow-2xl">
              {/* Theme Toggle Mobile */}
              <div className="flex items-center justify-between p-4 bg-surface-secondary border border-border-primary rounded-none">
                <span className="text-sm font-bold uppercase tracking-widest text-text-primary">Modo de Color</span>
                <ThemeToggle />
              </div>

              {/* Login / User Info Mobile */}
              {user ? (
                <div className="space-y-3">
                  <div className="p-4 bg-g4-red text-white">
                    <p className="text-xs font-black uppercase tracking-widest leading-tight">{user.name}</p>
                    <p className="text-[10px] opacity-80 uppercase font-bold">{user.role}</p>
                  </div>
                  {(user.role === 'admin' || user.role === 'operario') && !isDashboard && (
                    <Link
                      href={user.role === 'admin' ? '/admin' : '/operario'}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between p-4 bg-surface-secondary border border-border-primary text-xs font-bold uppercase tracking-widest text-text-primary"
                    >
                      <span>Panel de Control</span>
                      <span>→</span>
                    </Link>
                  )}
                  <button
                    onClick={() => { logout(); setIsMobileMenuOpen(false); }}
                    className="w-full flex items-center justify-between p-4 bg-danger/10 border border-danger/30 text-xs font-bold uppercase tracking-widest text-danger"
                  >
                    <span>Cerrar Sesión</span>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </div>
              ) : (
                !isAuthPage && (
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between p-4 bg-g4-red text-white text-sm font-black uppercase tracking-widest hover:bg-g4-red-dark transition-colors"
                  >
                    <span>ACCESO PRIVADO</span>
                    <span>→</span>
                  </Link>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
