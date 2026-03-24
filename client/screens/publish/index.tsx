import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system/legacy';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';
import { apiPost, getStoredToken } from '@/utils/api';
import { createFormDataFile } from '@/utils';

const SCENES = ['夜景', '人像', '建筑', '街拍', '风光', '星空'];
const STYLES = ['长曝光', '大光圈', '黑白', '胶片'];

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

interface ExifData {
  camera_brand: string;
  camera_model: string;
  lens_model: string | null;
  focal_length: string | null;
  aperture: string | null;
  shutter_speed: string | null;
  iso: number | null;
  latitude: number | null;
  longitude: number | null;
}

export default function PublishScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tips, setTips] = useState('');
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [exifData, setExifData] = useState<ExifData | null>(null);

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('提示', '需要相册权限才能选择照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 1, // 保持原始质量
    });

    if (!result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setImageUri(asset.uri);
      setImageUrl(null); // 重置上传后的 URL
      
      // 提取 EXIF 数据
      extractExif(asset.uri);
    }
  };

  // 从图片提取 EXIF 数据（通过后端处理）
  const extractExif = async (uri: string) => {
    // EXIF 提取将在上传时由后端处理
    // 这里先设置默认值
    setExifData({
      camera_brand: 'Unknown',
      camera_model: 'Unknown',
      lens_model: null,
      focal_length: null,
      aperture: null,
      shutter_speed: null,
      iso: null,
      latitude: null,
      longitude: null,
    });
  };

  // 上传图片到对象存储
  const uploadImage = async (): Promise<{ url: string; exif: ExifData } | null> => {
    if (!imageUri) return null;

    try {
      setUploading(true);

      const token = await getStoredToken();
      const formData = new FormData();
      
      // 使用 createFormDataFile 创建跨平台兼容的文件对象
      const fileName = `photo_${Date.now()}.jpg`;
      const file = await createFormDataFile(imageUri, fileName, 'image/jpeg');
      formData.append('file', file as any);

      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/upload/image`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      const result = await response.json();
      
      if (result.success && result.data.url) {
        setImageUrl(result.data.url);
        // 使用后端返回的 EXIF 数据
        if (result.data.exif) {
          const backendExif = result.data.exif;
          setExifData({
            camera_brand: backendExif.camera_brand || 'Unknown',
            camera_model: backendExif.camera_model || 'Unknown',
            lens_model: backendExif.lens_model,
            focal_length: backendExif.focal_length,
            aperture: backendExif.aperture,
            shutter_speed: backendExif.shutter_speed,
            iso: backendExif.iso,
            latitude: backendExif.latitude,
            longitude: backendExif.longitude,
          });
        }
        return { url: result.data.url, exif: result.data.exif };
      } else {
        throw new Error(result.error || '上传失败');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      Alert.alert('错误', '图片上传失败，请重试');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const toggleTag = (tag: string, selected: string[], setSelected: (tags: string[]) => void) => {
    if (selected.includes(tag)) {
      setSelected(selected.filter(t => t !== tag));
    } else {
      setSelected([...selected, tag]);
    }
  };

  const handlePublish = async () => {
    if (!imageUri) {
      Alert.alert('提示', '请选择一张照片');
      return;
    }
    if (!title.trim()) {
      Alert.alert('提示', '请输入标题');
      return;
    }

    try {
      setLoading(true);

      // 1. 先上传图片
      let finalImageUrl = imageUrl;
      let finalExif = exifData;
      
      if (!finalImageUrl) {
        const uploadResult = await uploadImage();
        if (!uploadResult) {
          setLoading(false);
          return;
        }
        finalImageUrl = uploadResult.url;
        finalExif = uploadResult.exif;
      }

      // 2. 构建标签数组
      const tags = [
        ...selectedScenes.map(name => ({ name, type: 'scene' })),
        ...selectedStyles.map(name => ({ name, type: 'style' })),
      ];

      // 3. 发布照片
      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos
       * Body 参数：image_url: string, title: string, description?: string, shooting_tips?: string, tags?: array
       * 需要登录：是
       */
      const response = await apiPost('/api/v1/photos', {
        image_url: finalImageUrl,
        title,
        description,
        shooting_tips: tips,
        location_name: location,
        tags,
        exif_data: finalExif ? {
          camera_brand: finalExif.camera_brand,
          camera_model: finalExif.camera_model,
          lens_model: finalExif.lens_model,
          focal_length: finalExif.focal_length,
          aperture: finalExif.aperture,
          shutter_speed: finalExif.shutter_speed,
          iso: finalExif.iso,
        } : undefined,
        latitude: finalExif?.latitude,
        longitude: finalExif?.longitude,
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('成功', '照片发布成功！');
        // 重置表单
        setImageUri(null);
        setImageUrl(null);
        setTitle('');
        setDescription('');
        setLocation('');
        setTips('');
        setSelectedScenes([]);
        setSelectedStyles([]);
        setExifData(null);
      } else if (response.status === 401) {
        Alert.alert('提示', '请先登录');
      } else {
        Alert.alert('错误', result.error || '发布失败，请重试');
      }
    } catch (error) {
      console.error('Error publishing photo:', error);
      Alert.alert('错误', '发布失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen backgroundColor={theme.backgroundRoot} statusBarStyle={isDark ? 'light' : 'dark'}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>发布作品</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>选择照片</Text>
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage} disabled={uploading}>
            {imageUri ? (
              <View style={{ position: 'relative' }}>
                <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
                {uploading && (
                  <View style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    <ActivityIndicator size="large" color="#FFFFFF" />
                    <Text style={{ color: '#FFFFFF', marginTop: 8 }}>上传中...</Text>
                  </View>
                )}
                {imageUrl && !uploading && (
                  <View style={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    backgroundColor: theme.success,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 4,
                  }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12 }}>已上传</Text>
                  </View>
                )}
              </View>
            ) : (
              <>
                <FontAwesome6 name="camera" size={40} style={styles.imagePickerIcon} />
                <Text style={styles.imagePickerText}>点击选择照片</Text>
              </>
            )}
          </TouchableOpacity>

          {imageUri && exifData && (
            <View style={styles.exifCard}>
              <Text style={styles.exifTitle}>拍摄参数（自动提取）</Text>
              <View style={styles.exifGrid}>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>相机</Text>
                  <Text style={styles.exifValue}>
                    {exifData.camera_brand} {exifData.camera_model}
                  </Text>
                </View>
                {exifData.lens_model && (
                  <View style={styles.exifItem}>
                    <Text style={styles.exifLabel}>镜头</Text>
                    <Text style={styles.exifValue}>{exifData.lens_model}</Text>
                  </View>
                )}
                {exifData.focal_length && (
                  <View style={styles.exifItem}>
                    <Text style={styles.exifLabel}>焦距</Text>
                    <Text style={styles.exifValue}>{exifData.focal_length}</Text>
                  </View>
                )}
                {exifData.aperture && (
                  <View style={styles.exifItem}>
                    <Text style={styles.exifLabel}>光圈</Text>
                    <Text style={styles.exifValue}>{exifData.aperture}</Text>
                  </View>
                )}
                {exifData.shutter_speed && (
                  <View style={styles.exifItem}>
                    <Text style={styles.exifLabel}>快门</Text>
                    <Text style={styles.exifValue}>{exifData.shutter_speed}</Text>
                  </View>
                )}
                {exifData.iso && (
                  <View style={styles.exifItem}>
                    <Text style={styles.exifLabel}>ISO</Text>
                    <Text style={styles.exifValue}>{exifData.iso}</Text>
                  </View>
                )}
              </View>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>作品信息</Text>
          <TextInput
            style={styles.input}
            placeholder="标题"
            placeholderTextColor={theme.textMuted}
            value={title}
            onChangeText={setTitle}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="描述（可选）"
            placeholderTextColor={theme.textMuted}
            value={description}
            onChangeText={setDescription}
            multiline
          />
          <TextInput
            style={styles.input}
            placeholder="拍摄地点"
            placeholderTextColor={theme.textMuted}
            value={location}
            onChangeText={setLocation}
          />
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="拍摄心得/Tips（可选）"
            placeholderTextColor={theme.textMuted}
            value={tips}
            onChangeText={setTips}
            multiline
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>拍摄场景</Text>
          <View style={styles.tagsContainer}>
            {SCENES.map(scene => (
              <TouchableOpacity
                key={scene}
                style={[styles.tag, selectedScenes.includes(scene) && styles.tagActive]}
                onPress={() => toggleTag(scene, selectedScenes, setSelectedScenes)}
              >
                <Text
                  style={[styles.tagText, selectedScenes.includes(scene) && styles.tagTextActive]}
                >
                  {scene}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>拍摄风格</Text>
          <View style={styles.tagsContainer}>
            {STYLES.map(style => (
              <TouchableOpacity
                key={style}
                style={[styles.tag, selectedStyles.includes(style) && styles.tagActive]}
                onPress={() => toggleTag(style, selectedStyles, setSelectedStyles)}
              >
                <Text
                  style={[styles.tagText, selectedStyles.includes(style) && styles.tagTextActive]}
                >
                  {style}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.publishButton, (loading || uploading) && styles.publishButtonDisabled]}
          onPress={handlePublish}
          disabled={loading || uploading}
        >
          {loading || uploading ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text style={styles.publishButtonText}>发布作品</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
