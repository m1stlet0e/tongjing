import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, FlatList } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface User {
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
  photos_count: number;
  followers_count: number;
  following_count: number;
}

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

  const [user, setUser] = useState<User | null>(null);
  const [photos, setPhotos] = useState<any[]>([]);
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [footprint, setFootprint] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        /**
         * 服务端文件：server/src/routes/users.ts
         * 接口：GET /api/v1/users/me
         */
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/me`);
        const result = await response.json();
        if (result.success) {
          setUser(result.data);
        }
      } catch (error) {
        console.error('Error fetching user:', error);
      }
    };

    const fetchUserPhotos = async () => {
      try {
        /**
         * 服务端文件：server/src/routes/users.ts
         * 接口：GET /api/v1/users/:id/photos
         */
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/1/photos`);
        const result = await response.json();
        if (result.success) {
          setPhotos(result.data.photos);
        }
      } catch (error) {
        console.error('Error fetching photos:', error);
      }
    };

    const fetchUserEquipment = async () => {
      try {
        /**
         * 服务端文件：server/src/routes/equipment.ts
         * 接口：GET /api/v1/equipment/user/:userId
         */
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/equipment/user/1`);
        const result = await response.json();
        if (result.success) {
          setEquipment(result.data.equipment);
        }
      } catch (error) {
        console.error('Error fetching equipment:', error);
      }
    };

    const fetchUserFootprint = async () => {
      try {
        /**
         * 服务端文件：server/src/routes/users.ts
         * 接口：GET /api/v1/users/:id/footprint
         */
        const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/users/1/footprint`);
        const result = await response.json();
        if (result.success) {
          setFootprint(result.data);
        }
      } catch (error) {
        console.error('Error fetching footprint:', error);
      }
    };

    fetchUserData();
    fetchUserPhotos();
    fetchUserEquipment();
    fetchUserFootprint();
  }, []);

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle="light">
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* 用户信息头部 */}
        <View style={styles.header}>
          {user && (
            <>
              <Image source={{ uri: user.avatar_url }} style={styles.avatar} />
              <Text style={styles.username}>{user.username}</Text>
              {user.bio && <Text style={styles.bio}>{user.bio}</Text>}
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.photos_count}</Text>
                  <Text style={styles.statLabel}>作品</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.followers_count}</Text>
                  <Text style={styles.statLabel}>粉丝</Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statValue}>{user.following_count}</Text>
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
      </ScrollView>
    </Screen>
  );
}
