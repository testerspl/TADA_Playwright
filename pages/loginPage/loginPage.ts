import { expect, type Locator, type Page } from '@playwright/test';
import { setPasswordSecretly } from '../../utils';
import BasePage from '../basePage';
import loginPageSelectors from './loginPage.selectors';
import mainPageSelectors from '../mainPage/mainPage.selectors';

export default class LoginPage extends BasePage {
    readonly loginForm: Locator = this.page.locator(loginPageSelectors.LOGIN_FORM);
    readonly emailField: Locator = this.page.getByRole('textbox', { name: 'Adres e-mail' });
    readonly passwordField: Locator = this.page.getByRole('textbox', { name: 'Hasło' });
    readonly loginButton: Locator = this.page.getByRole('button', { name: 'Zaloguj' });

    constructor(page: Page) {
        super('/zaloguj', page);
    }

    async login(email: string, password: string): Promise<void> {
        await this.emailField.fill(email);
        await this.passwordField.evaluate(setPasswordSecretly, password);
        await this.loginButton.click();
        await this.page.locator(mainPageSelectors.HEADER_LOGO).waitFor();
    }

    async assertLoginPage(): Promise<void> {
        await this.assertPageUrl();
        await expect(this.loginForm).toBeVisible();
    }
}
