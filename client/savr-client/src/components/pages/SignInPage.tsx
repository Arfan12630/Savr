import { useSignIn } from '../../hooks/useAuth';
import { SignInRequest } from '../../types/api';
import { SignInContainer } from '../SignIn/SignInContainer';
import { SignInFormData } from '../SignIn/signIn.schema';

export function SignInPage() {
  const signInMutation = useSignIn();
  const handleSignIn = async (data: SignInFormData) => {
    const signInData: SignInRequest = {
      email: data.email,
      password: data.password,
    };
    await signInMutation.mutateAsync(signInData);
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <SignInContainer
        onSubmit={handleSignIn}
        isLoading={signInMutation.isPending}
      />
    </div>
  );
}
