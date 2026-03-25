import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Modal, Platform, TextInput } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, CARD_WHITE, BORDER_LIGHT } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function MapScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [searchText, setSearchText] = useState('');
  const [bottomSheetVisible, setBottomSheetVisible] = useState(true);
  
  // 模拟热门机位数据
  const hotSpots = useMemo(() => [
    { id: 1, x: 80, y: 150, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100', hot: true },
    { id: 2, x: 200, y: 220, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', hot: false },
    { id: 3, x: 120, y: 320, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100', hot: true },
    { id: 4, x: 260, y: 380, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=100', hot: false },
  ], []);
  
  // 模拟附近机位数据
  const nearbyLocations = useMemo(() => [
    { id: 1, name: '外滩观景台', distance: '2.5km', count: 128, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=100', meta: '城市夜景 · 黄金机位' },
    { id: 2, name: '陆家嘴天桥', distance: '1.8km', count: 256, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=100', meta: '城市建筑 · 长焦推荐' },
    { id: 3, name: '世纪公园', distance: '4.2km', count: 89, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=100', meta: '自然风光 · 日落最佳' },
  ], []);

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== 地图占位 ========== */}
        <View style={styles.mapPlaceholder}>
          <FontAwesome6 name="map" size={48} color={TEXT_MUTED} />
          <Text style={styles.mapPlaceholderText}>地图加载中...</Text>
        </View>
        
        {/* ========== 照片气泡层 ========== */}
        {hotSpots.map((spot) => (
          <TouchableOpacity
            key={spot.id}
            style={[styles.photoBubble, { left: spot.x, top: spot.y }, spot.hot && styles.photoBubbleHot]}
            onPress={() => router.push('/photo-detail', { id: spot.id })}
          >
            <Image source={{ uri: spot.image }} style={styles.photoBubbleImage} />
          </TouchableOpacity>
        ))}

        {/* ========== 顶部悬浮控件 ========== */}
        <View style={styles.topWidgets}>
          {/* AI环境预测条 */}
          <View style={styles.aiPredictBar}>
            <View style={styles.aiPredictIcon}>
              <FontAwesome6 name="cloud-sun" size={16} color="#F59E0B" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.aiPredictText}>
                <Text style={styles.aiPredictHighlight}>黄金时刻</Text> 还有 2h 15min · 今天日落 18:32 · 建议拍摄剪影
              </Text>
            </View>
          </View>
          
          {/* 搜索栏 */}
          <View style={styles.mapSearchBar}>
            <FontAwesome6 name="magnifying-glass" size={16} color={TEXT_MUTED} />
            <TextInput
              style={styles.mapSearchInput}
              placeholder="搜索机位、地址..."
              placeholderTextColor={TEXT_MUTED}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        </View>

        {/* ========== 定位按钮 ========== */}
        <TouchableOpacity style={styles.locateBtn}>
          <FontAwesome6 name="location-crosshairs" size={20} color={KLEIN_BLUE} />
        </TouchableOpacity>

        {/* ========== 底部抽屉面板 ========== */}
        {bottomSheetVisible && (
          <View style={styles.bottomSheet}>
            <View style={styles.bottomSheetHandle} />
            <View style={styles.bottomSheetHeader}>
              <Text style={styles.bottomSheetTitle}>附近热门机位</Text>
              <Text style={styles.bottomSheetCount}>{nearbyLocations.length}个机位</Text>
            </View>
            <ScrollView style={styles.bottomSheetList} showsVerticalScrollIndicator={false}>
              {nearbyLocations.map((loc) => (
                <TouchableOpacity key={loc.id} style={styles.locationCard} onPress={() => router.push('/photo-detail', { id: loc.id })}>
                  <Image source={{ uri: loc.image }} style={styles.locationImage} />
                  <View style={styles.locationInfo}>
                    <Text style={styles.locationName}>{loc.name}</Text>
                    <Text style={styles.locationDistance}>{loc.distance} · {loc.count}张照片</Text>
                    <Text style={styles.locationMeta}>{loc.meta}</Text>
                  </View>
                  <TouchableOpacity style={styles.locationNavigateBtn}>
                    <Text style={styles.locationNavigateBtnText}>导航</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </Screen>
  );
}
