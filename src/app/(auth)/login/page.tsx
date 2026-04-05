'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (result.success) {
        // Redirect based on role
        const stored = localStorage.getItem('g4_user');
        if (stored) {
          const user = JSON.parse(stored);
          if (user.role === 'admin') router.push('/admin');
          else if (user.role === 'operario') router.push('/operario');
          else router.push('/');
        }
      } else {
        setError(result.error || 'Error al iniciar sesión');
      }
      setLoading(false);
    }, 600);
  };

  return (
    <div className="min-h-screen flex flex-col bg-surface-primary relative overflow-hidden">

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/4 -right-1/4 w-[800px] h-[800px] rounded-full" />
        <div className="absolute bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full" />
      </div>

      <main className="flex-1 flex items-center justify-center px-4 relative z-10 w-full py-12">
        <div className="w-full max-w-md animate-fade-in">

          {/* Form Card */}
          <div className="bg-surface-card border border-border-primary rounded-2xl p-8 shadow-2xl">
            <form onSubmit={handleSubmit} className="space-y-5">
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
                  placeholder="••••••••"
                  required
                />
              </div>

              {error && (
                <div className="p-3 rounded-lg bg-danger-bg border border-danger/20 text-sm text-danger animate-scale-in">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-g4-red-dark text-white font-semibold text-sm hover:shadow-lg hover:shadow-g4-red/30 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Ingresando...
                  </span>
                ) : 'Iniciar Sesión'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-text-muted">
                ¿No tenés cuenta?{' '}
                <Link href="/register" className="text-g4-red hover:text-g4-red-dark font-medium transition-colors">
                  Registrate
                </Link>
              </p>
            </div>

            {/* Demo credentials 
           <div className="mt-6 pt-5 border-t border-border-primary">
            <p className="text-xs text-text-muted text-center mb-3">Cuentas de prueba (1 Clic)</p>
            <div className="space-y-2">
              {[
                { role: 'Admin', email: 'admin@g4company.com', pass: 'admin123' },
                { role: 'Operario', email: 'carlos@g4company.com', pass: 'oper123' },
              ].map(cred => (
                <button
                  key={cred.role}
                  type="button"
                  onClick={() => { 
                    setEmail(cred.email); 
                    setPassword(cred.pass); 
                    // Ejecutamos inicio de sesión automático
                    setLoading(true);
                    setTimeout(() => {
                      const result = login(cred.email, cred.pass);
                      if(result.success) {
                        if (cred.role.toLowerCase() === 'admin') router.push('/admin');
                        else if (cred.role.toLowerCase() === 'operario') router.push('/operario');
                        else router.push('/');
                      } else {
                        setError(result.error || 'Error en validación');
                      }
                      setLoading(false);
                    }, 400); // pequeña demora para que se sienta real
                  }}
                  className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-surface-hover/50 hover:bg-surface-hover border border-border-primary text-xs transition-colors"
                >
                  <span className="text-text-secondary font-medium">{cred.role}</span>
                  <span className="text-text-muted font-mono">{cred.email}</span>
                </button>
              ))} 
            </div>
          </div>*/}
          </div>
        </div>
      </main>
    </div>
  );
}
