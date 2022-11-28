import { z } from 'zod';

export const registerUserSchema = z.object({
  body: z
    .object({
      name: z
        .string({
          required_error: 'Username is required',
        })
        .min(3, { message: 'Username must be at least 3 characters long' })
        .max(15, { message: 'Username must contain less than 15 characters' }),
      password: z
        .string({
          required_error: 'Password is required',
        })
        .min(6, { message: 'Password must be at least 6 characters long' }),
      confirmPassword: z.string({
        required_error: 'Confirm password is required',
      }),
      email: z
        .string({ required_error: 'Email is required' })
        .email({ message: 'Email is not valid' }),
      role: z.enum(['user', 'admin'], {
        required_error: 'Role is required',
        invalid_type_error: 'Wrong role has been passed',
      }),
    })
    .refine(data => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export type ReqisterUserInput = z.infer<typeof registerUserSchema>;
