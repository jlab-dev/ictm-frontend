import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { createContext, useContext, useEffect, useState } from 'react';
import api from '@/lib/api';

type User = {
  username: string;
  role: string;
};

type AuthContextType = {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const token = await AsyncStorage.getItem('token');
      const username = await AsyncStorage.getItem('username');
      const role = await AsyncStorage.getItem('role');
      if (token && username && role) {
        setUser({ username, role });
      }
      setIsLoading(false);
    })();
  }, []);

  const login = async (username: string, password: string) => {
    const response = await api.post('/auth/login', { username, password });
    const { token, role } = response.data;

    await AsyncStorage.setItem('token', token);
    await AsyncStorage.setItem('username', username);
    await AsyncStorage.setItem('role', role);

    setUser({ username, role });
    router.replace('/');
  };

  const logout = async () => {
    await AsyncStorage.multiRemove(['token', 'username', 'role']);
    setUser(null);
    router.replace('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}
