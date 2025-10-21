import React, { createContext, useState, useContext, ReactNode, useCallback, useRef } from 'react';

interface NotificationState {
  message: string;
  type: 'success' | 'error';
}

interface NotificationContextType {
  notification: NotificationState | null;
  showNotification: (message: string, type?: 'success' | 'error') => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<NotificationState | null>(null);
  const timerIdRef = useRef<number | null>(null);

  const hideNotification = useCallback(() => {
    setNotification(null);
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
      timerIdRef.current = null;
    }
  }, []);

  const showNotification = useCallback((message: string, type: 'success' | 'error' = 'success') => {
    if (timerIdRef.current) {
      clearTimeout(timerIdRef.current);
    }
    setNotification({ message, type });
    timerIdRef.current = window.setTimeout(() => {
      hideNotification();
    }, 4000);
  }, [hideNotification]);


  return (
    <NotificationContext.Provider value={{ notification, showNotification, hideNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};
