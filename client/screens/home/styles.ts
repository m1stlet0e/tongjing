import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 配色方案（浅色背景）
export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const BACKGROUND_LIGHT = '#FAFAFA';
export const CARD_WHITE = '#FFFFFF';
export const TEXT_PRIMARY = '#1A1A1A';
export const TEXT_SECONDARY = '#666666';
export const TEXT_MUTED = '#999999';
export const BORDER_LIGHT = '#EEEEEE';
export const ACCENT_RED = '#E53935';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = Spacing.md;
const CARD_MARGIN = Spacing.lg;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_GAP) / 2;

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    // 容器
    container: {
      flex: 1,
      backgroundColor: BACKGROUND_LIGHT,
    },

    // ========== 顶部导航栏 ==========
    topNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      backgroundColor: CARD_WHITE,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    topNavLeft: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    brandText: {
      fontSize: 20,
      fontWeight: '600',
      color: KLEIN_BLUE,
      letterSpacing: 2,
    },
    filterBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      backgroundColor: BACKGROUND_LIGHT,
      gap: Spacing.xs,
    },
    filterBtnText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
      fontWeight: '500',
    },

    // ========== Stories 横向滚动条 ==========
    storiesSection: {
      paddingVertical: Spacing.md,
      backgroundColor: CARD_WHITE,
    },
    storiesScrollContent: {
      paddingHorizontal: CARD_MARGIN,
    },
    storyItem: {
      alignItems: 'center',
      marginRight: Spacing.md,
    },
    storyRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: KLEIN_BLUE,
      padding: 2,
      marginBottom: Spacing.xs,
    },
    storyAvatar: {
      width: '100%',
      height: '100%',
      borderRadius: 28,
    },
    storyAddBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: BORDER_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xs,
      backgroundColor: BACKGROUND_LIGHT,
    },
    storyName: {
      color: TEXT_MUTED,
      fontSize: 10,
      fontWeight: '400',
      textAlign: 'center',
    },
    storyNameActive: {
      color: TEXT_PRIMARY,
    },

    // ========== 标签导航 ==========
    tabsSection: {
      backgroundColor: CARD_WHITE,
      paddingVertical: Spacing.sm,
    },
    tabsScrollContent: {
      paddingHorizontal: CARD_MARGIN,
    },
    tabItem: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      marginRight: Spacing.sm,
    },
    tabText: {
      color: TEXT_MUTED,
      fontSize: 15,
      fontWeight: '400',
    },
    tabTextActive: {
      color: TEXT_PRIMARY,
      fontSize: 15,
      fontWeight: '600',
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 3,
      backgroundColor: KLEIN_BLUE,
      borderRadius: 1.5,
    },

    // ========== 瀑布流列表 ==========
    masonryContainer: {
      paddingHorizontal: CARD_MARGIN,
      paddingTop: Spacing.md,
      paddingBottom: Spacing['3xl'],
    },
    masonryColumn: {
      flex: 1,
    },
    masonryRow: {
      flexDirection: 'row',
      gap: CARD_GAP,
    },

    // 照片卡片（瀑布流）
    photoCard: {
      marginBottom: CARD_GAP,
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      overflow: 'hidden',
      width: CARD_WIDTH,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.06,
      shadowRadius: 8,
      elevation: 2,
    },
    photoImage: {
      width: '100%',
    },
    photoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: Spacing.xl,
      paddingHorizontal: Spacing.sm,
      paddingBottom: Spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    photoTitle: {
      color: '#FFFFFF',
      fontSize: 12,
      fontWeight: '500',
      marginBottom: 2,
    },
    photoLocation: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 10,
      fontWeight: '400',
    },
    
    // 卡片内容
    cardContent: {
      padding: Spacing.sm,
    },
    cardExif: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
      gap: 2,
    },
    cardExifText: {
      color: TEXT_MUTED,
      fontSize: 9,
      fontWeight: '400',
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    cardAvatar: {
      width: 20,
      height: 20,
      borderRadius: 10,
      marginRight: Spacing.xs,
    },
    cardUsername: {
      color: TEXT_PRIMARY,
      fontSize: 11,
      fontWeight: '500',
      flex: 1,
    },
    cardDistance: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2,
    },
    cardDistanceText: {
      color: KLEIN_BLUE,
      fontSize: 9,
      fontWeight: '500',
    },
    cardFooter: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardStats: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    cardStat: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 3,
    },
    cardStatText: {
      color: TEXT_MUTED,
      fontSize: 10,
      fontWeight: '400',
    },

    // ========== 硬核筛选器面板 ==========
    filterPanel: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 100,
    },
    filterPanelContent: {
      position: 'absolute',
      top: 100,
      right: Spacing.lg,
      width: 280,
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.lg,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 8,
    },
    filterPanelTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.lg,
    },
    filterSection: {
      marginBottom: Spacing.lg,
    },
    filterSectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: TEXT_SECONDARY,
      marginBottom: Spacing.sm,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    filterOptions: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    filterOption: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: BORDER_LIGHT,
      backgroundColor: BACKGROUND_LIGHT,
    },
    filterOptionActive: {
      borderColor: KLEIN_BLUE,
      backgroundColor: KLEIN_BLUE,
    },
    filterOptionText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
    },
    filterOptionTextActive: {
      color: '#FFFFFF',
    },
    filterApplyBtn: {
      backgroundColor: KLEIN_BLUE,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
      marginTop: Spacing.md,
    },
    filterApplyBtnText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
    },

    // ========== 列表底部 ==========
    listFooter: {
      alignItems: 'center',
      paddingVertical: Spacing['2xl'],
    },
    footerBrand: {
      color: TEXT_MUTED,
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 4,
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
      color: TEXT_MUTED,
      fontSize: 14,
      fontWeight: '400',
    },

    loadingState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    loadingText: {
      color: TEXT_MUTED,
      fontSize: 13,
      marginTop: Spacing.md,
    },

    errorState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
      paddingHorizontal: Spacing.xl,
    },
    errorText: {
      color: ACCENT_RED,
      fontSize: 13,
      textAlign: 'center',
    },
    retryButton: {
      marginTop: Spacing.lg,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.full,
      backgroundColor: KLEIN_BLUE,
    },
    retryButtonText: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '500',
    },
  });
};
