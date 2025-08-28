import type { Meta, StoryObj } from '@storybook/react-vite';
import { SignUp } from '../components/SignUpFunctionality/SignUp';

const meta: Meta<typeof SignUp> = {
  title: 'Authentication/SignUp',
  component: SignUp,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    onSubmit: { action: 'submitted' },
    onSignInClick: { action: 'sign in clicked' },
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
      console.log('Sign up data:', data);
      alert(`Sign up attempt with name: ${data.name}, email: ${data.email}`);
    },
    onSignInClick: () => {
      console.log('Sign in link clicked');
      alert('Navigate to sign in page');
    },
  },
};

export const CustomStyling: Story = {
  args: {},
  parameters: {
    docs: {
      description: {
        story: 'The SignUp component with default styling and layout.',
      },
    },
  },
};
