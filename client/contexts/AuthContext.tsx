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
  login: (user: User, token: string) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (userData: Partial<User>) => Promise<void>;
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
            // 更新本地存储的用户信息
            await AsyncStorage.setItem('user_info', JSON.stringify(result.data));
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
      // 网络错误时不清除本地数据，保留登录状态
    } finally {
      setIsLoading(false);
    }
  }, []);

  // 应用启动时检查认证状态
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // 登录 - 保存到本地存储和更新状态
  const login = useCallback(async (userData: User, tokenStr: string) => {
    try {
      // 先更新状态
      setUser(userData);
      setToken(tokenStr);
      
      // 再保存到本地存储
      await AsyncStorage.multiSet([
        ['auth_token', tokenStr],
        ['user_info', JSON.stringify(userData)],
      ]);
    } catch (error) {
      console.error('Error saving auth data:', error);
      // 回滚状态
      setUser(null);
      setToken(null);
      throw error;
    }
  }, []);

  // 登出 - 完整清理
  const logout = useCallback(async () => {
    try {
      // 先调用后端退出接口（如果有token）
      if (token) {
        try {
          await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/logout`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
        } catch (apiError) {
          // API调用失败不影响本地清理
          console.error('Error calling logout API:', apiError);
        }
      }
    } finally {
      // 无论API是否成功，都清理本地状态
      setUser(null);
      setToken(null);
      
      // 清理本地存储
      try {
        await AsyncStorage.multiRemove(['auth_token', 'user_info']);
      } catch (storageError) {
        console.error('Error clearing storage:', storageError);
      }
    }
  }, [token]);

  // 更新用户信息 - 同步到本地存储
  const updateUser = useCallback(async (userData: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...userData };
      // 异步更新本地存储
      AsyncStorage.setItem('user_info', JSON.stringify(updated)).catch(err => {
        console.error('Error updating user info in storage:', err);
      });
      return updated;
    });
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
