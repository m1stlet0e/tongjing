import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useSafeSearchParams } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export default function PhotoDetailScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const params = useSafeSearchParams<{ id: string }>();

  const [photo, setPhoto] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPhotoDetail();
  }, [params.id]);

  const fetchPhotoDetail = async () => {
    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：GET /api/v1/photos/:id
       */
      const response = await fetch(
        `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${params.id}`
      );
      const result = await response.json();
      if (result.success) {
        setPhoto(result.data);
      }
    } catch (error) {
      console.error('Error fetching photo detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!photo) return;
    try {
      await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photo.id}/like`, {
        method: 'POST',
      });
      setPhoto({
        ...photo,
        is_liked: !photo.is_liked,
        likes_count: photo.is_liked ? photo.likes_count - 1 : photo.likes_count + 1,
      });
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async () => {
    if (!photo) return;
    try {
      await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photo.id}/favorite`, {
        method: 'POST',
      });
      setPhoto({
        ...photo,
        is_favorited: !photo.is_favorited,
        favorites_count: photo.is_favorited
          ? photo.favorites_count - 1
          : photo.favorites_count + 1,
      });
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  if (loading) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
        </View>
      </Screen>
    );
  }

  if (!photo) {
    return (
      <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ color: theme.textSecondary }}>照片不存在</Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Image source={{ uri: photo.image_url }} style={styles.image} resizeMode="cover" />

        <View style={styles.content}>
          <View style={styles.header}>
            <Image source={{ uri: photo.avatar_url }} style={styles.avatar} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{photo.username}</Text>
              <Text style={styles.location}>{photo.location_name}</Text>
            </View>
          </View>

          <Text style={styles.title}>{photo.title}</Text>
          {photo.description && (
            <Text style={styles.description}>{photo.description}</Text>
          )}

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>拍摄参数</Text>
            <View style={styles.exifCard}>
              <View style={styles.exifRow}>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>相机</Text>
                  <Text style={styles.exifValue}>
                    {photo.camera_brand} {photo.camera_model}
                  </Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>镜头</Text>
                  <Text style={styles.exifValue}>{photo.lens_model}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>焦距</Text>
                  <Text style={styles.exifValue}>{photo.focal_length}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>光圈</Text>
                  <Text style={styles.exifValue}>{photo.aperture}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>快门</Text>
                  <Text style={styles.exifValue}>{photo.shutter_speed}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>ISO</Text>
                  <Text style={styles.exifValue}>{photo.iso}</Text>
                </View>
              </View>
            </View>
          </View>

          {photo.shooting_tips && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>拍摄心得</Text>
              <View style={styles.tipsCard}>
                <Text style={styles.tipsText}>{photo.shooting_tips}</Text>
              </View>
            </View>
          )}

          {photo.tags && photo.tags.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>标签</Text>
              <View style={styles.tagsContainer}>
                {photo.tags.map((tag: any, index: number) => (
                  <View key={index} style={styles.tag}>
                    <Text style={styles.tagText}>#{tag.tag_name}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.statItem} onPress={handleLike}>
          <FontAwesome6
            name="heart"
            size={20}
            solid={photo.is_liked}
            color={photo.is_liked ? theme.error : theme.textSecondary}
          />
          <Text style={styles.statText}>{photo.likes_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem}>
          <FontAwesome6 name="comment" size={20} color={theme.textSecondary} />
          <Text style={styles.statText}>{photo.comments_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.statItem} onPress={handleFavorite}>
          <FontAwesome6
            name="bookmark"
            size={20}
            solid={photo.is_favorited}
            color={photo.is_favorited ? theme.accent : theme.textSecondary}
          />
          <Text style={styles.statText}>{photo.favorites_count}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionButton}>
          <Text style={styles.actionButtonText}>收藏到拍摄计划</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}
