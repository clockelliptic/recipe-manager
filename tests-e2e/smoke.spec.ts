import { test, expect } from '@playwright/test';

test('smoke test - side menu functionality', async ({ page }) => {
  // Go to the recipes page
  await page.goto('/recipes');
  
  // 1. Locate the hamburger menu button and click it
  const menuButton = page.locator('ion-menu-button');
  await expect(menuButton).toBeVisible();
  await menuButton.click();
  
  // 2. Wait for the side menu to be visible
  const sideMenu = page.locator('ion-menu');
  await expect(sideMenu).toBeVisible();
  
  // 3. Verify the menu content
  const menuTitle = sideMenu.locator('ion-title');
  await expect(menuTitle).toContainText('Recipe Manager');
  
  // 4. Verify organization switcher text is present
  await expect(page.getByText('Switch Organization')).toBeVisible();
  
  // 5. Ensure we can close the menu (by clicking outside or a link)
  // Clicking "All Recipes" should close the menu if auto-hide is true
  const allRecipesLink = page.getByText('Create New');
  await allRecipesLink.click();
  
  // Side menu should eventually hide
  await expect(sideMenu).not.toBeVisible();
});
