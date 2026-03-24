import React, { useState, useMemo } from 'react';
import { View, ScrollView, TouchableOpacity, Text, Image, FlatList } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import PhotoCard, { Photo } from '@/components/PhotoCard';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

const CAMERA_BRANDS = ['Sony', 'Canon', 'Nikon', 'Fujifilm', 'Leica'];
const SCENES = ['夜景', '人像', '建筑', '街拍', '风光', '星空'];
const STYLES = ['长曝光', '大光圈', '黑白', '胶片'];

export default function DiscoverScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedScene, setSelectedScene] = useState<string | null>(null);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(false);

  const searchPhotos = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedBrand) params.append('camera', selectedBrand);
      if (selectedScene) params.append('scene', selectedScene);

      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：GET /api/v1/photos
       * Query 参数：camera?: string, scene?: string
       */
      const response = await fetch(
        `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos?${params.toString()}`
      );
      const result = await response.json();
      if (result.success) {
        setPhotos(result.data.photos);
      }
    } catch (error) {
      console.error('Error searching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    searchPhotos();
  }, [selectedBrand, selectedScene]);

  const renderFilterSection = (
    label: string,
    options: string[],
    selected: string | null,
    onSelect: (value: string | null) => void
  ) => (
    <View style={styles.filterSection}>
      <Text style={styles.filterLabel}>{label}</Text>
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterScrollContent}
        >
        <TouchableOpacity
          style={[styles.filterChip, !selected && styles.filterChipActive]}
          onPress={() => onSelect(null)}
        >
          <Text style={[styles.filterChipText, !selected && styles.filterChipTextActive]}>
            全部
          </Text>
        </TouchableOpacity>
        {options.map(option => (
          <TouchableOpacity
            key={option}
            style={[styles.filterChip, selected === option && styles.filterChipActive]}
            onPress={() => onSelect(selected === option ? null : option)}
          >
            <Text
              style={[styles.filterChipText, selected === option && styles.filterChipTextActive]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      </View>
    </View>
  );

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>发现</Text>
          <Text style={styles.subtitle}>探索精彩作品</Text>
        </View>

        {renderFilterSection('相机品牌', CAMERA_BRANDS, selectedBrand, setSelectedBrand)}
        {renderFilterSection('拍摄场景', SCENES, selectedScene, setSelectedScene)}
        {renderFilterSection('拍摄风格', STYLES, selectedStyle, setSelectedStyle)}

        <View style={styles.divider} />

        <Text style={styles.sectionTitle}>精选作品</Text>

        <View style={styles.gridContainer}>
          <View style={styles.grid}>
            {photos.slice(0, 6).map(photo => (
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
                  <Text style={styles.gridStats}>
                    {photo.likes_count} 喜欢 · {photo.comments_count} 评论
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {photos.length > 6 && (
          <>
            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>更多作品</Text>
            <View style={{ paddingHorizontal: 24 }}>
              {photos.slice(6).map(photo => (
                <PhotoCard
                  key={photo.id}
                  photo={photo}
                  onPress={() => router.push('/photo-detail', { id: photo.id })}
                />
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </Screen>
  );
}
