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
      backgroundColor: theme.primary,
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '200',
    },
    section: {
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["2xl"],
    },
    sectionTitle: {
      color: theme.textPrimary,
      fontSize: 16,
      fontWeight: '600',
      marginBottom: Spacing.lg,
      textTransform: 'uppercase',
      letterSpacing: 1,
    },
    imagePicker: {
      aspectRatio: 1,
      borderRadius: BorderRadius.lg,
      backgroundColor: theme.backgroundTertiary,
      justifyContent: 'center',
      alignItems: 'center',
      borderWidth: 2,
      borderColor: theme.border,
      borderStyle: 'dashed',
    },
    imagePreview: {
      width: '100%',
      aspectRatio: 1,
      borderRadius: BorderRadius.lg,
    },
    imagePickerIcon: {
      color: theme.textMuted,
    },
    imagePickerText: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: Spacing.md,
    },
    exifCard: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.lg,
      padding: Spacing.lg,
      marginTop: Spacing.lg,
    },
    exifTitle: {
      color: theme.primary,
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      marginBottom: Spacing.md,
    },
    exifGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.md,
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
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      color: theme.textPrimary,
      fontSize: 15,
      marginBottom: Spacing.md,
    },
    textArea: {
      minHeight: 120,
      textAlignVertical: 'top',
    },
    tagsContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: Spacing.sm,
    },
    tag: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: Spacing.sm,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.full,
      backgroundColor: theme.backgroundTertiary,
      borderWidth: 1,
      borderColor: theme.border,
    },
    tagActive: {
      backgroundColor: theme.primary,
      borderColor: theme.primary,
    },
    tagText: {
      color: theme.textSecondary,
      fontSize: 13,
    },
    tagTextActive: {
      color: '#FFFFFF',
    },
    publishButton: {
      backgroundColor: theme.primary,
      marginHorizontal: Spacing["2xl"],
      marginVertical: Spacing["2xl"],
      paddingVertical: Spacing.xl,
      borderRadius: 0,
      alignItems: 'center',
    },
    publishButtonText: {
      color: '#FFFFFF',
      fontSize: 14,
      fontWeight: '600',
      letterSpacing: 2,
      textTransform: 'uppercase',
    },
  });
};
