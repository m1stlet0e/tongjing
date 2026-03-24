import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

/**
 * 获取存储的 token
 */
export const getStoredToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem('auth_token');
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * 统一的 API 请求封装
 * 自动携带 Authorization header
 */
export const apiRequest = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = await getStoredToken();
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });
};

/**
 * GET 请求
 */
export const apiGet = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'GET' });
};

/**
 * POST 请求
 */
export const apiPost = async (
  endpoint: string,
  data?: Record<string, any>
): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });
};

/**
 * PATCH 请求
 */
export const apiPatch = async (
  endpoint: string,
  data: Record<string, any>
): Promise<Response> => {
  return apiRequest(endpoint, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
};

/**
 * DELETE 请求
 */
export const apiDelete = async (endpoint: string): Promise<Response> => {
  return apiRequest(endpoint, { method: 'DELETE' });
};

/**
 * 上传文件（FormData）
 */
export const apiUpload = async (
  endpoint: string,
  formData: FormData
): Promise<Response> => {
  const token = await getStoredToken();
  
  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}${endpoint}`, {
    method: 'POST',
    headers,
    body: formData,
  });
};
