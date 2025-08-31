import { User } from '@/types';

const AUTH_KEY = 'edu_platform_auth';

export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Mock authentication - in real app, this would call your backend
    if (email === 'demo@example.com' && password === 'demo123') {
      const user: User = {
        id: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'student',
        isPremium: false
      };
      localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      return user;
    }
    throw new Error('Invalid credentials');
  },

  register: async (email: string, password: string, name: string): Promise<User> => {
    // Mock registration
    const user: User = {
      id: Date.now().toString(),
      email,
      name,
      role: 'student',
      isPremium: false
    };
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
    return user;
  },

  logout: () => {
    localStorage.removeItem(AUTH_KEY);
  },

  getCurrentUser: (): User | null => {
    const userData = localStorage.getItem(AUTH_KEY);
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem(AUTH_KEY);
  }
};