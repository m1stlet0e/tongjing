import React, { useState, useEffect, useMemo, useCallback } from 'react';
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
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, DEEP_SPACE_BLACK } from './styles';
import type { Photo } from '@/components/PhotoCard';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// 标签配置
const TABS = [
  { key: 'featured', label: '精选', icon: 'star' },
  { key: 'following', label: '关注', icon: 'user-group' },
  { key: 'trending', label: '热门', icon: 'fire' },
  { key: 'latest', label: '最新', icon: 'clock' },
  { key: 'landscape', label: '风光', icon: 'mountain-sun' },
  { key: 'portrait', label: '人像', icon: 'user' },
  { key: 'street', label: '街拍', icon: 'road' },
];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const [activeTab, setActiveTab] = useState('featured');
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: number }>({});
  const [indicatorLeft, setIndicatorLeft] = useState(0);
  const [indicatorWidth, setIndicatorWidth] = useState(0);

  // 计算指示器位置
  useEffect(() => {
    if (tabLayouts[activeTab]) {
      setIndicatorLeft(tabLayouts[activeTab]);
      setIndicatorWidth(60); // 固定宽度
    }
  }, [activeTab, tabLayouts]);

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
            [tab.key]: e.nativeEvent.layout.x,
          }));
        }}
        activeOpacity={0.8}
      >
        <View style={styles.tabContent}>
          <FontAwesome6
            name={tab.icon}
            size={12}
            color={isActive ? CHAMPAGNE_GOLD : 'rgba(255,255,255,0.4)'}
            solid={isActive}
          />
          <Text style={isActive ? styles.tabTextActive : styles.tabText}>
            {tab.label}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // 渲染照片卡片
  const renderPhotoCard = ({ item }: { item: Photo }) => (
    <TouchableOpacity
      style={styles.photoCard}
      activeOpacity={0.9}
    >
      <View>
        <Image source={{ uri: item.image_url }} style={styles.photoImage} resizeMode="cover" />
        <View style={styles.photoExifBar}>
          <View style={styles.exifRow}>
            <View style={styles.exifItem}>
              <FontAwesome6 name="camera" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.exifText}>{item.camera_model || '未知'}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="circle-dot" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.exifText}>{item.aperture || 'f/2.8'}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="clock" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.exifText}>{item.shutter_speed || '1/125'}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="film" size={10} color="rgba(255,255,255,0.7)" />
              <Text style={styles.exifText}>ISO {item.iso || 400}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.cardContent}>
        <View style={styles.cardHeader}>
          <Image
            source={{ uri: item.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
            style={styles.cardAvatar}
          />
          <View style={styles.cardUserInfo}>
            <Text style={styles.cardUsername}>{item.username || '匿名摄影师'}</Text>
            <Text style={styles.cardLocation}>{item.location_name || '未知地点'}</Text>
          </View>
        </View>

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.title || '无标题'}
        </Text>

        {item.description && (
          <Text style={styles.cardDescription} numberOfLines={2}>
            {item.description}
          </Text>
        )}

        {item.tags && item.tags.length > 0 && (
          <View style={styles.cardTags}>
            {item.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.cardTag}>
                <Text style={styles.cardTagText}>#{tag.tag_name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.cardFooter}>
          <View style={styles.cardStats}>
            <TouchableOpacity
              style={styles.cardStat}
              onPress={() => handleLike(item.id)}
            >
              <FontAwesome6
                name={item.is_liked ? 'heart' : 'heart'}
                size={16}
                solid={item.is_liked}
                color={item.is_liked ? theme.error : 'rgba(255,255,255,0.5)'}
              />
              <Text style={styles.cardStatText}>{item.likes_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.cardStat}>
              <FontAwesome6 name="comment" size={16} color="rgba(255,255,255,0.5)" />
              <Text style={styles.cardStatText}>{item.comments_count || 0}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cardStat}
              onPress={() => handleFavorite(item.id)}
            >
              <FontAwesome6
                name={item.is_favorited ? 'bookmark' : 'bookmark'}
                size={16}
                solid={item.is_favorited}
                color={item.is_favorited ? CHAMPAGNE_GOLD : 'rgba(255,255,255,0.5)'}
              />
              <Text style={styles.cardStatText}>{item.favorites_count || 0}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.cardShare}>
            <FontAwesome6 name="share-nodes" size={16} color="rgba(255,255,255,0.5)" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染列表头部
  const renderListHeader = () => (
    <View style={styles.listHeader}>
      <View style={styles.listHeaderLeft}>
        <Text style={styles.listHeaderCount}>{photos.length}</Text>
        <Text style={styles.listHeaderLabel}>张作品</Text>
      </View>
      <TouchableOpacity style={styles.filterButton}>
        <FontAwesome6 name="sliders" size={12} color={CHAMPAGNE_GOLD} />
        <Text style={styles.filterButtonText}>筛选</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染列表底部
  const renderListFooter = () => (
    <View style={styles.listFooter}>
      <Text style={styles.footerBrand}>同镜</Text>
      <View style={styles.footerLine} />
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
          <FontAwesome6 name="triangle-exclamation" size={32} color={theme.error} />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={() => fetchPhotos()}>
            <Text style={styles.retryButtonText}>重试</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.emptyState}>
        <FontAwesome6 name="images" size={48} color="rgba(255,255,255,0.2)" style={styles.emptyIcon} />
        <Text style={styles.emptyText}>暂无作品</Text>
      </View>
    );
  };

  return (
    <Screen backgroundColor={DEEP_SPACE_BLACK} statusBarStyle="light">
      <View style={styles.container}>
        {/* ========== 克莱因蓝头部 ========== */}
        <View style={styles.kleinHeader}>
          <View style={styles.brandRow}>
            <Text style={styles.brandName}>同镜</Text>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.headerIcon}>
                <FontAwesome6 name="bell" size={18} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.headerIcon}>
                <FontAwesome6 name="magnifying-glass" size={18} color="rgba(255,255,255,0.9)" />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.goldDivider} />
          <Text style={styles.headerSubtitle}>用镜头看见世界</Text>
        </View>

        {/* ========== 杂志风标签导航 ========== */}
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
                  left: indicatorLeft,
                  width: indicatorWidth,
                },
              ]}
            />
          </ScrollView>
        </View>

        {/* ========== 照片列表 ========== */}
        <FlatList
          data={photos}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderPhotoCard}
          ListHeaderComponent={renderListHeader}
          ListFooterComponent={renderListFooter}
          ListEmptyComponent={renderEmpty}
          contentContainerStyle={styles.listSection}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => fetchPhotos(true)}
              tintColor={CHAMPAGNE_GOLD}
              colors={[CHAMPAGNE_GOLD]}
            />
          }
          showsVerticalScrollIndicator={false}
        />
      </View>
    </Screen>
  );
}
