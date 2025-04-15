import React, { createContext, useContext, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  setEmail: (email: string) => void;
  verifyCode: (code: string) => Promise<boolean>;
  logout: () => void;
  signIn: (email: string, code: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState<string | null>(null);

  const verifyCode = async (code: string): Promise<boolean> => {
    // TODO: Implement actual verification logic with your backend
    // For now, we'll just simulate a successful verification
    if (code === '123456') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setEmail(null);
  };

  const signIn = async (email: string, code: string): Promise<void> => {
    const success = await verifyCode(code);
    if (success) {
      setIsAuthenticated(true);
      setEmail(email);
    } else {
      throw new Error('Invalid verification code');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, email, setEmail, verifyCode, logout, signIn }}>
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