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
  TextInput,
  Modal,
  Keyboard,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY, BORDER_LIGHT, CARD_WHITE } from './styles';

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
  shutter_speed: string;
  iso: number;
  username: string;
  avatar_url: string;
  likes_count: number;
  comments_count: number;
  favorites_count: number;
  tags: { tag_name: string; tag_type: string }[];
  is_liked: boolean;
  is_favorited: boolean;
}

// 标签配置
const TABS = [
  { key: 'following', label: '关注' },
  { key: 'recommend', label: '推荐' },
  { key: 'latest', label: '最新' },
];

// 筛选器选项
const FILTER_BRANDS = ['全部品牌', 'Sony', 'Canon', 'Nikon', '富士', 'Leica'];
const FILTER_FOCAL = ['全部焦段', '广角(≤35mm)', '标准(35-85mm)', '长焦(≥85mm)'];
const FILTER_APERTURE = ['全部光圈', '大光圈(≤f/2.8)', '中光圈(f/4-8)', '小光圈(≥f/11)'];
const FILTER_SCENES = ['全部题材', '人像', '风光', '街拍', '建筑', '星空', '夜景'];

export default function HomeScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  
  const [activeTab, setActiveTab] = useState('recommend');
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tabLayouts, setTabLayouts] = useState<{ [key: string]: { x: number; width: number } }>({});
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState('全部品牌');
  const [selectedFocal, setSelectedFocal] = useState('全部焦段');
  const [selectedAperture, setSelectedAperture] = useState('全部光圈');
  const [selectedScene, setSelectedScene] = useState('全部题材');

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

  // 计算指示器位置
  const indicatorStyle = useMemo(() => {
    const layout = tabLayouts[activeTab];
    if (!layout) return { left: 0, width: 0 };
    const textWidth = layout.width - 32;
    const left = layout.x + 16;
    return { left, width: textWidth };
  }, [activeTab, tabLayouts]);

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

  // 随机生成图片高度
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
      <TouchableOpacity
        key={photo.id}
        style={[styles.photoCard, { width: CARD_WIDTH }]}
        activeOpacity={0.9}
        onPress={() => router.push('/photo-detail', { id: photo.id })}
      >
        <Image source={{ uri: photo.image_url }} style={[styles.photoImage, { height: imageHeight }]} resizeMode="cover" />
        <View style={styles.cardContent}>
          {/* 第一行：头像 + 标题 */}
          <View style={styles.cardFirstRow}>
            <Image
              source={{ uri: photo.avatar_url || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100' }}
              style={styles.cardAvatar}
            />
            <Text style={styles.cardTitle} numberOfLines={1}>{photo.title || '无标题'}</Text>
          </View>
          {/* 第二行：硬核参数条 */}
          <View style={styles.cardSecondRow}>
            <FontAwesome6 name="camera" size={8} color={KLEIN_BLUE} />
            <Text style={styles.cardExifText}>{photo.camera_model || 'A7M4'}</Text>
            <Text style={styles.cardExifText}>|</Text>
            <Text style={styles.cardExifText}>{photo.focal_length || '50mm'}</Text>
            <Text style={styles.cardExifText}>|</Text>
            <FontAwesome6 name="location-arrow" size={8} color={KLEIN_BLUE} />
            <Text style={styles.cardDistanceText}>{distance}</Text>
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

  // 重置筛选器
  const resetFilters = () => {
    setSelectedBrand('全部品牌');
    setSelectedFocal('全部焦段');
    setSelectedAperture('全部光圈');
    setSelectedScene('全部题材');
  };

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== 顶部搜索栏 ========== */}
        <View style={styles.searchHeader}>
          <View style={styles.searchRow}>
            <View style={styles.searchBox}>
              <FontAwesome6 name="magnifying-glass" size={16} color={TEXT_MUTED} />
              <TextInput
                style={styles.searchInput}
                placeholder="搜索照片、机位、摄影师..."
                placeholderTextColor={TEXT_MUTED}
                value={searchText}
                onChangeText={setSearchText}
                returnKeyType="search"
              />
            </View>
            <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
              <FontAwesome6 name="sliders" size={18} color={TEXT_SECONDARY} />
            </TouchableOpacity>
          </View>
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

        {/* ========== 硬核筛选器侧边栏 ========== */}
        <Modal visible={filterVisible} transparent animationType="slide" onRequestClose={() => setFilterVisible(false)}>
          <TouchableOpacity style={styles.filterOverlay} activeOpacity={1} onPress={() => setFilterVisible(false)}>
            <View style={styles.filterSidebar}>
              {/* 头部 */}
              <View style={styles.filterHeader}>
                <Text style={styles.filterTitle}>高级筛选</Text>
                <TouchableOpacity style={styles.filterCloseBtn} onPress={() => setFilterVisible(false)}>
                  <FontAwesome6 name="xmark" size={16} color={TEXT_SECONDARY} />
                </TouchableOpacity>
              </View>
              
              {/* 筛选内容 */}
              <ScrollView style={styles.filterScroll} contentContainerStyle={styles.filterScrollContent}>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>相机品牌</Text>
                  {renderFilterOptions(FILTER_BRANDS, selectedBrand, setSelectedBrand)}
                </View>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>焦段</Text>
                  {renderFilterOptions(FILTER_FOCAL, selectedFocal, setSelectedFocal)}
                </View>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>光圈</Text>
                  {renderFilterOptions(FILTER_APERTURE, selectedAperture, setSelectedAperture)}
                </View>
                <View style={styles.filterSection}>
                  <Text style={styles.filterSectionTitle}>拍摄题材</Text>
                  {renderFilterOptions(FILTER_SCENES, selectedScene, setSelectedScene)}
                </View>
              </ScrollView>
              
              {/* 底部按钮 */}
              <View style={styles.filterFooter}>
                <TouchableOpacity style={styles.filterResetBtn} onPress={resetFilters}>
                  <Text style={styles.filterResetBtnText}>重置</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.filterApplyBtn} onPress={() => setFilterVisible(false)}>
                  <Text style={styles.filterApplyBtnText}>应用筛选</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        </Modal>
      </View>
    </Screen>
  );
}
