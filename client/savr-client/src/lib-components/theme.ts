import { extendTheme } from '@mui/joy/styles';
import type { RecursivePartial } from './RecursivePartial';
import recursiveMerge from './recursiveMerge';

export interface ColorPalette {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  neutral: Record<string, string>;
  success: Record<string, string>;
  warning: Record<string, string>;
  error: Record<string, string>;
}

export const defaultGreenPalette: ColorPalette = {
  primary: {
    50: '#fafbf8',
    100: '#f5f6f2',
    200: '#e8eae4',
    300: '#d4a574',
    400: '#7fb069',
    500: '#5a7c65',
    600: '#4a6b56',
    700: '#3a5a47',
    800: '#2a4938',
    900: '#1a3829',
  },
  secondary: {
    50: '#fafbf8',
    100: '#f5f6f2',
    200: '#f0f1ed',
    300: '#e8eae4',
    400: '#b8bdb6',
    500: '#8a9189',
    600: '#3a3f3a',
    700: '#3a5a47',
    800: '#2a4938',
    900: '#1a3829',
  },
  neutral: {
    50: '#ffffff',
    100: '#fafbf8',
    200: '#f5f6f2',
    300: '#e8eae4',
    400: '#b8bdb6',
    500: '#8a9189',
    600: '#3a3f3a',
    700: '#2a2f2a',
    800: '#1a1f1a',
    900: '#0a0f0a',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
};

function createColorScheme(palette: ColorPalette, isDark: boolean = false) {
  return {
    primary: {
      50: palette.primary[isDark ? '900' : '50'],
      100: palette.primary[isDark ? '800' : '100'],
      200: palette.primary[isDark ? '700' : '200'],
      300: palette.primary[isDark ? '600' : '300'],
      400: palette.primary[isDark ? '500' : '400'],
      500: palette.primary[isDark ? '400' : '500'],
      600: palette.primary[isDark ? '300' : '600'],
      700: palette.primary[isDark ? '200' : '700'],
      800: palette.primary[isDark ? '100' : '800'],
      900: palette.primary[isDark ? '50' : '900'],
      solidBg: palette.primary[isDark ? '400' : '600'],
      solidColor: '#ffffff',
      solidHoverBg: palette.primary[isDark ? '300' : '700'],
      solidActiveBg: palette.primary[isDark ? '200' : '800'],
      softBg: palette.primary[isDark ? '800' : '100'],
      softColor: palette.primary[isDark ? '200' : '700'],
      softHoverBg: palette.primary[isDark ? '700' : '200'],
      softActiveBg: palette.primary[isDark ? '600' : '300'],
      outlinedBorder: palette.primary[isDark ? '600' : '300'],
      outlinedColor: palette.primary[isDark ? '200' : '700'],
      outlinedHoverBg: palette.primary[isDark ? '900' : '50'],
      outlinedHoverBorder: palette.primary[isDark ? '500' : '400'],
      outlinedActiveBg: palette.primary[isDark ? '800' : '100'],
      plainColor: palette.primary[isDark ? '300' : '600'],
      plainHoverBg: palette.primary[isDark ? '900' : '50'],
      plainHoverColor: palette.primary[isDark ? '200' : '700'],
      plainActiveBg: palette.primary[isDark ? '800' : '100'],
    },
    neutral: {
      50: palette.neutral[isDark ? '900' : '50'],
      100: palette.neutral[isDark ? '800' : '100'],
      200: palette.neutral[isDark ? '700' : '200'],
      300: palette.neutral[isDark ? '600' : '300'],
      400: palette.neutral[isDark ? '500' : '400'],
      500: palette.neutral[isDark ? '400' : '500'],
      600: palette.neutral[isDark ? '300' : '600'],
      700: palette.neutral[isDark ? '200' : '700'],
      800: palette.neutral[isDark ? '100' : '800'],
      900: palette.neutral[isDark ? '50' : '900'],
      solidBg: palette.neutral[isDark ? '400' : '600'],
      solidColor: '#ffffff',
      solidHoverBg: palette.neutral[isDark ? '300' : '700'],
      solidActiveBg: palette.neutral[isDark ? '200' : '800'],
      softBg: palette.neutral[isDark ? '800' : '100'],
      softColor: palette.neutral[isDark ? '200' : '700'],
      softHoverBg: palette.neutral[isDark ? '700' : '200'],
      softActiveBg: palette.neutral[isDark ? '600' : '300'],
      outlinedBorder: palette.neutral[isDark ? '600' : '300'],
      outlinedColor: palette.neutral[isDark ? '200' : '700'],
      outlinedHoverBg: palette.neutral[isDark ? '900' : '50'],
      outlinedHoverBorder: palette.neutral[isDark ? '500' : '400'],
      outlinedActiveBg: palette.neutral[isDark ? '800' : '100'],
      plainColor: palette.neutral[isDark ? '300' : '600'],
      plainHoverBg: palette.neutral[isDark ? '900' : '50'],
      plainHoverColor: palette.neutral[isDark ? '200' : '700'],
      plainActiveBg: palette.neutral[isDark ? '800' : '100'],
    },
    background: {
      body: isDark ? palette.neutral[900] : '#ffffff',
      surface: isDark ? palette.neutral[800] : '#ffffff',
      popup: isDark ? palette.neutral[800] : '#ffffff',
      level1: isDark ? palette.neutral[800] : palette.neutral[50],
      level2: isDark ? palette.neutral[700] : palette.neutral[100],
      level3: isDark ? palette.neutral[600] : palette.neutral[200],
    },
    text: {
      primary: isDark ? palette.neutral[50] : palette.neutral[900],
      secondary: isDark ? palette.neutral[300] : palette.neutral[600],
      tertiary: isDark ? palette.neutral[400] : palette.neutral[500],
    },
    divider: isDark ? palette.neutral[700] : palette.neutral[200],
  };
}

export function createCustomTheme(palette: ColorPalette = defaultGreenPalette) {
  return extendTheme({
    colorSchemes: {
      light: {
        palette: createColorScheme(palette, false),
      },
      dark: {
        palette: createColorScheme(palette, true),
      },
    },
    fontFamily: {
      display: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      body: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    },
    fontSize: {
      xs: '0.75rem',
      sm: '0.875rem',
      md: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      xl2: '1.5rem',
      xl3: '1.875rem',
      xl4: '2.25rem',
    },
    fontWeight: {
      xs: 300,
      sm: 400,
      md: 500,
      lg: 600,
      xl: 700,
    },
    components: {
      JoyButton: {
        styleOverrides: {
          root: {
            fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
            fontWeight: 500,
            textTransform: 'none',
            borderRadius: '0.5rem',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
            '&:active': {
              transform: 'translateY(0)',
            },
          },
        },
      },
    },
  });
}

export const customTheme = createCustomTheme(defaultGreenPalette);

export const themeTokens = {
  colors: defaultGreenPalette,
  fontSize: customTheme.fontSize,
  fontWeight: customTheme.fontWeight,
};

export function createPartialTheme(
  partialPalette: RecursivePartial<ColorPalette>
): ColorPalette {
  return recursiveMerge(defaultGreenPalette, partialPalette);
}
