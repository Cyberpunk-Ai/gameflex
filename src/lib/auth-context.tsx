import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

interface RegisterData {
  phone: string;
  username: string;
  password: string;
  email?: string;
  gameHandle?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock users for demo
const mockUsers: User[] = [
  {
    id: '1',
    phone: '0712345678',
    username: 'ProGamer254',
    email: 'progamer@example.com',
    gameHandle: 'ProGamer#1234',
    walletBalance: 5000,
    role: 'user',
    isVerified: true,
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date(),
  },
  {
    id: 'admin',
    phone: '0700000000',
    username: 'Admin',
    email: 'admin@gameflex.com',
    walletBalance: 0,
    role: 'admin',
    isVerified: true,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date(),
  },
];

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for stored session
    const storedUser = localStorage.getItem('gameflex_user');
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setUser({
          ...parsed,
          createdAt: new Date(parsed.createdAt),
          updatedAt: new Date(parsed.updatedAt),
        });
      } catch (error) {
        localStorage.removeItem('gameflex_user');
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (phone: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Find user by phone (demo: password is "password" for all users)
    const foundUser = mockUsers.find(u => u.phone === phone);
    
    if (!foundUser || password !== 'password') {
      throw new Error('Invalid phone number or password');
    }
    
    setUser(foundUser);
    localStorage.setItem('gameflex_user', JSON.stringify(foundUser));
  };

  const register = async (data: RegisterData) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if phone already exists
    if (mockUsers.some(u => u.phone === data.phone)) {
      throw new Error('Phone number already registered');
    }
    
    const newUser: User = {
      id: crypto.randomUUID(),
      phone: data.phone,
      username: data.username,
      email: data.email,
      gameHandle: data.gameHandle,
      walletBalance: 0,
      role: 'user',
      isVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    mockUsers.push(newUser);
    setUser(newUser);
    localStorage.setItem('gameflex_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('gameflex_user');
  };

  const updateUser = (data: Partial<User>) => {
    if (user) {
      const updated = { ...user, ...data, updatedAt: new Date() };
      setUser(updated);
      localStorage.setItem('gameflex_user', JSON.stringify(updated));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        updateUser,
      }}
    >
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
