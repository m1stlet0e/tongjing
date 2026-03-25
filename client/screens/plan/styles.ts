import { StyleSheet, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const BACKGROUND_LIGHT = '#FAFAFA';
export const CARD_WHITE = '#FFFFFF';
export const TEXT_PRIMARY = '#1A1A1A';
export const TEXT_SECONDARY = '#666666';
export const TEXT_MUTED = '#999999';
export const BORDER_LIGHT = '#EEEEEE';
export const SUCCESS_GREEN = '#4CAF50';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BACKGROUND_LIGHT,
    },

    // ========== 顶部Tab切换 ==========
    topTabs: {
      flexDirection: 'row',
      backgroundColor: CARD_WHITE,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    topTab: {
      flex: 1,
      paddingVertical: Spacing.lg,
      alignItems: 'center',
    },
    topTabActive: {
      borderBottomWidth: 2,
      borderBottomColor: KLEIN_BLUE,
    },
    topTabText: {
      fontSize: 15,
      color: TEXT_MUTED,
      fontWeight: '400',
    },
    topTabTextActive: {
      fontSize: 15,
      color: TEXT_PRIMARY,
      fontWeight: '600',
    },

    // ========== 内容区域 ==========
    content: {
      flex: 1,
    },
    scrollContent: {
      padding: Spacing.lg,
    },

    // ========== 天气提示卡 ==========
    weatherCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
    },
    weatherIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: '#E3F2FD',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    weatherInfo: {
      flex: 1,
    },
    weatherTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: 2,
    },
    weatherDesc: {
      fontSize: 12,
      color: TEXT_SECONDARY,
    },
    weatherAction: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: SUCCESS_GREEN,
      borderRadius: BorderRadius.full,
    },
    weatherActionText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },

    // ========== 计划卡片 ==========
    planCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      marginBottom: Spacing.md,
      overflow: 'hidden',
    },
    planImage: {
      width: '100%',
      height: 140,
    },
    planContent: {
      padding: Spacing.md,
    },
    planHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: Spacing.sm,
    },
    planTitle: {
      fontSize: 15,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      flex: 1,
    },
    planStatus: {
      paddingVertical: 2,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: '#FFF3E0',
      marginLeft: Spacing.sm,
    },
    planStatusText: {
      fontSize: 10,
      color: '#F57C00',
      fontWeight: '500',
    },
    planLocation: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      marginBottom: Spacing.sm,
    },
    planLocationText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
    },
    planExif: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    planExifItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    planExifText: {
      fontSize: 11,
      color: TEXT_MUTED,
    },

    // ========== 挑战卡片 ==========
    challengeCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      marginBottom: Spacing.md,
      overflow: 'hidden',
    },
    challengeBanner: {
      height: 120,
      position: 'relative',
    },
    challengeBannerImage: {
      width: '100%',
      height: '100%',
    },
    challengeOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.md,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    challengeTag: {
      fontSize: 10,
      color: CHAMPAGNE_GOLD,
      fontWeight: '600',
      letterSpacing: 1,
      marginBottom: 4,
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: '#FFFFFF',
    },
    challengeContent: {
      padding: Spacing.md,
    },
    challengeStats: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    challengeParticipants: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    participantAvatars: {
      flexDirection: 'row',
    },
    participantAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      borderWidth: 2,
      borderColor: CARD_WHITE,
      marginLeft: -8,
    },
    participantAvatarFirst: {
      marginLeft: 0,
    },
    participantCount: {
      fontSize: 12,
      color: TEXT_SECONDARY,
    },
    challengeJoinBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      backgroundColor: KLEIN_BLUE,
      borderRadius: BorderRadius.full,
    },
    challengeJoinBtnText: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
    },

    // ========== 空状态 ==========
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['5xl'],
    },
    emptyIcon: {
      marginBottom: Spacing.lg,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '500',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.sm,
    },
    emptyText: {
      fontSize: 14,
      color: TEXT_MUTED,
      textAlign: 'center',
    },
  });
};
