import { create } from 'zustand';
import { authApi } from '../api-client';

interface Agency {
  id: string;
  email: string;
  name: string;
  subdomain?: string;
  logo?: string;
}

interface AuthState {
  agency: Agency | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  agency: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isLoading: false,
  
  login: async (email, password) => {
    set({ isLoading: true });
    try {
      const response = await authApi.login({ email, password });
      const { token, agency } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, agency, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  register: async (data) => {
    set({ isLoading: true });
    try {
      const response = await authApi.register(data);
      const { token, agency } = response.data;
      
      localStorage.setItem('token', token);
      set({ token, agency, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  
  logout: () => {
    localStorage.removeItem('token');
    set({ token: null, agency: null });
  },
  
  checkAuth: async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    
    try {
      const response = await authApi.getCurrentUser();
      set({ agency: response.data.agency });
    } catch (error) {
      localStorage.removeItem('token');
      set({ token: null, agency: null });
    }
  },
}));
