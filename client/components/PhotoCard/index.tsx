import React, { useMemo } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { createStyles } from './styles';

export interface Photo {
  id: number;
  image_url: string;
  title: string;
  description: string;
  camera_brand: string;
  camera_model: string;
  lens_model: string;
  focal_length: string;
  aperture: string;
  shutter_speed: string;
  iso: number;
  location_name: string;
  likes_count: number;
  comments_count: number;
  favorites_count: number;
  username: string;
  avatar_url: string;
  tags: { tag_name: string; tag_type: string }[];
  is_liked: boolean;
  is_favorited: boolean;
}

interface PhotoCardProps {
  photo: Photo;
  onPress?: () => void;
  onLike?: () => void;
  onFavorite?: () => void;
}

export default function PhotoCard({ photo, onPress, onLike, onFavorite }: PhotoCardProps) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: photo.image_url }} style={styles.image} resizeMode="cover" />
        <View style={styles.exifOverlay}>
          <View style={styles.exifRow}>
            <View style={styles.exifItem}>
              <FontAwesome6 name="camera" size={12} color="#FFFFFF" />
              <Text style={styles.exifText}>{photo.camera_model}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="circle-dot" size={12} color="#FFFFFF" />
              <Text style={styles.exifText}>{photo.aperture}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="clock" size={12} color="#FFFFFF" />
              <Text style={styles.exifText}>{photo.shutter_speed}</Text>
            </View>
            <View style={styles.exifItem}>
              <FontAwesome6 name="film" size={12} color="#FFFFFF" />
              <Text style={styles.exifText}>ISO {photo.iso}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <View style={styles.header}>
          <Image source={{ uri: photo.avatar_url }} style={styles.avatar} />
          <View style={styles.userInfo}>
            <Text style={styles.username}>{photo.username}</Text>
            <Text style={styles.location}>{photo.location_name}</Text>
          </View>
        </View>

        <Text style={styles.title} numberOfLines={2}>
          {photo.title}
        </Text>

        {photo.description && (
          <Text style={styles.description} numberOfLines={2}>
            {photo.description}
          </Text>
        )}

        {photo.tags && photo.tags.length > 0 && (
          <View style={styles.tagsContainer}>
            {photo.tags.slice(0, 3).map((tag, index) => (
              <View key={index} style={styles.tag}>
                <Text style={styles.tagText}>#{tag.tag_name}</Text>
              </View>
            ))}
          </View>
        )}

        <View style={styles.footer}>
          <View style={styles.statsContainer}>
            <TouchableOpacity style={styles.statItem} onPress={onLike}>
              <FontAwesome6
                name={photo.is_liked ? "heart" : "heart"}
                size={18}
                solid={photo.is_liked}
                color={photo.is_liked ? theme.error : theme.textSecondary}
              />
              <Text style={styles.statText}>{photo.likes_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statItem}>
              <FontAwesome6 name="comment" size={18} color={theme.textSecondary} />
              <Text style={styles.statText}>{photo.comments_count}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.statItem} onPress={onFavorite}>
              <FontAwesome6
                name={photo.is_favorited ? "bookmark" : "bookmark"}
                size={18}
                solid={photo.is_favorited}
                color={photo.is_favorited ? theme.accent : theme.textSecondary}
              />
              <Text style={styles.statText}>{photo.favorites_count}</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.actionButton}>
            <FontAwesome6 name="share" size={18} color={theme.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}
