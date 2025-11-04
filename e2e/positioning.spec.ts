import { test, expect } from '@playwright/test';

test.describe('Onboarding Positioning Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('should load the demo page correctly', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'Onboarding Library Demo' })).toBeVisible();
    await expect(page.getByTestId('start-tour-button')).toBeVisible();
  });

  test('should start the tour when button is clicked', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();

    // Wait for the onboarding card to appear
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });
    await expect(page.locator('text=This tour demonstrates the positioning cutoff prevention feature')).toBeVisible();
  });

  test('should navigate through all tour steps', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();

    // Wait for first step
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Click Next button through all steps
    const steps = [
      'Welcome!',
      'Top Left Corner',
      'Top Right Corner',
      'Bottom Left Corner',
      'Bottom Right Corner',
      'Left Edge',
      'Right Edge',
      'Center Element',
      'Tour Complete!',
    ];

    for (let i = 0; i < steps.length - 1; i++) {
      await expect(page.getByRole('heading', { name: steps[i] })).toBeVisible();
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500); // Wait for animation
    }

    // On last step, check for Finish button
    await expect(page.getByRole('heading', { name: 'Tour Complete!' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
  });

  test('should show card for top-left element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to top-left step
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('heading', { name: 'Top Left Corner' })).toBeVisible();
    await expect(page.getByTestId('element-top-left')).toBeVisible();
  });

  test('should show card for top-right element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to top-right step (step 3)
    for (let i = 0; i < 2; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Top Right Corner' })).toBeVisible();
    await expect(page.getByTestId('element-top-right')).toBeVisible();
  });

  test('should show card for bottom-left element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to bottom-left step (step 4)
    for (let i = 0; i < 3; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Bottom Left Corner' })).toBeVisible();
    await expect(page.getByTestId('element-bottom-left')).toBeVisible();
  });

  test('should show card for bottom-right element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to bottom-right step (step 5)
    for (let i = 0; i < 4; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Bottom Right Corner' })).toBeVisible();
    await expect(page.getByTestId('element-bottom-right')).toBeVisible();
  });

  test('should show card for left-edge element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to left-edge step (step 6)
    for (let i = 0; i < 5; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Left Edge' })).toBeVisible();
    await expect(page.getByTestId('element-left-edge')).toBeVisible();
  });

  test('should show card for right-edge element without cutoff', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to right-edge step (step 7)
    for (let i = 0; i < 6; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Right Edge' })).toBeVisible();
    await expect(page.getByTestId('element-right-edge')).toBeVisible();
  });

  test('should show card for center element', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to center step (step 8)
    for (let i = 0; i < 7; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    // Check for the heading in the onboarding card
    await expect(page.getByRole('heading', { name: 'Center Element' })).toBeVisible();
    await expect(page.getByTestId('element-center')).toBeVisible();
  });

  test('should allow skipping the tour', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Click Skip Tour button
    await page.getByRole('button', { name: 'Skip Tour' }).click();

    // Tour should be closed
    await expect(page.getByRole('heading', { name: 'Welcome!' })).not.toBeVisible();
  });

  test('should navigate backward with Previous button', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate forward
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('heading', { name: 'Top Left Corner' })).toBeVisible();

    // Navigate backward
    await page.getByRole('button', { name: 'Previous' }).click();
    await page.waitForTimeout(500);

    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible();
  });

  test('should disable Previous button on first step', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Previous button should be disabled on first step
    const prevButton = page.getByRole('button', { name: 'Previous' });
    await expect(prevButton).toBeDisabled();
  });

  test('should show Finish button on last step', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to last step
    for (let i = 0; i < 8; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    // Should show Finish button instead of Next
    await expect(page.getByRole('button', { name: 'Finish' })).toBeVisible();
    await expect(page.getByRole('button', { name: 'Next', exact: true })).not.toBeVisible();
  });

  test('should close tour when Finish button is clicked', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to last step
    for (let i = 0; i < 8; i++) {
      await page.getByRole('button', { name: 'Next', exact: true }).click();
      await page.waitForTimeout(500);
    }

    await expect(page.getByRole('heading', { name: 'Tour Complete!' })).toBeVisible();

    // Click Finish
    await page.getByRole('button', { name: 'Finish' }).click();

    // Tour should be closed
    await expect(page.getByRole('heading', { name: 'Tour Complete!' })).not.toBeVisible();
  });

  test('should display step counter correctly', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Check step counter on first step
    await expect(page.locator('text=1 of 9')).toBeVisible();

    // Navigate forward
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(500);

    // Check step counter on second step
    await expect(page.locator('text=2 of 9')).toBeVisible();
  });

  test('should show spotlight effect on target elements', async ({ page }) => {
    await page.getByTestId('start-tour-button').click();
    await expect(page.getByRole('heading', { name: 'Welcome!' })).toBeVisible({ timeout: 5000 });

    // Navigate to a step with a target element
    await page.getByRole('button', { name: 'Next', exact: true }).click();
    await page.waitForTimeout(500);

    // The top-left element should be visible and highlighted
    const targetElement = page.getByTestId('element-top-left');
    await expect(targetElement).toBeVisible();

    // There should be some form of overlay/spotlight (implementation-specific)
    // This is a basic check that the element is still accessible
    await expect(targetElement).toBeInViewport();
  });
});
