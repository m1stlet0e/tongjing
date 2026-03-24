import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    mapContainer: {
      flex: 1,
      backgroundColor: theme.backgroundTertiary,
    },
    map: {
      flex: 1,
    },
    mapPlaceholder: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    mapPlaceholderText: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: Spacing.md,
    },
    header: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["4xl"],
      paddingBottom: Spacing.xl,
      backgroundColor: theme.backgroundRoot,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 4,
    },
    spotsList: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundRoot,
      borderTopLeftRadius: BorderRadius["2xl"],
      borderTopRightRadius: BorderRadius["2xl"],
      paddingVertical: Spacing.xl,
      maxHeight: '45%',
    },
    spotsTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      paddingHorizontal: Spacing["2xl"],
      marginBottom: Spacing.lg,
    },
    spotCard: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: Spacing["2xl"],
      paddingVertical: Spacing.md,
    },
    spotImageContainer: {
      width: 48,
      height: 48,
      borderRadius: BorderRadius.md,
      justifyContent: 'center',
      alignItems: 'center',
    },
    spotImage: {
      width: 60,
      height: 60,
      borderRadius: BorderRadius.md,
    },
    spotInfo: {
      flex: 1,
      marginLeft: Spacing.lg,
    },
    spotName: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    spotStats: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
    spotPhotos: {
      color: theme.primary,
      fontSize: 12,
      marginTop: 2,
    },
    loadingContainer: {
      paddingVertical: Spacing["2xl"],
      alignItems: 'center',
    },
    emptyContainer: {
      marginHorizontal: Spacing["2xl"],
      padding: Spacing["2xl"],
      borderRadius: BorderRadius.lg,
      alignItems: 'center',
    },
    emptyText: {
      fontSize: 14,
      marginTop: Spacing.md,
    },
    emptyHint: {
      fontSize: 12,
      marginTop: Spacing.sm,
      textAlign: 'center',
    },
    // 地图标记样式
    markerContainer: {
      width: 40,
      height: 40,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerImageContainer: {
      width: 36,
      height: 36,
      borderRadius: 18,
      justifyContent: 'center',
      alignItems: 'center',
    },
    markerImage: {
      width: '100%',
      height: '100%',
    },
    // Callout 样式
    calloutContainer: {
      width: 200,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
      elevation: 4,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.15,
      shadowRadius: 4,
    },
    calloutImage: {
      width: '100%',
      height: 100,
    },
    calloutContent: {
      padding: Spacing.md,
    },
    calloutTitle: {
      fontSize: 14,
      fontWeight: '600',
    },
    calloutLocation: {
      fontSize: 12,
      marginTop: 4,
    },
    calloutStats: {
      flexDirection: 'row',
      alignItems: 'center',
      marginTop: 6,
    },
    calloutStatText: {
      fontSize: 11,
    },
  });
};
