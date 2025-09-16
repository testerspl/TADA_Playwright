import { expect, test } from '@playwright/test';

test('update battery status (no golden)', async ({ page }) => {
	await page.addInitScript(() => {
		// Mock class that will notify corresponding listeners when battery status changes.
		class BatteryMock {
			level = 0.1;
			charging = false;
			chargingTime = 1800;
			dischargingTime = Infinity;
			_chargingListeners = [];
			_levelListeners = [];
			addEventListener(eventName, listener) {
				if (eventName === 'chargingchange')
					this._chargingListeners.push(listener);
				if (eventName === 'levelchange') this._levelListeners.push(listener);
			}
			// Will be called by the test.
			_setLevel(value) {
				this.level = value;
				this._levelListeners.forEach((cb) => cb());
			}
			_setCharging(value) {
				this.charging = value;
				this._chargingListeners.forEach((cb) => cb());
			}
		}
		const mockBattery = new BatteryMock();
		// Override the method to always return mock battery info.
		window.navigator.getBattery = async () => mockBattery;
		// Save the mock object on window for easier access.
		window.mockBattery = mockBattery;
	});

	await page.goto('/');
	await expect(page.locator('.battery-percentage')).toHaveText('10%');

	// Update level to 27.5%
	await page.evaluate(() => window.mockBattery._setLevel(0.275));
	await expect(page.locator('.battery-percentage')).toHaveText('27.5%');
	await expect(page.locator('.battery-status')).toHaveText('Battery');

	// Emulate connected adapter
	await page.evaluate(() => window.mockBattery._setCharging(true));
	await expect(page.locator('.battery-status')).toHaveText('Adapter');
	await expect(page.locator('.battery-fully')).toHaveText('00:30');
});
