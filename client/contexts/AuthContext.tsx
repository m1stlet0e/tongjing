import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export interface User {
  id: number;
  username: string;
  phone?: string;
  avatar_url?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: User, token: string) => void;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => void;
  checkAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user && !!token;

  // 检查本地存储的认证状态
  const checkAuth = useCallback(async () => {
    try {
      setIsLoading(true);
      
      const storedToken = await AsyncStorage.getItem('auth_token');
      const storedUser = await AsyncStorage.getItem('user_info');

      if (storedToken && storedUser) {
        // 验证token是否有效
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/me`, {
          headers: {
            Authorization: `Bearer ${storedToken}`,
          },
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setToken(storedToken);
            setUser(result.data);
          } else {
            // Token无效，清除本地存储
            await AsyncStorage.multiRemove(['auth_token', 'user_info']);
          }
        } else {
          // Token过期，清除本地存储
          await AsyncStorage.multiRemove(['auth_token', 'user_info']);
        }
      }
    } catch (error) {
      console.error('Error checking auth:', error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 应用启动时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 登录
  const login = useCallback((userData: User, tokenStr: string) => {
    setUser(userData);
    setToken(tokenStr);
  }, []);

  // 登出
  const logout = useCallback(async () => {
    try {
      // 调用后端退出接口
      if (token) {
        await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Error logout:', error);
    } finally {
      // 清除本地状态
      setUser(null);
      setToken(null);
      await AsyncStorage.multiRemove(['auth_token', 'user_info']);
    }
  }, [token]);

  // 更新用户信息
  const updateUser = useCallback((userData: Partial<User>) => {
    setUser(prev => prev ? { ...prev, ...userData } : null);
  }, []);

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated,
    isLoading,
    login,
    logout,
    updateUser,
    checkAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
