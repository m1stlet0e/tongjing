import React, { useState, useEffect, useMemo } from 'react';
import { View, FlatList, TouchableOpacity, Text, ActivityIndicator } from 'react-native';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { ThemedText } from '@/components/ThemedText';
import PhotoCard, { Photo } from '@/components/PhotoCard';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

export default function HomeScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();

  const [activeTab, setActiveTab] = useState<'hot' | 'latest' | 'following'>('hot');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchPhotos = async (pageNum: number, tab: string) => {
    try {
      setLoading(pageNum === 1);

      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：GET /api/v1/photos
       * Query 参数：page: number, limit: number, tab: 'hot' | 'latest' | 'following'
       */
      const response = await fetch(
        `${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos?page=${pageNum}&limit=10&tab=${tab}`
      );
      const result = await response.json();

      if (result.success) {
        if (pageNum === 1) {
          setPhotos(result.data.photos);
        } else {
          setPhotos(prev => [...prev, ...result.data.photos]);
        }
        setHasMore(result.data.photos.length === 10);
      }
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos(1, activeTab);
  }, [activeTab]);

  const handleLoadMore = () => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchPhotos(nextPage, activeTab);
    }
  };

  const handlePhotoPress = (photoId: number) => {
    router.push('/photo-detail', { id: photoId });
  };

  const handleLike = async (photoId: number) => {
    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos/:id/like
       */
      await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photoId}/like`, {
        method: 'POST',
      });

      setPhotos(prev =>
        prev.map(p => {
          if (p.id === photoId) {
            return {
              ...p,
              is_liked: !p.is_liked,
              likes_count: p.is_liked ? p.likes_count - 1 : p.likes_count + 1,
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleFavorite = async (photoId: number) => {
    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos/:id/favorite
       */
      await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photoId}/favorite`, {
        method: 'POST',
      });

      setPhotos(prev =>
        prev.map(p => {
          if (p.id === photoId) {
            return {
              ...p,
              is_favorited: !p.is_favorited,
              favorites_count: p.is_favorited ? p.favorites_count - 1 : p.favorites_count + 1,
            };
          }
          return p;
        })
      );
    } catch (error) {
      console.error('Error toggling favorite:', error);
    }
  };

  const renderPhoto = ({ item }: { item: Photo }) => (
    <PhotoCard
      photo={item}
      onPress={() => handlePhotoPress(item.id)}
      onLike={() => handleLike(item.id)}
      onFavorite={() => handleFavorite(item.id)}
    />
  );

  const tabs = [
    { key: 'hot', label: '热门' },
    { key: 'latest', label: '最新' },
    { key: 'following', label: '关注' },
  ];

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <View style={styles.header}>
        <Text style={styles.headerLabel}>PHOTOGRAPHY COMMUNITY</Text>
        <Text style={styles.headerTitle}>光影工坊</Text>
        <Text style={styles.headerSubtitle}>发现 · 分享 · 记录</Text>
      </View>

      <View style={styles.tabsContainer}>
        {tabs.map(tab => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab.key as any);
              setPage(1);
            }}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {loading && photos.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      ) : (
        <FlatList
          data={photos}
          renderItem={renderPhoto}
          keyExtractor={item => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loading && photos.length > 0 ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
              </View>
            ) : null
          }
        />
      )}
    </Screen>
  );
}
