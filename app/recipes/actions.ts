'use server';

import prisma from '@/prisma/client';
import { Recipe } from '@/lib/contract';

export async function getRecipes(orgId: string, query?: string) {
  const recipes = await prisma.recipe.findMany({
    where: {
      orgId,
      OR: query ? [
        { title: { contains: query, mode: 'insensitive' } },
        { ingredients: { some: { name: { contains: query, mode: 'insensitive' } } } },
        { instructions: { some: { description: { contains: query, mode: 'insensitive' } } } },
      ] : undefined,
    },
    include: {
      ingredients: true,
      instructions: true,
    },
    orderBy: {
      updatedAt: 'desc',
    },
  });

  return recipes as Recipe[];
}

export async function getRecipeById(id: string, orgId: string) {
  const recipe = await prisma.recipe.findFirst({
    where: {
      id,
      orgId,
    },
    include: {
      ingredients: true,
      instructions: true,
    },
  });

  return recipe as Recipe | null;
}

export async function deleteRecipe(id: string, orgId: string) {
  await prisma.recipe.deleteMany({
    where: {
      id,
      orgId,
    },
  });
}

export async function saveRecipe(data: any, orgId: string, id?: string) {
  const { ingredients, instructions, ...recipeData } = data;

  if (id) {
    // Update
    return await prisma.$transaction(async (tx) => {
      // Delete old ingredients and instructions
      await tx.ingredient.deleteMany({ where: { recipeId: id } });
      await tx.instruction.deleteMany({ where: { recipeId: id } });

      return await tx.recipe.update({
        where: { id, orgId },
        data: {
          ...recipeData,
          ingredients: {
            create: ingredients,
          },
          instructions: {
            create: instructions,
          },
        },
      });
    });
  } else {
    // Create
    return await prisma.recipe.create({
      data: {
        ...recipeData,
        orgId,
        ingredients: {
          create: ingredients,
        },
        instructions: {
          create: instructions,
        },
      },
    });
  }
}
