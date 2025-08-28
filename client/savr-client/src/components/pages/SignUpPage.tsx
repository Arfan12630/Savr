import axios from 'axios';
import { SignUpContainer } from '../SignUpFunctionality/SignUpContainer';
import { SignUpFormData } from '../SignUpFunctionality/signUp.schema';

const handleSignUp = async (data: SignUpFormData) => {
  try {
    await axios.post('/signup', data);
  } catch (error) {
    console.error('Sign up error:', error);
  }
};

export function SignUpPage() {
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
        isLoading={false}
      />
    </div>
  );
}
