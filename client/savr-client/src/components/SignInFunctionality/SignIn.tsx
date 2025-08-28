import { Box } from '@mui/joy';
import {
  Card,
  CardContent,
  CardHeader,
  PrimaryButton,
} from '../../lib-components';
import { TextFieldRHF } from '../../lib-components/Form/ReactHookFormTextField';

interface SignInProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onSignInClick?: () => void;
  isSubmitting?: boolean;
}

export function SignIn({ onSubmit, onSignInClick, isSubmitting }: SignInProps) {
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
      <CardHeader sx={{ textAlign: 'center' }}>Sign in</CardHeader>
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
            placeholder="Enter your password"
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
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </PrimaryButton>
        </Box>
      </CardContent>
    </Card>
  );
}
