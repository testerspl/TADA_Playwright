import { expect, test } from '@playwright/test';
import LoginPage from '../pages/loginPage/loginPage';
import MainPage from '../pages/mainPage/mainPage';
const { describe, beforeEach } = test;
const [user, password] = [process.env.DEFAULT_USER!, process.env.DEFAULT_PASSWORD!];
let loginPage: LoginPage, mainPage: MainPage;

describe('test arena specification', () => {
    beforeEach(async ({ page }) => {
        loginPage = new LoginPage(page);

        await loginPage.gotoPage();
        await loginPage.login(user, password);

        mainPage = new MainPage(page);
    });

    test('should login to app', async ({ page }) => {
        await mainPage.assertMainPage(user);
    });

    test('should logout from app', async ({ page }) => {
        mainPage.logout();

        await loginPage.assertLoginPage();
    });
});
