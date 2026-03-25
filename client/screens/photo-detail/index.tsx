import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, CARD_WHITE, BORDER_LIGHT, DARK_BG } from './styles';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function PhotoDetailScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [isLiked, setIsLiked] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // 模拟数据
  const photo = useMemo(() => ({
    id: 1,
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
    title: '魔都天际线',
    description: '黄昏时分的陆家嘴，天空被染成了金黄色。使用长焦镜头压缩空间感，突出了建筑的线条美。',
    author: {
      name: '光影猎人',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      bio: '城市风光摄影 · 索尼用户',
    },
    exif: {
      camera: 'Sony A7M4',
      lens: 'FE 70-200mm F2.8 GM',
      focal: '135mm',
      aperture: 'f/8',
      shutter: '1/500s',
      iso: 'ISO 200',
    },
    location: '上海·外滩观景台',
    distance: '2.5km',
    tips: '黄金时刻（日落前1小时）是拍摄最佳时机，建议使用三脚架，F8-F11光圈保证景深，ISO 100-400。',
    tags: ['城市风光', '日落', '长焦', '上海'],
    likes: 89,
    comments: 12,
  }), []);

  return (
    <Screen backgroundColor={DARK_BG} statusBarStyle="light">
      <View style={styles.container}>
        {/* ========== 上半屏：全屏大图 ========== */}
        <View style={styles.imageSection}>
          <Image source={{ uri: photo.image }} style={styles.fullImage} resizeMode="cover" />
          
          {/* 顶部操作栏 */}
          <View style={styles.imageOverlay}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <FontAwesome6 name="chevron-left" size={18} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={styles.imageActions}>
              <TouchableOpacity style={styles.imageActionBtn}>
                <FontAwesome6 name="share-nodes" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.imageActionBtn} onPress={() => setIsFavorited(!isFavorited)}>
                <FontAwesome6 name={isFavorited ? 'bookmark' : 'bookmark'} size={16} color={isFavorited ? KLEIN_BLUE : '#FFFFFF'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ========== 下半屏：滑动面板 ========== */}
        <View style={styles.detailPanel}>
          <View style={styles.panelHandle} />
          <ScrollView style={styles.panelScroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.panelContent}>
            {/* 作者与文案区 */}
            <View style={styles.authorSection}>
              <Image source={{ uri: photo.author.avatar }} style={styles.authorAvatar} />
              <View style={styles.authorInfo}>
                <Text style={styles.authorName}>{photo.author.name}</Text>
                <Text style={styles.authorMeta}>{photo.author.bio}</Text>
              </View>
              <TouchableOpacity style={styles.followBtn}>
                <Text style={styles.followBtnText}>关注</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.photoTitle}>{photo.title}</Text>
            <Text style={styles.photoDescription}>{photo.description}</Text>

            {/* 拍摄Tips */}
            <View style={styles.tipsCard}>
              <View style={styles.tipsHeader}>
                <FontAwesome6 name="lightbulb" size={14} color="#F59E0B" />
                <Text style={styles.tipsTitle}>拍摄心得</Text>
              </View>
              <Text style={styles.tipsContent}>{photo.tips}</Text>
            </View>

            {/* EXIF参数仪表盘 */}
            <View style={styles.exifDashboard}>
              <Text style={styles.exifDashboardTitle}>拍摄参数</Text>
              <View style={styles.exifGrid}>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="camera" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>相机</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.camera}</Text>
                </View>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="camera" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>镜头</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.lens}</Text>
                </View>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="crosshairs" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>焦段</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.focal}</Text>
                </View>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="circle-dot" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>光圈</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.aperture}</Text>
                </View>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="clock" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>快门</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.shutter}</Text>
                </View>
                <View style={styles.exifGridItem}>
                  <View style={styles.exifGridIcon}>
                    <FontAwesome6 name="sun" size={16} color={KLEIN_BLUE} />
                  </View>
                  <Text style={styles.exifGridLabel}>ISO</Text>
                  <Text style={styles.exifGridValue}>{photo.exif.iso}</Text>
                </View>
              </View>
            </View>

            {/* 机位地图卡片 */}
            <View style={styles.locationCard}>
              <View style={styles.locationMiniMap}>
                <FontAwesome6 name="map-location-dot" size={24} color={TEXT_MUTED} />
                <Text style={styles.locationMiniMapText}>点击查看地图</Text>
              </View>
              <View style={styles.locationInfo}>
                <View style={styles.locationName}>
                  <FontAwesome6 name="location-dot" size={14} color={KLEIN_BLUE} />
                  <Text style={styles.locationNameText}>{photo.location}</Text>
                </View>
                <TouchableOpacity style={styles.navigateBtn}>
                  <FontAwesome6 name="route" size={12} color="#FFFFFF" />
                  <Text style={styles.navigateBtnText}>导航前往</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* 标签 */}
            <View style={styles.tagsRow}>
              {photo.tags.map((tag, index) => (
                <View key={index} style={styles.tag}>
                  <Text style={styles.tagText}>#{tag}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* ========== 底部悬浮操作栏 ========== */}
          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.statBtn} onPress={() => setIsLiked(!isLiked)}>
              <FontAwesome6 name={isLiked ? 'heart' : 'heart'} size={22} color={isLiked ? '#FF4D67' : TEXT_SECONDARY} style={styles.statBtnIcon} solid={isLiked} />
              <Text style={styles.statBtnText}>{photo.likes + (isLiked ? 1 : 0)}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statBtn}>
              <FontAwesome6 name="comment" size={22} color={TEXT_SECONDARY} style={styles.statBtnIcon} />
              <Text style={styles.statBtnText}>{photo.comments}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.planBtn}>
              <FontAwesome6 name="calendar-plus" size={16} color="#FFFFFF" />
              <Text style={styles.planBtnText}>创建拍摄计划</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Screen>
  );
}
