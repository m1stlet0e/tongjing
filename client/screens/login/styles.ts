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
      letterSpacing: 2,
    },
    subtitle: {
      color: theme.textSecondary,
      fontSize: 14,
      letterSpacing: 1,
    },
    form: {
      marginBottom: Spacing["2xl"],
    },
    inputContainer: {
      marginBottom: Spacing.lg,
    },
    inputLabel: {
      color: theme.textPrimary,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: Spacing.sm,
      letterSpacing: 0.5,
    },
    input: {
      backgroundColor: theme.backgroundTertiary,
      borderRadius: 0,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      color: theme.textPrimary,
      fontSize: 16,
      borderWidth: 1,
      borderColor: 'transparent',
    },
    inputFocused: {
      borderColor: theme.primary,
    },
    inputError: {
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
    },
    codeInput: {
      flex: 1,
      marginRight: Spacing.md,
    },
    codeButton: {
      backgroundColor: theme.backgroundTertiary,
      paddingHorizontal: Spacing.lg,
      paddingVertical: Spacing.lg,
      borderRadius: 0,
      minWidth: 110,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.primary,
    },
    codeButtonDisabled: {
      borderColor: theme.border,
    },
    codeButtonText: {
      color: theme.primary,
      fontSize: 14,
      fontWeight: '500',
    },
    codeButtonTextDisabled: {
      color: theme.textMuted,
    },
    loginButton: {
      backgroundColor: theme.primary,
      paddingVertical: Spacing.xl,
      borderRadius: 0,
      alignItems: 'center',
      marginTop: Spacing["2xl"],
    },
    loginButtonDisabled: {
      opacity: 0.6,
    },
    loginButtonText: {
      color: '#FFFFFF',
      fontSize: 16,
      fontWeight: '600',
      letterSpacing: 2,
    },
    divider: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: Spacing["2xl"],
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
    oauthButtons: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: Spacing["4xl"],
      marginTop: Spacing.xl,
    },
    oauthButtonItem: {
      alignItems: 'center',
    },
    oauthButton: {
      width: 56,
      height: 56,
      borderRadius: 28,
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: Spacing.sm,
    },
    wechatButton: {
      backgroundColor: '#07C160',
    },
    weiboButton: {
      backgroundColor: '#E6162D',
    },
    oauthButtonText: {
      color: theme.textSecondary,
      fontSize: 12,
      marginTop: Spacing.xs,
    },
    agreement: {
      marginTop: 'auto',
      paddingTop: Spacing["3xl"],
      alignItems: 'center',
    },
    agreementText: {
      color: theme.textMuted,
      fontSize: 11,
      textAlign: 'center',
      lineHeight: 20,
    },
    agreementLink: {
      color: theme.primary,
    },
    // Toast样式
    toast: {
      position: 'absolute',
      top: 60,
      left: Spacing["2xl"],
      right: Spacing["2xl"],
      backgroundColor: theme.textPrimary,
      paddingVertical: Spacing.md,
      paddingHorizontal: Spacing.lg,
      borderRadius: BorderRadius.md,
      alignItems: 'center',
    },
    toastText: {
      color: theme.backgroundRoot,
      fontSize: 14,
    },
    toastError: {
      backgroundColor: theme.error,
    },
    toastSuccess: {
      backgroundColor: theme.success,
    },
  });
};
