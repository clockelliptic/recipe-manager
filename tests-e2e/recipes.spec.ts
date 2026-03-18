import { delay } from '@/lib/utils/time';
import { test, expect, Page } from '@playwright/test';

async function waitForLoading(page: Page) {
  // Wait for our specific data-loading spinner to be gone
  // We use [name="crescent"] to avoid matching Ionic's internal layout spinners
  await page.locator('ion-spinner[name="crescent"]').waitFor({ state: 'hidden' });
}

test.describe('Recipe Management', () => {
  test.skip('should create, search, view, and delete a recipe', async ({ page }) => {
    // 1. CREATE A RECIPE
    await page.goto('/recipes');
    await waitForLoading(page);
    
    // Open wizard using test-id
    await page.click('[data-testid="new-recipe-button"]');
    await expect(page.locator('span', { hasText: 'Basic Info' })).toBeVisible();

    // Step 1: Basic Info
    await page.fill('ion-input[placeholder="e.g. Grandma\'s Marinara"] input', 'E2E Test Pasta');
    await delay(1000);
    await page.fill('ion-input[placeholder="4"] input', '2');
    await delay(1000);
    await page.fill('ion-input[placeholder="Servings"] input', 'Portions');
    await delay(1000);
    await page.click('ion-button:has-text("Next Step")');
    await delay(1000);

    // Step 2: Ingredients
    await expect(page.locator('h3', { hasText: 'Ingredients' })).toBeVisible();
    await page.fill('ion-input[placeholder="Salt"] input', 'Test Flour');
    await delay(1000);
    await page.fill('ion-input[placeholder="1"] input', '500');
    await delay(1000);
    await page.fill('ion-input[placeholder="tsp"] input', 'g');
    await delay(1000);
    await page.click('ion-button:has-text("Next Step")');
    await delay(1000);

    // Step 3: Instructions
    await expect(page.locator('h3', { hasText: 'Instructions' })).toBeVisible();
    await page.fill('ion-textarea[placeholder="Describe step..."] textarea', 'Mix flour with water and pray.');
    await delay(1000);
    await page.click('ion-button:has-text("Next Step")');

    // Step 4: Review and Save
    await expect(page.locator('span', { hasText: 'Review' })).toBeVisible();
    await expect(page.getByText('E2E Test Pasta')).toBeVisible();
    await page.click('ion-button:has-text("Save Recipe")');

    // Wait for redirect to Kitchen View
    await waitForLoading(page);
    await expect(page).toHaveURL(/\/recipes\/.+/);
    await expect(page.locator('h3')).toContainText('E2E Test Pasta');

    // 2. SEARCH FOR RECIPE
    await page.goto('/recipes');
    await waitForLoading(page);
    const searchBar = page.locator('ion-searchbar input');
    await searchBar.fill('E2E Test');
    
    // Verify our specific card appears (using the class we added)
    const recipeCard = page.locator('.recipe-card', { hasText: 'E2E Test Pasta' });
    await expect(recipeCard).toBeVisible();
    await delay(1000);

    // 3. KITCHEN VIEW READABILITY
    await recipeCard.click();
    await waitForLoading(page);
    await delay(1000);
    
    // Check for high-readability elements
    const title = page.locator('h1');
    await expect(title).toContainText('E2E Test Pasta');
    
    const yieldInfo = page.getByText('Yields: 2 Portions');
    await expect(yieldInfo).toBeVisible();
    
    const ingredient = page.locator('span', { hasText: 'Test Flour' });
    await expect(ingredient).toBeVisible();
    await expect(page.getByText('500 Portions')).not.toBeVisible();
    await expect(page.getByText('500 g')).toBeVisible();

    // 4. DELETE RECIPE
    await page.click('button:has-text("Delete")');
    
    // Handle Ionic Alert
    const alert = page.locator('ion-alert');
    await expect(alert).toBeVisible();
    await page.click('button.alert-button-role-destructive');
    await delay(1000);

    // Should return to dashboard and recipe should be gone
    await expect(page).toHaveURL('/recipes');
    await waitForLoading(page);
    await searchBar.fill('E2E Test Pasta');
    await expect(page.getByText('No recipes found')).toBeVisible();
  });

  test('should allow editing an existing recipe', async ({ page }) => {
    await page.goto('/recipes');
    await waitForLoading(page);
    
    // Use an existing recipe from seed data
    const recipeCard = page.locator('.recipe-card', { hasText: 'Classic Marinara Sauce' });
    await expect(recipeCard).toBeVisible();
    
    // Click Edit button on the card
    await recipeCard.locator('button:has-text("Edit")').click();
    await waitForLoading(page);
    
    // Verify we are in edit mode
    await expect(page.getByText('Edit Recipe')).toBeVisible();
    
    // Change title
    const titleInput = page.locator('ion-input[placeholder="e.g. Grandma\'s Marinara"] input');
    await titleInput.fill('Updated Marinara');
    await delay(500);
    
    // Skip to review
    await page.click('ion-button:has-text("Next Step")'); // Ingredients
    await delay(500);
    await page.click('ion-button:has-text("Next Step")'); // Instructions
    await delay(500);
    await page.click('ion-button:has-text("Next Step")'); // Review
    await delay(500);

    await page.click('ion-button:has-text("Save Recipe")');
    await delay(500);

    // Verify change in Kitchen View
    await waitForLoading(page);
    await expect(page.locator('h1')).toContainText('Updated Marinara');
  });
});
