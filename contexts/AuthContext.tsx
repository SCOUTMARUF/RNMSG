

import React, { createContext, useState, useContext, ReactNode } from 'react';
import { useData } from './DataContext';

interface CurrentUser {
  username: string;
  fullName: string;
  role: 'CHIEF_ADMIN' | 'MODERATOR';
  imageUrl?: string;
}

interface AuthContextType {
  isAdmin: boolean;
  currentUser: CurrentUser | null;
  isLoginModalOpen: boolean;
  login: (username: string, password_val: string, pin: string) => boolean;
  logout: () => void;
  openLoginModal: () => void;
  closeLoginModal: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { moderators } = useData();
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  // Hardcoded credentials for the Chief Admin
  const chiefAdminUsername = "@maruf";
  const chiefAdminPassword = "IAMMARUF";
  const chiefAdminPin = "62783";

  const login = (username: string, password_val: string, pin: string) => {
    // Check for Chief Admin
    if (username === chiefAdminUsername && password_val === chiefAdminPassword && pin === chiefAdminPin) {
      setCurrentUser({ 
        username: chiefAdminUsername, 
        fullName: "Mehedi Hasan Maruf", 
        role: 'CHIEF_ADMIN',
        imageUrl: "https://res.cloudinary.com/dtqnpnzxj/image/upload/v1760974988/1759646827984_el6jbe.jpg"
      });
      setIsLoginModalOpen(false);
      return true;
    }
    
    // Check for Moderators
    const moderator = moderators.find(mod => mod.username === username && mod.password_val === password_val && mod.pin === pin);
    if (moderator) {
      setCurrentUser({ 
        username: moderator.username, 
        fullName: moderator.fullName, 
        role: 'MODERATOR',
        imageUrl: moderator.imageUrl
      });
      setIsLoginModalOpen(false);
      return true;
    }

    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const openLoginModal = () => setIsLoginModalOpen(true);
  const closeLoginModal = () => setIsLoginModalOpen(false);

  const isAdmin = !!currentUser;

  return (
    <AuthContext.Provider value={{ isAdmin, currentUser, isLoginModalOpen, login, logout, openLoginModal, closeLoginModal }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};