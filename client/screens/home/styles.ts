import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

// 配色方案
export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const BACKGROUND_LIGHT = '#FAFAFA';
export const CARD_WHITE = '#FFFFFF';
export const TEXT_PRIMARY = '#1A1A1A';
export const TEXT_SECONDARY = '#666666';
export const TEXT_MUTED = '#999999';
export const BORDER_LIGHT = '#EEEEEE';
export const ACCENT_RED = '#E53935';
export const SUCCESS_GREEN = '#4CAF50';
export const DARK_BG = '#0A0A0F';

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

    // ========== 顶部搜索栏 ==========
    searchHeader: {
      backgroundColor: CARD_WHITE,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    searchRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    searchBox: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: BACKGROUND_LIGHT,
      borderRadius: BorderRadius.full,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      gap: Spacing.sm,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: TEXT_PRIMARY,
    },
    searchPlaceholder: {
      color: TEXT_MUTED,
      fontSize: 14,
    },
    filterBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: BACKGROUND_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ========== 标签导航 ==========
    tabsSection: {
      backgroundColor: CARD_WHITE,
      paddingVertical: 0,
    },
    tabsScrollContent: {
      paddingHorizontal: CARD_MARGIN,
    },
    tabItem: {
      paddingVertical: Spacing.md,
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

    // 照片卡片
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
    cardContent: {
      padding: Spacing.sm,
    },
    cardFirstRow: {
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
    cardTitle: {
      flex: 1,
      fontSize: 12,
      fontWeight: '500',
      color: TEXT_PRIMARY,
    },
    cardSecondRow: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: 'rgba(0,47,167,0.08)',
      borderRadius: 4,
      paddingHorizontal: Spacing.xs,
      paddingVertical: 2,
      gap: 4,
    },
    cardExifText: {
      color: KLEIN_BLUE,
      fontSize: 9,
      fontWeight: '400',
    },
    cardDistanceText: {
      color: KLEIN_BLUE,
      fontSize: 9,
      fontWeight: '500',
    },

    // ========== 硬核筛选器侧边栏 ==========
    filterOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 100,
    },
    filterSidebar: {
      position: 'absolute',
      top: 0,
      right: 0,
      bottom: 0,
      width: 300,
      backgroundColor: CARD_WHITE,
      shadowColor: '#000',
      shadowOffset: { width: -4, height: 0 },
      shadowOpacity: 0.15,
      shadowRadius: 12,
      elevation: 16,
    },
    filterHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    filterTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    filterCloseBtn: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: BACKGROUND_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    filterScroll: {
      flex: 1,
    },
    filterScrollContent: {
      padding: Spacing.lg,
    },
    filterSection: {
      marginBottom: Spacing.xl,
    },
    filterSectionTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: TEXT_SECONDARY,
      marginBottom: Spacing.md,
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
    filterFooter: {
      flexDirection: 'row',
      padding: Spacing.lg,
      borderTopWidth: 1,
      borderTopColor: BORDER_LIGHT,
      gap: Spacing.md,
    },
    filterResetBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: BORDER_LIGHT,
      alignItems: 'center',
    },
    filterResetBtnText: {
      fontSize: 14,
      color: TEXT_SECONDARY,
    },
    filterApplyBtn: {
      flex: 2,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: KLEIN_BLUE,
      alignItems: 'center',
    },
    filterApplyBtnText: {
      fontSize: 14,
      fontWeight: '600',
      color: '#FFFFFF',
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
  });
};
