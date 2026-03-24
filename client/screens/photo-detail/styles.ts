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
    image: {
      width: '100%',
      aspectRatio: 4 / 3,
    },
    content: {
      padding: Spacing["2xl"],
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.xl,
    },
    avatar: {
      width: 50,
      height: 50,
      borderRadius: 25,
    },
    userInfo: {
      flex: 1,
      marginLeft: Spacing.lg,
    },
    username: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '600',
    },
    location: {
      color: theme.textSecondary,
      fontSize: 13,
      marginTop: 2,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 24,
      fontWeight: '700',
      marginBottom: Spacing.md,
    },
    description: {
      color: theme.textSecondary,
      fontSize: 15,
      lineHeight: 22,
      marginBottom: Spacing.xl,
    },
    section: {
      marginBottom: Spacing.xl,
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '600',
      marginBottom: Spacing.md,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    exifCard: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    exifRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.lg,
    },
    exifItem: {
      width: '48%',
    },
    exifLabel: {
      color: theme.textMuted,
      fontSize: 11,
      marginBottom: 2,
    },
    exifValue: {
      color: theme.textPrimary,
      fontSize: 14,
      fontWeight: '500',
    },
    tipsCard: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
    },
    tipsText: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 20,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    tag: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.sm,
      borderRadius: BorderRadius.full,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 12,
    },
    footer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: theme.backgroundRoot,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
      paddingHorizontal: Spacing["2xl"],
      paddingVertical: Spacing.lg,
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xl,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.sm,
    },
    statText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
    actionButton: {
      flex: 1,
      backgroundColor: theme.primary,
      paddingVertical: Spacing.lg,
      alignItems: 'center',
    },
    actionButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 1,
    },
  });
};
