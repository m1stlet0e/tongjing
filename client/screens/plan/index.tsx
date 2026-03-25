import React, { useState, useMemo } from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import { FontAwesome6 } from '@expo/vector-icons';
import { useTheme } from '@/hooks/useTheme';
import { Screen } from '@/components/Screen';
import { createStyles, KLEIN_BLUE, TEXT_PRIMARY, TEXT_MUTED, TEXT_SECONDARY, CHAMPAGNE_GOLD } from './styles';

// 模拟计划数据
const MOCK_PLANS = [
  {
    id: 1,
    title: '外滩夜景长曝光',
    location: '上海外滩',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600',
    camera: 'Sony A7M4',
    lens: '24-70mm',
    aperture: 'f/8',
    shutter: '30s',
    status: '待执行',
  },
  {
    id: 2,
    title: '故宫晨曦',
    location: '北京故宫',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600',
    camera: 'Canon R5',
    lens: '70-200mm',
    aperture: 'f/11',
    shutter: '1/125s',
    status: '待执行',
  },
];

// 模拟挑战数据
const MOCK_CHALLENGES = [
  {
    id: 1,
    title: '城市对称美学',
    tag: '#寻找对称',
    banner: 'https://images.unsplash.com/photo-1480714378408-67cf0d13bc1b?w=600',
    participants: 128,
    avatars: [
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100',
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
    ],
  },
  {
    id: 2,
    title: '黄金时刻',
    tag: '#日落剪影',
    banner: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=600',
    participants: 256,
    avatars: [
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
      'https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=100',
    ],
  },
];

type TabKey = 'plan' | 'challenge';

export default function PlanScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState<TabKey>('plan');

  // 渲染天气提示卡
  const renderWeatherCard = () => (
    <View style={styles.weatherCard}>
      <View style={styles.weatherIcon}>
        <FontAwesome6 name="sun" size={24} color="#FFA000" />
      </View>
      <View style={styles.weatherInfo}>
        <Text style={styles.weatherTitle}>本周末适合拍摄</Text>
        <Text style={styles.weatherDesc}>周六晴朗，能见度高，适合风光摄影</Text>
      </View>
      <TouchableOpacity style={styles.weatherAction}>
        <Text style={styles.weatherActionText}>查看计划</Text>
      </TouchableOpacity>
    </View>
  );

  // 渲染计划卡片
  const renderPlanCard = (plan: typeof MOCK_PLANS[0]) => (
    <TouchableOpacity key={plan.id} style={styles.planCard}>
      <Image source={{ uri: plan.image }} style={styles.planImage} resizeMode="cover" />
      <View style={styles.planContent}>
        <View style={styles.planHeader}>
          <Text style={styles.planTitle}>{plan.title}</Text>
          <View style={styles.planStatus}>
            <Text style={styles.planStatusText}>{plan.status}</Text>
          </View>
        </View>
        <View style={styles.planLocation}>
          <FontAwesome6 name="location-dot" size={12} color={TEXT_SECONDARY} />
          <Text style={styles.planLocationText}>{plan.location}</Text>
        </View>
        <View style={styles.planExif}>
          <View style={styles.planExifItem}>
            <FontAwesome6 name="camera" size={10} color={TEXT_MUTED} />
            <Text style={styles.planExifText}>{plan.camera}</Text>
          </View>
          <View style={styles.planExifItem}>
            <FontAwesome6 name="circle-dot" size={10} color={TEXT_MUTED} />
            <Text style={styles.planExifText}>{plan.aperture}</Text>
          </View>
          <View style={styles.planExifItem}>
            <FontAwesome6 name="clock" size={10} color={TEXT_MUTED} />
            <Text style={styles.planExifText}>{plan.shutter}</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染挑战卡片
  const renderChallengeCard = (challenge: typeof MOCK_CHALLENGES[0]) => (
    <TouchableOpacity key={challenge.id} style={styles.challengeCard}>
      <View style={styles.challengeBanner}>
        <Image source={{ uri: challenge.banner }} style={styles.challengeBannerImage} resizeMode="cover" />
        <View style={styles.challengeOverlay}>
          <Text style={styles.challengeTag}>{challenge.tag}</Text>
          <Text style={styles.challengeTitle}>{challenge.title}</Text>
        </View>
      </View>
      <View style={styles.challengeContent}>
        <View style={styles.challengeStats}>
          <View style={styles.challengeParticipants}>
            <View style={styles.participantAvatars}>
              {challenge.avatars.map((avatar, idx) => (
                <Image
                  key={idx}
                  source={{ uri: avatar }}
                  style={[styles.participantAvatar, idx === 0 && styles.participantAvatarFirst]}
                />
              ))}
            </View>
            <Text style={styles.participantCount}>{challenge.participants} 人参与</Text>
          </View>
          <TouchableOpacity style={styles.challengeJoinBtn}>
            <Text style={styles.challengeJoinBtnText}>参与挑战</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  // 渲染空状态
  const renderEmpty = (type: TabKey) => (
    <View style={styles.emptyState}>
      <FontAwesome6
        name={type === 'plan' ? 'clipboard-list' : 'trophy'}
        size={48}
        color={TEXT_MUTED}
        style={styles.emptyIcon}
      />
      <Text style={styles.emptyTitle}>
        {type === 'plan' ? '暂无拍摄计划' : '暂无挑战活动'}
      </Text>
      <Text style={styles.emptyText}>
        {type === 'plan' ? '收藏喜欢的作品，一键生成拍摄计划' : '参与社区挑战，与摄影师们一起创作'}
      </Text>
    </View>
  );

  return (
    <Screen backgroundColor="#FAFAFA" statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== 顶部Tab切换 ========== */}
        <View style={styles.topTabs}>
          <TouchableOpacity
            style={[styles.topTab, activeTab === 'plan' && styles.topTabActive]}
            onPress={() => setActiveTab('plan')}
          >
            <Text style={activeTab === 'plan' ? styles.topTabTextActive : styles.topTabText}>
              我的计划
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.topTab, activeTab === 'challenge' && styles.topTabActive]}
            onPress={() => setActiveTab('challenge')}
          >
            <Text style={activeTab === 'challenge' ? styles.topTabTextActive : styles.topTabText}>
              同款挑战
            </Text>
          </TouchableOpacity>
        </View>

        {/* ========== 内容区域 ========== */}
        <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {activeTab === 'plan' ? (
            <>
              {renderWeatherCard()}
              {MOCK_PLANS.length > 0 ? MOCK_PLANS.map(renderPlanCard) : renderEmpty('plan')}
            </>
          ) : (
            <>
              {MOCK_CHALLENGES.length > 0 ? MOCK_CHALLENGES.map(renderChallengeCard) : renderEmpty('challenge')}
            </>
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}
