import { expect, type Page } from '@playwright/test';

export default class BasePage {
	readonly page: Page;
	readonly url: string;

	constructor(url: string, page: Page) {
		this.page = page;
		this.url = url;
	}

	async gotoPage(): Promise<void> {
		await this.page.goto(this.url);
	}

	async assertPageUrl(): Promise<void> {
		await expect(this.page).toHaveURL(this.url);
	}

	randomString(len: number, type: string) {
		type = type && type.toLowerCase();
		let str = '',
			i = 0,
			min = type == 'letters' ? 10 : 0,
			max = type == 'number' ? 10 : 62;
		for (; i++ < len; ) {
			let r = (Math.random() * (max - min) + min) << 0;
			str += String.fromCharCode((r += r > 9 ? (r < 36 ? 55 : 61) : 48));
		}
		return str;
	}
}