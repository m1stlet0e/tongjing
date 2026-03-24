import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Alert,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles } from './styles';

const EXPO_PUBLIC_BACKEND_BASE_URL = process.env.EXPO_PUBLIC_BACKEND_BASE_URL;

const SCENES = ['夜景', '人像', '建筑', '街拍', '风光', '星空'];
const STYLES = ['长曝光', '大光圈', '黑白', '胶片'];

export default function PublishScreen() {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [location, setLocation] = useState('');
  const [tips, setTips] = useState('');
  const [selectedScenes, setSelectedScenes] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  // 模拟EXIF数据（实际应该从图片中提取）
  const mockExifData = {
    camera: 'Sony A7M4',
    lens: 'FE 24-70mm F2.8 GM II',
    focalLength: '35mm',
    aperture: 'F2.8',
    shutterSpeed: '1/500s',
    iso: '400',
    wb: 'Auto',
  };

  const pickImage = async () => {
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permissionResult.granted) {
      Alert.alert('提示', '需要相册权限才能选择照片');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: false,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setImageUri(result.assets[0].uri);
      // 实际项目中应该提取EXIF数据
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

      // 构建标签数组
      const tags = [
        ...selectedScenes.map(name => ({ name, type: 'scene' })),
        ...selectedStyles.map(name => ({ name, type: 'style' })),
      ];

      /**
       * 服务端文件：server/src/routes/photos.ts
       * 接口：POST /api/v1/photos
       * Body 参数：image_url: string, title: string, description?: string, shooting_tips?: string, tags?: array
       */
      const response = await fetch(`${EXPO_PUBLIC_BACKEND_BASE_URL}/api/v1/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          image_url: imageUri,
          title,
          description,
          shooting_tips: tips,
          location_name: location,
          tags,
          latitude: 31.2304, // 示例坐标
          longitude: 121.4737,
        }),
      });

      const result = await response.json();
      if (result.success) {
        Alert.alert('成功', '照片发布成功！');
        // 重置表单
        setImageUri(null);
        setTitle('');
        setDescription('');
        setLocation('');
        setTips('');
        setSelectedScenes([]);
        setSelectedStyles([]);
      } else {
        Alert.alert('错误', '发布失败，请重试');
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
          <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} style={styles.imagePreview} resizeMode="cover" />
            ) : (
              <>
                <FontAwesome6 name="camera" size={40} style={styles.imagePickerIcon} />
                <Text style={styles.imagePickerText}>点击选择照片</Text>
              </>
            )}
          </TouchableOpacity>

          {imageUri && (
            <View style={styles.exifCard}>
              <Text style={styles.exifTitle}>拍摄参数（自动提取）</Text>
              <View style={styles.exifGrid}>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>相机</Text>
                  <Text style={styles.exifValue}>{mockExifData.camera}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>镜头</Text>
                  <Text style={styles.exifValue}>{mockExifData.lens}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>焦距</Text>
                  <Text style={styles.exifValue}>{mockExifData.focalLength}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>光圈</Text>
                  <Text style={styles.exifValue}>{mockExifData.aperture}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>快门</Text>
                  <Text style={styles.exifValue}>{mockExifData.shutterSpeed}</Text>
                </View>
                <View style={styles.exifItem}>
                  <Text style={styles.exifLabel}>ISO</Text>
                  <Text style={styles.exifValue}>{mockExifData.iso}</Text>
                </View>
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
          style={styles.publishButton}
          onPress={handlePublish}
          disabled={loading}
        >
          <Text style={styles.publishButtonText}>
            {loading ? '发布中...' : '发布作品'}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </Screen>
  );
}
