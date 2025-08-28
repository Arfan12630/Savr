import { z } from 'zod';

const firstNameSchema = z
  .string()
  .min(1, 'First name is required')
  .min(2, 'First name must be at least 2 characters')
  .max(50, 'First name must be less than 50 characters')
  .trim()
  .refine(value => /^[a-zA-Z]+$/.test(value), {
    message: 'First name can only contain letters',
  });

const lastNameSchema = z
  .string()
  .min(1, 'Last name is required')
  .min(2, 'Last name must be at least 2 characters')
  .max(50, 'Last name must be less than 50 characters')
  .trim()
  .refine(value => /^[a-zA-Z]+$/.test(value), {
    message: 'Last name can only contain letters',
  });

const emailSchema = z
  .email({ message: 'Please enter a valid email address' })
  .toLowerCase()
  .trim();

const passwordSchema = z
  .string()
  .min(1, 'Password is required')
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be less than 128 characters')
  .refine(
    password =>
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+={}[\]|\\:;"'<>,.?/~`])/.test(
        password
      ),
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    }
  );

const confirmPasswordSchema = z.string().min(1, 'Please confirm your password');

const phoneNumberSchema = z
  .string()
  .min(1, 'Phone number is required')
  .refine(phoneNumber => /^[0-9]{10}$/.test(phoneNumber), {
    message: 'Please enter a valid phone number',
  });

const termsSchema = z.boolean().refine(terms => terms === true, {
  message: 'You must agree to the terms and conditions',
});

export const signUpSchema = z
  .object({
    firstName: firstNameSchema,
    lastName: lastNameSchema,
    email: emailSchema,
    password: passwordSchema,
    confirmPassword: confirmPasswordSchema,
    phoneNumber: phoneNumberSchema,
    terms: termsSchema,
  })
  .refine(data => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;

export const signUpDefaultValues: Partial<SignUpFormData> = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
  phoneNumber: '',
  terms: false,
};

export const getFieldError = (
  errors: z.ZodError<unknown>,
  fieldName: keyof SignUpFormData
): string | undefined => {
  const fieldError = errors.issues.find((error: z.core.$ZodIssue) =>
    error.path.includes(fieldName)
  );
  return fieldError?.message;
};

export const validateSignUpData = (
  data: unknown
):
  | { success: true; data: SignUpFormData }
  | { success: false; errors: z.ZodError } => {
  const result = signUpSchema.safeParse(data);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, errors: result.error };
};
