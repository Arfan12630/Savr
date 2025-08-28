import { useMutation } from '@tanstack/react-query';
import { authApi } from '../api/auth';
import { SignInRequest, SignUpRequest, User } from '../types/api';

export function useSignUp() {
  return useMutation<User, Error, SignUpRequest>({
    mutationFn: authApi.signUp,
    onSuccess: (data: User) => {
      console.log('Signup successful:', data);
    },
    onError: (error: Error) => {
      console.error('Signup failed:', error);
    },
  });
}

export function useSignIn() {
  return useMutation<User, Error, SignInRequest>({
    mutationFn: authApi.signIn,
    onSuccess: (data: User) => {
      console.log('Signin successful:', data);
    },
    onError: (error: Error) => {
      console.error('Signin failed:', error);
    },
  });
}
