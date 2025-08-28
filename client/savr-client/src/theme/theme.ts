import { extendTheme } from '@mui/joy/styles';
import type { RecursivePartial } from '../stories/RecursivePartial';
import recursiveMerge from '../stories/recursiveMerge';

export interface ColorPalette {
  primary: Record<string, string>;
  secondary: Record<string, string>;
  neutral: Record<string, string>;
  success: Record<string, string>;
  warning: Record<string, string>;
  error: Record<string, string>;
}

export const sageGreenPalette: ColorPalette = {
  primary: {
    50: '#f0f4f0',
    100: '#e1e9e1',
    200: '#c3d3c3',
    300: '#a5bda5',
    400: '#87a787',
    500: '#699169',
    600: '#547454',
    700: '#3f573f',
    800: '#2a3a2a',
    900: '#151d15',
  },
  secondary: {
    50: '#fdfbf7',
    100: '#fbf7ef',
    200: '#f7efdf',
    300: '#f3e7cf',
    400: '#efdfbf',
    500: '#ebd7af',
    600: '#bcac8c',
    700: '#8d8169',
    800: '#5e5646',
    900: '#2f2b23',
  },
  neutral: {
    50: '#fafbf8',
    100: '#f5f6f2',
    200: '#e8eae4',
    300: '#d4d7d0',
    400: '#a8ada3',
    500: '#7c8376',
    600: '#636a5e',
    700: '#4a5146',
    800: '#31382e',
    900: '#181f16',
  },
  success: {
    50: '#f0f8f0',
    100: '#e1f1e1',
    200: '#c3e3c3',
    300: '#a5d5a5',
    400: '#87c787',
    500: '#69b969',
    600: '#549454',
    700: '#3f6f3f',
    800: '#2a4a2a',
    900: '#152515',
  },
  warning: {
    50: '#fef9f0',
    100: '#fdf3e1',
    200: '#fbe7c3',
    300: '#f9dba5',
    400: '#f7cf87',
    500: '#f5c369',
    600: '#c49c54',
    700: '#93753f',
    800: '#624e2a',
    900: '#312715',
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

export function createCustomTheme(palette: ColorPalette = sageGreenPalette) {
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

export const customTheme = createCustomTheme(sageGreenPalette);

export const themeTokens = {
  colors: sageGreenPalette,
  fontSize: customTheme.fontSize,
  fontWeight: customTheme.fontWeight,
};

export function createPartialTheme(
  partialPalette: RecursivePartial<ColorPalette>
): ColorPalette {
  return recursiveMerge(sageGreenPalette, partialPalette);
}
