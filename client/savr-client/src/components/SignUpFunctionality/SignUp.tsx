import { Box, Divider, Typography } from '@mui/joy';
import {
  Card,
  CardContent,
  CardHeader,
  PrimaryButton,
  TextButton,
} from '../../lib-components';
import { CheckboxRHF } from '../../lib-components/Form/ReactHookFormCheckBox';
import { TextFieldRHF } from '../../lib-components/Form/ReactHookFormTextField';

interface SignUpProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignInClick?: () => void;
  isSubmitting?: boolean;
}

export function SignUp({ onSubmit, onSignInClick, isSubmitting }: SignUpProps) {
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
      <CardHeader sx={{ textAlign: 'center' }}>Sign up</CardHeader>

      <CardContent>
        <Box
          component="form"
          onSubmit={onSubmit}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}>
          <TextFieldRHF
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            required
          />
          <TextFieldRHF
            name="email"
            label="Email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <TextFieldRHF
            name="password"
            label="Password"
            type="password"
            placeholder="Create a password"
            required
          />

          <TextFieldRHF
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            placeholder="Confirm your password"
            required
          />

          <TextFieldRHF
            name="phoneNumber"
            label="Phone Number"
            type="tel"
            placeholder="123-456-7890"
            required
          />

          <CheckboxRHF
            name="terms"
            label="I agree to the terms and conditions"
            required
          />

          <PrimaryButton
            type="submit"
            disabled={isSubmitting}
            sx={{
              mt: 2,
              height: 48,
              fontSize: '1rem',
              fontWeight: 600,
            }}>
            {isSubmitting ? 'Signing up...' : 'Sign up'}
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
            Already have an account?
          </Typography>
          <TextButton onClick={onSignInClick}>Sign in</TextButton>
        </Box>
      </CardContent>
    </Card>
  );
}
