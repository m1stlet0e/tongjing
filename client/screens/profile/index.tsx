import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
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

  const fetchData = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      // 获取用户照片
      const photosResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/1/photos`);
      const photosResult = await photosResponse.json();
      if (photosResult.success) {
        setPhotos(photosResult.data.photos);
      }

      // 获取用户装备
      const equipmentResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/equipment/user/1`);
      const equipmentResult = await equipmentResponse.json();
      if (equipmentResult.success) {
        setEquipment(equipmentResult.data.equipment);
      }

      // 获取用户足迹
      const footprintResponse = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/1/footprint`);
      const footprintResult = await footprintResponse.json();
      if (footprintResult.success) {
        setFootprint(footprintResult.data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  }, [isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      fetchData();
    }, [fetchData])
  );

  const handleLogout = () => {
    Alert.alert(
      '退出登录',
      '确定要退出登录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确定',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  // 未登录状态
  if (!isAuthenticated) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={styles.header}>
          <TouchableOpacity
            style={{ alignItems: 'center' }}
            onPress={() => router.push('/login')}
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 用户信息头部 */}
        <View style={styles.header}>
          {authUser && (
            <>
              <Image source={{ uri: authUser.avatar_url }} style={styles.avatar} />
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
            <TouchableOpacity>
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
              {equipment.map((item, index) => (
                <View key={index} style={styles.equipmentCard}>
                  <Text style={styles.equipmentBrand}>{item.brand}</Text>
                  <Text style={styles.equipmentModel}>{item.model}</Text>
                  <Text style={styles.equipmentType}>
                    {item.type === 'camera' ? '相机' : '镜头'}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>

        {/* 我的作品集 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>我的作品</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>查看全部</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.photosGrid}>
            {photos.slice(0, 6).map((photo, index) => (
              <TouchableOpacity
                key={photo.id}
                style={styles.photoItem}
                onPress={() => router.push('/photo-detail', { id: photo.id })}
              >
                <Image source={{ uri: photo.image_url }} style={styles.photoImage} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* 拍摄足迹 */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>拍摄足迹</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>地图查看</Text>
            </TouchableOpacity>
          </View>
          {footprint.slice(0, 3).map((location, index) => (
            <View key={index} style={styles.footprintCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FontAwesome6 name="location-dot" size={14} color={theme.primary} />
                <Text style={styles.footprintLocation}> {location.location_name}</Text>
              </View>
              <Text style={styles.footprintCount}>{location.photo_count} 张照片</Text>
            </View>
          ))}
        </View>

        {/* 退出登录 */}
        <View style={[styles.section, { marginTop: 20 }]}>
          <TouchableOpacity
            style={{
              backgroundColor: theme.backgroundTertiary,
              paddingVertical: 16,
              borderRadius: 8,
              alignItems: 'center',
            }}
            onPress={handleLogout}
          >
            <Text style={{ color: theme.error, fontSize: 15, fontWeight: '500' }}>退出登录</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </Screen>
  );
}
