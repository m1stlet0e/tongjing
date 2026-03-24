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
  });
};
