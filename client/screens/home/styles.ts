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
    headerLabel: {
      color: theme.accent,
      fontSize: 11,
      fontWeight: '300',
      letterSpacing: 6,
      textTransform: 'uppercase',
      marginBottom: Spacing.md,
    },
    headerTitle: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '200',
      marginBottom: Spacing.sm,
    },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.7)',
      fontSize: 14,
      fontWeight: '300',
    },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: theme.backgroundDefault,
      paddingHorizontal: Spacing["2xl"],
      paddingVertical: Spacing.md,
      borderBottomWidth: 1,
      borderBottomColor: theme.borderLight,
    },
    tab: {
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.xl,
      marginRight: Spacing.md,
      borderRadius: BorderRadius.full,
    },
    tabActive: {
      backgroundColor: theme.primary,
    },
    tabText: {
      color: theme.textSecondary,
      fontSize: 13,
      fontWeight: '500',
    },
    tabTextActive: {
      color: '#FFFFFF',
      fontWeight: '600',
    },
    listContainer: {
      padding: Spacing["2xl"],
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing["6xl"],
    },
    loadingText: {
      color: theme.textSecondary,
      fontSize: 14,
      marginTop: Spacing.md,
    },
    emptyContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: Spacing["6xl"],
    },
    emptyText: {
      color: theme.textSecondary,
      fontSize: 14,
    },
  });
};
