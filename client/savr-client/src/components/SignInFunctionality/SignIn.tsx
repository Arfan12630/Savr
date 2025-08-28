import { Box, Divider, FormControl, FormLabel, Typography } from '@mui/joy';
import { FormEvent } from 'react';

import {
  Card,
  CardContent,
  CardHeader,
  FormInput,
  PrimaryButton,
  TextButton,
} from '../../lib-components';

interface SignInProps {
  onSubmit?: (data: { email: string; password: string }) => void;
  onSignUpClick?: () => void;
}

export function SignIn({ onSubmit, onSignUpClick }: SignInProps) {
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const email = formData.get('email')?.toString();
    const password = formData.get('password')?.toString();
    if (!email || !password) {
      console.error('Email or password is missing');
      return;
    }
    onSubmit?.({ email, password });
  };
  return (
    <Card
      variant="outlined"
      sx={{
        width: '100%',
        maxWidth: 400,
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
      }}>
      <CardHeader>Sign in</CardHeader>

      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <FormControl>
            <FormLabel htmlFor="email">Email</FormLabel>
            <FormInput
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              autoComplete="email"
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
              autoComplete="current-password"
            />
          </FormControl>

          <PrimaryButton
            type="submit"
            sx={{
              mt: 2,
              height: 48,
              fontSize: '1rem',
              fontWeight: 600,
            }}>
            Sign in
          </PrimaryButton>
        </Box>

        <Divider sx={{ my: 3 }}>
          <Typography
            level="body-sm"
            sx={{ color: 'text.secondary' }}>
            or
          </Typography>
        </Divider>

        <Box sx={{ textAlign: 'center' }}>
          <Typography
            level="body-sm"
            sx={{ color: 'text.secondary', mb: 1 }}>
            Don't have an account?
          </Typography>
          <TextButton onClick={onSignUpClick}>Sign up</TextButton>
        </Box>
      </CardContent>
    </Card>
  );
}
