import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface PhotoSpot {
  location_name: string;
  latitude: number;
  longitude: number;
  photo_count: number;
  total_likes: number;
}

export default function MapScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [spots, setSpots] = useState<PhotoSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [mapPhotos, setMapPhotos] = useState<any[]>([]);

  useEffect(() => {
    fetchPopularSpots();
    fetchMapPhotos();
  }, []);

  const fetchPopularSpots = async () => {
    try {
      /**
       * 服务端文件：server/src/routes/map.ts
       * 接口：GET /api/v1/map/popular-spots
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/map/popular-spots`);
      const result = await response.json();
      if (result.success) {
        setSpots(result.data);
      }
    } catch (error) {
      console.error('Error fetching spots:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMapPhotos = async () => {
    try {
      /**
       * 服务端文件：server/src/routes/map.ts
       * 接口：GET /api/v1/map/photos
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/map/photos`);
      const result = await response.json();
      if (result.success) {
        setMapPhotos(result.data);
      }
    } catch (error) {
      console.error('Error fetching map photos:', error);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 模拟地图视图 */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <FontAwesome6 name="map-location-dot" size={48} color={theme.textMuted} />
            <Text style={styles.mapPlaceholderText}>地图视图（需要地图API）</Text>
            <Text style={[styles.mapPlaceholderText, { marginTop: 8, fontSize: 12 }]}>
              共 {mapPhotos.length} 个拍摄点位
            </Text>
          </View>
        </View>

        {/* 头部 */}
        <View style={styles.header}>
          <Text style={styles.title}>机位地图</Text>
        </View>

        {/* 热门地点列表 */}
        <View style={styles.spotsList}>
          <Text style={styles.spotsTitle}>热门拍摄地</Text>
          {loading ? (
            <ActivityIndicator size="large" color={theme.primary} />
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {spots.map((spot, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.spotCard}
                  onPress={() => router.push('/location-photos', { name: spot.location_name })}
                >
                  <Image
                    source={{
                      uri: `https://images.unsplash.com/photo-${
                        1500000000000 + index * 100000000
                      }?w=120&h=120&fit=crop`,
                    }}
                    style={styles.spotImage}
                  />
                  <View style={styles.spotInfo}>
                    <Text style={styles.spotName}>{spot.location_name}</Text>
                    <Text style={styles.spotStats}>
                      {spot.total_likes} 喜欢 · {spot.photo_count} 张照片
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <FontAwesome6 name="location-dot" size={10} color={theme.primary} />
                      <Text style={styles.spotPhotos}> 查看此点位照片</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>
      </View>
    </Screen>
  );
}
