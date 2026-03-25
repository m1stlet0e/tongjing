import { StyleSheet, Platform, Dimensions } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const KLEIN_BLUE = '#002FA7';
export const CHAMPAGNE_GOLD = '#C9A96E';
export const BACKGROUND_LIGHT = '#FAFAFA';
export const CARD_WHITE = '#FFFFFF';
export const TEXT_PRIMARY = '#1A1A1A';
export const TEXT_SECONDARY = '#666666';
export const TEXT_MUTED = '#999999';
export const BORDER_LIGHT = '#EEEEEE';
export const DARK_BG = '#0A0A0F';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    // ========== 地图层 ==========
    mapContainer: {
      flex: 1,
      backgroundColor: '#E8E8E8',
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#E8E8E8',
    },
    mapPlaceholderText: {
      color: TEXT_MUTED,
      fontSize: 14,
      marginTop: Spacing.md,
    },

    // ========== 顶部悬浮控件 ==========
    topWidgets: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: Platform.OS === 'web' ? Spacing.lg : Spacing.xl,
      paddingHorizontal: Spacing.lg,
      zIndex: 10,
    },
    
    // AI环境预测条
    aiPredictBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: CARD_WHITE,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      marginBottom: Spacing.md,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    aiPredictIcon: {
      width: 32,
      height: 32,
      borderRadius: 16,
      backgroundColor: '#FFF8E1',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: Spacing.sm,
    },
    aiPredictText: {
      flex: 1,
      fontSize: 12,
      color: TEXT_PRIMARY,
      lineHeight: 16,
    },
    aiPredictHighlight: {
      color: KLEIN_BLUE,
      fontWeight: '600',
    },

    // 搜索栏
    mapSearchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: CARD_WHITE,
      borderRadius: BorderRadius.lg,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.sm,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 8,
      elevation: 4,
    },
    mapSearchInput: {
      flex: 1,
      marginLeft: Spacing.sm,
      fontSize: 14,
      color: TEXT_PRIMARY,
    },

    // ========== 照片气泡 ==========
    photoBubble: {
      position: 'absolute',
      width: 60,
      height: 60,
      borderRadius: 30,
      borderWidth: 3,
      borderColor: CARD_WHITE,
      overflow: 'hidden',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.2,
      shadowRadius: 4,
      elevation: 4,
    },
    photoBubbleImage: {
      width: '100%',
      height: '100%',
    },
    photoBubbleHot: {
      borderColor: KLEIN_BLUE,
      width: 70,
      height: 70,
      borderRadius: 35,
    },

    // ========== 底部抽屉面板 ==========
    bottomSheet: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: CARD_WHITE,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: -4 },
      shadowOpacity: 0.1,
      shadowRadius: 12,
      elevation: 8,
      maxHeight: SCREEN_HEIGHT * 0.6,
    },
    bottomSheetHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: BORDER_LIGHT,
      alignSelf: 'center',
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    bottomSheetHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: Spacing.lg,
      paddingBottom: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    bottomSheetTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    bottomSheetCount: {
      fontSize: 12,
      color: TEXT_MUTED,
    },
    bottomSheetList: {
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    
    // 机位卡片
    locationCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: BORDER_LIGHT,
    },
    locationImage: {
      width: 60,
      height: 60,
      borderRadius: 8,
      marginRight: Spacing.md,
    },
    locationInfo: {
      flex: 1,
    },
    locationName: {
      fontSize: 14,
      fontWeight: '500',
      color: TEXT_PRIMARY,
      marginBottom: 2,
    },
    locationDistance: {
      fontSize: 12,
      color: KLEIN_BLUE,
      marginBottom: 2,
    },
    locationMeta: {
      fontSize: 11,
      color: TEXT_MUTED,
    },
    locationNavigateBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: KLEIN_BLUE,
      borderRadius: BorderRadius.full,
    },
    locationNavigateBtnText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '500',
    },

    // ========== 定位按钮 ==========
    locateBtn: {
      position: 'absolute',
      right: Spacing.lg,
      bottom: SCREEN_HEIGHT * 0.35,
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: CARD_WHITE,
      justifyContent: 'center',
      alignItems: 'center',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },

    // ========== 空状态 ==========
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyText: {
      color: TEXT_MUTED,
      fontSize: 14,
      marginTop: Spacing.md,
    },
  });
};
