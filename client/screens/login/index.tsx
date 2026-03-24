import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export default function LoginScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { isAuthenticated, login } = useAuth();

  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [errors, setErrors] = useState<{ phone?: string; code?: string }>({});

  // 已登录则跳转首页
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/');
    }
  }, [isAuthenticated]);

  // 倒计时
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const validatePhone = () => {
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
  };

  const validateCode = () => {
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
  };

  const handleSendCode = async () => {
    if (!validatePhone() || countdown > 0) return;

    try {
      setSendingCode(true);

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
        // 开发环境下自动填充验证码
        if (result._dev_code) {
          setCode(result._dev_code);
        }
      } else {
        setErrors(prev => ({ ...prev, phone: result.error }));
      }
    } catch (error) {
      console.error('Error sending code:', error);
      setErrors(prev => ({ ...prev, phone: '发送验证码失败' }));
    } finally {
      setSendingCode(false);
    }
  };

  const handlePhoneLogin = async () => {
    if (!validatePhone() || !validateCode()) return;

    try {
      setLoading(true);

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
        // 保存认证信息
        await AsyncStorage.setItem('auth_token', result.data.token);
        await AsyncStorage.setItem('user_info', JSON.stringify(result.data.user));
        
        // 更新全局状态
        login(result.data.user, result.data.token);
        
        // 跳转首页
        router.replace('/');
      } else {
        setErrors(prev => ({ ...prev, code: result.error }));
      }
    } catch (error) {
      console.error('Error phone login:', error);
      setErrors(prev => ({ ...prev, code: '登录失败，请重试' }));
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'wechat' | 'weibo') => {
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
        body: JSON.stringify({ provider, code: 'mock_auth_code' }),
      });

      const result = await response.json();
      if (result.success) {
        // 保存认证信息
        await AsyncStorage.setItem('auth_token', result.data.token);
        await AsyncStorage.setItem('user_info', JSON.stringify(result.data.user));
        
        // 更新全局状态
        login(result.data.user, result.data.token);
        
        // 跳转首页
        router.replace('/');
      } else {
        alert(result.error || '登录失败');
      }
    } catch (error) {
      console.error('Error oauth login:', error);
      alert('登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled">
        {/* 头部 */}
        <View style={styles.header}>
          <View style={{ width: 80, height: 80, justifyContent: 'center', alignItems: 'center' }}>
            <FontAwesome6 name="camera" size={48} color={theme.primary} />
          </View>
          <Text style={styles.title}>光影工坊</Text>
          <Text style={styles.subtitle}>记录光影，分享美好</Text>
        </View>

        {/* 手机号登录表单 */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>手机号</Text>
            <TextInput
              style={[styles.input, errors.phone && styles.inputError]}
              placeholder="请输入手机号"
              placeholderTextColor={theme.textMuted}
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              maxLength={11}
            />
            {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>验证码</Text>
            <View style={styles.codeRow}>
              <TextInput
                style={[styles.input, styles.codeInput, errors.code && styles.inputError]}
                placeholder="请输入验证码"
                placeholderTextColor={theme.textMuted}
                value={code}
                onChangeText={setCode}
                keyboardType="number-pad"
                maxLength={6}
              />
              <TouchableOpacity
                style={[styles.codeButton, (countdown > 0 || sendingCode) && styles.codeButtonDisabled]}
                onPress={handleSendCode}
                disabled={countdown > 0 || sendingCode}
              >
                {sendingCode ? (
                  <ActivityIndicator size="small" color={theme.primary} />
                ) : (
                  <Text style={styles.codeButtonText}>
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
          <TouchableOpacity
            style={[styles.oauthButton, styles.wechatButton]}
            onPress={() => handleOAuthLogin('wechat')}
          >
            <FontAwesome6 name="weixin" size={28} color="#FFFFFF" brand />
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.oauthButton, styles.weiboButton]}
            onPress={() => handleOAuthLogin('weibo')}
          >
            <FontAwesome6 name="weibo" size={28} color="#FFFFFF" brand />
          </TouchableOpacity>
        </View>

        {/* 用户协议 */}
        <View style={styles.agreement}>
          <Text style={styles.agreementText}>
            登录即表示同意
            <Text style={styles.agreementLink}>《用户协议》</Text>
            和
            <Text style={styles.agreementLink}>《隐私政策》</Text>
          </Text>
        </View>
      </ScrollView>
    </Screen>
  );
}
