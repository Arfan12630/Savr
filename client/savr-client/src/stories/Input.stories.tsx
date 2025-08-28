import { Box, FormControl, FormLabel } from '@mui/joy';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  FormInput,
  Input,
  LargeInput,
  MediumInput,
  OutlineInput,
  PlainInput,
  SmallInput,
  SoftInput,
} from '../lib-components/Input';

const meta: Meta<typeof Input> = {
  title: 'Components/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Box sx={{ width: 300 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Default input',
  },
};

export const AllSizes: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <FormLabel>Small Input</FormLabel>
        <SmallInput placeholder="Small input" />
      </FormControl>
      <FormControl>
        <FormLabel>Medium Input</FormLabel>
        <MediumInput placeholder="Medium input" />
      </FormControl>
      <FormControl>
        <FormLabel>Large Input</FormLabel>
        <LargeInput placeholder="Large input" />
      </FormControl>
    </Box>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <FormLabel>Default Input</FormLabel>
        <Input placeholder="Default variant" />
      </FormControl>
      <FormControl>
        <FormLabel>Outline Input</FormLabel>
        <OutlineInput placeholder="Outline variant" />
      </FormControl>
      <FormControl>
        <FormLabel>Soft Input</FormLabel>
        <SoftInput placeholder="Soft variant" />
      </FormControl>
      <FormControl>
        <FormLabel>Plain Input</FormLabel>
        <PlainInput placeholder="Plain variant" />
      </FormControl>
      <FormControl>
        <FormLabel>Form Input</FormLabel>
        <FormInput placeholder="Form variant" />
      </FormControl>
    </Box>
  ),
};

export const FormInputExample: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl>
        <FormLabel htmlFor="email">Email</FormLabel>
        <FormInput
          id="email"
          name="email"
          type="email"
          placeholder="Enter your email"
          required
        />
      </FormControl>
      <FormControl>
        <FormLabel htmlFor="password">Password</FormLabel>
        <FormInput
          id="password"
          name="password"
          type="password"
          placeholder="Enter your password"
          required
        />
      </FormControl>
    </Box>
  ),
};
