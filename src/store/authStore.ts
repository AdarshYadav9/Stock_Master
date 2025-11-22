import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  email: string;
  name: string;
  role: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        // Mock login - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const user = {
          id: '1',
          email,
          name: email.split('@')[0],
          role: 'admin',
        };
        set({ user, isAuthenticated: true });
      },
      signup: async (email: string, password: string, name: string) => {
        // Mock signup - simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const user = {
          id: '1',
          email,
          name,
          role: 'user',
        };
        set({ user, isAuthenticated: true });
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      resetPassword: async (email: string) => {
        // Mock password reset
        await new Promise((resolve) => setTimeout(resolve, 1000));
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
