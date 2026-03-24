import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    card: {
      backgroundColor: theme.backgroundDefault,
      marginBottom: Spacing.lg,
      overflow: 'hidden',
    },
    imageContainer: {
      position: 'relative',
    },
    image: {
      width: '100%',
      aspectRatio: 4 / 3,
    },
    exifOverlay: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.md,
    },
    exifRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    exifItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    exifIcon: {
      width: 14,
      height: 14,
    },
    exifText: {
      color: '#FFFFFF',
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 0.5,
    },
    content: {
      padding: Spacing.lg,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: Spacing.md,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: Spacing.md,
    },
    userInfo: {
      flex: 1,
    },
    username: {
      color: theme.textPrimary,
      fontSize: 15,
      fontWeight: '600',
    },
    location: {
      color: theme.textMuted,
      fontSize: 12,
      marginTop: 2,
    },
    title: {
      color: theme.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: Spacing.sm,
    },
    description: {
      color: theme.textSecondary,
      fontSize: 14,
      lineHeight: 20,
      marginBottom: Spacing.md,
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
      marginBottom: Spacing.md,
    },
    tag: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.md,
      paddingVertical: Spacing.xs,
      borderRadius: BorderRadius.full,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 11,
      fontWeight: '500',
    },
    footer: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: Spacing.md,
      borderTopWidth: 1,
      borderTopColor: theme.borderLight,
    },
    statsContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xl,
    },
    statItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.xs,
    },
    statText: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    actionButton: {
      padding: Spacing.sm,
    },
  });
};
