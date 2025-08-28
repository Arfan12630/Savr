import { useSignUp } from '../../hooks/useAuth';
import { SignUpRequest } from '../../types/api';
import { SignUpContainer } from '../SignUpFunctionality/SignUpContainer';
import { SignUpFormData } from '../SignUpFunctionality/signUp.schema';

export function SignUpPage() {
  const signUpMutation = useSignUp();
  const handleSignUp = async (data: SignUpFormData) => {
    const signUpData: SignUpRequest = {
      email: data.email,
      password: data.password,
      full_name: data.fullName,
      phone_number: data.phoneNumber,
    };
    await signUpMutation.mutateAsync(signUpData);
  };
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}>
      <SignUpContainer
        onSubmit={handleSignUp}
        isLoading={signUpMutation.isPending}
      />
    </div>
  );
}
