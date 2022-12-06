import { z } from 'zod';

export const createRecipeSchema = z.object({
  body: z.object({
    title: z
      .string({ required_error: 'Recipe title is required' })
      .min(3, { message: 'Recipe title must be at least 3 characters long' })
      .max(50, {
        message: 'Recipe title must contain less than 50 characters',
      }),
    cookingTime: z.number({ required_error: 'Cooking time is required' }),
    ingredients: z.array(
      z.object(
        {
          name: z.string({ required_error: 'Ingredient name is required' }),
          value: z.number({ required_error: 'Ingredient value is required' }),
          unit: z.string().optional(),
        },
        { required_error: 'At least 1 ingredient is required' }
      )
    ),
    instructions: z.string({ required_error: 'Instructions are required' }),
  }),
});

export type CreateRecipeInput = z.infer<typeof createRecipeSchema>;
