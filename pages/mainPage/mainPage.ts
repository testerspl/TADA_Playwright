import { expect, type Locator, type Page } from "@playwright/test";
import BasePage from "../basePage";
import mainPageSelectors from "./mainPage.selectors";
import loginPageSelectors from "../loginPage/loginPage.selectors";

export default class MainPage extends BasePage {
    readonly headerLogo: Locator = this.page.locator(mainPageSelectors.HEADER_LOGO);
    readonly userInfo: Locator = this.page.locator(mainPageSelectors.USER_INFO);
    readonly logoutButton: Locator = this.page.locator(mainPageSelectors.LOGOUT_BUTTON);

    constructor(page: Page) {
        super('/', page);
    }

    logout() {
        this.logoutButton.click();
        this.page.locator(loginPageSelectors.LOGIN_FORM).waitFor();
    }

    async assertMainPage(user: string | null): Promise<void> {
        await this.assertPageUrl();
        await expect(this.headerLogo).toBeVisible();

        if (user !== null) {
            await expect(this.userInfo).toContainText(user);
        }
    }
}