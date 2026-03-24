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
      backgroundColor: theme.primary,
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["4xl"],
      paddingBottom: Spacing["3xl"],
      alignItems: 'center',
    },
    avatar: {
      width: 80,
      height: 80,
      borderRadius: 40,
      borderWidth: 3,
      borderColor: theme.accent,
    },
    username: {
      color: '#FFFFFF',
      fontSize: 22,
      fontWeight: '600',
      marginTop: Spacing.lg,
    },
    bio: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 13,
      marginTop: Spacing.sm,
      textAlign: 'center',
    },
    statsRow: {
      flexDirection: 'row',
      marginTop: Spacing.xl,
      gap: Spacing["3xl"],
    },
    statItem: {
      alignItems: 'center',
    },
    statValue: {
      color: '#FFFFFF',
      fontSize: 20,
      fontWeight: '700',
    },
    statLabel: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 11,
      marginTop: 2,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    section: {
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["2xl"],
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: Spacing.lg,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
    },
    seeAll: {
      color: theme.primary,
      fontSize: 13,
    },
    equipmentScroll: {
      marginHorizontal: -Spacing["2xl"],
    },
    equipmentScrollContent: {
      paddingHorizontal: Spacing["2xl"],
      gap: Spacing.md,
    },
    equipmentCard: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      minWidth: 140,
    },
    equipmentBrand: {
      color: theme.primary,
      fontSize: 11,
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    equipmentModel: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '600',
      marginTop: Spacing.xs,
    },
    equipmentType: {
      color: theme.textMuted,
      fontSize: 11,
      marginTop: 2,
    },
    photosGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    photoItem: {
      width: '32%',
      aspectRatio: 1,
      borderRadius: BorderRadius.md,
      overflow: 'hidden',
    },
    photoImage: {
      width: '100%',
      height: '100%',
    },
    footprintCard: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginTop: Spacing.md,
    },
    footprintLocation: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    footprintCount: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: 2,
    },
  });
};
