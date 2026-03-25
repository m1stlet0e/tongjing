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
  Modal,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY, BORDER_LIGHT } from './styles';

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
  camera_model: string;
  focal_length: string;
  aperture: string;
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
];

// 标签配置
const TABS = [
  { key: 'following', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'latest', label: '最新' },
];

// 筛选器选项
const FILTER_DEVICES = ['全部设备', 'Sony A7M4', 'Canon R5', 'Nikon Z8', '富士 X-T5'];
const FILTER_STYLES = ['全部风格', '长曝光', '大光圈', '黑白', 'HDR'];
const FILTER_SCENES = ['全部场景', '城市', '人像', '风光', '街拍', '星空'];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  
  const [activeTab, setActiveTab] = useState('recommend');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
  
  // 筛选器状态
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState('全部设备');
  const [selectedStyle, setSelectedStyle] = useState('全部风格');
  const [selectedScene, setSelectedScene] = useState('全部场景');

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
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) throw new Error('获取照片失败');

      const result = await response.json();
      setPhotos(result.data?.photos || []);
    } catch (err) {
      console.error('获取照片失败:', err);
      setError(err instanceof Error ? err.message : '获取照片失败');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { fetchPhotos(); }, [fetchPhotos]));

  // 处理点赞
  const handleLike = async (photoId: number) => {
    try {
      await fetch(`${process.env.EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos/${photoId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
        headers: { 'Content-Type': 'application/json' },
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
    const textWidth = layout.width - 32;
    const left = layout.x + 16;
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
        <Text style={[styles.storyName, styles.storyNameActive]} numberOfLines={1}>{story.name}</Text>
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
            [tab.key]: { x: e.nativeEvent.layout.x, width: e.nativeEvent.layout.width },
          }));
        }}
        activeOpacity={0.8}
      >
        <Text style={isActive ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
      </TouchableOpacity>
    );
  };

  // 随机生成图片高度（瀑布流效果）
  const getImageHeight = (index: number) => {
    const heights = [180, 220, 260, 200, 240, 280];
    return heights[index % heights.length];
  };

  // 模拟距离
  const getDistance = (index: number) => {
    const distances = ['2.5km', '1.2km', '5.8km', '800m', '3.4km', '12km'];
    return distances[index % distances.length];
  };

  // 渲染照片卡片
  const renderPhotoCard = (photo: PhotoItem, index: number) => {
    const imageHeight = getImageHeight(index);
    const distance = getDistance(index);
    
    return (
      <TouchableOpacity key={photo.id} style={[styles.photoCard, { width: CARD_WIDTH }]} activeOpacity={0.9}>
        <View style={{ position: 'relative' }}>
          <Image source={{ uri: photo.image_url }} style={[styles.photoImage, { height: imageHeight }]} resizeMode="cover" />
          <View style={[styles.photoOverlay, { height: 60 }]}>
            <Text style={styles.photoTitle} numberOfLines={1}>{photo.title || '无标题'}</Text>
            {photo.location_name && (
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 3 }}>
                <FontAwesome6 name="location-dot" size={8} color="rgba(255,255,255,0.7)" />
                <Text style={styles.photoLocation} numberOfLines={1}>{photo.location_name}</Text>
              </View>
            )}
          </View>
        </View>

        <View style={styles.cardContent}>
          {/* EXIF 信息 */}
          <View style={styles.cardExif}>
            <FontAwesome6 name="camera" size={9} color={TEXT_MUTED} />
            <Text style={styles.cardExifText}>{photo.camera_model || 'A7M4'}</Text>
            <Text style={styles.cardExifText}>|</Text>
            <Text style={styles.cardExifText}>{photo.focal_length || '50mm'}</Text>
            <Text style={styles.cardExifText}>|</Text>
            <Text style={styles.cardExifText}>{photo.aperture || 'f/1.4'}</Text>
          </View>
          
          <View style={styles.cardHeader}>
            <Image source={{ uri: photo.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }} style={styles.cardAvatar} />
            <Text style={styles.cardUsername} numberOfLines={1}>{photo.username || '匿名'}</Text>
            <View style={styles.cardDistance}>
              <FontAwesome6 name="location-arrow" size={8} color={KLEIN_BLUE} />
              <Text style={styles.cardDistanceText}>{distance}</Text>
            </View>
          </View>
          
          <View style={styles.cardFooter}>
            <View style={styles.cardStats}>
              <TouchableOpacity style={styles.cardStat} onPress={() => handleLike(photo.id)}>
                <FontAwesome6 name="heart" size={12} solid={photo.is_liked} color={photo.is_liked ? theme.error : TEXT_MUTED} />
                <Text style={styles.cardStatText}>{photo.likes_count || 0}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cardStat} onPress={() => handleFavorite(photo.id)}>
                <FontAwesome6 name="bookmark" size={12} solid={photo.is_favorited} color={photo.is_favorited ? KLEIN_BLUE : TEXT_MUTED} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  // 构建瀑布流数据
  const masonryData = useMemo(() => {
    const leftColumn: (PhotoItem & { colIndex: number })[] = [];
    const rightColumn: (PhotoItem & { colIndex: number })[] = [];
    photos.forEach((photo, index) => {
      if (index % 2 === 0) leftColumn.push({ ...photo, colIndex: index });
      else rightColumn.push({ ...photo, colIndex: index });
    });
    return { leftColumn, rightColumn };
  }, [photos]);

  // 渲染筛选器选项
  const renderFilterOptions = (options: string[], selected: string, onSelect: (v: string) => void) => (
    <View style={styles.filterOptions}>
      {options.map((option) => {
        const isActive = selected === option;
        return (
          <TouchableOpacity
            key={option}
            style={[styles.filterOption, isActive && styles.filterOptionActive]}
            onPress={() => onSelect(option)}
          >
            <Text style={[styles.filterOptionText, isActive && styles.filterOptionTextActive]}>{option}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== 顶部导航栏 ========== */}
        <View style={styles.topNav}>
          <Text style={styles.brandText}>同镜</Text>
          <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
            <FontAwesome6 name="sliders" size={14} color={TEXT_SECONDARY} />
            <Text style={styles.filterBtnText}>筛选</Text>
          </TouchableOpacity>
        </View>

        {/* ========== Stories ========== */}
        <View style={styles.storiesSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.storiesScrollContent}>
            {STORIES.map(renderStory)}
          </ScrollView>
        </View>

        {/* ========== 标签导航 ========== */}
        <View style={styles.tabsSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.tabsScrollContent}>
            {TABS.map(renderTab)}
            <View style={[styles.tabIndicator, { left: indicatorStyle.left, width: indicatorStyle.width }]} />
          </ScrollView>
        </View>

        {/* ========== 瀑布流 ========== */}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={styles.masonryContainer}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchPhotos(true)} tintColor={KLEIN_BLUE} colors={[KLEIN_BLUE]} />
          }
        >
          {loading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={KLEIN_BLUE} size="small" />
              <Text style={styles.loadingText}>加载中...</Text>
            </View>
          ) : photos.length === 0 ? (
            <View style={styles.emptyState}>
              <FontAwesome6 name="images" size={44} color={TEXT_MUTED} style={styles.emptyIcon} />
              <Text style={styles.emptyText}>暂无作品</Text>
            </View>
          ) : (
            <View style={styles.masonryRow}>
              <View style={styles.masonryColumn}>
                {masonryData.leftColumn.map((photo) => renderPhotoCard(photo, photo.colIndex))}
              </View>
              <View style={styles.masonryColumn}>
                {masonryData.rightColumn.map((photo) => renderPhotoCard(photo, photo.colIndex))}
              </View>
            </View>
          )}
          <View style={styles.listFooter}>
            <Text style={styles.footerBrand}>同镜</Text>
          </View>
        </ScrollView>

        {/* ========== 硬核筛选器面板 ========== */}
        <Modal visible={filterVisible} transparent animationType="fade" onRequestClose={() => setFilterVisible(false)}>
          <TouchableOpacity style={styles.filterPanel} activeOpacity={1} onPress={() => setFilterVisible(false)}>
            <View style={styles.filterPanelContent}>
              <Text style={styles.filterPanelTitle}>硬核筛选器</Text>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>设备</Text>
                {renderFilterOptions(FILTER_DEVICES, selectedDevice, setSelectedDevice)}
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>风格</Text>
                {renderFilterOptions(FILTER_STYLES, selectedStyle, setSelectedStyle)}
              </View>
              
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>场景</Text>
                {renderFilterOptions(FILTER_SCENES, selectedScene, setSelectedScene)}
              </View>
              
              <TouchableOpacity style={styles.filterApplyBtn} onPress={() => setFilterVisible(false)}>
                <Text style={styles.filterApplyBtnText}>应用筛选</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Screen>
  );
}
