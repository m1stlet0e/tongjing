import { StyleSheet, Platform, StatusBar } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 克莱因蓝高定风配色
export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const DEEP_SPACE_BLACK = '#0A0A0F';
export const SOFT_WHITE = '#FAFAFA';
export const WARM_GRAY = '#1A1A1F';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    // 容器
    container: {
      flex: 1,
      backgroundColor: DEEP_SPACE_BLACK,
    },
    scrollContent: {
      paddingBottom: Spacing['5xl'],
    },

    // ========== 标签导航（顶部唯一元素）==========
    tabsSection: {
      backgroundColor: DEEP_SPACE_BLACK,
      paddingTop: Platform.OS === 'web' ? Spacing.lg : Spacing.xl,
      paddingBottom: Spacing.sm,
    },
    tabsScrollContent: {
      paddingHorizontal: Spacing.lg,
    },
    tabItem: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.md,
      marginRight: Spacing.lg,
      alignItems: 'center',
    },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    tabText: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 13,
      fontWeight: '400',
      letterSpacing: 1,
    },
    tabTextActive: {
      color: SOFT_WHITE,
      fontSize: 13,
      fontWeight: '500',
      letterSpacing: 1,
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: CHAMPAGNE_GOLD,
      borderRadius: 1,
    },

    // ========== 内容分割线 ==========
    sectionDivider: {
      height: 1,
      backgroundColor: 'rgba(201,169,110,0.1)',
      marginHorizontal: Spacing.lg,
    },

    // ========== 列表区域 ==========
    listSection: {
      backgroundColor: DEEP_SPACE_BLACK,
      paddingTop: Spacing.md,
    },
    
    // 列表头部统计
    listHeader: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    listHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'baseline',
      gap: Spacing.sm,
    },
    listHeaderCount: {
      color: CHAMPAGNE_GOLD,
      fontSize: 20,
      fontWeight: '300',
      letterSpacing: 1,
    },
    listHeaderLabel: {
      color: 'rgba(255,255,255,0.3)',
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 0.5,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: 'rgba(201,169,110,0.25)',
    },
    filterButtonText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 0.5,
    },

    // 照片卡片
    photoCard: {
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      backgroundColor: WARM_GRAY,
      borderRadius: 12,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      aspectRatio: 4 / 3,
    },
    photoExifBar: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.65)',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
    },
    exifRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    exifItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    exifText: {
      color: 'rgba(255,255,255,0.75)',
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 0.3,
    },
    
    // 卡片内容
    cardContent: {
      padding: Spacing.lg,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    cardAvatar: {
      width: 36,
      height: 36,
      borderRadius: 18,
      marginRight: Spacing.md,
      borderWidth: 1,
      borderColor: 'rgba(201,169,110,0.4)',
    },
    cardUserInfo: {
      flex: 1,
    },
    cardUsername: {
      color: SOFT_WHITE,
      fontSize: 14,
      fontWeight: '400',
      letterSpacing: 0.3,
    },
    cardLocation: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 11,
      fontWeight: '300',
      marginTop: 2,
    },
    cardTitle: {
      color: SOFT_WHITE,
      fontSize: 16,
      fontWeight: '500',
      letterSpacing: 0.3,
      marginBottom: Spacing.sm,
    },
    cardDescription: {
      color: 'rgba(255,255,255,0.55)',
      fontSize: 13,
      fontWeight: '300',
      letterSpacing: 0.2,
      lineHeight: 19,
      marginBottom: Spacing.md,
    },
    cardTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    cardTag: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      backgroundColor: 'rgba(201,169,110,0.1)',
    },
    cardTagText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 0.5,
    },
    
    // 卡片底部
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'rgba(255,255,255,0.06)',
      paddingTop: Spacing.md,
    },
    cardStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xl,
    },
    cardStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    cardStatText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 13,
      fontWeight: '300',
    },
    cardShare: {
      padding: Spacing.sm,
    },

    // ========== 底部品牌标识 ==========
    listFooter: {
      alignItems: 'center',
      paddingVertical: Spacing['2xl'],
    },
    footerBrand: {
      color: CHAMPAGNE_GOLD,
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 6,
      textTransform: 'uppercase',
      opacity: 0.3,
    },
    footerLine: {
      width: 40,
      height: 1,
      backgroundColor: CHAMPAGNE_GOLD,
      opacity: 0.2,
      marginTop: Spacing.sm,
    },

    // ========== 状态提示 ==========
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['5xl'],
    },
    emptyIcon: {
      marginBottom: Spacing.lg,
    },
    emptyText: {
      color: 'rgba(255,255,255,0.25)',
      fontSize: 13,
      fontWeight: '300',
      letterSpacing: 1,
    },

    loadingState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    loadingText: {
      color: 'rgba(255,255,255,0.35)',
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 1,
      marginTop: Spacing.md,
    },

    // ========== 错误提示 ==========
    errorState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
      paddingHorizontal: Spacing.xl,
    },
    errorText: {
      color: theme.error,
      fontSize: 13,
      fontWeight: '300',
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: CHAMPAGNE_GOLD,
    },
    retryButtonText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 1,
    },
  });
};
