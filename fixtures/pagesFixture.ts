import { test } from '@playwright/test';
import MainPage from '../pages/mainPage/mainPage';
import LoginPage from '../pages/loginPage/loginPage';

type PagesFixture = {
    getLoginPage: () => LoginPage;
    getMainPage: () => MainPage;
};

export const pagesTest = test.extend<PagesFixture>({
    getLoginPage: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        await use(() => loginPage);
    },
    getMainPage: async ({ page }, use) => {
        const mainPage = new MainPage(page);
        await use(() => mainPage);
    }
});
