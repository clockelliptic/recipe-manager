import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.instruction.deleteMany({})
  await prisma.ingredient.deleteMany({})
  await prisma.recipe.deleteMany({})
  await prisma.user.deleteMany({})
  await prisma.organization.deleteMany({})

  // Create Organizations
  const bistro = await prisma.organization.create({
    data: {
      id: 'org-bistro-italiano',
      name: 'Bistro Italiano',
    },
  })

  const zen = await prisma.organization.create({
    data: {
      id: 'org-zen-kitchen',
      name: 'Zen Kitchen',
    },
  })

  // Create Recipes for Bistro Italiano
  await prisma.recipe.create({
    data: {
      id: 'recipe-1',
      orgId: bistro.id,
      title: 'Classic Marinara Sauce',
      yieldAmount: 4,
      yieldUnit: 'cups',
      ingredients: {
        create: [
          { name: 'Canned San Marzano Tomatoes', amount: 28, unit: 'oz', sortOrder: 0 },
          { name: 'Extra Virgin Olive Oil', amount: 3, unit: 'tbsp', sortOrder: 1 },
          { name: 'Garlic Cloves (minced)', amount: 4, unit: 'cloves', sortOrder: 2 },
          { name: 'Fresh Basil Leaves', amount: 10, unit: 'leaves', sortOrder: 3 },
          { name: 'Sea Salt', amount: 1, unit: 'tsp', sortOrder: 4 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, description: 'Heat olive oil in a large saucepan over medium heat.' },
          { stepNumber: 2, description: 'Add minced garlic and sauté for 1-2 minutes until fragrant.' },
          { stepNumber: 3, description: 'Add the canned tomatoes with their juice. Break them up with a spoon.' },
          { stepNumber: 4, description: 'Add salt and basil. Simmer for 20-25 minutes.' },
          { stepNumber: 5, description: 'Taste and adjust seasoning.' },
        ],
      },
    },
  })

  await prisma.recipe.create({
    data: {
      id: 'recipe-2',
      orgId: bistro.id,
      title: 'Pizza Dough',
      yieldAmount: 2,
      yieldUnit: 'large pizzas',
      ingredients: {
        create: [
          { name: 'All-Purpose Flour', amount: 500, unit: 'g', sortOrder: 0 },
          { name: 'Warm Water', amount: 325, unit: 'ml', sortOrder: 1 },
          { name: 'Active Dry Yeast', amount: 7, unit: 'g', sortOrder: 2 },
          { name: 'Olive Oil', amount: 2, unit: 'tbsp', sortOrder: 3 },
          { name: 'Salt', amount: 10, unit: 'g', sortOrder: 4 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, description: 'Combine warm water, yeast, and sugar. Let stand until foamy.' },
          { stepNumber: 2, description: 'Mix flour and salt. Add yeast mixture and oil.' },
          { stepNumber: 3, description: 'Knead for 8-10 minutes until smooth and elastic.' },
          { stepNumber: 4, description: 'Let rise in a warm place for 1-2 hours until doubled.' },
        ],
      },
    },
  })

  // Create Recipes for Zen Kitchen
  await prisma.recipe.create({
    data: {
      id: 'recipe-4',
      orgId: zen.id,
      title: 'Miso Soup',
      yieldAmount: 4,
      yieldUnit: 'servings',
      ingredients: {
        create: [
          { name: 'Dashi Stock', amount: 4, unit: 'cups', sortOrder: 0 },
          { name: 'White Miso Paste', amount: 3, unit: 'tbsp', sortOrder: 1 },
          { name: 'Silken Tofu (cubed)', amount: 200, unit: 'g', sortOrder: 2 },
          { name: 'Wakame Seaweed (dried)', amount: 2, unit: 'tbsp', sortOrder: 3 },
          { name: 'Green Onions (sliced)', amount: 2, unit: 'stalks', sortOrder: 4 },
        ],
      },
      instructions: {
        create: [
          { stepNumber: 1, description: 'Heat dashi stock until it begins to simmer.' },
          { stepNumber: 2, description: 'Mix miso paste with a little warm dashi until smooth.' },
          { stepNumber: 3, description: 'Add wakame and simmer for 2 minutes.' },
          { stepNumber: 4, description: 'Add miso and tofu. Heat through without boiling.' },
          { stepNumber: 5, description: 'Garnish with green onions and serve.' },
        ],
      },
    },
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
