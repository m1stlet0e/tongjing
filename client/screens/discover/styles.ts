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
      fontSize: 28,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    filterSection: {
      paddingHorizontal: Spacing["2xl"],
      marginBottom: Spacing["2xl"],
    },
    filterLabel: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: Spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    filterScroll: {
      marginHorizontal: -Spacing["2xl"],
    },
    filterScrollContent: {
      paddingHorizontal: Spacing["2xl"],
      gap: Spacing.sm,
    },
    filterChip: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    filterChipActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    filterChipText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    filterChipTextActive: {
      color: '#FFFFFF',
    },
    divider: {
      height: 1,
      backgroundColor: theme.borderLight,
      marginHorizontal: Spacing["2xl"],
      marginVertical: Spacing.xl,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 20,
      fontWeight: '700',
      paddingHorizontal: Spacing["2xl"],
      marginBottom: Spacing.lg,
    },
    gridContainer: {
      paddingHorizontal: Spacing["2xl"],
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
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    gridTitle: {
      color: '#FFFFFF',
      fontSize: 13,
      fontWeight: '600',
    },
    gridStats: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 11,
      marginTop: 2,
    },
  });
};
