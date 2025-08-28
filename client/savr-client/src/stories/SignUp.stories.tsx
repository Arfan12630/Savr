import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignUpContainer } from '../components/SignUpFunctionality/SignUpContainer';

const meta: Meta<typeof SignUpContainer> = {
  title: 'Authentication/SignUp',
  component: SignUpContainer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
  },
  decorators: [
    Story => (
      <div
        style={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    onSubmit: async data => {
      console.log('Sign up data:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
    },
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};

export const WithError: Story = {
  args: {
    onSubmit: async data => {
      throw new Error('Sign up failed');
    },
  },
};
