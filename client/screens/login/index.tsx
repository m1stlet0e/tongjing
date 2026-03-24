import React, { useState, useMemo, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface ToastState {
  visible: boolean;
  message: string;
  type: 'error' | 'success' | 'info';
}

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { isAuthenticated, login, isLoading: authLoading } = useAuth();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});
  const [toast, setToast] = useState<ToastState>({ visible: false, message: '', type: 'info' });
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  // 已登录则跳转首页
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      router.replace('/');
    }
  }, [isAuthenticated, authLoading]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  // Toast自动隐藏
  useEffect(() => {
    if (toast.visible) {
      const timer = setTimeout(() => {
        setToast(prev => ({ ...prev, visible: false }));
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.visible]);

  const showToast = useCallback((message: string, type: ToastState['type'] = 'info') => {
    setToast({ visible: true, message, type });
  }, []);

  const validatePhone = useCallback(() => {
    if (!phone) {
      setErrors(prev => ({ ...prev, phone: '请输入手机号' }));
      return false;
    }
    if (!/^1[3-9]\d{9}$/.test(phone)) {
      setErrors(prev => ({ ...prev, phone: '请输入正确的手机号' }));
      return false;
    }
    setErrors(prev => ({ ...prev, phone: undefined }));
    return true;
  }, [phone]);

  const validateCode = useCallback(() => {
    if (!code) {
      setErrors(prev => ({ ...prev, code: '请输入验证码' }));
      return false;
    }
    if (!/^\d{6}$/.test(code)) {
      setErrors(prev => ({ ...prev, code: '验证码为6位数字' }));
      return false;
    }
    setErrors(prev => ({ ...prev, code: undefined }));
    return true;
  }, [code]);

  const handleSendCode = async () => {
    if (!validatePhone() || countdown > 0 || sendingCode) return;

    try {
      setSendingCode(true);
      setErrors(prev => ({ ...prev, phone: undefined }));

      /**
       * 服务端文件：server/src/routes/auth.ts
       * 接口：POST /api/v1/auth/send-code
       * Body 参数：phone: string, type: 'login' | 'register'
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/send-code`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, type: 'login' }),
      });

      const result = await response.json();
      if (result.success) {
        setCountdown(60);
        showToast('验证码已发送', 'success');
        // 开发环境下自动填充验证码
        if (result._dev_code) {
          setCode(result._dev_code);
        }
      } else {
        setErrors(prev => ({ ...prev, phone: result.error }));
        showToast(result.error || '发送失败', 'error');
      }
    } catch (error) {
      console.error('Error sending code:', error);
      const errorMsg = '网络错误，请检查网络后重试';
      setErrors(prev => ({ ...prev, phone: errorMsg }));
      showToast(errorMsg, 'error');
    } finally {
      setSendingCode(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhone() || !validateCode() || loading) return;

    try {
      setLoading(true);
      setErrors({});

      /**
       * 服务端文件：server/src/routes/auth.ts
       * 接口：POST /api/v1/auth/login/phone
       * Body 参数：phone: string, code: string
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/login/phone`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code }),
      });

      const result = await response.json();
      if (result.success) {
        // 保存认证信息到本地
        await AsyncStorage.multiSet([
          ['auth_token', result.data.token],
          ['user_info', JSON.stringify(result.data.user)],
        ]);
        
        // 更新全局状态
        login(result.data.user, result.data.token);
        
        showToast(result.message || '登录成功', 'success');
        
        // 延迟跳转，让用户看到成功提示
        setTimeout(() => {
          router.replace('/');
        }, 500);
      } else {
        const errorMsg = result.error || '登录失败';
        setErrors(prev => ({ ...prev, code: errorMsg }));
        showToast(errorMsg, 'error');
      }
    } catch (error) {
      console.error('Error phone login:', error);
      const errorMsg = '网络错误，请稍后重试';
      setErrors(prev => ({ ...prev, code: errorMsg }));
      showToast(errorMsg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'wechat' | 'weibo') => {
    if (loading) return;

    try {
      setLoading(true);

      /**
       * 服务端文件：server/src/routes/auth.ts
       * 接口：POST /api/v1/auth/login/oauth
       * Body 参数：provider: 'wechat' | 'weibo', code: string, state?: string
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/auth/login/oauth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider, code: `mock_${provider}_${Date.now()}` }),
      });

      const result = await response.json();
      if (result.success) {
        // 保存认证信息到本地
        await AsyncStorage.multiSet([
          ['auth_token', result.data.token],
          ['user_info', JSON.stringify(result.data.user)],
        ]);
        
        // 更新全局状态
        login(result.data.user, result.data.token);
        
        showToast(result.message || '登录成功', 'success');
        
        // 延迟跳转
        setTimeout(() => {
          router.replace('/');
        }, 500);
      } else {
        showToast(result.error || '登录失败', 'error');
      }
    } catch (error) {
      console.error('Error oauth login:', error);
      showToast('网络错误，请稍后重试', 'error');
    } finally {
      setLoading(false);
    }
  };

  const getInputStyle = (fieldName: string, hasError: boolean) => {
    const styleArray = [styles.input];
    if (focusedInput === fieldName) {
      styleArray.push(styles.inputFocused as any);
    }
    if (hasError) {
      styleArray.push(styles.inputError as any);
    }
    return styleArray;
  };

  // 显示加载状态
  if (authLoading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, marginTop: 16 }}>加载中...</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* 头部 */}
        <View style={styles.header}>
          <View style={{ 
            width: 80, 
            height: 80, 
            justifyContent: 'center', 
            alignItems: 'center',
            backgroundColor: theme.primary,
            borderRadius: 40,
          }}>
            <FontAwesome6 name="camera" size={36} color="#FFFFFF" />
          </View>
          <Text style={styles.title}>同镜</Text>
          <Text style={styles.subtitle}>取景框里的光影故事</Text>
        </View>

        {/* 手机号登录表单 */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>手机号</Text>
            <TextInput
              style={getInputStyle('phone', !!errors.phone)}
              placeholder="请输入手机号"
              placeholderTextColor={theme.textMuted}
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
              }}
              keyboardType="phone-pad"
              maxLength={11}
              onFocus={() => setFocusedInput('phone')}
              onBlur={() => setFocusedInput(null)}
              editable={!loading}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>验证码</Text>
            <View style={styles.codeRow}>
              <TextInput
                style={[...getInputStyle('code', !!errors.code), styles.codeInput]}
                placeholder="请输入验证码"
                placeholderTextColor={theme.textMuted}
                value={code}
                onChangeText={(text) => {
                  setCode(text);
                  if (errors.code) setErrors(prev => ({ ...prev, code: undefined }));
                }}
                keyboardType="number-pad"
                maxLength={6}
                onFocus={() => setFocusedInput('code')}
                onBlur={() => setFocusedInput(null)}
                editable={!loading}
              />
              <TouchableOpacity
                style={[styles.codeButton, (countdown > 0 || sendingCode) && styles.codeButtonDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0 || sendingCode || loading}
              >
                {sendingCode ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <Text style={[
                    styles.codeButtonText, 
                    (countdown > 0) && styles.codeButtonTextDisabled
                  ]}>
                    {countdown > 0 ? `${countdown}s` : '获取验证码'}
                  </Text>
                )}
              </TouchableOpacity>
            </View>
            {errors.code && <Text style={styles.errorText}>{errors.code}</Text>}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handlePhoneLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>登录 / 注册</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* 分割线 */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>其他登录方式</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* 第三方登录 */}
        <View style={styles.oauthContainer}>
          <View style={styles.oauthButtons}>
            <TouchableOpacity 
              style={styles.oauthButtonItem}
              onPress={() => handleOAuthLogin('wechat')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={[styles.oauthButton, styles.wechatButton]}>
                <FontAwesome6 name="weixin" size={26} color="#FFFFFF" brand />
              </View>
              <Text style={styles.oauthButtonText}>微信登录</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.oauthButtonItem}
              onPress={() => handleOAuthLogin('weibo')}
              disabled={loading}
              activeOpacity={0.7}
            >
              <View style={[styles.oauthButton, styles.weiboButton]}>
                <FontAwesome6 name="weibo" size={26} color="#FFFFFF" brand />
              </View>
              <Text style={styles.oauthButtonText}>微博登录</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 用户协议 */}
        <View style={styles.agreement}>
          <Text style={styles.agreementText}>
            登录即表示同意{'\n'}
            <Text style={styles.agreementLink}>《用户协议》</Text>和<Text style={styles.agreementLink}>《隐私政策》</Text>
          </Text>
        </View>
      </ScrollView>

      {/* Toast提示 */}
      {toast.visible && (
        <View style={[
          styles.toast, 
          toast.type === 'error' && styles.toastError,
          toast.type === 'success' && styles.toastSuccess,
        ]}>
          <Text style={styles.toastText}>{toast.message}</Text>
        </View>
      )}
    </Screen>
  );
}
