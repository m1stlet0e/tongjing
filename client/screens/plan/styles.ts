import { StyleSheet, Dimensions, Platform } from 'react-native';
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

    // ========== 标签导航 ========== 
    tabsSection: {
      flexDirection: 'row',
      backgroundColor: CARD_WHITE,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    tabItem: {
      flex: 1,
      paddingVertical: Spacing.md,
      alignItems: 'center',
      borderBottomWidth: 2,
      borderBottomColor: 'transparent',
    },
    tabItemActive: {
      borderBottomColor: KLEIN_BLUE,
    },
    tabText: {
      fontSize: 14,
      color: TEXT_MUTED,
      fontWeight: '400',
    },
    tabTextActive: {
      fontSize: 14,
      color: TEXT_PRIMARY,
      fontWeight: '600',
    },

    // ========== 加载状态 ==========
    loadingState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },

    // ========== 我的计划 ========== 
    plansList: {
      gap: Spacing.md,
    },
    planCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 16,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    planHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    planIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,47,167,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    planTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: 2,
    },
    planMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 4,
    },
    planMetaText: {
      fontSize: 12,
      color: TEXT_MUTED,
      marginLeft: 4,
    },
    
    // 天气提示
    weatherBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(255,152,0,0.08)',
      borderRadius: 12,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    weatherInfo: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    weatherText: {
      fontSize: 14,
      fontWeight: '500',
      color: TEXT_PRIMARY,
    },
    weatherDesc: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      marginTop: 2,
    },
    
    // AI建议
    aiSuggestCard: {
      backgroundColor: 'rgba(0,47,167,0.05)',
      borderRadius: 12,
      padding: Spacing.md,
      marginBottom: Spacing.md,
    },
    aiSuggestHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
      gap: Spacing.xs,
    },
    aiSuggestTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: KLEIN_BLUE,
    },
    aiSuggestText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      lineHeight: 18,
    },
    
    // 操作按钮
    planActions: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      gap: Spacing.sm,
      marginTop: Spacing.sm,
    },
    planActionBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      backgroundColor: BACKGROUND_LIGHT,
    },
    planActionBtnText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      marginLeft: 4,
    },

    // ========== 同款挑战 ==========
    challengesList: {
      gap: Spacing.lg,
    },
    challengeCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 16,
      overflow: 'hidden',
    },
    challengeCover: {
      position: 'relative',
      height: 160,
    },
    challengeCoverImage: {
      width: '100%',
      height: '100%',
    },
    challengeBadge: {
      position: 'absolute',
      top: Spacing.md,
      right: Spacing.md,
      paddingVertical: 4,
      paddingHorizontal: Spacing.md,
      backgroundColor: 'rgba(0,0,0,0.6)',
      borderRadius: BorderRadius.full,
    },
    challengeBadgeText: {
      fontSize: 11,
      color: '#FFFFFF',
      fontWeight: '500',
    },
    challengeContent: {
      padding: Spacing.md,
    },
    challengeTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.sm,
    },
    challengeDesc: {
      fontSize: 13,
      color: TEXT_SECONDARY,
      lineHeight: 18,
      marginBottom: Spacing.md,
    },
    participantsRow: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    avatarStack: {
      width: 48,
      height: 24,
      position: 'relative',
    },
    avatarStackItem: {
      position: 'absolute',
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: BORDER_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: CARD_WHITE,
    },
    participantsText: {
      fontSize: 12,
      color: TEXT_MUTED,
      marginLeft: Spacing.sm,
    },
    hotItemsRow: {
      flexDirection: 'row',
      gap: 4,
    },
    hotItemThumb: {
      width: 60,
      height: 60,
      borderRadius: 8,
    },
    joinBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4,
      paddingVertical: Spacing.md,
      backgroundColor: KLEIN_BLUE,
      borderRadius: BorderRadius.lg,
      marginTop: Spacing.md,
    },
    joinBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
    },

    // ========== 空状态 ========== 
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyIcon: {
      marginBottom: Spacing.md,
    },
    emptyText: {
      fontSize: 14,
      color: TEXT_MUTED,
      textAlign: 'center',
    },
    emptyBtn: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      backgroundColor: KLEIN_BLUE,
      borderRadius: BorderRadius.full,
    },
    emptyBtnText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '500',
    },
  });
};
