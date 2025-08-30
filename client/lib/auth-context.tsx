'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Demo user data
export const demoUser = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  role: 'Energy Analyst',
  company: 'OptiH2 Solutions',
  lastLogin: '2024-01-15T10:30:00Z'
};

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
  company: string;
  lastLogin: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  loginWithGoogle: () => Promise<boolean>;
  logout: () => void;
  signup: (userData: any) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('optih2_user');
    if (savedUser) {
      const userData = JSON.parse(savedUser);
      setUser(userData);
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo login - accept any email/password combination
    if (email && password) {
      const userData = { ...demoUser, email };
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('optih2_user', JSON.stringify(userData));
      return true;
    }
    return false;
  };

  const loginWithGoogle = async (): Promise<boolean> => {
    // Demo Google login
    const userData = { ...demoUser };
    setUser(userData);
    setIsAuthenticated(true);
    localStorage.setItem('optih2_user', JSON.stringify(userData));
    return true;
  };

  const signup = async (userData: any): Promise<boolean> => {
    // Demo signup
    const newUser = { 
      ...demoUser, 
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email 
    };
    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('optih2_user', JSON.stringify(newUser));
    return true;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('optih2_user');
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      loginWithGoogle,
      logout,
      signup
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
