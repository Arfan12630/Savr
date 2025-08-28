import { zodResolver } from '@hookform/resolvers/zod';
import { FormProvider, useForm } from 'react-hook-form';
import { SignIn } from './SignIn';
import {
  SignInFormData,
  signInDefaultValues,
  signInSchema,
} from './signIn.schema';

interface SignInContainerProps {
  onSubmit?: (data: SignInFormData) => Promise<void> | void;
  isLoading?: boolean;
}

export const SignInContainer = ({
  onSubmit,
  isLoading = false,
}: SignInContainerProps) => {
  const methods = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: signInDefaultValues,
    mode: 'onBlur',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const handleFormSubmit = async (data: SignInFormData) => {
    if (onSubmit !== undefined) {
      await onSubmit(data);
    }
  };

  return (
    <FormProvider {...methods}>
      <SignIn
        isSubmitting={isSubmitting || isLoading}
        onSubmit={handleSubmit(handleFormSubmit)}
      />
    </FormProvider>
  );
};
