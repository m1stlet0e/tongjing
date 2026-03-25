import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
  StyleSheet,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles, CHAMPAGNE_GOLD, DEEP_SPACE_BLACK, SOFT_WHITE } from './styles';
import type { Photo } from '@/components/PhotoCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_MARGIN = 20;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_GAP) / 2;

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
  const [photos, setPhotos] = useState<Photo[]>([]);
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
      const response = await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('获取照片失败');
      }

      const data = await response.json();
      setPhotos(data.photos || []);
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
    const textWidth = layout.width - 24; // 减去 padding
    const left = layout.x + 12; // 加上 padding-left
    return { left, width: textWidth };
  }, [activeTab, tabLayouts]);

  // 渲染 Story 项
  const renderStory = (story: typeof STORIES[0]) => {
    if (story.isAdd) {
      return (
        <TouchableOpacity key={story.id} style={styles.storyItem}>
          <View style={styles.storyAddBtn}>
            <FontAwesome6 name="plus" size={20} color="rgba(255,255,255,0.6)" />
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
  const renderPhotoCard = ({ item, index }: { item: Photo; index: number }) => {
    const imageHeight = getImageHeight(index);
    
    return (
      <TouchableOpacity
        style={[styles.photoCard, { width: CARD_WIDTH }]}
        activeOpacity={0.9}
      >
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: item.image_url }}
            style={[styles.photoImage, { height: imageHeight }]}
            resizeMode="cover"
          />
          {/* 底部渐变遮罩 */}
          <View style={[styles.photoOverlay, { height: 60 }]}>
            <Text style={styles.photoTitle} numberOfLines={1}>
              {item.title || '无标题'}
            </Text>
            {item.location_name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <FontAwesome6 name="location-dot" size={8} color="rgba(255,255,255,0.5)" />
                <Text style={styles.photoLocation} numberOfLines={1}>
                  {item.location_name}
                </Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          <View style={styles.cardHeader}>
            <Image
              source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
              style={styles.cardAvatar}
            />
            <Text style={styles.cardUsername} numberOfLines={1}>
              {item.username || '匿名'}
            </Text>
          </View>
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <TouchableOpacity
                style={styles.cardStat}
                onPress={() => handleLike(item.id)}
              >
                <FontAwesome6
                  name="heart"
                  size={12}
                  solid={item.is_liked}
                  color={item.is_liked ? theme.error : 'rgba(255,255,255,0.45)'}
                />
                <Text style={styles.cardStatText}>{item.likes_count || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.cardStat}
                onPress={() => handleFavorite(item.id)}
              >
                <FontAwesome6
                  name="bookmark"
                  size={12}
                  solid={item.is_favorited}
                  color={item.is_favorited ? CHAMPAGNE_GOLD : 'rgba(255,255,255,0.45)'}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

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
          <ActivityIndicator color={CHAMPAGNE_GOLD} size="small" />
          <Text style={styles.loadingText}>加载中</Text>
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
        <FontAwesome6 name="images" size={44} color="rgba(255,255,255,0.15)" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>暂无作品</Text>
      </View>
    );
  };

  // 构建瀑布流数据（双列）
  const masonryData = useMemo(() => {
    const leftColumn: (Photo & { colIndex: number })[] = [];
    const rightColumn: (Photo & { colIndex: number })[] = [];
    
    photos.forEach((photo, index) => {
      if (index % 2 === 0) {
        leftColumn.push({ ...photo, colIndex: index });
      } else {
        rightColumn.push({ ...photo, colIndex: index });
      }
    });

    return { leftColumn, rightColumn };
  }, [photos]);

  return (
    <Screen backgroundColor={DEEP_SPACE_BLACK} statusBarStyle="light">
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
              tintColor={CHAMPAGNE_GOLD}
              colors={[CHAMPAGNE_GOLD]}
            />
          }
        >
          {loading || photos.length === 0 ? (
            renderEmpty()
          ) : (
            <View style={styles.masonryRow}>
              {/* 左列 */}
              <View style={styles.masonryColumn}>
                {masonryData.leftColumn.map((photo) => (
                  <View key={`left-${photo.id}`}>
                    {renderPhotoCard({ item: photo, index: photo.colIndex })}
                  </View>
                ))}
              </View>
              {/* 右列 */}
              <View style={styles.masonryColumn}>
                {masonryData.rightColumn.map((photo) => (
                  <View key={`right-${photo.id}`}>
                    {renderPhotoCard({ item: photo, index: photo.colIndex })}
                  </View>
                ))}
              </View>
            </View>
          )}
          {renderListFooter()}
        </ScrollView>
      </View>
    </Screen>
  );
}
