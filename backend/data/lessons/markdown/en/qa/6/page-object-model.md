# Page Object Model — Architektura Testów E2E

Gdy masz więcej niż kilka testów automatycznych, chaos w kodzie staje się problemem. Page Object Model (POM) to wzorzec który porządkuje testy E2E.

## Problem bez POM

```typescript
// Test 1
await page.fill('input[name="email"]', 'user@test.com')
await page.fill('input[name="password"]', 'pass123')
await page.click('button[type="submit"]')

// Test 2
await page.fill('input[name="email"]', 'admin@test.com')
await page.fill('input[name="password"]', 'admin123')
await page.click('button[type="submit"]')
```

Gdy UI się zmieni (np. `name="email"` → `data-testid="email-input"`), musisz zmienić selektory w **każdym teście**.

## Page Object Model

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[data-testid="email"]', email)
    await this.page.fill('[data-testid="password"]', password)
    await this.page.click('[data-testid="submit"]')
  }

  async getErrorMessage() {
    return this.page.textContent('[data-testid="error"]')
  }
}

// test.spec.ts
test('logowanie admina', async ({ page }) => {
  const loginPage = new LoginPage(page)
  await loginPage.login('admin@test.com', 'admin123')
  await expect(page).toHaveURL('/dashboard')
})
```

Teraz przy zmianie selektora — zmieniasz **tylko w jednym miejscu**.

## Zasady Dobrego POM

1. **Jedna klasa = jedna strona/komponent** — `LoginPage`, `CheckoutPage`, `ProductCard`
2. **Metody opisują akcje** — `login()`, `addToCart()`, `submitForm()`
3. **Brak asercji w Page Objects** — asercje należą do testów
4. **Zwracaj Page Objects** — po akcji nawigacyjnej zwróć nową stronę

```typescript
async login(email: string, password: string): Promise<DashboardPage> {
  // ... login logic
  return new DashboardPage(this.page)
}
```

## Fixtures w Playwright

```typescript
// fixtures.ts
export const test = base.extend<{ loginPage: LoginPage }>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page))
  }
})
```

Fixtures eliminują powtarzający się setup w każdym teście.
