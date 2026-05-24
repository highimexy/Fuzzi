# Konfiguracja Środowisk i Zarządzanie Danymi Testowymi

QA pracuje na wielu środowiskach. Chaos w konfiguracji = chaos w wynikach testów.

## Problemy ze Środowiskami

Klasyczne scenariusze które widzisz w każdej firmie:

- "U mnie działa" → developer testował na local, QA na staging
- "Test fail na CI ale pass lokalnie" → różne wersje zależności
- "Dane testowe gdzieś zniknęły" → ktoś czyścił bazę staging bez ostrzeżenia
- "Cert SSL wygasł" → staging nie ma auto-renewal

## Zmienne Środowiskowe

Nigdy nie hardkoduj URL-i w testach:

```typescript
// ŹLE
await page.goto('https://staging.app.com/login')

// DOBRZE
await page.goto(`${process.env.BASE_URL}/login`)
```

Playwright config:

```typescript
// playwright.config.ts
export default defineConfig({
  use: {
    baseURL: process.env.BASE_URL || 'http://localhost:3000',
  }
})
```

Uruchamianie na różnych środowiskach:
```bash
BASE_URL=https://staging.app.com npx playwright test
BASE_URL=https://prod.app.com npx playwright test --project=smoke
```

## Test Data Management

Dane testowe to jeden z najtrudniejszych aspektów automatyzacji.

### Strategie:

**1. Test Data Factory** — generuj dane na żądanie:
```typescript
async function createTestUser(overrides = {}) {
  return api.post('/users', {
    email: `test-${Date.now()}@test.com`,
    password: 'TestPass123!',
    ...overrides
  })
}
```

**2. Database Seeding** — seed testowej bazy przed suite
**3. API Setup** — twórz dane przez API przed każdym testem
**4. Data Pool** — pula pre-zdefiniowanych danych testowych

### Izolacja Testów

Każdy test powinien być **niezależny** — nie polegać na stanie pozostawionym przez poprzedni test.

```typescript
test.beforeEach(async ({ page }) => {
  // zawsze czyść state
  await page.context().clearCookies()
})

test.afterEach(async ({ request }) => {
  // posprzątaj dane które stworzyłeś
  await request.delete(`/api/test-users/${userId}`)
})
```
