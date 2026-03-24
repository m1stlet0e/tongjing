// 原生端地图页面 - 使用 react-native-maps
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import MapView, { Marker, Callout, PROVIDER_GOOGLE } from 'react-native-maps';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';
import { apiGet } from '@/utils/api';

// 默认地图中心点（上海）
const DEFAULT_REGION = {
  latitude: 31.2304,
  longitude: 121.4737,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

interface MapPhoto {
  id: number;
  title: string;
  image_url: string;
  latitude: number;
  longitude: number;
  location_name: string;
  camera_model: string;
  lens_model: string;
  likes_count: number;
  username: string;
}

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
  const mapRef = useRef<MapView>(null);

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

  const handleSpotPress = (spot: PhotoSpot) => {
    if (mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: spot.latitude,
        longitude: spot.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      }, 500);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.container}>
        {/* 地图视图 */}
        <View style={styles.mapContainer}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={DEFAULT_REGION}
            showsUserLocation
            showsMyLocationButton
            showsCompass
            toolbarEnabled={false}
          >
            {mapPhotos.map((photo) => (
              <Marker
                key={photo.id}
                coordinate={{
                  latitude: photo.latitude,
                  longitude: photo.longitude,
                }}
              >
                <View style={styles.markerContainer}>
                  <View style={[styles.markerImageContainer, { backgroundColor: theme.primary }]}>
                    <FontAwesome6 name="camera" size={16} color="#FFFFFF" />
                  </View>
                </View>
                <Callout tooltip onPress={() => router.push('/photo-detail', { id: photo.id })}>
                  <View style={[styles.calloutContainer, { backgroundColor: theme.backgroundDefault }]}>
                    <View style={styles.calloutContent}>
                      <Text style={[styles.calloutTitle, { color: theme.textPrimary }]} numberOfLines={1}>
                        {photo.title}
                      </Text>
                      <Text style={[styles.calloutLocation, { color: theme.textSecondary }]} numberOfLines={1}>
                        <FontAwesome6 name="location-dot" size={10} /> {photo.location_name}
                      </Text>
                      <View style={styles.calloutStats}>
                        <FontAwesome6 name="heart" size={10} color={theme.error} />
                        <Text style={[styles.calloutStatText, { color: theme.textSecondary }]}>
                          {' '}{photo.likes_count}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>

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
                  onPress={() => {
                    handleSpotPress(spot);
                    router.push('/location-photos', { name: spot.location_name });
                  }}
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
