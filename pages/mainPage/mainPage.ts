import {expect,  Locator, type Page } from '@playwright/test';
import BasePage from '../basePage';


export class MainPage extends BasePage {
readonly logoutBtn: Locator
    constructor(page: Page) {
        super('/', page)
        this.logoutBtn = page.locator('.icons-switch')
    }

    async logout() {
        await this.logoutBtn.click()
    }
}