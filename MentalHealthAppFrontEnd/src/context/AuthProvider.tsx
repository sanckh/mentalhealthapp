import { getCurrentUser } from '@/lib/authService';
import React, { createContext, useState, useEffect, useContext } from 'react';

interface AuthContextProps {
  user: any;
  isLoading: boolean;
  setUser: (user: any) => void;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  isLoading: false,
  setUser: () => {},
});

export const AuthProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        console.log(currentUser);

        if (currentUser) {
          setUser(currentUser);
        } else {
          setUser(null);
        }
      } catch (error) {
        setUser(null);
        console.error('Error fetching user session from auth provider:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
