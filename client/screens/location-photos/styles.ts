import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      paddingBottom: 100,
    },
    header: {
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["4xl"],
      paddingBottom: Spacing["2xl"],
    },
    title: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: '700',
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: Spacing.sm,
    },
    gridContainer: {
      padding: Spacing["2xl"],
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
    },
    gridItem: {
      width: '48%',
      aspectRatio: 1,
      borderRadius: BorderRadius.lg,
      overflow: 'hidden',
    },
    gridImage: {
      width: '100%',
      height: '100%',
    },
    gridOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      padding: Spacing.md,
      backgroundColor: 'rgba(0,0,0,0.6)',
    },
    gridTitle: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    gridAuthor: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 11,
      marginTop: 2,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing["6xl"],
    },
  });
};
