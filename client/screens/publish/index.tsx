import React, { useState, useMemo } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, Dimensions, Platform, TextInput, ActivityIndicator } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { useSafeRouter } from '@/hooks/useSafeRouter';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, CARD_WHITE, BORDER_LIGHT, SUCCESS_GREEN } from './styles';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export default function PublishScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  
  // 步骤：'select'选图 -> 'analyzing'AI解析 -> 'edit'编辑 -> 'success'发布成功
  const [step, setStep] = useState<'select' | 'analyzing' | 'edit' | 'success'>('select');
  const [selectedPhotos, setSelectedPhotos] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  
  // 模拟相册照片
  const galleryPhotos = useMemo(() => [
    'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200',
    'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200',
    'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=200',
    'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=200',
    'https://images.unsplash.com/photo-1682687982501-1e58ab814714?w=200',
    'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=200',
  ], []);

  // 模拟EXIF数据
  const exifData = useMemo(() => ({
    camera: 'Sony A7M4',
    lens: 'FE 50mm F1.4 GM',
    focal: '50mm',
    aperture: 'f/1.4',
    shutter: '1/2000s',
    iso: 'ISO 100',
    location: '上海·外滩',
  }), []);

  // 选择照片
  const togglePhoto = (uri: string) => {
    setSelectedPhotos((prev) => (prev.includes(uri) ? prev.filter((u) => u !== uri) : [...prev, uri]));
  };

  // 开始解析
  const startAnalyzing = () => {
    if (selectedPhotos.length === 0) return;
    setStep('analyzing');
    // 模拟AI解析过程
    setTimeout(() => setStep('edit'), 2500);
  };

  // 发布
  const handlePublish = () => {
    setStep('success');
    setTimeout(() => {
      router.replace('/');
    }, 1500);
  };

  // ========== 步骤一：选图区 ==========
  if (step === 'select') {
    return (
      <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
        <View style={styles.container}>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.selectSection}>
            <Text style={styles.sectionTitle}>选择照片</Text>
            <View style={styles.photoGrid}>
              {galleryPhotos.map((uri, index) => {
                const isSelected = selectedPhotos.includes(uri);
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.photoGridItem, styles.photoGridPlaceholder, isSelected && styles.photoGridSelected]}
                    onPress={() => togglePhoto(uri)}
                  >
                    <Image source={{ uri }} style={styles.photoGridImage} />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
          <View style={{ padding: 20, backgroundColor: CARD_WHITE, borderTopWidth: 1, borderTopColor: BORDER_LIGHT }}>
            <TouchableOpacity
              style={[styles.publishBtn, selectedPhotos.length === 0 && { opacity: 0.5 }]}
              onPress={startAnalyzing}
              disabled={selectedPhotos.length === 0}
            >
              <Text style={styles.publishBtnText}>开始解析</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Screen>
    );
  }

  // ========== AI解析动画 ==========
  if (step === 'analyzing') {
    return (
      <Screen backgroundColor={KLEIN_BLUE} statusBarStyle="light">
        <View style={styles.analyzingOverlay}>
          <View style={styles.analyzingContent}>
            <View style={styles.analyzingIcon}>
              <FontAwesome6 name="camera" size={32} color="#FFFFFF" />
            </View>
            <Text style={styles.analyzingTitle}>AI正在解析照片...</Text>
            <Text style={styles.analyzingText}>提取EXIF信息 · 分析拍摄场景</Text>
            <View style={styles.analyzingProgress}>
              <View style={styles.analyzingProgressBar} />
            </View>
          </View>
        </View>
      </Screen>
    );
  }

  // ========== 发布成功 ==========
  if (step === 'success') {
    return (
      <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
        <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: SUCCESS_GREEN, justifyContent: 'center', alignItems: 'center', marginBottom: 20 }}>
              <FontAwesome6 name="check" size={36} color="#FFFFFF" />
            </View>
            <Text style={{ fontSize: 18, fontWeight: '600', color: TEXT_PRIMARY, marginBottom: 8 }}>发布成功</Text>
            <Text style={{ fontSize: 14, color: TEXT_MUTED }}>跳转到首页...</Text>
          </View>
        </View>
      </Screen>
    );
  }

  // ========== 步骤二：编辑区 ==========
  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        <ScrollView style={styles.editContainer} showsVerticalScrollIndicator={false}>
          {/* 预览区 */}
          <View style={styles.previewSection}>
            <Image source={{ uri: selectedPhotos[0] }} style={styles.previewImage} resizeMode="cover" />
            <View style={styles.previewToolbar}>
              <TouchableOpacity style={styles.previewToolBtn}>
                <FontAwesome6 name="crop" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewToolBtn}>
                <FontAwesome6 name="wand-magic-sparkles" size={16} color="#FFFFFF" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.previewToolBtn}>
                <FontAwesome6 name="filter" size={16} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>

          {/* 信息卡片区 */}
          <View style={styles.infoSection}>
            {/* 文案输入 */}
            <View style={styles.captionCard}>
              <View style={styles.captionHeader}>
                <Text style={styles.captionLabel}>文案</Text>
                <TouchableOpacity style={styles.aiWriteBtn}>
                  <FontAwesome6 name="robot" size={10} color={KLEIN_BLUE} />
                  <Text style={styles.aiWriteBtnText}>AI撰写</Text>
                </TouchableOpacity>
              </View>
              <TextInput
                style={styles.captionInput}
                placeholder="分享你的拍摄心得..."
                placeholderTextColor={TEXT_MUTED}
                value={caption}
                onChangeText={setCaption}
                multiline
              />
            </View>

            {/* EXIF参数区 */}
            <View style={styles.exifCard}>
              <View style={styles.exifHeader}>
                <Text style={styles.exifTitle}>拍摄参数</Text>
                <TouchableOpacity><Text style={styles.exifEditBtn}>编辑</Text></TouchableOpacity>
              </View>
              <View style={styles.exifGrid}>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>相机</Text>
                  <Text style={styles.exifValue}>{exifData.camera}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>镜头</Text>
                  <Text style={styles.exifValue}>{exifData.lens}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>焦段</Text>
                  <Text style={styles.exifValue}>{exifData.focal}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>光圈</Text>
                  <Text style={styles.exifValue}>{exifData.aperture}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>快门</Text>
                  <Text style={styles.exifValue}>{exifData.shutter}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>ISO</Text>
                  <Text style={styles.exifValue}>{exifData.iso}</Text>
                </View>
              </View>
            </View>

            {/* 位置打卡区 */}
            <View style={styles.locationCard}>
              <View style={styles.locationHeader}>
                <FontAwesome6 name="location-dot" size={16} color={KLEIN_BLUE} />
                <Text style={styles.locationTitle}>机位打卡</Text>
              </View>
              <View style={styles.locationMiniMap}>
                <Text style={styles.locationMiniMapText}>点击选择机位</Text>
              </View>
              <View style={styles.locationName}>
                <FontAwesome6 name="map-pin" size={12} color={TEXT_MUTED} />
                <Text style={styles.locationNameText}>{exifData.location}</Text>
              </View>
            </View>
          </View>
        </ScrollView>

        {/* 底部操作区 */}
        <View style={styles.footerActions}>
          <TouchableOpacity style={styles.draftBtn}>
            <Text style={styles.draftBtnText}>存草稿</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.publishBtn} onPress={handlePublish}>
            <FontAwesome6 name="paper-plane" size={16} color="#FFFFFF" />
            <Text style={styles.publishBtnText}>发布</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Screen>
  );
}
