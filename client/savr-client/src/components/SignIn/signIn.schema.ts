import { z } from 'zod';

const emailSchema = z
  .email({ message: 'Please enter a valid email address' })
  .toLowerCase()
  .trim();

const passwordSchema = z.string().min(1, 'Password is required');

export const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export type SignInFormData = z.infer<typeof signInSchema>;

export const signInDefaultValues: Partial<SignInFormData> = {
  email: '',
  password: '',
};

export const getFieldError = (
  errors: z.ZodError<unknown>,
  fieldName: keyof SignInFormData
): string | undefined => {
  const fieldError = errors.issues.find((error: z.core.$ZodIssue) =>
    error.path.includes(fieldName)
  );
  return fieldError?.message;
};

export const validateSignInData = (
  data: unknown
):
  | { success: true; data: SignInFormData }
  | { success: false; errors: z.ZodError } => {
  const result = signInSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};
