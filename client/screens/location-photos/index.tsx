import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useSafeSearchParams, useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export default function LocationPhotosScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useSafeSearchParams<{ name: string }>();
  const router = useSafeRouter();

  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLocationPhotos();
  }, [params.name]);

  const fetchLocationPhotos = async () => {
    try {
      /**
       * 服务端文件：server/src/routes/map.ts
       * 接口：GET /api/v1/map/location/:locationName
       */
      const response = await fetch(
        `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/map/location/${encodeURIComponent(params.name)}`
      );
      const result = await response.json();
      if (result.success) {
        setPhotos(result.data);
      }
    } catch (error) {
      console.error('Error fetching location photos:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>{params.name}</Text>
          <Text style={styles.subtitle}>共 {photos.length} 张照片</Text>
        </View>

        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : (
          <View style={styles.gridContainer}>
            <View style={styles.grid}>
              {photos.map(photo => (
                <TouchableOpacity
                  key={photo.id}
                  style={styles.gridItem}
                  onPress={() => router.push('/photo-detail', { id: photo.id })}
                >
                  <Image source={{ uri: photo.image_url }} style={styles.gridImage} />
                  <View style={styles.gridOverlay}>
                    <Text style={styles.gridTitle} numberOfLines={1}>
                      {photo.title}
                    </Text>
                    <Text style={styles.gridAuthor}>by {photo.username}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </Screen>
  );
}
