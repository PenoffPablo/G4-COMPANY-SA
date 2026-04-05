'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import ThemeLogo from '@/components/ThemeLogo';
import type { UserRole } from '@/data/mockData';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = register(name, email, password, 'cliente');
      if (result.success) {
        router.push('/');
      } else {
        setError(result.error || 'Error al registrarse');
      }
      setLoading(false);
    }, 600);
  };

  const roles: { value: UserRole; label: string; desc: string; locked?: boolean }[] = [
    { value: 'admin', label: 'Administrador', desc: 'Gestión completa del sistema', locked: true },
    { value: 'operario', label: 'Operario', desc: 'Conductor / logística', locked: true },
    { value: 'cliente', label: 'Cliente', desc: 'Sucursal / empresa', locked: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-surface-primary relative overflow-hidden">

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[600px] h-[600px] rounded-full" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10 w-full py-12">
        <div className="w-full max-w-md animate-fade-in relative py-8">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold text-text-primary">Crear Cuenta</h1>
            <p className="text-sm text-text-muted mt-1">Únete a G4 Company</p>
          </div>

          <div className="bg-surface-card border border-border-primary rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Nombre completo</label>
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-g4-red focus:ring-1 focus:ring-g4-red/30 transition-all"
                  placeholder="Juan Pérez"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-g4-red focus:ring-1 focus:ring-g4-red/30 transition-all"
                  placeholder="tu@email.com"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-g4-red focus:ring-1 focus:ring-g4-red/30 transition-all"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-text-secondary mb-1.5">Confirmar contraseña</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-surface-input border border-border-primary text-text-primary placeholder-text-muted text-sm focus:outline-none focus:border-g4-red focus:ring-1 focus:ring-g4-red/30 transition-all"
                  placeholder="Repetí tu contraseña"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger-bg border border-danger/20 text-sm text-danger animate-scale-in">
                  {error}
                </div>
              )}

              {/*<button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-g4-red-dark text-white font-semibold text-sm hover:shadow-lg hover:shadow-g4-red/30 transition-all duration-300 disabled:opacity-50"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Creando cuenta...
                  </span>
                ) : 'Crear Cuenta'}
              </button>*/}
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                ¿Ya tenés cuenta?{' '}
                <Link href="/login" className="text-g4-red hover:text-g4-red-dark font-medium transition-colors">
                  Iniciá sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
