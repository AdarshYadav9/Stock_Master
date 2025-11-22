import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
  _id: string;
  id?: string; // For compatibility
  email: string;
  name: string;
  role: string;
  createdAt: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  logout: () => void;
  requestOTP: (email: string) => Promise<void>;
  resetPassword: (email: string, otp: string, newPassword: string) => Promise<void>;
  getCurrentUser: () => User | null;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login(email, password);
          
          if (response.error || !response.data) {
            throw new Error(response.error || 'Login failed');
          }

          const { user, token } = response.data;
          
          // Store token
          localStorage.setItem('auth-token', token);
          
          // Normalize user ID
          const normalizedUser: User = {
            ...user,
            id: user._id || user.id,
          };

          set({ 
            user: normalizedUser, 
            token,
            isAuthenticated: true 
          });
          
          toast.success('Login successful');
        } catch (error) {
          toast.error((error as Error).message || 'Invalid email or password');
          throw error;
        }
      },
      
      signup: async (email: string, password: string, name: string) => {
        try {
          const response = await authAPI.signup(name, email, password);
          
          if (response.error || !response.data) {
            throw new Error(response.error || 'Signup failed');
          }

          const { user, token } = response.data;
          
          // Store token
          localStorage.setItem('auth-token', token);
          
          // Normalize user ID
          const normalizedUser: User = {
            ...user,
            id: user._id || user.id,
          };

          set({ 
            user: normalizedUser, 
            token,
            isAuthenticated: true 
          });
          
          toast.success('Account created successfully');
        } catch (error) {
          toast.error((error as Error).message || 'Failed to create account');
          throw error;
        }
      },
      
      logout: () => {
        localStorage.removeItem('auth-token');
        set({ 
          user: null, 
          token: null,
          isAuthenticated: false 
        });
        toast.success('Logged out successfully');
      },
      
      requestOTP: async (email: string) => {
        try {
          const response = await authAPI.requestOTP(email);
          
          if (response.error) {
            throw new Error(response.error);
          }

          toast.success('OTP sent to your email');
        } catch (error) {
          toast.error((error as Error).message || 'Failed to send OTP');
          throw error;
        }
      },
      
      resetPassword: async (email: string, otp: string, newPassword: string) => {
        try {
          const response = await authAPI.resetPassword(email, otp, newPassword);
          
          if (response.error) {
            throw new Error(response.error);
          }

          toast.success('Password reset successfully');
        } catch (error) {
          toast.error((error as Error).message || 'Failed to reset password');
          throw error;
        }
      },
      
      getCurrentUser: () => {
        return get().user;
      },
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        // Initialize token from localStorage on rehydrate
        if (state) {
          const storedToken = localStorage.getItem('auth-token');
          if (storedToken && !state.token) {
            state.token = storedToken;
            state.isAuthenticated = !!storedToken;
          }
        }
      },
    }
  )
);
