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
      backgroundColor: BACKGROUND_LIGHT,
    },

    // ========== 头部个人信息区 ==========
    headerSection: {
      backgroundColor: CARD_WHITE,
      paddingTop: Platform.OS === 'web' ? Spacing.lg : Spacing.xl,
      paddingBottom: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    headerContent: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      marginBottom: Spacing.lg,
    },
    userInfo: {
      flexDirection: 'row',
      flex: 1,
    },
    avatar: {
      width: 64,
      height: 64,
      borderRadius: 32,
      marginRight: Spacing.md,
    },
    userTextInfo: {
      flex: 1,
      justifyContent: 'center',
    },
    username: {
      fontSize: 18,
      fontWeight: '600',
      color: TEXT_PRIMARY,
      marginBottom: 2,
    },
    userLevel: {
      fontSize: 11,
      color: KLEIN_BLUE,
      marginBottom: 4,
    },
    userBio: {
      fontSize: 12,
      color: TEXT_MUTED,
    },
    editBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.md,
      borderRadius: BorderRadius.full,
      borderWidth: 1,
      borderColor: BORDER_LIGHT,
    },
    editBtnText: {
      fontSize: 12,
      color: KLEIN_BLUE,
    },

    // 统计数据条
    statsBar: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: BORDER_LIGHT,
    },
    statItem: {
      alignItems: 'center',
    },
    statNum: {
      fontSize: 20,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    statLabel: {
      fontSize: 11,
      color: TEXT_MUTED,
      marginTop: 2,
    },

    // ========== 通用Section ==========
    section: {
      marginTop: Spacing.lg,
      paddingHorizontal: Spacing.lg,
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_PRIMARY,
    },
    sectionMore: {
      fontSize: 12,
      color: KLEIN_BLUE,
    },

    // ========== 装备库 ==========
    equipmentList: {
      gap: Spacing.sm,
    },
    equipmentCard: {
      width: 110,
      backgroundColor: CARD_WHITE,
      borderRadius: 12,
      padding: Spacing.md,
      alignItems: 'center',
    },
    equipmentIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: 'rgba(0,47,167,0.1)',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    equipmentName: {
      fontSize: 11,
      color: TEXT_PRIMARY,
      textAlign: 'center',
    },
    addEquipmentCard: {
      borderWidth: 1,
      borderStyle: 'dashed',
      borderColor: BORDER_LIGHT,
      backgroundColor: 'transparent',
    },

    // ========== 足迹地图 ==========
    footprintCard: {
      backgroundColor: CARD_WHITE,
      borderRadius: 16,
      overflow: 'hidden',
    },
    footprintMap: {
      height: 120,
      backgroundColor: BACKGROUND_LIGHT,
      justifyContent: 'center',
      alignItems: 'center',
    },
    footprintMapText: {
      fontSize: 12,
      color: TEXT_MUTED,
      marginTop: Spacing.sm,
    },
    footprintCities: {
      padding: Spacing.md,
    },
    footprintCitiesTitle: {
      fontSize: 12,
      fontWeight: '600',
      color: TEXT_SECONDARY,
      marginBottom: Spacing.sm,
    },
    footprintCityList: {
      gap: Spacing.xs,
    },
    footprintCityItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.xs,
    },
    footprintCityIndex: {
      width: 20,
      fontSize: 12,
      fontWeight: '600',
      color: KLEIN_BLUE,
    },
    footprintCityName: {
      flex: 1,
      fontSize: 13,
      color: TEXT_PRIMARY,
    },
    footprintCityCount: {
      fontSize: 12,
      color: TEXT_MUTED,
    },

    // ========== 作品集网格 ==========
    worksGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 2,
    },
    workItem: {
      width: (SCREEN_WIDTH - Spacing.lg * 2 - 4) / 3,
      aspectRatio: 1,
    },
    workImage: {
      width: '100%',
      height: '100%',
      borderRadius: 4,
    },
    workOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: 4,
      backgroundColor: 'rgba(0,0,0,0.3)',
    },
    workMeta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4,
    },
    workLikes: {
      fontSize: 10,
      color: '#FFFFFF',
    },

    // ========== 加载与空状态 ==========
    loadingState: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyState: {
      alignItems: 'center',
      paddingVertical: Spacing['3xl'],
    },
    emptyText: {
      color: TEXT_MUTED,
      fontSize: 14,
      marginTop: Spacing.md,
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
