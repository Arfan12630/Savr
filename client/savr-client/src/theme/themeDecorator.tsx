import CssBaseline from '@mui/joy/CssBaseline';
import { CssVarsProvider } from '@mui/joy/styles';
import type { Decorator } from '@storybook/react';
import recursiveMerge from '../stories/recursiveMerge';
import type { RecursivePartial } from '../stories/RecursivePartial';
import type { ColorPalette } from './theme';
import { createCustomTheme, sageGreenPalette } from './theme';

const defaultDarkPalette: ColorPalette = {
  primary: {
    50: '#151d15',
    100: '#2a3a2a',
    200: '#3f573f',
    300: '#547454',
    400: '#699169',
    500: '#87a787',
    600: '#a5bda5',
    700: '#c3d3c3',
    800: '#e1e9e1',
    900: '#f0f4f0',
  },
  secondary: {
    50: '#2f2b23',
    100: '#5e5646',
    200: '#8d8169',
    300: '#bcac8c',
    400: '#ebd7af',
    500: '#efdfbf',
    600: '#f3e7cf',
    700: '#f7efdf',
    800: '#fbf7ef',
    900: '#fdfbf7',
  },
  neutral: {
    50: '#181f16',
    100: '#31382e',
    200: '#4a5146',
    300: '#636a5e',
    400: '#7c8376',
    500: '#a8ada3',
    600: '#d4d7d0',
    700: '#e8eae4',
    800: '#f5f6f2',
    900: '#fafbf8',
  },
  success: {
    50: '#152515',
    100: '#2a4a2a',
    200: '#3f6f3f',
    300: '#549454',
    400: '#69b969',
    500: '#87c787',
    600: '#a5d5a5',
    700: '#c3e3c3',
    800: '#e1f1e1',
    900: '#f0f8f0',
  },
  warning: {
    50: '#312715',
    100: '#624e2a',
    200: '#93753f',
    300: '#c49c54',
    400: '#f5c369',
    500: '#f7cf87',
    600: '#f9dba5',
    700: '#fbe7c3',
    800: '#fdf3e1',
    900: '#fef9f0',
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
      return sageGreenPalette;
    }
    case 'default-dark': {
      return defaultDarkPalette;
    }
    default: {
      return sageGreenPalette;
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
      const fallbackTheme = createCustomTheme(sageGreenPalette);
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
