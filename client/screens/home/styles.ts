import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 克莱因蓝高定风配色
export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const DEEP_SPACE_BLACK = '#0A0A0F';
export const SOFT_WHITE = '#FAFAFA';
export const WARM_GRAY = '#1A1A1F';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = Spacing.md;
const CARD_MARGIN = Spacing.lg;
const CARD_WIDTH = (SCREEN_WIDTH - CARD_MARGIN * 2 - CARD_GAP) / 2;

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    // 容器
    container: {
      flex: 1,
      backgroundColor: DEEP_SPACE_BLACK,
    },

    // ========== Stories 横向滚动条 ==========
    storiesSection: {
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(255,255,255,0.05)',
    },
    storiesScrollContent: {
      paddingHorizontal: CARD_MARGIN,
      gap: Spacing.md,
    },
    storyItem: {
      alignItems: 'center',
      width: 72,
    },
    storyRing: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 2,
      borderColor: CHAMPAGNE_GOLD,
      padding: 2,
      marginBottom: Spacing.xs,
    },
    storyAvatar: {
      width: '100%',
      height: '100%',
      borderRadius: 28,
    },
    storyAddRing: {
      borderColor: 'rgba(255,255,255,0.2)',
      borderStyle: 'dashed',
    },
    storyAddBtn: {
      width: 64,
      height: 64,
      borderRadius: 32,
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.2)',
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    storyName: {
      color: 'rgba(255,255,255,0.6)',
      fontSize: 10,
      fontWeight: '300',
      letterSpacing: 0.3,
      textAlign: 'center',
    },
    storyNameActive: {
      color: SOFT_WHITE,
    },

    // ========== 标签导航 ==========
    tabsSection: {
      backgroundColor: DEEP_SPACE_BLACK,
      paddingVertical: Spacing.sm,
    },
    tabsScrollContent: {
      paddingHorizontal: CARD_MARGIN,
    },
    tabItem: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      marginRight: Spacing.md,
    },
    tabText: {
      color: 'rgba(255,255,255,0.4)',
      fontSize: 13,
      fontWeight: '400',
      letterSpacing: 0.5,
    },
    tabTextActive: {
      color: SOFT_WHITE,
      fontSize: 13,
      fontWeight: '600',
      letterSpacing: 0.5,
    },
    tabIndicator: {
      position: 'absolute',
      bottom: 0,
      height: 2,
      backgroundColor: CHAMPAGNE_GOLD,
      borderRadius: 1,
    },

    // ========== 瀑布流列表 ==========
    masonryContainer: {
      paddingHorizontal: CARD_MARGIN,
      paddingTop: Spacing.sm,
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
      backgroundColor: WARM_GRAY,
      borderRadius: 12,
      overflow: 'hidden',
      width: CARD_WIDTH,
    },
    photoImage: {
      width: '100%',
    },
    photoOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      paddingTop: Spacing['2xl'],
      paddingHorizontal: Spacing.sm,
      paddingBottom: Spacing.sm,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    photoTitle: {
      color: SOFT_WHITE,
      fontSize: 12,
      fontWeight: '400',
      letterSpacing: 0.2,
      marginBottom: 2,
    },
    photoLocation: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: 10,
      fontWeight: '300',
    },
    
    // 卡片内容
    cardContent: {
      padding: Spacing.sm,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xs,
    },
    cardAvatar: {
      width: 24,
      height: 24,
      borderRadius: 12,
      marginRight: Spacing.sm,
      borderWidth: 1,
      borderColor: 'rgba(201,169,110,0.3)',
    },
    cardUsername: {
      color: SOFT_WHITE,
      fontSize: 11,
      fontWeight: '400',
      letterSpacing: 0.2,
      flex: 1,
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
      color: 'rgba(255,255,255,0.5)',
      fontSize: 10,
      fontWeight: '300',
    },

    // ========== 列表底部 ==========
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
      opacity: 0.25,
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
