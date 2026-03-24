import { StyleSheet } from 'react-native';
import { Spacing, BorderRadius, Theme } from '@/constants/theme';

export const createStyles = (theme: Theme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    scrollContent: {
      flexGrow: 1,
      paddingHorizontal: Spacing["2xl"],
      paddingTop: Spacing["6xl"],
      paddingBottom: Spacing["3xl"],
    },
    header: {
      alignItems: 'center',
      marginBottom: Spacing["4xl"],
    },
    logo: {
      width: 80,
      height: 80,
      marginBottom: Spacing["2xl"],
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
    form: {
      marginBottom: Spacing["3xl"],
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: Spacing.sm,
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: BorderRadius.md,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      color: theme.textPrimary,
      fontSize: 16,
    },
    inputError: {
      borderWidth: 1,
      borderColor: theme.error,
    },
    errorText: {
      color: theme.error,
      fontSize: 12,
      marginTop: Spacing.xs,
    },
    codeRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: Spacing.md,
    },
    codeInput: {
      flex: 1,
    },
    codeButton: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      borderRadius: BorderRadius.md,
      minWidth: 120,
      alignItems: 'center',
    },
    codeButtonDisabled: {
      opacity: 0.5,
    },
    codeButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    loginButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.xl,
      borderRadius: 0,
      alignItems: 'center',
      marginTop: Spacing.xl,
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 1,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing["3xl"],
    },
    dividerLine: {
      flex: 1,
      height: 1,
      backgroundColor: theme.border,
    },
    dividerText: {
      color: theme.textMuted,
      fontSize: 12,
      marginHorizontal: Spacing.lg,
    },
    oauthContainer: {
      alignItems: 'center',
    },
    oauthTitle: {
      color: theme.textSecondary,
      fontSize: 13,
      marginBottom: Spacing.xl,
    },
    oauthButtons: {
      flexDirection: 'row',
      gap: Spacing["2xl"],
    },
    oauthButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
    },
    wechatButton: {
      backgroundColor: '#07C160',
    },
    weiboButton: {
      backgroundColor: '#E6162D',
    },
    agreement: {
      marginTop: Spacing["3xl"],
      alignItems: 'center',
    },
    agreementText: {
      color: theme.textMuted,
      fontSize: 12,
      textAlign: 'center',
    },
    agreementLink: {
      color: theme.primary,
    },
  });
};
