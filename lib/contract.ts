import { z } from 'zod';

export const IngredientSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Ingredient name is required'),
  amount: z.number().min(0, 'Amount must be positive'),
  unit: z.string().min(1, 'Unit is required'),
  sortOrder: z.number().int(),
});

export const InstructionSchema = z.object({
  id: z.string().optional(),
  stepNumber: z.number().int(),
  description: z.string().min(1, 'Description is required'),
});

export const RecipeSchema = z.object({
  id: z.string().optional(),
  orgId: z.string().optional(),
  title: z.string().min(1, 'Recipe title is required'),
  yieldAmount: z.number().min(0, 'Yield amount must be positive'),
  yieldUnit: z.string().min(1, 'Yield unit is required'),
  ingredients: z.array(IngredientSchema),
  instructions: z.array(InstructionSchema),
});

export type Ingredient = z.infer<typeof IngredientSchema>;
export type Instruction = z.infer<typeof InstructionSchema>;
export type Recipe = z.infer<typeof RecipeSchema>;

export const CreateRecipeDtoSchema = RecipeSchema.omit({ 
  id: true, 
  orgId: true 
}).extend({
  ingredients: z.array(IngredientSchema.omit({ id: true })),
  instructions: z.array(InstructionSchema.omit({ id: true })),
});

export type CreateRecipeDto = z.infer<typeof CreateRecipeDtoSchema>;
