import { Input as JoyInput, InputProps as JoyInputProps } from '@mui/joy';

export function Input({ children, ...props }: JoyInputProps) {
  return <JoyInput {...props}>{children}</JoyInput>;
}

export function SmallInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      size="sm"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function MediumInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      size="md"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function LargeInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      size="lg"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function OutlineInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      variant="outlined"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function SoftInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      variant="soft"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function PlainInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      variant="plain"
      {...props}>
      {children}
    </JoyInput>
  );
}

export function FormInput({ children, ...props }: JoyInputProps) {
  return (
    <JoyInput
      variant="outlined"
      size="md"
      sx={{
        '--Input-radius': '0.5rem',
        '--Input-gap': '0.5rem',
        '--Input-placeholderOpacity': 0.5,
        '--Input-focusedThickness': '2px',
      }}
      {...props}>
      {children}
    </JoyInput>
  );
}
