import { db, DB_COLLECTIONS } from './database';

const API_BASE_URL ='http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Simple hash function
const hashPassword = (password: string): string => {
  return btoa(password);
};

const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

export const authAPI = {
  signup: async (name: string, email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> => {
    try {
      const existingUser = await db.findOneInCollection(
        DB_COLLECTIONS.USERS,
        (user: any) => user.email === email
      );

      if (existingUser) {
        return { error: 'User already exists with this email' };
      }

      const newUser = {
        id: crypto.randomUUID(),
        name,
        email,
        password: hashPassword(password),
        createdAt: new Date().toISOString(),
      };

      await db.addToCollection(DB_COLLECTIONS.USERS, newUser);
      const token = btoa(`${email}:${Date.now()}`);

      const { password: _, ...userWithoutPassword } = newUser;

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Signup failed',
      };
    }
  },

  login: async (email: string, password: string): Promise<ApiResponse<{ user: any; token: string }>> => {
    try {
      const user = await db.findOneInCollection(
        DB_COLLECTIONS.USERS,
        (u: any) => u.email === email
      );

      if (!user) {
        return { error: 'Invalid email or password' };
      }

      if (!verifyPassword(password, user.password)) {
        return { error: 'Invalid email or password' };
      }

      const token = btoa(`${email}:${Date.now()}`);

      const { password: _, ...userWithoutPassword } = user;

      return {
        data: {
          user: userWithoutPassword,
          token,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Login failed',
      };
    }
  },

  // ------------------------------
  // FIXED OTP REQUEST FUNCTION
  // ------------------------------
  requestOTP: async (email: string): Promise<ApiResponse<{ message: string }>> => {
    try {
      const user = await db.findOneInCollection(
        DB_COLLECTIONS.USERS,
        (u: any) => u.email === email
      );

      if (!user) {
        return { error: 'No account found with this email' };
      }

      // SINGLE CORRECT API CALL
      const response = await fetch(`${API_BASE_URL}/send-otp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          name: user.name,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || 'Failed to send OTP' };
      }

      console.log(`OTP sent to ${email}`);

      return {
        data: {
          message: `OTP has been sent to ${email}`,
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to send OTP',
      };
    }
  },

  // ------------------------------
  // RESET PASSWORD (LOCAL DB)
  // ------------------------------
  resetPassword: async (
    email: string,
    otp: string,
    newPassword: string
  ): Promise<ApiResponse<{ message: string }>> => {
    try {
      const otpData = await db.get<{ otp: string; expiresAt: number; email: string }>(`otp_${email}`);

      if (!otpData) {
        return { error: 'OTP not found. Please request a new OTP.' };
      }

      if (otpData.expiresAt < Date.now()) {
        await db.delete(`otp_${email}`);
        return { error: 'OTP has expired. Please request a new one.' };
      }

      if (otpData.otp !== otp.trim()) {
        return { error: 'Invalid OTP. Please try again.' };
      }

      // Update password
      const users = await db.getCollection<any>(DB_COLLECTIONS.USERS);
      const userIndex = users.findIndex((u: any) => u.email === email);

      if (userIndex === -1) {
        return { error: 'User not found' };
      }

      users[userIndex].password = hashPassword(newPassword);
      users[userIndex].updatedAt = new Date().toISOString();

      await db.set(DB_COLLECTIONS.USERS, users);

      // Delete OTP
      await db.delete(`otp_${email}`);

      console.log(`Password reset successful for ${email}`);

      return {
        data: {
          message: 'Password reset successfully! You can now login.',
        },
      };
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Failed to reset password',
      };
    }
  },
};
