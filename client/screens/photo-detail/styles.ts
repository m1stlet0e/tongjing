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
export const SUCCESS_GREEN = '#4CAF50';
export const DARK_BG = '#0A0A0F';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: DARK_BG,
    },

    // ========== 上半屏：全屏大图 ==========  
    imageSection: {
      position: 'relative',
    },
    fullImage: {
      width: '100%',
      height: Dimensions.get('window').height * 0.55,
    },
    imageOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingTop: Platform.OS === 'web' ? Spacing.lg : Spacing.xl,
      paddingHorizontal: Spacing.lg,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    imageActions: {
      flexDirection: 'row',
      gap: Spacing.sm,
    },
    imageActionBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ========== 下半屏：滑动面板 ==========
    detailPanel: {
      flex: 1,
      backgroundColor: CARD_WHITE,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      marginTop: -24,
    },
    panelHandle: {
      width: 40,
      height: 4,
      borderRadius: 2,
      backgroundColor: BORDER_LIGHT,
      alignSelf: 'center',
      marginTop: Spacing.md,
      marginBottom: Spacing.sm,
    },
    panelScroll: {
      flex: 1,
    },
    panelContent: {
      padding: Spacing.lg,
    },

    // 作者与文案区
    authorSection: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    authorAvatar: {
      width: 48,
      height: 48,
      borderRadius: 24,
      marginRight: Spacing.md,
    },
    authorInfo: {
      flex: 1,
    },
    authorName: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    authorMeta: {
      fontSize: 12,
      color: TEXT_MUTED,
      marginTop: 2,
    },
    followBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: KLEIN_BLUE,
    },
    followBtnText: {
      fontSize: 13,
      fontWeight: '500',
      color: KLEIN_BLUE,
    },

    // 标题与描述
    photoTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.sm,
    },
    photoDescription: {
      fontSize: 14,
      color: TEXT_SECONDARY,
      lineHeight: 22,
      marginBottom: Spacing.lg,
    },
    
    // 拍摄Tips
    tipsCard: {
      backgroundColor: 'rgba(0,47,167,0.05)',
      borderRadius: 12,
      padding: Spacing.md,
      marginBottom: Spacing.lg,
    },
    tipsHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
      gap: Spacing.sm,
    },
    tipsTitle: {
      fontSize: 13,
      fontWeight: '600',
      color: KLEIN_BLUE,
    },
    tipsContent: {
      fontSize: 13,
      color: TEXT_SECONDARY,
      lineHeight: 20,
    },

    // EXIF参数仪表盘
    exifDashboard: {
      backgroundColor: BACKGROUND_LIGHT,
      borderRadius: 16,
      padding: Spacing.lg,
      marginBottom: Spacing.lg,
    },
    exifDashboardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.md,
    },
    exifGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    exifGridItem: {
      width: '47%',
      alignItems: 'center',
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.md,
    },
    exifGridIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,47,167,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    exifGridLabel: {
      fontSize: 10,
      color: TEXT_MUTED,
      marginBottom: 2,
    },
    exifGridValue: {
      fontSize: 13,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      textAlign: 'center',
    },

    // 机位地图卡片
    locationCard: {
      backgroundColor: BACKGROUND_LIGHT,
      borderRadius: 16,
      overflow: 'hidden',
      marginBottom: Spacing.lg,
    },
    locationMiniMap: {
      height: 120,
      backgroundColor: BORDER_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationMiniMapText: {
      fontSize: 12,
      color: TEXT_MUTED,
    },
    locationInfo: {
      padding: Spacing.md,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    locationName: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    locationNameText: {
      fontSize: 14,
      fontWeight: '500',
      color: TEXT_PRIMARY,
    },
    navigateBtn: {
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      backgroundColor: KLEIN_BLUE,
      borderRadius: BorderRadius.full,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    navigateBtnText: {
      fontSize: 12,
      color: '#FFFFFF',
      fontWeight: '500',
    },

    // 标签
    tagsRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.xl,
    },
    tag: {
      paddingVertical: Spacing.xs,
      paddingHorizontal: Spacing.md,
      backgroundColor: BACKGROUND_LIGHT,
      borderRadius: BorderRadius.full,
    },
    tagText: {
      fontSize: 12,
      color: TEXT_SECONDARY,
    },

    // ========== 底部悬浮操作栏 ==========
    bottomBar: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: Spacing.lg,
      paddingBottom: Spacing.xl,
      backgroundColor: CARD_WHITE,
      borderTopWidth: 1,
      borderTopColor: BORDER_LIGHT,
      gap: Spacing.lg,
    },
    statBtn: {
      alignItems: 'center',
    },
    statBtnIcon: {
      marginBottom: 2,
    },
    statBtnText: {
      fontSize: 10,
      color: TEXT_MUTED,
    },
    planBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: KLEIN_BLUE,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    planBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};
