import React, { useState, useMemo, useCallback } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Image, 
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/contexts/AuthContext';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface Equipment {
  brand: string;
  model: string;
  type: string;
  specs: any;
}

export default function ProfileScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const { user: authUser, isAuthenticated, logout } = useAuth();

  const [photos, setPhotos] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [footprint, setFootprint] = useState<any[]>([]);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const fetchData = useCallback(async () => {
    if (!isAuthenticated || !authUser) return;
    
    try {
      // 获取用户照片
      const photosResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${authUser.id}/photos`);
      const photosResult = await photosResponse.json();
      if (photosResult.success) {
        setPhotos(photosResult.data.photos);
      }

      // 获取用户装备
      const equipmentResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/equipment/user/${authUser.id}`);
      const equipmentResult = await equipmentResponse.json();
      if (equipmentResult.success) {
        setEquipment(equipmentResult.data.equipment);
      }

      // 获取用户足迹
      const footprintResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/${authUser.id}/footprint`);
      const footprintResult = await footprintResponse.json();
      if (footprintResult.success) {
        setFootprint(footprintResult.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [isAuthenticated, authUser]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleLogout = useCallback(async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      setShowLogoutModal(false);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => router.push('/login')}
            activeOpacity={0.7}
          >
            <View
              style={{
                width: 80,
                height: 80,
                borderRadius: 40,
                backgroundColor: theme.backgroundTertiary,
                justifyContent: 'center',
                alignItems: 'center',
                borderWidth: 3,
                borderColor: theme.border,
              }}
            >
              <FontAwesome6 name="user" size={32} color={theme.textMuted} />
            </View>
            <Text style={[styles.username, { marginTop: 16 }]}>点击登录</Text>
            <Text style={styles.bio}>登录后查看个人中心</Text>
          </TouchableOpacity>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* 用户信息头部 */}
        <View style={styles.header}>
          {authUser && (
            <>
              <TouchableOpacity activeOpacity={0.8}>
                <Image source={{ uri: authUser.avatar_url }} style={styles.avatar} />
              </TouchableOpacity>
              <Text style={styles.username}>{authUser.username}</Text>
              {authUser.bio && <Text style={styles.bio}>{authUser.bio}</Text>}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{photos.length}</Text>
                  <Text style={styles.statLabel}>作品</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>粉丝</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>0</Text>
                  <Text style={styles.statLabel}>关注</Text>
                </View>
              </View>
            </>
          )}
        </View>

        {/* 我的装备库 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的装备库</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>管理</Text>
            </TouchableOpacity>
          </View>
          <View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={styles.equipmentScroll}
              contentContainerStyle={styles.equipmentScrollContent}
            >
              {equipment.length > 0 ? (
                equipment.map((item, index) => (
                  <View key={index} style={styles.equipmentCard}>
                    <Text style={styles.equipmentBrand}>{item.brand}</Text>
                    <Text style={styles.equipmentModel}>{item.model}</Text>
                    <Text style={styles.equipmentType}>
                      {item.type === 'camera' ? '相机' : '镜头'}
                    </Text>
                  </View>
                ))
              ) : (
                <View style={[styles.equipmentCard, { justifyContent: 'center' }]}>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>暂无装备</Text>
                </View>
              )}
            </ScrollView>
          </View>
        </View>

        {/* 我的作品集 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的作品</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photosGrid}>
            {photos.slice(0, 6).map((photo) => (
              <TouchableOpacity
                key={photo.id}
                style={styles.photoItem}
                onPress={() => router.push('/photo-detail', { id: photo.id })}
                activeOpacity={0.8}
              >
                <Image source={{ uri: photo.image_url }} style={styles.photoImage} />
              </TouchableOpacity>
            ))}
            {photos.length === 0 && (
              <View style={{ paddingVertical: 20, alignItems: 'center', width: '100%' }}>
                <Text style={{ color: theme.textMuted, fontSize: 13 }}>暂无作品</Text>
              </View>
            )}
          </View>
        </View>

        {/* 拍摄足迹 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>拍摄足迹</Text>
            <TouchableOpacity activeOpacity={0.7}>
              <Text style={styles.seeAll}>地图查看</Text>
            </TouchableOpacity>
          </View>
          {footprint.length > 0 ? (
            footprint.slice(0, 3).map((location, index) => (
              <View key={index} style={styles.footprintCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <FontAwesome6 name="location-dot" size={14} color={theme.primary} />
                  <Text style={styles.footprintLocation}> {location.location_name}</Text>
                </View>
                <Text style={styles.footprintCount}>{location.photo_count} 张照片</Text>
              </View>
            ))
          ) : (
            <View style={[styles.footprintCard, { alignItems: 'center' }]}>
              <Text style={{ color: theme.textMuted, fontSize: 13 }}>暂无足迹</Text>
            </View>
          )}
        </View>

        {/* 退出登录按钮 */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.backgroundTertiary,
              paddingVertical: 16,
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
            }}
            onPress={() => setShowLogoutModal(true)}
            disabled={isLoggingOut}
            activeOpacity={0.7}
          >
            {isLoggingOut ? (
              <ActivityIndicator size="small" color={theme.error} />
            ) : (
              <>
                <FontAwesome6 name="right-from-bracket" size={16} color={theme.error} style={{ marginRight: 8 }} />
                <Text style={{ color: theme.error, fontSize: 15, fontWeight: '500' }}>退出登录</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        {/* 版本信息 */}
        <View style={{ alignItems: 'center', paddingTop: 20, paddingBottom: 40 }}>
          <Text style={{ color: theme.textMuted, fontSize: 11 }}>同镜 v1.0.0</Text>
        </View>
      </ScrollView>

      {/* 退出登录确认弹窗 */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowLogoutModal(false)}>
          <View style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            <TouchableWithoutFeedback>
              <View style={{
                backgroundColor: theme.backgroundDefault,
                width: 280,
                padding: 24,
                alignItems: 'center',
              }}>
                <FontAwesome6 name="right-from-bracket" size={32} color={theme.error} style={{ marginBottom: 16 }} />
                <Text style={{
                  color: theme.textPrimary,
                  fontSize: 18,
                  fontWeight: '600',
                  marginBottom: 8,
                }}>
                  退出登录
                </Text>
                <Text style={{
                  color: theme.textSecondary,
                  fontSize: 14,
                  textAlign: 'center',
                  marginBottom: 24,
                }}>
                  确定要退出当前账号吗？
                </Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      backgroundColor: theme.backgroundTertiary,
                      alignItems: 'center',
                    }}
                    onPress={() => setShowLogoutModal(false)}
                    activeOpacity={0.7}
                  >
                    <Text style={{ color: theme.textPrimary, fontSize: 15 }}>取消</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      backgroundColor: theme.error,
                      alignItems: 'center',
                    }}
                    onPress={handleLogout}
                    disabled={isLoggingOut}
                    activeOpacity={0.7}
                  >
                    {isLoggingOut ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '500' }}>退出</Text>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Screen>
  );
}
