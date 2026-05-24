# Testy Wizualne — Łapanie Regresji Układu

Developer zmienił jedną linię CSS. Cały checkout wygląda teraz inaczej na Safari. Testy automatyczne przeszły — bo testują funkcjonalność, nie wygląd. Visual testing to siatka bezpieczeństwa dla tego co oko widzi.

## Czym Jest Visual Regression Testing?

Visual testing porównuje screenshoty strony przed i po zmianie. Piksel po pikselu. Jeśli coś się zmieniło — test failuje i pokazuje diff.

```
Baseline screenshot → Deploy nowej wersji → New screenshot → Porównanie
                                                                    ↓
                                                    Diff: tu coś się zmieniło (czerwone)
```

## Narzędzia

### Percy (BrowserStack)
- Integracja z CI (GitHub Actions, CircleCI)
- Screenshoty na wielu przeglądarkach
- Dashboard z diffami

```typescript
// W Playwright:
import { percySnapshot } from '@percy/playwright';

test('checkout page looks correct', async ({ page }) => {
  await page.goto('/checkout');
  await percySnapshot(page, 'Checkout Page');
});
```

### Playwright (wbudowane screenshoty)

```typescript
test('header matches snapshot', async ({ page }) => {
  await page.goto('/');
  
  // Zrób screenshot konkretnego elementu
  const header = page.locator('header');
  await expect(header).toHaveScreenshot('header.png');
});
```

Po pierwszym uruchomieniu tworzy baseline. Kolejne uruchomienia porównują.

Aktualizacja baseline gdy zmiana jest intentional:
```bash
npx playwright test --update-snapshots
```

### Chromatic (dla Storybook)
Jeśli firma używa Storybook do komponentów UI, Chromatic automatycznie wykrywa zmiany w każdym komponencie.

## Kiedy Testy Wizualne Mają Sens?

### TAK:
- Aplikacja ma stabilny design system
- Częste deployy które mogą negatywnie wpłynąć na UI
- Wiele przeglądarek do obsługi (Safari/Chrome/Firefox różnią się!)
- Komponent library (każda zmiana powinna być świadoma)

### NIE:
- Dynamiczna treść (reklamy, daty, liczniki) — generuje false positives
- Aktywnie rozwijany UI (każda zmiana = aktualizacja baseline)
- Animacje (screenshoty w różnych momentach animacji)

## False Positives — Największy Problem

Visual testy mają wysoką tendencję do fałszywych alarmów:
- Reklamy załadowały się inaczej
- Czas renderowania fontu się zmienił
- Anti-aliasing na różnych GPU

**Jak sobie radzić:**
```typescript
// Ignoruj dynamiczne obszary:
await expect(page).toHaveScreenshot('page.png', {
  mask: [page.locator('[data-testid="ad-banner"]')],
  // Maskuje element, nie wlicza do porównania
});

// Threshold dla małych różnic pikseli:
await expect(page).toHaveScreenshot('button.png', {
  maxDiffPixels: 100  // akceptuj do 100 różnych pikseli
});
```

## Visual Testing w Praktyce — Przepływ

1. **Ustal baseline** — pierwsze screenshoty po wdrożeniu stable brancha
2. **Integruj z PR** — każdy PR generuje screenshoty i porównuje z baseline
3. **Review diff** — QA lub developer ocenia czy zmiana jest intentional
4. **Approve lub reject** — intentional: zaktualizuj baseline. Bug: napraw.

## Co NIE Jest Visual Testing

Visual testing nie zastępuje:
- Testów funkcjonalnych (czy przycisk działa)
- Testów dostępności (czy kontrast jest wystarczający)
- Testów responsywności (visual testy na konkretnej rozdzielczości)

To uzupełnienie, nie substytut.

## Praktyczny Tip: Pierwszy Krok bez Narzędzi

Zanim wdrożysz Percy czy Visual Playwright — zacznij prosto:

1. Zrób screenshoty kluczowych stron przed każdym releasem
2. Porównaj ręcznie po deployu
3. Dopiero gdy regularnie zajmuje > 30 minut → automatyzacja

Automatyzacja bez procesu to chaos. Proces ręczny jest wolny ale daje Ci rozumienie co testować wizualnie.
