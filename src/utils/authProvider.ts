import {create} from 'zustand';

interface AuthState {
  username: string;
  isAuthenticated: boolean;
  login: (username: string) => void;
  logout: () => void;
}

export const useAuth = create<AuthState>((set) => ({
  username: 'guest',
  isAuthenticated: false,
  login: (username) => set({ username, isAuthenticated: true }),
  logout: () => set({ username: 'guest', isAuthenticated: false }),
}));
