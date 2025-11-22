import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { authAPI } from '@/lib/api';
import { toast } from 'sonner';

export interface User {
  _id: string;
  id?: string;
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

      // ----------------------------------------------------------
      // LOGIN
      // ----------------------------------------------------------
      login: async (email: string, password: string) => {
        try {
          const response = await authAPI.login(email, password);

          if (response.error || !response.data) {
            throw new Error(response.error || "Login failed");
          }

          const { user, token } = response.data;

          localStorage.setItem("auth-token", token);

          const normalizedUser: User = {
            ...user,
            id: user._id || user.id,
          };

          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
          });

          toast.success("Login successful");
        } catch (error) {
          toast.error((error as Error).message || "Invalid email or password");
          throw error;
        }
      },

      // ----------------------------------------------------------
      // SIGNUP
      // ----------------------------------------------------------
      signup: async (email: string, password: string, name: string) => {
        try {
          const response = await authAPI.signup(name, email, password);

          if (response.error || !response.data) {
            throw new Error(response.error || "Signup failed");
          }

          const { user, token } = response.data;

          localStorage.setItem("auth-token", token);

          const normalizedUser: User = {
            ...user,
            id: user._id || user.id,
          };

          set({
            user: normalizedUser,
            token,
            isAuthenticated: true,
          });

          toast.success("Account created successfully");
        } catch (error) {
          toast.error((error as Error).message || "Failed to create account");
          throw error;
        }
      },

      // ----------------------------------------------------------
      // LOGOUT
      // ----------------------------------------------------------
      logout: () => {
        localStorage.removeItem("auth-token");

        set({
          user: null,
          token: null,
          isAuthenticated: false,
        });

        toast.success("Logged out successfully");
      },

      // ----------------------------------------------------------
      // REQUEST OTP
      // ----------------------------------------------------------
      requestOTP: async (email: string) => {
        try {
          const res = await fetch(`${import.meta.env.VITE_API_URL}/send-otp`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
      
          const data = await res.json();
      
          if (!res.ok) {
            throw new Error(data.error || "Failed to send OTP");
          }
      
          toast.success("OTP sent to your email");
      
        } catch (error: any) {
          toast.error(error.message || "Failed to send OTP");
          throw error;
        }
      },
      

      // ----------------------------------------------------------
      // RESET PASSWORD
      // ----------------------------------------------------------
      resetPassword: async (email: string, otp: string, newPassword: string) => {
        try {
          const response = await authAPI.resetPassword(email, otp, newPassword);

          if (response.error) {
            throw new Error(response.error);
          }

          toast.success("Password reset successfully");
        } catch (error) {
          toast.error((error as Error).message || "Failed to reset password");
          throw error;
        }
      },

      // ----------------------------------------------------------
      // GET LOGGED-IN USER
      // ----------------------------------------------------------
      getCurrentUser: () => {
        return get().user;
      },
    }),
    {
      name: "auth-storage",
      onRehydrateStorage: () => (state) => {
        if (state) {
          const storedToken = localStorage.getItem("auth-token");

          if (storedToken && !state.token) {
            state.token = storedToken;
            state.isAuthenticated = !!storedToken;
          }
        }
      },
    }
  )
);
