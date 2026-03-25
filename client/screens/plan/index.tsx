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
import { createStyles, KLEIN_BLUE, CHAMPAGNE_GOLD, BACKGROUND_LIGHT, TEXT_PRIMARY, TEXT_SECONDARY, TEXT_MUTED, CARD_WHITE, BORDER_LIGHT } from './styles';

// 标签配置
const TABS = [
  { key: 'plans', label: '我的计划' },
  { key: 'challenges', label: '同款挑战' },
];

interface Plan {
  id: number;
  title: string;
  location: string;
  datetime: string;
  weather: string;
  weatherIcon: string;
  weatherDesc: string;
  aiSuggest: string;
}

interface Challenge {
  id: number;
  title: string;
  cover: string;
  participants: number;
  daysLeft: number;
  description: string;
  hotItems: { id: number; image: string }[];
}

export default function PlanScreen() {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useSafeRouter();
  const [activeTab, setActiveTab] = useState('plans');
  const [refreshing, setRefreshing] = useState(false);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  // 模拟数据
  const mockPlans: Plan[] = useMemo(() => [
    {
      id: 1,
      title: '外滩夜景拍摄',
      location: '上海·外滩观景台',
      datetime: '2025-01-18 17:30',
      weather: '晴',
      weatherIcon: 'sun',
      weatherDesc: '温度 8°C · 风力 2级',
      aiSuggest: '今天日落 17:28，黄金时刻在 16:45-17:15，建议提前到达。夜间拍摄注意携带三脚架，推荐使用长焦镜头捕捉对岸建筑群。',
    },
    {
      id: 2,
      title: '世纪公园晨雾',
      location: '上海·世纪公园',
      datetime: '2025-01-20 06:00',
      weather: '多云',
      weatherIcon: 'cloud-sun',
      weatherDesc: '温度 5°C · 风力 1级',
      aiSuggest: '明日清晨湿度较高，可能有晨雾，是拍摄的好时机。建议使用中长焦段，ISO 400-800，快门 1/250s。',
    },
  ], []);

  const mockChallenges: Challenge[] = useMemo(() => [
    {
      id: 1,
      title: '城市建筑·长焦挑战',
      cover: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=400',
      participants: 256,
      daysLeft: 12,
      description: '用长焦镜头捕捉城市建筑的几何之美，展示建筑的线条与光影。',
      hotItems: [
        { id: 1, image: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=100' },
        { id: 2, image: 'https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=100' },
        { id: 3, image: 'https://images.unsplash.com/photo-1478827536114-da961b7f86d2?w=100' },
      ],
    },
    {
      id: 2,
      title: '星空·银河挑战',
      cover: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=400',
      participants: 128,
      daysLeft: 28,
      description: '拍摄银河、星轨或星空下的风景，展现夜空的浩瀚之美。',
      hotItems: [
        { id: 1, image: 'https://images.unsplash.com/photo-1506318137071-a8e063b4bec0?w=100' },
        { id: 2, image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=100' },
        { id: 3, image: 'https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=100' },
      ],
    },
  ], []);

  // 获取数据
  const fetchData = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    
    // 模拟API调用
    setTimeout(() => {
      setPlans(mockPlans);
      setChallenges(mockChallenges);
      setLoading(false);
      setRefreshing(false);
    }, 500);
  }, [mockPlans, mockChallenges]);

  useFocusEffect(useCallback(() => { fetchData(); }, [fetchData]));

  // 渲染天气图标
  const getWeatherIcon = (icon: string) => {
    const icons: { [key: string]: string } = {
      'sun': 'sun',
      'cloud-sun': 'cloud-sun',
      'cloud': 'cloud',
      'rain': 'cloud-rain',
    };
    return icons[icon] || 'sun';
  };

  return (
    <Screen backgroundColor={BACKGROUND_LIGHT} statusBarStyle="dark">
      <View style={styles.container}>
        {/* ========== 标签导航 ========== */}
        <View style={styles.tabsSection}>
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tabItem, isActive && styles.tabItemActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}
              >
                <Text style={isActive ? styles.tabTextActive : styles.tabText}>{tab.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ========== 内容区 ========== */}
        {loading ? (
          <View style={styles.loadingState}>
            <ActivityIndicator color={KLEIN_BLUE} size="small" />
          </View>
        ) : (
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={() => fetchData(true)} tintColor={KLEIN_BLUE} colors={[KLEIN_BLUE]} />
            }
          >
            {/* 我的计划 */}
            {activeTab === 'plans' && (
              <View style={styles.plansList}>
                {plans.map((plan) => (
                  <View key={plan.id} style={styles.planCard}>
                    {/* 头部 */}
                    <View style={styles.planHeader}>
                      <View style={styles.planIcon}>
                        <FontAwesome6 name="calendar-check" size={16} color={KLEIN_BLUE} />
                      </View>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.planTitle}>{plan.title}</Text>
                        <View style={styles.planMeta}>
                          <FontAwesome6 name="location-dot" size={10} color={TEXT_MUTED} />
                          <Text style={styles.planMetaText}>{plan.location}</Text>
                          <FontAwesome6 name="clock" size={10} color={TEXT_MUTED} style={{ marginLeft: 12 }} />
                          <Text style={styles.planMetaText}>{plan.datetime}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* 天气提示 */}
                    <View style={styles.weatherBar}>
                      <View style={styles.weatherInfo}>
                        <FontAwesome6 name={getWeatherIcon(plan.weatherIcon)} size={20} color="#F59E0B" />
                        <View style={{ marginLeft: 8 }}>
                          <Text style={styles.weatherText}>{plan.weather}</Text>
                          <Text style={styles.weatherDesc}>{plan.weatherDesc}</Text>
                        </View>
                      </View>
                    </View>
                    
                    {/* AI建议 */}
                    <View style={styles.aiSuggestCard}>
                      <View style={styles.aiSuggestHeader}>
                        <FontAwesome6 name="lightbulb" size={12} color="#F59E0B" />
                        <Text style={styles.aiSuggestTitle}>AI拍摄建议</Text>
                      </View>
                      <Text style={styles.aiSuggestText}>{plan.aiSuggest}</Text>
                    </View>
                    
                    {/* 操作按钮 */}
                    <View style={styles.planActions}>
                      <TouchableOpacity style={styles.planActionBtn}>
                        <FontAwesome6 name="pencil" size={12} color={TEXT_SECONDARY} />
                        <Text style={styles.planActionBtnText}>编辑</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.planActionBtn}>
                        <FontAwesome6 name="share-nodes" size={12} color={TEXT_SECONDARY} />
                        <Text style={styles.planActionBtnText}>分享</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.planActionBtn, { backgroundColor: KLEIN_BLUE }]}>
                        <FontAwesome6 name="camera" size={12} color="#FFFFFF" />
                        <Text style={[styles.planActionBtnText, { color: '#FFFFFF' }]}>开始拍摄</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
                
                {/* 空状态 */}
                {plans.length === 0 && (
                  <View style={styles.emptyState}>
                    <FontAwesome6 name="calendar-plus" size={40} color={TEXT_MUTED} />
                    <Text style={styles.emptyText}>还没有拍摄计划</Text>
                    <TouchableOpacity style={styles.emptyBtn}>
                      <Text style={styles.emptyBtnText}>创建计划</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {/* 同款挑战 */}
            {activeTab === 'challenges' && (
              <View style={styles.challengesList}>
                {challenges.map((challenge) => (
                  <View key={challenge.id} style={styles.challengeCard}>
                    {/* 封面图 */}
                    <View style={styles.challengeCover}>
                      <Image source={{ uri: challenge.cover }} style={styles.challengeCoverImage} />
                      <View style={styles.challengeBadge}>
                        <Text style={styles.challengeBadgeText}>剩{challenge.daysLeft}天</Text>
                      </View>
                    </View>
                    
                    {/* 内容 */}
                    <View style={styles.challengeContent}>
                      <Text style={styles.challengeTitle}>{challenge.title}</Text>
                      <Text style={styles.challengeDesc}>{challenge.description}</Text>
                      
                      {/* 参与者头像 */}
                      <View style={styles.participantsRow}>
                        <View style={styles.avatarStack}>
                          {[0, 1, 2].map((i) => (
                            <View key={i} style={[styles.avatarStackItem, { left: i * 16 }]}>
                              <FontAwesome6 name="user" size={10} color={TEXT_MUTED} />
                            </View>
                          ))}
                        </View>
                        <Text style={styles.participantsText}>{challenge.participants}人参与</Text>
                      </View>
                      
                      {/* 热门作品缩略图 */}
                      <View style={styles.hotItemsRow}>
                        {challenge.hotItems.map((item) => (
                          <Image key={item.id} source={{ uri: item.image }} style={styles.hotItemThumb} />
                        ))}
                      </View>
                    </View>
                    
                    {/* 底部按钮 */}
                    <TouchableOpacity style={styles.joinBtn}>
                      <FontAwesome6 name="plus" size={12} color="#FFFFFF" />
                      <Text style={styles.joinBtnText}>参与挑战</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
          </ScrollView>
        )}
      </View>
    </Screen>
  );
}
