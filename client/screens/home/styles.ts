import { StyleSheet, Platform } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 克莱因蓝高定风配色
export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const DEEP_SPACE_BLACK = '#0A0A0F';
export const SOFT_WHITE = '#FAFAFA';
export const WARM_GRAY = '#2A2A2A';

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

    // ========== 克莱因蓝头部 ==========
    kleinHeader: {
      backgroundColor: KLEIN_BLUE,
      paddingHorizontal: Spacing.xl,
      paddingTop: Platform.OS === 'web' ? Spacing['2xl'] : Spacing['3xl'],
      paddingBottom: Spacing['2xl'],
    },
    brandRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    brandName: {
      color: SOFT_WHITE,
      fontSize: 28,
      fontWeight: '300', // 极细字重
      letterSpacing: 8, // 大字间距
      textTransform: 'uppercase',
    },
    headerActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.lg,
    },
    headerIcon: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    
    // 金色分割线
    goldDivider: {
      height: 1,
      backgroundColor: CHAMPAGNE_GOLD,
      marginTop: Spacing.xl,
      opacity: 0.6,
    },
    
    // 副标题
    headerSubtitle: {
      marginTop: Spacing.lg,
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 4,
      textTransform: 'uppercase',
    },

    // ========== 杂志风标签导航 ==========
    tabsSection: {
      backgroundColor: DEEP_SPACE_BLACK,
      paddingVertical: 0,
    },
    tabsScrollContent: {
      paddingHorizontal: Spacing.lg,
    },
    tabItem: {
      paddingVertical: Spacing.lg,
      paddingHorizontal: Spacing.md,
      marginRight: Spacing.xl,
      alignItems: 'center',
    },
    tabContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    tabText: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
    tabTextActive: {
      color: CHAMPAGNE_GOLD,
      fontSize: 12,
      fontWeight: '400',
      letterSpacing: 2,
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 1,
      backgroundColor: CHAMPAGNE_GOLD,
    },

    // ========== 列表区域 ==========
    listSection: {
      backgroundColor: DEEP_SPACE_BLACK,
      paddingTop: Spacing.sm,
    },
    
    // 列表头部统计
    listHeader: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(201,169,110,0.2)',
    },
    listHeaderLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    listHeaderCount: {
      color: CHAMPAGNE_GOLD,
      fontSize: 24,
      fontWeight: '300',
      letterSpacing: 2,
    },
    listHeaderLabel: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 1,
    },
    filterButton: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: 'rgba(201,169,110,0.3)',
    },
    filterButtonText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 1,
    },

    // 照片卡片
    photoCard: {
      marginHorizontal: Spacing.lg,
      marginBottom: Spacing.lg,
      backgroundColor: WARM_GRAY,
      borderRadius: 0, // 直角设计
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
      backgroundColor: 'rgba(0,0,0,0.7)',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
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
      color: 'rgba(255,255,255,0.8)',
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 0.5,
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
      borderColor: CHAMPAGNE_GOLD,
    },
    cardUserInfo: {
      flex: 1,
    },
    cardUsername: {
      color: SOFT_WHITE,
      fontSize: 13,
      fontWeight: '400',
      letterSpacing: 0.5,
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
      fontWeight: '400',
      letterSpacing: 1,
      marginBottom: Spacing.sm,
    },
    cardDescription: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 0.5,
      lineHeight: 18,
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
      borderWidth: 1,
      borderColor: 'rgba(201,169,110,0.3)',
    },
    cardTagText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 1,
    },
    
    // 卡片底部
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      borderTopWidth: 1,
      borderTopColor: 'rgba(201,169,110,0.15)',
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
      fontSize: 12,
      fontWeight: '300',
    },
    cardShare: {
      padding: Spacing.sm,
    },

    // ========== 底部品牌标识 ==========
    listFooter: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    footerBrand: {
      color: CHAMPAGNE_GOLD,
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 6,
      textTransform: 'uppercase',
      opacity: 0.4,
    },
    footerLine: {
      width: 60,
      height: 1,
      backgroundColor: CHAMPAGNE_GOLD,
      opacity: 0.3,
      marginTop: Spacing.md,
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
      color: 'rgba(255,255,255,0.3)',
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 2,
    },

    loadingState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    loadingText: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 2,
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
      fontSize: 12,
      fontWeight: '300',
      letterSpacing: 1,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderWidth: 1,
      borderColor: CHAMPAGNE_GOLD,
    },
    retryButtonText: {
      color: CHAMPAGNE_GOLD,
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 2,
    },
  });
};
