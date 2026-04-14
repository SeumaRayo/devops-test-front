import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '../../features/auth/types/auth.types';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setCredentials: (token: string, userData: User) => void;
  clearCredentials: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setCredentials: (token, userData) => set({ token, user: userData, isAuthenticated: true }),
      clearCredentials: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'auth-storage',
    }
  )
);
