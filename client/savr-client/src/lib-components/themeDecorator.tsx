import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Decorator } from '@storybook/react';
import recursiveMerge from './recursiveMerge';
import type { RecursivePartial } from './RecursivePartial';
import type { ColorPalette } from './theme';
import { createCustomTheme, defaultGreenPalette } from './theme';

const defaultDarkPalette: ColorPalette = {
  primary: {
    50: '#1a3829',
    100: '#2a4938',
    200: '#3a5a47',
    300: '#4a6b56',
    400: '#5a7c65',
    500: '#7fb069',
    600: '#d4a574',
    700: '#e8eae4',
    800: '#f5f6f2',
    900: '#fafbf8',
  },
  secondary: {
    50: '#1a3829',
    100: '#2a4938',
    200: '#3a5a47',
    300: '#3a3f3a',
    400: '#8a9189',
    500: '#b8bdb6',
    600: '#e8eae4',
    700: '#f0f1ed',
    800: '#f5f6f2',
    900: '#fafbf8',
  },
  neutral: {
    50: '#0a0f0a',
    100: '#1a1f1a',
    200: '#2a2f2a',
    300: '#3a3f3a',
    400: '#8a9189',
    500: '#b8bdb6',
    600: '#e8eae4',
    700: '#f5f6f2',
    800: '#fafbf8',
    900: '#ffffff',
  },
  success: {
    50: '#14532d',
    100: '#166534',
    200: '#15803d',
    300: '#16a34a',
    400: '#22c55e',
    500: '#4ade80',
    600: '#86efac',
    700: '#bbf7d0',
    800: '#dcfce7',
    900: '#f0fdf4',
  },
  warning: {
    50: '#78350f',
    100: '#92400e',
    200: '#b45309',
    300: '#d97706',
    400: '#f59e0b',
    500: '#fbbf24',
    600: '#fcd34d',
    700: '#fde68a',
    800: '#fef3c7',
    900: '#fffbeb',
  },
  error: {
    50: '#7f1d1d',
    100: '#991b1b',
    200: '#b91c1c',
    300: '#dc2626',
    400: '#ef4444',
    500: '#f87171',
    600: '#fca5a5',
    700: '#fecaca',
    800: '#fee2e2',
    900: '#fef2f2',
  },
};

type PartialTheme = RecursivePartial<ColorPalette>;

function getGlobalTheme(globalTheme: string): PartialTheme {
  switch (globalTheme) {
    case 'default': {
      return defaultGreenPalette;
    }
    case 'default-dark': {
      return defaultDarkPalette;
    }
    default: {
      return defaultGreenPalette;
    }
  }
}

const themeDecorator =
  (customTheme: PartialTheme = {}): Decorator =>
  (Story, context) => {
    const { globals, parameters } = context;

    try {
      const themeValue = parameters.theme || globals.theme || 'default';
      const baseTheme = getGlobalTheme(themeValue);
      const mergedTheme = recursiveMerge(baseTheme, customTheme);
      const finalTheme = createCustomTheme(mergedTheme as ColorPalette);

      return (
        <CssVarsProvider
          theme={finalTheme}
          disableTransitionOnChange>
          <CssBaseline />
          <Story />
        </CssVarsProvider>
      );
    } catch (error) {
      console.warn('Theme decorator error:', error);
      const fallbackTheme = createCustomTheme(defaultGreenPalette);
      return (
        <CssVarsProvider
          theme={fallbackTheme}
          disableTransitionOnChange>
          <CssBaseline />
          <Story />
        </CssVarsProvider>
      );
    }
  };

export default themeDecorator;
