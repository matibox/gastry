import { z } from 'zod';

export const createMenuSchema = z.object({
  body: z.object({
    name: z
      .string({ required_error: 'Name is required' })
      .max(20, 'Name must contain less than 20 characters'),
  }),
});

export type CreateRecipeInput = z.infer<typeof createMenuSchema>;
