import { Button as JoyButton, ButtonProps as JoyButtonProps } from '@mui/joy';

export function Button({ children, ...props }: JoyButtonProps) {
  return <JoyButton {...props}>{children}</JoyButton>;
}

export function SmallButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="sm"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function MediumButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="md"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function LargeButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="lg"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function PrimaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="solid"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function SecondaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="outlined"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function OutlineButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="outlined"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function TextButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="plain"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function SoftButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="soft"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function CTAButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="solid"
      color="primary"
      size="lg"
      sx={{
        borderRadius: '0.75rem',
        fontWeight: 600,
        fontSize: 16,
      }}
      {...props}>
      {children}
    </JoyButton>
  );
}

export function ActionButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="soft"
      color="primary"
      sx={{
        borderRadius: '0.75rem',
        fontWeight: 500,
        fontSize: 14,
      }}
      {...props}>
      {children}
    </JoyButton>
  );
}

export function CancelButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      variant="outlined"
      color="neutral"
      sx={{
        borderRadius: '0.75rem',
        fontWeight: 500,
        fontSize: 14,
      }}
      {...props}>
      {children}
    </JoyButton>
  );
}

export function FullWidthButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      fullWidth
      {...props}>
      {children}
    </JoyButton>
  );
}

export function SmallPrimaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="sm"
      variant="solid"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function MediumPrimaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="md"
      variant="solid"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function LargePrimaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="lg"
      variant="solid"
      color="primary"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function SmallSecondaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="sm"
      variant="outlined"
      color="neutral"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function MediumSecondaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="md"
      variant="outlined"
      color="neutral"
      {...props}>
      {children}
    </JoyButton>
  );
}

export function LargeSecondaryButton({ children, ...props }: JoyButtonProps) {
  return (
    <JoyButton
      size="lg"
      variant="outlined"
      color="neutral"
      {...props}>
      {children}
    </JoyButton>
  );
}
