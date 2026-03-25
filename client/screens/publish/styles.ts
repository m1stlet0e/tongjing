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

const { width: SCREEN_WIDTH } = Dimensions.get('window');

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: BACKGROUND_LIGHT,
    },
    scrollContent: {
      flexGrow: 1,
    },

    // ========== 步骤一：选图区 ==========
    selectSection: {
      flex: 1,
      padding: Spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: Spacing.lg,
    },
    
    // 照片网格
    photoGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    photoGridItem: {
      width: (SCREEN_WIDTH - Spacing.lg * 2 - Spacing.sm * 2) / 3,
      aspectRatio: 1,
      borderRadius: 8,
      overflow: 'hidden',
    },
    photoGridImage: {
      width: '100%',
      height: '100%',
    },
    photoGridSelected: {
      borderWidth: 3,
      borderColor: KLEIN_BLUE,
    },
    photoGridPlaceholder: {
      backgroundColor: BORDER_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },

    // ========== AI解析动画 ==========
    analyzingOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,47,167,0.95)',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 100,
    },
    analyzingContent: {
      alignItems: 'center',
    },
    analyzingIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: 'rgba(255,255,255,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    analyzingTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: '#FFFFFF',
      marginBottom: Spacing.sm,
    },
    analyzingText: {
      fontSize: 14,
      color: 'rgba(255,255,255,0.7)',
      marginBottom: Spacing.xl,
    },
    analyzingProgress: {
      width: 200,
      height: 3,
      backgroundColor: 'rgba(255,255,255,0.2)',
      borderRadius: 1.5,
      overflow: 'hidden',
    },
    analyzingProgressBar: {
      height: '100%',
      backgroundColor: '#FFFFFF',
      width: '60%',
    },

    // ========== 步骤二：编辑区 ==========
    editContainer: {
      flex: 1,
    },

    // 预览区
    previewSection: {
      position: 'relative',
    },
    previewImage: {
      width: '100%',
      height: 300,
    },
    previewToolbar: {
      position: 'absolute',
      right: Spacing.md,
      top: '50%',
      marginTop: -60,
      gap: Spacing.sm,
    },
    previewToolBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(0,0,0,0.6)',
      justifyContent: 'center',
      alignItems: 'center',
    },

    // 信息卡片区
    infoSection: {
      padding: Spacing.lg,
      gap: Spacing.lg,
    },

    // 文案输入
    captionCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.md,
    },
    captionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.sm,
    },
    captionLabel: {
      fontSize: 12,
      fontWeight: '600',
      color: TEXT_SECONDARY,
    },
    aiWriteBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: 4,
      paddingHorizontal: Spacing.sm,
      borderRadius: BorderRadius.full,
      backgroundColor: 'rgba(0,47,167,0.1)',
    },
    aiWriteBtnText: {
      fontSize: 11,
      color: KLEIN_BLUE,
      fontWeight: '500',
    },
    captionInput: {
      fontSize: 15,
      color: TEXT_PRIMARY,
      lineHeight: 22,
      minHeight: 80,
    },

    // EXIF参数区
    exifCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.md,
    },
    exifHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: Spacing.md,
    },
    exifTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    exifEditBtn: {
      fontSize: 12,
      color: KLEIN_BLUE,
    },
    exifGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    exifItem: {
      width: '48%',
      backgroundColor: BACKGROUND_LIGHT,
      borderRadius: 8,
      padding: Spacing.sm,
    },
    exifLabel: {
      fontSize: 10,
      color: TEXT_MUTED,
      marginBottom: 2,
    },
    exifValue: {
      fontSize: 13,
      fontWeight: '500',
      color: TEXT_PRIMARY,
    },

    // 位置打卡区
    locationCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.md,
    },
    locationHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    locationTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginLeft: Spacing.sm,
    },
    locationMiniMap: {
      height: 100,
      backgroundColor: BORDER_LIGHT,
      borderRadius: 8,
      justifyContent: 'center',
      alignItems: 'center',
    },
    locationMiniMapText: {
      fontSize: 12,
      color: TEXT_MUTED,
    },
    locationName: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: Spacing.sm,
      gap: Spacing.xs,
    },
    locationNameText: {
      fontSize: 13,
      color: TEXT_PRIMARY,
    },

    // 底部操作区
    footerActions: {
      flexDirection: 'row',
      padding: Spacing.lg,
      gap: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: BORDER_LIGHT,
      backgroundColor: CARD_WHITE,
    },
    draftBtn: {
      flex: 1,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      borderWidth: 1,
      borderColor: BORDER_LIGHT,
      alignItems: 'center',
    },
    draftBtnText: {
      fontSize: 14,
      color: TEXT_SECONDARY,
    },
    publishBtn: {
      flex: 2,
      paddingVertical: Spacing.md,
      borderRadius: BorderRadius.lg,
      backgroundColor: KLEIN_BLUE,
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing.sm,
    },
    publishBtnText: {
      fontSize: 15,
      fontWeight: '600',
      color: '#FFFFFF',
    },
  });
};
