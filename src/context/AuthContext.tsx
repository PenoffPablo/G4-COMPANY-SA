'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, UserRole, initialUsers } from '@/data/mockData';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  register: (name: string, email: string, password: string, role: UserRole) => { success: boolean; error?: string };
  logout: () => void;
  allUsers: User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [allUsers, setAllUsers] = useState<User[]>(initialUsers);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem('g4_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('g4_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string) => {
    const found = allUsers.find(u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === password);
    if (!found) return { success: false, error: 'Email o contraseña incorrectos' };
    if (!found.active) return { success: false, error: 'Esta cuenta está desactivada' };
    setUser(found);
    localStorage.setItem('g4_user', JSON.stringify(found));
    return { success: true };
  }, [allUsers]);

  const register = useCallback((name: string, email: string, password: string, role: UserRole) => {
    if (allUsers.some(u => u.email === email)) {
      return { success: false, error: 'Este email ya está registrado' };
    }
    const newUser: User = {
      id: `u${Date.now()}`,
      name,
      email,
      password,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAllUsers(prev => [...prev, newUser]);
    setUser(newUser);
    localStorage.setItem('g4_user', JSON.stringify(newUser));
    return { success: true };
  }, [allUsers]);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('g4_user');
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, register, logout, allUsers }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
