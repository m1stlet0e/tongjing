// Web 端地图页面 - 使用占位视图
import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';
import { apiGet } from '@/utils/api';

interface PhotoSpot {
  location_name: string;
  latitude: number;
  longitude: number;
  photo_count: number;
  total_likes: number;
}

interface MapPhoto {
  id: number;
  title: string;
  image_url: string;
  latitude: number;
  longitude: number;
  location_name: string;
  likes_count: number;
}

export default function MapScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [spots, setSpots] = useState<PhotoSpot[]>([]);
  const [mapPhotos, setMapPhotos] = useState<MapPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPopularSpots();
    fetchMapPhotos();
  }, []);

  const fetchPopularSpots = async () => {
    try {
      const response = await apiGet('/api/v1/map/popular-spots');
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
      const response = await apiGet('/api/v1/map/photos');
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
        {/* Web 端占位视图 */}
        <View style={styles.mapContainer}>
          <View style={styles.mapPlaceholder}>
            <FontAwesome6 name="map-location-dot" size={48} color={theme.textMuted} />
            <Text style={styles.mapPlaceholderText}>地图视图</Text>
            <Text style={[styles.mapPlaceholderText, { marginTop: 8, fontSize: 12 }]}>
              共 {mapPhotos.length} 个拍摄点位
            </Text>
            <Text style={[styles.mapPlaceholderText, { marginTop: 4, fontSize: 11, opacity: 0.7 }]}>
              （请在移动端查看完整地图体验）
            </Text>
          </View>

          {/* 头部覆盖层 */}
          <View style={styles.header}>
            <Text style={styles.title}>机位地图</Text>
            <Text style={styles.subtitle}>{mapPhotos.length} 个拍摄点位</Text>
          </View>
        </View>

        {/* 热门地点列表 */}
        <View style={styles.spotsList}>
          <Text style={styles.spotsTitle}>热门拍摄地</Text>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color={theme.primary} />
            </View>
          ) : (
            <ScrollView showsVerticalScrollIndicator={false}>
              {spots.length > 0 ? spots.map((spot, index) => (
                <TouchableOpacity
                  key={index}
                  style={[styles.spotCard, { backgroundColor: theme.backgroundDefault }]}
                  onPress={() => router.push('/location-photos', { name: spot.location_name })}
                >
                  <View style={[styles.spotImageContainer, { backgroundColor: theme.backgroundTertiary }]}>
                    <FontAwesome6 name="location-dot" size={24} color={theme.primary} />
                  </View>
                  <View style={styles.spotInfo}>
                    <Text style={[styles.spotName, { color: theme.textPrimary }]}>{spot.location_name}</Text>
                    <Text style={[styles.spotStats, { color: theme.textSecondary }]}>
                      {spot.total_likes} 喜欢 · {spot.photo_count} 张照片
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                      <FontAwesome6 name="images" size={10} color={theme.primary} />
                      <Text style={[styles.spotPhotos, { color: theme.primary }]}> 查看此点位照片</Text>
                    </View>
                  </View>
                  <FontAwesome6 name="chevron-right" size={14} color={theme.textMuted} />
                </TouchableOpacity>
              )) : (
                <View style={[styles.emptyContainer, { backgroundColor: theme.backgroundDefault }]}>
                  <FontAwesome6 name="map-pin" size={32} color={theme.textMuted} />
                  <Text style={[styles.emptyText, { color: theme.textSecondary }]}>
                    暂无拍摄地点数据
                  </Text>
                  <Text style={[styles.emptyHint, { color: theme.textMuted }]}>
                    发布带有位置信息的照片后，这里会显示热门拍摄地
                  </Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>
      </View>
    </Screen>
  );
}
