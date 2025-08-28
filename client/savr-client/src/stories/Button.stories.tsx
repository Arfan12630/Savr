import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/internal/test';
import {
  ActionButton,
  Button,
  CancelButton,
  CTAButton,
  DestructiveButton,
  FullWidthButton,
  GhostButton,
  GhostCTAButton,
  GhostDestructiveButton,
  GhostPrimaryButton,
  GhostSuccessButton,
  InfoButton,
  LargeButton,
  LargePrimaryButton,
  LargeSecondaryButton,
  MediumButton,
  MediumPrimaryButton,
  MediumSecondaryButton,
  OutlineButton,
  OutlineCTAButton,
  OutlineDestructiveButton,
  OutlinePrimaryButton,
  OutlineSuccessButton,
  PrimaryButton,
  SecondaryButton,
  SmallButton,
  SmallPrimaryButton,
  SmallSecondaryButton,
  SoftButton,
  SoftCTAButton,
  SoftDestructiveButton,
  SoftPrimaryButton,
  SoftSuccessButton,
  SoftWarningButton,
  SuccessButton,
  TextButton,
  WarningButton,
} from '../lib-components/Button';

const meta: Meta = {
  title: 'UI Components/Button',
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {
  render: () => <Button>Base Button</Button>,
};

export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <SmallButton>Small</SmallButton>
      <MediumButton>Medium</MediumButton>
      <LargeButton>Large</LargeButton>
    </div>
  ),
};

export const Styles: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <PrimaryButton>Primary</PrimaryButton>
      <SecondaryButton>Secondary</SecondaryButton>
      <OutlineButton>Outline</OutlineButton>
      <TextButton>Text</TextButton>
      <SoftButton>Soft</SoftButton>
    </div>
  ),
};

export const SpecialPurpose: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <CTAButton>Call to Action</CTAButton>
      <ActionButton>Action</ActionButton>
      <CancelButton>Cancel</CancelButton>
    </div>
  ),
};

export const SemanticButtons: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <SuccessButton>Success</SuccessButton>
      <WarningButton>Warning</WarningButton>
      <InfoButton>Info</InfoButton>
      <DestructiveButton>Destructive</DestructiveButton>
    </div>
  ),
};

export const FullWidth: Story = {
  render: () => (
    <div style={{ width: '400px' }}>
      <FullWidthButton>Full Width Button</FullWidthButton>
    </div>
  ),
};

export const SizeStyleCombinations: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SmallPrimaryButton>Small Primary</SmallPrimaryButton>
        <MediumPrimaryButton>Medium Primary</MediumPrimaryButton>
        <LargePrimaryButton>Large Primary</LargePrimaryButton>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <SmallSecondaryButton>Small Secondary</SmallSecondaryButton>
        <MediumSecondaryButton>Medium Secondary</MediumSecondaryButton>
        <LargeSecondaryButton>Large Secondary</LargeSecondaryButton>
      </div>
    </div>
  ),
};

export const Interactive: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <PrimaryButton onClick={fn()}>Click Me</PrimaryButton>
        <SecondaryButton onClick={fn()}>Click Me</SecondaryButton>
        <CTAButton onClick={fn()}>Click Me</CTAButton>
      </div>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        <ActionButton disabled>Disabled</ActionButton>
        <CancelButton disabled>Disabled</CancelButton>
      </div>
    </div>
  ),
};

export const OutlineVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <OutlinePrimaryButton>Outline Primary</OutlinePrimaryButton>
      <OutlineCTAButton>Outline CTA</OutlineCTAButton>
      <OutlineSuccessButton>Outline Success</OutlineSuccessButton>
      <OutlineDestructiveButton>Outline Destructive</OutlineDestructiveButton>
    </div>
  ),
};

export const GhostVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <GhostButton>Ghost</GhostButton>
      <GhostPrimaryButton>Ghost Primary</GhostPrimaryButton>
      <GhostCTAButton>Ghost CTA</GhostCTAButton>
      <GhostSuccessButton>Ghost Success</GhostSuccessButton>
      <GhostDestructiveButton>Ghost Destructive</GhostDestructiveButton>
    </div>
  ),
};

export const SoftVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        alignItems: 'center',
        flexWrap: 'wrap',
      }}>
      <SoftPrimaryButton>Soft Primary</SoftPrimaryButton>
      <SoftCTAButton>Soft CTA</SoftCTAButton>
      <SoftSuccessButton>Soft Success</SoftSuccessButton>
      <SoftWarningButton>Soft Warning</SoftWarningButton>
      <SoftDestructiveButton>Soft Destructive</SoftDestructiveButton>
    </div>
  ),
};

export const AllVariants: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '800px',
      }}>
      <div>
        <h3 style={{ marginBottom: '12px' }}>Size Variants</h3>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <SmallButton>Small</SmallButton>
          <MediumButton>Medium</MediumButton>
          <LargeButton>Large</LargeButton>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Style Variants</h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <OutlineButton>Outline</OutlineButton>
          <TextButton>Text</TextButton>
          <SoftButton>Soft</SoftButton>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Semantic Variants</h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <SuccessButton>Success</SuccessButton>
          <WarningButton>Warning</WarningButton>
          <InfoButton>Info</InfoButton>
          <DestructiveButton>Destructive</DestructiveButton>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Special Purpose</h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <CTAButton>Call to Action</CTAButton>
          <ActionButton>Action</ActionButton>
          <CancelButton>Cancel</CancelButton>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Size + Style Combinations</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <SmallPrimaryButton>Small Primary</SmallPrimaryButton>
            <MediumPrimaryButton>Medium Primary</MediumPrimaryButton>
            <LargePrimaryButton>Large Primary</LargePrimaryButton>
          </div>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <SmallSecondaryButton>Small Secondary</SmallSecondaryButton>
            <MediumSecondaryButton>Medium Secondary</MediumSecondaryButton>
            <LargeSecondaryButton>Large Secondary</LargeSecondaryButton>
          </div>
        </div>
      </div>

      <div>
        <h3 style={{ marginBottom: '12px' }}>Full Width</h3>
        <div style={{ width: '100%' }}>
          <FullWidthButton>Full Width Button</FullWidthButton>
        </div>
      </div>
    </div>
  ),
};

export const ThemeDemo: Story = {
  render: () => (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        maxWidth: '800px',
        padding: '24px',
        borderRadius: '8px',
        border: '1px solid #e0e0e0',
      }}>
      <div>
        <h2
          style={{
            marginBottom: '16px',
            color: 'var(--joy-palette-text-primary)',
          }}>
          Theme Demo
        </h2>
        <p
          style={{
            marginBottom: '24px',
            color: 'var(--joy-palette-text-secondary)',
          }}>
          Use the theme selector in the toolbar above to see how these buttons
          adapt to different themes.
        </p>
      </div>

      <div>
        <h3
          style={{
            marginBottom: '12px',
            color: 'var(--joy-palette-text-primary)',
          }}>
          Primary Buttons
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <SmallPrimaryButton>Small</SmallPrimaryButton>
          <MediumPrimaryButton>Medium</MediumPrimaryButton>
          <LargePrimaryButton>Large</LargePrimaryButton>
        </div>
      </div>

      <div>
        <h3
          style={{
            marginBottom: '12px',
            color: 'var(--joy-palette-text-primary)',
          }}>
          Secondary Buttons
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <SmallSecondaryButton>Small</SmallSecondaryButton>
          <MediumSecondaryButton>Medium</MediumSecondaryButton>
          <LargeSecondaryButton>Large</LargeSecondaryButton>
        </div>
      </div>

      <div>
        <h3
          style={{
            marginBottom: '12px',
            color: 'var(--joy-palette-text-primary)',
          }}>
          All Styles
        </h3>
        <div
          style={{
            display: 'flex',
            gap: '16px',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <PrimaryButton>Primary</PrimaryButton>
          <SecondaryButton>Secondary</SecondaryButton>
          <OutlineButton>Outline</OutlineButton>
          <TextButton>Text</TextButton>
          <SoftButton>Soft</SoftButton>
        </div>
      </div>
    </div>
  ),
};
