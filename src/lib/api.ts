// API utility functions

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Generic API request function
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('auth-token');
    const url = `${API_BASE_URL}${endpoint}`;
    
    console.log('API Request:', url, options.method || 'GET'); // Debug log
    
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    // Handle non-JSON responses
    let data;
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      const text = await response.text();
      console.error('Non-JSON response:', text);
      return {
        error: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    if (!response.ok) {
      console.error('API Error:', response.status, data); // Debug log
      return {
        error: data.error || `Error ${response.status}: ${response.statusText}`,
        message: data.message,
      };
    }

    return { data };
  } catch (error) {
    console.error('API Request Error:', error); // Debug log
    const errorMessage = error instanceof Error ? error.message : 'Network error occurred';
    
    // Check if it's a connection error
    if (errorMessage.includes('Failed to fetch') || errorMessage.includes('NetworkError')) {
      return {
        error: 'Cannot connect to server. Please ensure the backend server is running on port 3001.',
      };
    }
    
    return {
      error: errorMessage,
    };
  }
}

// Auth API functions
export const authAPI = {
  signup: async (name: string, email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  login: async (email: string, password: string) => {
    return apiRequest<{ user: any; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  requestOTP: async (email: string) => {
    return apiRequest<{ message: string }>('/auth/request-otp', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    return apiRequest<{ message: string }>('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email, otp, newPassword }),
    });
  },
};

