import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_MUTED } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_MARGIN = 20;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_GAP) / 2;

interface PhotoItem {
  id: number;
  image_url: string;
  title: string;
  description: string;
  location_name: string;
  username: string;
  avatar_url: string;
  likes_count: number;
  comments_count: number;
  favorites_count: number;
  tags: { tag_name: string; tag_type: string }[];
  is_liked: boolean;
  is_favorited: boolean;
}

// 模拟 Stories 数据
const STORIES = [
  { id: 'add', name: '发布', isAdd: true, avatar: null },
  { id: '1', name: '你的故事', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' },
  { id: '2', name: '光影日记', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100' },
  { id: '3', name: '街头猎手', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100' },
  { id: '4', name: '风光控', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100' },
  { id: '5', name: '人像师', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  { id: '6', name: '城市夜', avatar: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100' },
];

// 标签配置
const TABS = [
  { key: 'following', label: '关注' },
  { key: 'discover', label: '发现' },
  { key: 'featured', label: '精选' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const [activeTab, setActiveTab] = useState('discover');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});

  // 获取照片数据
  const fetchPhotos = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }
    setError(null);

    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：GET /api/v1/photos
       * 返回：{ success: boolean, data: { photos: PhotoItem[], pagination: {...} } }
       */
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('获取照片失败');
      }

      const result = await response.json();
      // API 返回结构：result.data.photos
      setPhotos(result.data?.photos || []);
    } catch (err) {
      console.error('获取照片失败:', err);
      setError(err instanceof Error ? err.message : '获取照片失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchPhotos();
    }, [fetchPhotos])
  );

  // 处理点赞
  const handleLike = async (photoId: number) => {
    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos/:id/like
       */
      await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photoId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchPhotos();
    } catch (error) {
      console.error('点赞失败:', error);
    }
  };

  // 处理收藏
  const handleFavorite = async (photoId: number) => {
    try {
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos/:id/favorite
       */
      await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photoId}/favorite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchPhotos();
    } catch (error) {
      console.error('收藏失败:', error);
    }
  };

  // 计算指示器位置
  const indicatorStyle = useMemo(() => {
    const layout = tabLayouts[activeTab];
    if (!layout) return { left: 0, width: 0 };
    const textWidth = layout.width - 28;
    const left = layout.x + 14;
    return { left, width: textWidth };
  }, [activeTab, tabLayouts]);

  // 渲染 Story 项
  const renderStory = (story: typeof STORIES[0]) => {
    if (story.isAdd) {
      return (
        <TouchableOpacity key={story.id} style={styles.storyItem}>
          <View style={styles.storyAddBtn}>
            <FontAwesome6 name="plus" size={20} color={TEXT_MUTED} />
          </View>
          <Text style={styles.storyName}>{story.name}</Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity key={story.id} style={styles.storyItem}>
        <View style={styles.storyRing}>
          <Image source={{ uri: story.avatar! }} style={styles.storyAvatar} />
        </View>
        <Text style={[styles.storyName, styles.storyNameActive]} numberOfLines={1}>
          {story.name}
        </Text>
      </TouchableOpacity>
    );
  };

  // 渲染标签项
  const renderTab = (tab: typeof TABS[0]) => {
    const isActive = activeTab === tab.key;
    return (
      <TouchableOpacity
        key={tab.key}
        style={styles.tabItem}
        onPress={() => setActiveTab(tab.key)}
        onLayout={(e) => {
          setTabLayouts((prev) => ({
            ...prev,
            [tab.key]: {
              x: e.nativeEvent.layout.x,
              width: e.nativeEvent.layout.width,
            },
          }));
        }}
        activeOpacity={0.8}
      >
        <Text style={isActive ? styles.tabTextActive : styles.tabText}>
          {tab.label}
        </Text>
      </TouchableOpacity>
    );
  };

  // 随机生成图片高度（瀑布流效果）
  const getImageHeight = (index: number) => {
    const heights = [180, 220, 260, 200, 240, 280];
    return heights[index % heights.length];
  };

  // 渲染照片卡片（瀑布流）
  const renderPhotoCard = (photo: PhotoItem, index: number) => {
    const imageHeight = getImageHeight(index);
    
    return (
      <TouchableOpacity
        key={photo.id}
        style={[styles.photoCard, { width: CARD_WIDTH }]}
        activeOpacity={0.9}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: photo.image_url }}
            style={[styles.photoImage, { height: imageHeight }]}
            resizeMode="cover"
          />
          {/* 底部渐变遮罩 */}
          <View style={[styles.photoOverlay, { height: 60 }]}>
            <Text style={styles.photoTitle} numberOfLines={1}>
              {photo.title || '无标题'}
            </Text>
            {photo.location_name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <FontAwesome6 name="location-dot" size={8} color="rgba(255,255,255,0.7)" />
                <Text style={styles.photoLocation} numberOfLines={1}>
                  {photo.location_name}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: photo.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
              style={styles.cardAvatar}
            />
            <Text style={styles.cardUsername} numberOfLines={1}>
              {photo.username || '匿名'}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <TouchableOpacity
                style={styles.cardStat}
                onPress={() => handleLike(photo.id)}
              >
                <FontAwesome6
                  name="heart"
                  size={12}
                  solid={photo.is_liked}
                  color={photo.is_liked ? theme.error : TEXT_MUTED}
                />
                <Text style={styles.cardStatText}>{photo.likes_count || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardStat}
                onPress={() => handleFavorite(photo.id)}
              >
                <FontAwesome6
                  name="bookmark"
                  size={12}
                  solid={photo.is_favorited}
                  color={photo.is_favorited ? KLEIN_BLUE : TEXT_MUTED}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 构建瀑布流数据（双列）
  const masonryData = useMemo(() => {
    const leftColumn: (PhotoItem & { colIndex: number })[] = [];
    const rightColumn: (PhotoItem & { colIndex: number })[] = [];
    
    photos.forEach((photo, index) => {
      if (index % 2 === 0) {
        leftColumn.push({ ...photo, colIndex: index });
      } else {
        rightColumn.push({ ...photo, colIndex: index });
      }
    });

    return { leftColumn, rightColumn };
  }, [photos]);

  // 渲染列表底部
  const renderListFooter = () => (
    <View style={styles.listFooter}>
      <Text style={styles.footerBrand}>同镜</Text>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View style={styles.loadingState}>
          <ActivityIndicator color={KLEIN_BLUE} size="small" />
          <Text style={styles.loadingText}>加载中...</Text>
        </View>
      );
    }

    if (error) {
      return (
        <View style={styles.errorState}>
          <FontAwesome6 name="triangle-exclamation" size={28} color={theme.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchPhotos()}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <FontAwesome6 name="images" size={44} color={TEXT_MUTED} style={styles.emptyIcon} />
        <Text style={styles.emptyText}>暂无作品</Text>
      </View>
    );
  };

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== Stories 横向滚动条 ========== */}
        <View style={styles.storiesSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.storiesScrollContent}
          >
            {STORIES.map(renderStory)}
          </ScrollView>
        </View>

        {/* ========== 标签导航 ========== */}
        <View style={styles.tabsSection}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.tabsScrollContent}
          >
            {TABS.map(renderTab)}
            {/* 底部指示器 */}
            <View
              style={[
                styles.tabIndicator,
                {
                  left: indicatorStyle.left,
                  width: indicatorStyle.width,
                },
              ]}
            />
          </ScrollView>
        </View>

        {/* ========== 双列瀑布流 ========== */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.masonryContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPhotos(true)}
              tintColor={KLEIN_BLUE}
              colors={[KLEIN_BLUE]}
            />
          }
        >
          {loading ? (
            renderEmpty()
          ) : photos.length === 0 ? (
            renderEmpty()
          ) : (
            <View style={styles.masonryRow}>
              {/* 左列 */}
              <View style={styles.masonryColumn}>
                {masonryData.leftColumn.map((photo) => renderPhotoCard(photo, photo.colIndex))}
              </View>
              {/* 右列 */}
              <View style={styles.masonryColumn}>
                {masonryData.rightColumn.map((photo) => renderPhotoCard(photo, photo.colIndex))}
              </View>
            </View>
          )}
          {renderListFooter()}
        </ScrollView>
      </View>
    </Screen>
  );
}
