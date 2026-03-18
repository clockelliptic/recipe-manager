import { describe, it, expect } from 'vitest';
import { CreateRecipeDtoSchema } from './contract';

describe('CreateRecipeDtoSchema', () => {
  it('should validate a correct recipe DTO', () => {
    const validData = {
      title: 'Valid Recipe',
      yieldAmount: 4,
      yieldUnit: 'servings',
      ingredients: [
        { name: 'Ingredient 1', amount: 100, unit: 'g', sortOrder: 0 }
      ],
      instructions: [
        { stepNumber: 1, description: 'Step 1' }
      ]
    };
    
    const result = CreateRecipeDtoSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should fail validation if title is missing', () => {
    const invalidData = {
      yieldAmount: 4,
      yieldUnit: 'servings',
      ingredients: [],
      instructions: []
    };
    
    const result = CreateRecipeDtoSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });
});
