import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignIn } from '../components/SignIn/SignIn';

const meta: Meta<typeof SignIn> = {
  title: 'Authentication/SignIn',
  component: SignIn,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onSignUpClick: { action: 'sign up clicked' },
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
  args: {},
};

export const WithHandlers: Story = {
  args: {
    onSubmit: data => {
      console.log('Sign in data:', data);
      alert(`Sign in attempt with email: ${data.email}`);
    },
    onSignUpClick: () => {
      console.log('Sign up link clicked');
      alert('Navigate to sign up page');
    },
  },
};

export const CustomStyling: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The SignIn component with default styling and layout.',
      },
    },
  },
};
