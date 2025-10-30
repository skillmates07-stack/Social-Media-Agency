import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface Agency {
  id: string;
  name: string;
  email: string;
  subdomain?: string;
  createdAt: string;
}

interface AuthState {
  agency: Agency | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      agency: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        set({ isLoading: true });
        
        // Mock login - remove this when backend is ready
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockAgency = {
          id: '1',
          name: 'Demo Agency',
          email: email,
          createdAt: new Date().toISOString(),
        };
        
        set({
          agency: mockAgency,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      register: async (data) => {
        set({ isLoading: true });
        
        // Mock register
        await new Promise((resolve) => setTimeout(resolve, 1000));
        
        const mockAgency = {
          id: '1',
          name: data.name,
          email: data.email,
          subdomain: data.subdomain,
          createdAt: new Date().toISOString(),
        };
        
        set({
          agency: mockAgency,
          isAuthenticated: true,
          isLoading: false,
        });
      },

      logout: async () => {
        set({
          agency: null,
          isAuthenticated: false,
        });
      },

      loadUser: async () => {
        // Check if user exists in storage
        set({ isLoading: false });
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);
