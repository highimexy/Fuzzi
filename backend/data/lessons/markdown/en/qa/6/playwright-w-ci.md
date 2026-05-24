# Playwright w CI — Testy Automatyczne w Pipeline

Playwright lokalnie to jedno. Playwright w CI to zupełnie inne środowisko: brak GUI, inne timings, headless mode, równoległe uruchomienia, artefakty. QA który rozumie CI dla Playwright może diagnozować i naprawiać failing testy które "działają u mnie".

## Dlaczego CI Różni Się od Lokalnego

| Aspekt | Lokalnie | CI (GitHub Actions, GitLab) |
|---|---|---|
| Przeglądarka | Headed (widoczna) | Headless (brak GUI) |
| CPU | Twój laptop | Shared runner (słabszy lub silniejszy) |
| Sieć | Szybka WiFi | Zmienna, czasem wolna |
| Równoległość | 1 worker | Może wiele workerów |
| Czas | Brak presji | Timeout (zwykle 10-30 min) |
| Artefakty | Lokalny folder | Upload do CI storage |

## Konfiguracja Playwright dla CI

```typescript
// playwright.config.ts
export default defineConfig({
  // Headless w CI, headed lokalnie
  use: {
    headless: process.env.CI ? true : false,
  },
  
  // Wolniejszy timeout w CI (runner może być wolniejszy)
  timeout: process.env.CI ? 60000 : 30000,
  
  // Retry przy flaky tests (tylko w CI)
  retries: process.env.CI ? 2 : 0,
  
  // Zapis artefaktów tylko przy failach
  use: {
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    trace: 'on-first-retry',
  },
  
  // Reporty dla CI
  reporter: process.env.CI
    ? [['github'], ['html', { open: 'never' }]]
    : [['html', { open: 'on-failure' }]],
});
```

## GitHub Actions — Przykładowy Workflow

```yaml
name: E2E Tests

on:
  push:
    branches: [main]
  pull_request:

jobs:
  playwright:
    runs-on: ubuntu-latest
    timeout-minutes: 30
    
    steps:
      - uses: actions/checkout@v4
      
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Start app (if needed)
        run: npm run start:ci &
        # lub testuj staging URL
      
      - name: Run Playwright tests
        run: npx playwright test
        env:
          BASE_URL: ${{ vars.STAGING_URL }}
          AUTH_TOKEN: ${{ secrets.TEST_AUTH_TOKEN }}
      
      - name: Upload test results
        if: always()   # ← WAŻNE: zawsze uploaduj, nawet przy failach
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 30
      
      - name: Upload traces
        if: failure()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-traces
          path: test-results/
```

## Parallel Testing w CI

Playwright może dzielić testy między shards (osobne joby CI):

```yaml
strategy:
  matrix:
    shard: [1, 2, 3, 4]

steps:
  - run: npx playwright test --shard=${{ matrix.shard }}/4
```

4 joby = 4× szybsze wykonanie. Koszt: więcej runner minut w CI.

**Ważne:** testy muszą być izolowane — każdy shard musi działać niezależnie od innych.

## Typowe Problemy w CI

### "Works locally, fails in CI"

**Najczęstsze przyczyny:**

1. **Timing issues** — CI jest wolniejszy, element nie zdążył się załadować
```typescript
// Zły — zakłada że element jest od razu
await page.click('button.submit');

// Dobry — czeka na element
await page.waitForSelector('button.submit', { state: 'visible' });
await page.click('button.submit');
```

2. **Hardcoded ports / URLs** — localhost:3000 nie działa w CI
```typescript
// Zły
const BASE_URL = 'http://localhost:3000';

// Dobry
const BASE_URL = process.env.BASE_URL ?? 'http://localhost:3000';
```

3. **Missing environment variables** — sekret nie jest przekazany do CI
```yaml
env:
  STRIPE_TEST_KEY: ${{ secrets.STRIPE_TEST_KEY }}  # ← musi być w GitHub Secrets
```

4. **Font rendering różni się** — visual comparison tests failują bo font antyaliasing jest inny
```typescript
// Wyłącz font antialiasing w visual tests lub użyj tolerancji
await expect(page).toHaveScreenshot('page.png', { threshold: 0.2 });
```

5. **Brak zainstalowanych przeglądarek** — Playwright browser musi być zainstalowany
```yaml
- run: npx playwright install --with-deps chromium  # tylko chromium jeśli nie potrzebujesz wszystkich
```

## Czytanie Artefaktów z CI

Po failu, pobierz artefakty z CI i otwórz report:

```bash
# Pobrany playwright-report.zip → wypakowujesz → otwierasz index.html
npx playwright show-report path/to/playwright-report
```

Lub Playwright Trace Viewer dla szczegółów:

```bash
npx playwright show-trace path/to/trace.zip
```

Trace pokazuje: każdą akcję, screenshot przed/po, network requests, console logs — wszystko co się działo podczas testu.

## Optymalizacja Czasu CI

Jeśli testy trwają za długo:

```typescript
// 1. Tagi — uruchamiaj tylko smoke tests na każdym PR
test('@smoke: User can login', async ({ page }) => { ... });
// npx playwright test --grep @smoke

// 2. Sharding — równoległe uruchomienie
// npx playwright test --shard=1/3

// 3. Pomiń powolne tests w fast path
test.skip(process.env.FAST_CI === 'true', 'Skipped in fast CI mode');

// 4. Reuse authentication state (nie loguj się na początku każdego testu)
// playwright.config.ts:
storageState: 'playwright/.auth/user.json'
```

## Raportowanie Wyników CI do Teamu

Po każdym uruchomieniu CI, QA powinien widzieć:
- Ile testów przeszło / failowało
- Które konkretnie failowały
- Screenshot i trace dla każdego failu
- Trend flaky rate w czasie

GitHub Actions pokazuje wyniki bezpośrednio w PR check. Dodaj komentarz z linkiem do pełnego raportu.
