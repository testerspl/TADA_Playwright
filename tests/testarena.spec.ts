import { test } from '@playwright/test';
import { pagesTest } from '../fixtures/pagesFixture';
import LoginPage from '../pages/loginPage/loginPage';
const { describe, beforeEach } = test;
const [user, password] = [process.env.DEFAULT_USER!, process.env.DEFAULT_PASSWORD!];

describe('test arena specification', () => {
    beforeEach(async ({ page }) => {
        const loginPage = new LoginPage(page);

        await loginPage.gotoPage();
        await loginPage.login(user, password);
    });

    pagesTest('should login to app', async ({ getMainPage }) => {
        await getMainPage().assertMainPage(user);
    });

    pagesTest('should logout from app', async ({ getMainPage, getLoginPage }) => {
        await getMainPage().logout();

        await getLoginPage().assertLoginPage();
    });
});
