import { expect, test } from '@playwright/test';


// NOTE: Proste mockowanie jednej odpowiedzi API
test('mockowana prosta odpowiedź API', async ({ page }) => {
	await page.route('**/api/users', async (route) => {
		const mockedResponse = [
			{ id: 1, name: 'Jan Kowalski' },
			{ id: 2, name: 'Anna Nowak' },
		];
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedResponse),
		});
	});

	await page.goto('http://localhost:3000/users');
	await expect(page.locator('text=Jan Kowalski')).toBeVisible();
	await expect(page.locator('text=Anna Nowak')).toBeVisible();
});


// NOTE: Mockowanie z opóźnieniem + błędna odpowiedź
test('symulacja błędu serwera z opóźnieniem', async ({ page }) => {
	await page.route('**/api/products', async (route) => {
		await route.fulfill({
			status: 500,
			contentType: 'application/json',
			body: JSON.stringify({ error: 'Internal Server Error' }),
			delay: 1000, // opóźnienie 1s
		});
	});

	await page.goto('http://localhost:3000/products');
	await expect(page.locator('text=Błąd ładowania')).toBeVisible();
});


// NOTE: Mockowanie tylko konkretnej metody (np. POST)
test('mock POST zapytania', async ({ page }) => {
	await page.route('**/api/login', async (route) => {
		if (route.request().method() === 'POST') {
			await route.fulfill({
				status: 200,
				contentType: 'application/json',
				body: JSON.stringify({ token: 'fake-jwt-token' }),
			});
		} else {
			route.continue(); // pozwól innym metodom przejść normalnie
		}
	});

	await page.goto('http://localhost:3000/login');
	await page.fill('input[name="username"]', 'admin');
	await page.fill('input[name="password"]', 'admin123');
	await page.click('button[type="submit"]');

	await expect(page.locator('text=Zalogowano')).toBeVisible();
});


// NOTE: Jak odebrać response, który jest rzeczywistym rezultatem zapytania
test('odczytanie odpowiedzi API po mocku', async ({ page }) => {
	const mockedData = [{ id: 1, name: 'Test User' }];

	await page.route('**/api/users', async (route) => {
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify(mockedData),
		});
	});

	const [response] = await Promise.all([
		page.waitForResponse(
			(resp) => resp.url().includes('/api/users') && resp.status() === 200
		),
		page.goto('http://localhost:3000/users'),
	]);

	const body = await response.json();
	console.log('Odebrana odpowiedź:', body); // [ { id: 1, name: 'Test User' } ]

	expect(body).toEqual(mockedData);
});


// NOTE: Odczyt wszystkich response (np. do logów/debugowania)
test('nasłuchiwanie wszystkich odpowiedzi', async ({ page }) => {
	await page.on('response', async (response) => {
		if (response.url().includes('/api/users')) {
			const body = await response.json();
			console.log('Interceptowana odpowiedź:', body);
		}
	});

	await page.goto('http://localhost:3000/users');
});


// NOTE: Weryfikacja w samym handlerze page.route()
test('mock + walidacja request body w route.fulfill()', async ({ page }) => {
	const expectedPayload = { username: 'admin', password: 'secret' };

	await page.route('**/api/login', async (route) => {
		// Parsujemy ciało przychodzącego żądania
		const postData = JSON.parse(route.request().postData() || '{}');

		// Asercje – upewniamy się, że payload jest taki jak chcemy
		expect(postData).toEqual(expectedPayload);

		// Zwracamy sztuczną odpowiedź
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ token: 'fake-token-123' }),
		});
	});

	// Wywołanie akcji w aplikacji
	await page.goto('http://localhost:3000/login');
	await page.fill('input[name="username"]', 'admin');
	await page.fill('input[name="password"]', 'secret');
	await page.click('button[type="submit"]');

	// Możemy dodatkowo poczekać na odpowiedź i sprawdzić UI
	const response = await page.waitForResponse((r) =>
		r.url().includes('/api/login')
	);
	const json = await response.json();
	expect(json.token).toBe('fake-token-123');
});


// NOTE: Oddzielne mockowanie + nasłuchiwanie page.waitForRequest()
test('mock + osobne sprawdzenie request body przez waitForRequest', async ({
	page,
}) => {
	// Najpierw ustawiamy mock odpowiedzi
	await page.route('**/api/login', (route) =>
		route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({ token: 'fake-token-456' }),
		})
	);

	// Równolegle nasłuchujemy na wychodzące requesty
	const [request] = await Promise.all([
		page.waitForRequest(
			(r) => r.url().includes('/api/login') && r.method() === 'POST'
		),
		(async () => {
			// Aplikacja wykonuje POST
			await page.goto('http://localhost:3000/login');
			await page.fill('input[name="username"]', 'user1');
			await page.fill('input[name="password"]', 'pass1');
			await page.click('button[type="submit"]');
		})(),
	]);

	// Parsujemy i asertujemy ciało żądania
	const body = JSON.parse(request.postData() || '{}');
	expect(body).toEqual({ username: 'user1', password: 'pass1' });

	// Możemy też zweryfikować, że aplikacja otrzymała nasz mock
	const response = await page.waitForResponse((r) =>
		r.url().includes('/api/login')
	);
	const json = await response.json();
	expect(json.token).toBe('fake-token-456');
});
