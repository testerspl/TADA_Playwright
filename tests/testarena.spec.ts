import { expect, test } from '@playwright/test';
const { describe } = test;
const setPasswordSecretly = (input: HTMLInputElement, password: string) => {
    input.value = password;
}

describe('test arena specification', () => {
    test('should login to app', async ({ page }) => {
        const user = process.env.DEFAULT_USER!;
        const password = process.env.DEFAULT_PASSWORD!;
        await page.goto('/zaloguj');

        await page.getByRole('textbox', { name: 'Adres e-mail' }).fill(user);
        await page.getByRole('textbox', { name: 'Hasło' }).evaluate(setPasswordSecretly, password);
        await page.getByRole('button', { name: 'Zaloguj' }).click();

        await expect(page).toHaveURL('/');
        await expect(page.locator('#header_logo')).toBeVisible();
        await expect(page.locator('.user-info')).toContainText(user);
    });

    test('should logout from app', async ({ page }) => {
        const user = process.env.DEFAULT_USER!;
        const password = process.env.DEFAULT_PASSWORD!;
        await page.goto('/zaloguj');
        await page.getByRole('textbox', { name: 'Adres e-mail' }).fill(user);
        await page.getByRole('textbox', { name: 'Hasło' }).evaluate(setPasswordSecretly, password);
        await page.getByRole('button', { name: 'Zaloguj' }).click();
        await page.waitForSelector('#header_logo');

        await page.locator('.header_logout>a').click();

        await expect(page).toHaveURL('/zaloguj');
        await expect(page.locator('form.front-log')).toBeVisible();
    });
});
