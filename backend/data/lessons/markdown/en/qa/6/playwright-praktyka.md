# Playwright w Praktyce — Od Zera do Pierwszego Testu

Playwright to obecnie najlepsze narzędzie do automatyzacji testów E2E. Szybszy niż Selenium, stabilniejszy niż Cypress dla testów cross-browser, z wbudowanym tracing i nagrywaniem.

## Dlaczego Playwright?

| Feature | Playwright | Selenium | Cypress |
|---------|-----------|----------|---------|
| Chrome, Firefox, Safari | ✓ | ✓ | Ograniczone |
| Auto-wait | ✓ | ✗ | ✓ |
| Nagrywanie | ✓ | ✗ | ✓ |
| API testing | ✓ | ✗ | ✓ |
| Mobile emulation | ✓ | Ograniczone | ✗ |
| Szybkość | ★★★★★ | ★★★ | ★★★★ |

## Setup w 5 Minut

```bash
npm init playwright@latest
```

Playwright automatycznie:
- Tworzy konfigurację
- Instaluje przeglądarki (Chromium, Firefox, WebKit)
- Tworzy przykładowe testy
- Konfiguruje GitIgnore

## Twój Pierwszy Test

```typescript
// tests/login.spec.ts
import { test, expect } from '@playwright/test';

test('użytkownik może się zalogować', async ({ page }) => {
  // Otwórz stronę
  await page.goto('https://staging.example.com/login');
  
  // Wypełnij formularz
  await page.fill('[name="email"]', 'test@example.com');
  await page.fill('[name="password"]', 'Password123!');
  
  // Kliknij przycisk
  await page.click('button[type="submit"]');
  
  // Sprawdź że jesteś zalogowany
  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('[data-testid="user-menu"]')).toBeVisible();
});
```

## Selektory — Hierarchia od Najlepszego do Najgorszego

| Selector | Przykład | Ocena |
|----------|---------|-------|
| `data-testid` | `[data-testid="submit-btn"]` | ★★★★★ — najstabilniejszy |
| Role + name | `getByRole('button', {name: 'Zaloguj'})` | ★★★★★ — semantyczny |
| Text | `getByText('Zaloguj się')` | ★★★★ — zmienia się z kopią |
| Label | `getByLabel('Email')` | ★★★★ — dla formularzy |
| Placeholder | `getByPlaceholder('jan@example.com')` | ★★★ |
| CSS class | `.btn-primary` | ★★ — zmienia się z refactorem |
| XPath | `//div[@class='...']/button` | ★ — kruche, unikaj |

**Zasada:** Im mniej zależy od implementacji CSS/struktury, tym stabilniejszy test.

## Auto-Wait — Dlaczego Playwright jest Odporny na Flakiness

Playwright automatycznie czeka na:
- Element widoczny (visible)
- Element klikalny (not disabled, not covered)
- Sieć idle (po nawigacji)

```typescript
// NIE MUSISZ pisać:
await page.waitForTimeout(2000);  // ← złe, arbitrary wait
await page.waitForSelector('.spinner', { state: 'hidden' });  // ← niepotrzebne

// Playwright sam czeka:
await page.click('#submit-btn');  // czeka aż przycisk będzie klikalny
await expect(page.locator('.result')).toBeVisible();  // czeka na element
```

## Page Object Model (POM)

POM to wzorzec projektowy: każda strona to klasa z metodami.

```typescript
// pages/LoginPage.ts
export class LoginPage {
  constructor(private page: Page) {}

  async login(email: string, password: string) {
    await this.page.fill('[name="email"]', email);
    await this.page.fill('[name="password"]', password);
    await this.page.click('button[type="submit"]');
  }

  async getErrorMessage() {
    return this.page.locator('.error-message').textContent();
  }
}

// tests/login.spec.ts
const loginPage = new LoginPage(page);
await loginPage.login('test@example.com', 'wrongpassword');
expect(await loginPage.getErrorMessage()).toBe('Nieprawidłowe hasło');
```

POM sprawia że gdy strona się zmienia, poprawiasz w jednym miejscu, nie w 50 testach.

## Debugging i Tracing

```bash
# Uruchom testy z UI (interaktywny debugger)
npx playwright test --ui

# Nagraj ślad (trace) żeby zobaczyć co się stało
npx playwright test --trace on

# Otwórz trace viewer
npx playwright show-trace test-results/trace.zip
```

Trace viewer pokazuje screenshot każdego kroku, sieć, logi konsoli. Idealne do debugowania flaky testów.

## Uruchamianie w CI/CD

```yaml
# .github/workflows/e2e.yml
- name: Run E2E tests
  run: npx playwright test
  
- name: Upload test results
  uses: actions/upload-artifact@v3
  if: always()
  with:
    name: playwright-report
    path: playwright-report/
```

`if: always()` — raporty są uploadowane nawet gdy testy się nie powiodły. Kluczowe dla debugowania CI.
