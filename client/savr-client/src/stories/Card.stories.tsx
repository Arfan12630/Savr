import { Box, Typography } from '@mui/joy';
import type { Meta, StoryObj } from '@storybook/react-vite';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  OutlineCard,
  OutlineSoftCard,
  SoftCard,
} from '../lib-components/Card';

const meta: Meta<typeof Card> = {
  title: 'Components/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  decorators: [
    Story => (
      <Box sx={{ width: 400 }}>
        <Story />
      </Box>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card>
      <CardContent>
        <Typography>This is a default card with content.</Typography>
      </CardContent>
    </Card>
  ),
};

export const WithHeaderAndFooter: Story = {
  render: () => (
    <Card>
      <CardHeader>Card Title</CardHeader>
      <CardContent>
        <Typography>
          This card has a header, content, and footer. The header contains the
          title, the content contains the main information, and the footer can
          contain actions.
        </Typography>
      </CardContent>
      <CardFooter>
        <Typography
          level="body-sm"
          sx={{ color: 'text.secondary' }}>
          Footer content
        </Typography>
      </CardFooter>
    </Card>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Card>
        <CardHeader>Default Card</CardHeader>
        <CardContent>
          <Typography>Default card variant with content.</Typography>
        </CardContent>
      </Card>

      <OutlineCard>
        <CardHeader>Outline Card</CardHeader>
        <CardContent>
          <Typography>Outline card variant with content.</Typography>
        </CardContent>
      </OutlineCard>

      <SoftCard>
        <CardHeader>Soft Card</CardHeader>
        <CardContent>
          <Typography>Soft card variant with content.</Typography>
        </CardContent>
      </SoftCard>

      <OutlineSoftCard>
        <CardHeader>Outline Soft Card</CardHeader>
        <CardContent>
          <Typography>Outline soft card variant with content.</Typography>
        </CardContent>
      </OutlineSoftCard>
    </Box>
  ),
};

export const FormCard: Story = {
  render: () => (
    <Card variant="outlined">
      <CardHeader>Sign In Form</CardHeader>
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography level="body-sm">
            This is an example of how a card can be used to contain a form.
          </Typography>
          <Typography level="body-sm">
            The card provides a nice container with proper spacing and styling.
          </Typography>
        </Box>
      </CardContent>
      <CardFooter>
        <Typography
          level="body-sm"
          sx={{ color: 'text.secondary' }}>
          Form actions would go here
        </Typography>
      </CardFooter>
    </Card>
  ),
};
