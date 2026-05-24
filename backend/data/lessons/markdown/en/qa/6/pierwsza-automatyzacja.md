# Test Automation — Pierwszy Krok

Automatyzacja testów to pisanie kodu, który wykonuje testy zamiast człowieka. Nie zastępuje testowania manualnego — uzupełnia je.

## Kiedy Automatyzować?

**Warto automatyzować:**
- Regresję — testy które powtarzasz każdy sprint
- Smoke testy — szybka weryfikacja po deploy'u
- Testy danych — generowanie/walidacja wielu przypadków
- Testy API — stabilne, deterministyczne, szybkie

**Nie automatyzuj:**
- Testów exploratory
- Testów UX i użyteczności
- Testów jednorazowych
- Testów na niestabilnych funkcjach (w trakcie developmentu)

## Playwright — Przykład

Playwright (Microsoft) to nowoczesny framework do automatyzacji E2E.

```typescript
import { test, expect } from '@playwright/test';

test('użytkownik może się zalogować', async ({ page }) => {
  await page.goto('/login');

  await page.fill('[data-testid="email"]', 'user@example.com');
  await page.fill('[data-testid="password"]', 'password123');
  await page.click('[data-testid="submit"]');

  await expect(page).toHaveURL('/dashboard');
  await expect(page.locator('h1')).toContainText('Witaj');
});
```

## data-testid — Kontrakt z Developerami

`data-testid` to atrybut HTML specjalnie dla testów automatycznych. Daje stabilne selektory niezależne od CSS i tekstu przycisku.

Dobra praktyka: QA i developerzy ustalają naming convention dla `data-testid` na początku projektu.

## Piramida Testów Ponownie

Automatyzuj od dołu piramidy:
1. **Unit tests** — developerzy piszą, QA weryfikuje pokrycie
2. **Integration/API** — QA i developerzy współpracują
3. **E2E** — QA pisze, ale trzyma ich liczbę w ryzach (są drogie w utrzymaniu)
