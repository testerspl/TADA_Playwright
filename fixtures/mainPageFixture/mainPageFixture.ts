import { test as base } from '@playwright/test';
import { MainPageSettings } from '../../lib/config/basePageSettings';
import { MainPage } from '../../pages/mainPage/mainPage';

type TesterzyPlFixtures = {
	testerzyplMainPage: MainPage;
};

export const test = base.extend<TesterzyPlFixtures>({
	testerzyplMainPage: async ({ page }, use) => {
		const mainPage = new MainPage(page, MainPageSettings.production.home);
		await mainPage.gotoPage();
		await use(mainPage);
	},
});

export { expect } from '@playwright/test';
