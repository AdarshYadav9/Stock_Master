import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { db, DB_COLLECTIONS } from '@/lib/database';
import { toast } from 'sonner';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  password?: string; // Only stored hashed in real app
  createdAt: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  resetPassword: (email: string) => Promise<void>;
  getCurrentUser: () => User | null;
}

// Simple hash function (in production, use proper hashing)
const hashPassword = (password: string): string => {
  // Simple hash - in production use bcrypt or similar
  return btoa(password).split('').reverse().join('');
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        try {
          const users = await db.getCollection<User>(DB_COLLECTIONS.USERS);
          const user = users.find(
            (u) => u.email === email && u.password === hashPassword(password)
          );

          if (!user) {
            throw new Error('Invalid email or password');
          }

          // Remove password from user object
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword as User, isAuthenticated: true });
          toast.success('Login successful');
        } catch (error) {
          toast.error('Invalid email or password');
          throw error;
        }
      },
      signup: async (email: string, password: string, name: string) => {
        try {
          const users = await db.getCollection<User>(DB_COLLECTIONS.USERS);
          
          // Check if user already exists
          const existingUser = users.find((u) => u.email === email);
          if (existingUser) {
            throw new Error('User with this email already exists');
          }

          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            name,
            role: 'user',
            password: hashPassword(password),
            createdAt: new Date().toISOString(),
          };

          await db.addToCollection(DB_COLLECTIONS.USERS, newUser);
          
          // Remove password from user object
          const { password: _, ...userWithoutPassword } = newUser;
          set({ user: userWithoutPassword as User, isAuthenticated: true });
          toast.success('Account created successfully');
        } catch (error) {
          toast.error((error as Error).message || 'Failed to create account');
          throw error;
        }
      },
      logout: () => {
        set({ user: null, isAuthenticated: false });
        toast.success('Logged out successfully');
      },
      resetPassword: async (email: string) => {
        try {
          const users = await db.getCollection<User>(DB_COLLECTIONS.USERS);
          const user = users.find((u) => u.email === email);
          
          if (!user) {
            throw new Error('User not found');
          }

          // In a real app, send email with reset link
          toast.success('Password reset link sent to your email');
        } catch (error) {
          toast.error('Failed to send reset link');
          throw error;
        }
      },
      getCurrentUser: () => {
        return get().user;
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
