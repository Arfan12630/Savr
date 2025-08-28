import type { Preview } from '@storybook/react-webpack5';
import themeDecorator from '../src/lib-components/themeDecorator';

const preview: Preview = {
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Set the color theme',
      defaultValue: 'default',
      toolbar: {
        dynamicTitle: true,
        items: [
          { value: 'default', right: '🌿', title: 'Default' },
          { value: 'default-dark', right: '🌿🌙', title: 'Default Dark' },
        ],
      },
    },
  },
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    themes: {
      default: 'default',
      list: [
        { name: 'default', class: 'theme-default', color: '#5a7c65' },
        { name: 'default-dark', class: 'theme-default-dark', color: '#4a6b56' },
      ],
    },
  },
  decorators: [themeDecorator()],
};

export default preview;
