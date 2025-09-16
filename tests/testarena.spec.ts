import { expect, test } from '@playwright/test';
const { describe } = test;

describe('test arena specification', () => {
    test('should login to app', async ({ page }) => {
        const user = process.env.DEFAULT_USER!;
        const password = process.env.DEFAULT_PASSWORD!;
        await page.goto('/zaloguj');

        await page.getByRole('textbox', { name: 'Adres e-mail' }).fill(user);
        await page.getByRole('textbox', { name: 'Hasło' }).fill(password);
        await page.getByRole('button', { name: 'Zaloguj' }).click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#header_logo')).toBeVisible();
        await expect(page.locator('.user-info')).toContainText(user);
    });
});
