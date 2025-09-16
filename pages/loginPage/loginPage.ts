import {expect,  Locator, type Page } from '@playwright/test';
import BasePage from '../basePage';

export class LoginPage extends BasePage {
readonly emailInput: Locator
readonly passInput: Locator
readonly loginBtn: Locator
readonly loginForm: Locator

	constructor(page: Page) {
		super('demo.testarena.pl/zaloguj', page);
        this.emailInput = page.locator('#email')
        this.passInput = page.locator('#password')
        this.loginBtn = page.getByRole('button', { name: 'Zaloguj' })
        this.loginForm = page.locator('form[class="front-log"]')
	}


	async login(): Promise<void> {
		await this.emailInput.fill('administrator@testarena.pl');
		await this.passInput.fill('sumXQQ72$L');
		await this.loginBtn.click();
	}

    async checkLoginPageElems (): Promise<void> {
        await expect(this.loginForm).toBeVisible()
    }
}
