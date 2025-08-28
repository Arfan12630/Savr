import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { SignUp } from './SignUp';
import {
  SignUpFormData,
  signUpDefaultValues,
  signUpSchema,
} from './signUp.schema';

interface SignUpContainerProps {
  onSubmit?: (data: SignUpFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export const SignUpContainer = ({
  onSubmit,
  isLoading = false,
}: SignUpContainerProps) => {
  const methods = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: signUpDefaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: SignUpFormData) => {
    try {
      if (onSubmit !== undefined) {
        await onSubmit(data);
      }
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  return (
    <FormProvider {...methods}>
      <SignUp
        isSubmitting={isSubmitting || isLoading}
        onSubmit={handleSubmit(handleFormSubmit)}
      />
    </FormProvider>
  );
};
