import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useFocusEffect } from 'expo-router';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, CARD_WHITE, BORDER_LIGHT, DARK_BG } from './styles';

export default function ProfileScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ works: 0, favorites: 0, following: 0, followers: 0 });
  const [equipment, setEquipment] = useState<any[]>([]);
  const [recentWorks, setRecentWorks] = useState<any[]>([]);

  // 模拟数据
  const mockUser = useMemo(() => ({
    id: 1,
    username: '光影猎人',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200',
    bio: '城市风光 · 建筑摄影 · 索尼用户',
    level: 'Lv.8 摄影达人',
  }), []);

  const mockStats = useMemo(() => ({ works: 128, favorites: 256, following: 89, followers: 1024 }), []);

  const mockEquipment = useMemo(() => [
    { id: 1, type: 'camera', name: 'Sony A7M4', icon: 'camera' },
    { id: 2, type: 'lens', name: 'FE 24-70mm F2.8 GM', icon: 'aperture' },
    { id: 3, type: 'lens', name: 'FE 50mm F1.4 GM', icon: 'aperture' },
    { id: 4, type: 'tripod', name: 'Gitzo GT3543LS', icon: 'mountain-sun' },
  ], []);

  const mockWorks = useMemo(() => [
    { id: 1, image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200', likes: 89, location: '上海·外滩' },
    { id: 2, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200', likes: 156, location: '杭州·西湖' },
    { id: 3, image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200', likes: 234, location: '北京·故宫' },
    { id: 4, image: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200', likes: 312, location: '西藏·珠峰' },
    { id: 5, image: 'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200', likes: 78, location: '上海·陆家嘴' },
    { id: 6, image: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200', likes: 198, location: '云南·大理' },
  ], []);

  const mockFootprint = useMemo(() => [
    { id: 1, city: '上海', count: 45 },
    { id: 2, city: '杭州', count: 32 },
    { id: 3, city: '北京', count: 28 },
    { id: 4, city: '成都', count: 15 },
    { id: 5, city: '西藏', count: 8 },
  ], []);

  // 获取数据
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    setTimeout(() => {
      setStats(mockStats);
      setEquipment(mockEquipment);
      setRecentWorks(mockWorks);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, [mockStats, mockEquipment, mockWorks]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} tintColor={KLEIN_BLUE} colors={[KLEIN_BLUE]} />
          }
        >
          {/* ========== 头部个人信息 ========== */}
          <View style={styles.headerSection}>
            <View style={styles.headerContent}>
              {/* 左侧：头像 + 信息 */}
              <View style={styles.userInfo}>
                <Image source={{ uri: mockUser.avatar }} style={styles.avatar} />
                <View style={styles.userTextInfo}>
                  <Text style={styles.username}>{mockUser.username}</Text>
                  <Text style={styles.userLevel}>{mockUser.level}</Text>
                  <Text style={styles.userBio}>{mockUser.bio}</Text>
                </View>
              </View>
              {/* 右侧：编辑按钮 */}
              <TouchableOpacity style={styles.editBtn}>
                <FontAwesome6 name="pencil" size={14} color={KLEIN_BLUE} />
                <Text style={styles.editBtnText}>编辑资料</Text>
              </TouchableOpacity>
            </View>
            
            {/* 数据统计 */}
            <View style={styles.statsBar}>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNum}>{stats.works}</Text>
                <Text style={styles.statLabel}>作品</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNum}>{stats.favorites}</Text>
                <Text style={styles.statLabel}>收藏</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNum}>{stats.following}</Text>
                <Text style={styles.statLabel}>关注</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.statItem}>
                <Text style={styles.statNum}>{stats.followers}</Text>
                <Text style={styles.statLabel}>粉丝</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* ========== 装备库 ========== */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>装备库</Text>
              <TouchableOpacity><Text style={styles.sectionMore}>管理</Text></TouchableOpacity>
            </View>
            <View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.equipmentList}>
                {equipment.map((item) => (
                  <View key={item.id} style={styles.equipmentCard}>
                    <View style={styles.equipmentIcon}>
                      <FontAwesome6 name={item.icon} size={20} color={KLEIN_BLUE} />
                    </View>
                    <Text style={styles.equipmentName} numberOfLines={1}>{item.name}</Text>
                  </View>
                ))}
                {/* 添加装备 */}
                <TouchableOpacity style={[styles.equipmentCard, styles.addEquipmentCard]}>
                  <FontAwesome6 name="plus" size={20} color={TEXT_MUTED} />
                  <Text style={[styles.equipmentName, { color: TEXT_MUTED }]}>添加装备</Text>
                </TouchableOpacity>
              </ScrollView>
            </View>
          </View>

          {/* ========== 足迹地图 ========== */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>足迹地图</Text>
              <TouchableOpacity><Text style={styles.sectionMore}>查看全部</Text></TouchableOpacity>
            </View>
            <View style={styles.footprintCard}>
              <View style={styles.footprintMap}>
                <FontAwesome6 name="map-location-dot" size={32} color={TEXT_MUTED} />
                <Text style={styles.footprintMapText}>查看足迹地图</Text>
              </View>
              <View style={styles.footprintCities}>
                <Text style={styles.footprintCitiesTitle}>最近拍摄城市</Text>
                <View style={styles.footprintCityList}>
                  {mockFootprint.slice(0, 5).map((city, index) => (
                    <View key={city.id} style={styles.footprintCityItem}>
                      <Text style={styles.footprintCityIndex}>{index + 1}</Text>
                      <Text style={styles.footprintCityName}>{city.city}</Text>
                      <Text style={styles.footprintCityCount}>{city.count}张</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
          </View>

          {/* ========== 我的作品集 ========== */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>我的作品</Text>
              <TouchableOpacity><Text style={styles.sectionMore}>全部</Text></TouchableOpacity>
            </View>
            <View style={styles.worksGrid}>
              {recentWorks.map((work) => (
                <TouchableOpacity key={work.id} style={styles.workItem} onPress={() => router.push('/photo-detail', { id: work.id })}>
                  <Image source={{ uri: work.image }} style={styles.workImage} />
                  <View style={styles.workOverlay}>
                    <View style={styles.workMeta}>
                      <FontAwesome6 name="heart" size={10} color="#FFFFFF" />
                      <Text style={styles.workLikes}>{work.likes}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}
