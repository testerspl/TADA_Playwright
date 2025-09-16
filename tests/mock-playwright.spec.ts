import { expect, test } from '@playwright/test';
import * as dotenv from 'dotenv';
dotenv.config();

const baseUrl =
	process.env.BASE_URL ||
	'https://e43c23fe-12bb-4ee6-bde3-85e81dc7ac59.mock.pstmn.io';

test.describe('Mocked API integration', () => {
	test('should return a valid user', async ({ request }) => {
		const res = await request.get(`${baseUrl}/users/1`);
		expect(res.status()).toBe(200);
		const body = await res.json();
		expect(body.name).toBe('Krzysiek QA');
	});

	test('should return 404 for non-existent user', async ({ request }) => {
		const res = await request.get(`${baseUrl}/users/9999`);
		expect(res.status()).toBe(404);
		const body = await res.json();
		expect(body.error).toBe('User not found');
	});

	test('should log in with valid credentials', async ({ request }) => {
		const res = await request.post(`${baseUrl}/login`, {
			data: {
				username: 'qa',
				password: 'test123',
			},
		});
		expect(res.status()).toBe(200);
		const body = await res.json();
		expect(body.token).toBe('abc123xyz');
	});
});
