# Debugging Testów Automatycznych — Dlaczego Test Failuje i Jak to Naprawić

Testy automatyczne failują. Czasem z dobrego powodu (znalazły buga), czasem z złego (są źle napisane lub niestabilne środowisko). QA który potrafi szybko zdiagnozować przyczynę failowania — oszczędza godziny debugowania.

## Dwa Typy Failowania

### True Failure — Bug w Aplikacji
Test wykrył regresję. To jest sukces testu. Przejdź do zgłoszenia buga.

### False Positive — Bug w Teście lub Środowisku
Test failuje ale aplikacja działa poprawnie. To jest problem do naprawy w teście.

Rozróżnienie nie zawsze jest oczywiste. Pierwsza reguła: **sprawdź manualnie zanim zaczniesz naprawiać test.**

## Diagnostyka — Gdzie Zacząć

### Krok 1: Przeczytaj Error Message

```
TimeoutError: Waiting for element to be visible
  locator: [data-testid="submit-button"]
  timeout: 30000ms
```

Ten błąd mówi: test czekał 30 sekund na element który nigdy się nie pojawił.

Możliwe przyczyny:
- Element ma inny selektor
- Strona nie załadowała się poprawnie
- Feature jest za feature flagą (wyłączona w tym środowisku)
- Aplikacja jest za wolna i timeout jest za krótki

### Krok 2: Uruchom Test Lokalnie i Obejrzyj

```bash
# Playwright — tryb headed (widoczna przeglądarka)
npx playwright test --headed --project=chromium login.spec.ts

# Selenium — z wolniejszym wykonaniem
# Dodaj implicit wait lub opóźnienia między krokami
```

Oglądając test w przeglądarce często od razu widzisz problem.

### Krok 3: Sprawdź Screenshots i Logi

Większość dobrych frameworków tworzy screenshots przy failowaniu:

```bash
# Playwright — automatyczne screenshoty przy failach
ls test-results/

# Sprawdź też trace (Playwright Trace Viewer)
npx playwright show-trace test-results/trace.zip
```

Screenshot pokazuje stan aplikacji w momencie failu — zazwyczaj wszystko jasne.

## Najczęstsze Przyczyny Failowania

### Race Condition — Asynchroniczność
Test nie czeka aż element jest gotowy do interakcji.

```javascript
// Zły pattern:
await page.click('#submit');
expect(await page.textContent('.result')).toBe('Sukces');
// Problem: .result może jeszcze nie mieć tekstu

// Dobry pattern:
await page.click('#submit');
await expect(page.locator('.result')).toHaveText('Sukces', { timeout: 5000 });
// Poczekaj aż tekst faktycznie będzie 'Sukces'
```

### Hardcoded Dane
Test zakłada dane które nie są w środowisku testowym.

```javascript
// Zły:
await page.fill('#email', 'admin@company.com'); // może nie istnieć na staging
await page.fill('#password', 'password123');    // może być inne hasło

// Dobry:
const { email, password } = process.env; // dane z env vars lub fixtures
await page.fill('#email', email);
```

### Zależność między Testami
Test B zakłada że Test A już wykonał jakieś działanie.

```javascript
// Problem: Test B zakłada że Test A stworzył usera
test('B: edit user profile', async () => {
  await page.goto('/users/123'); // 123 musi istnieć!
});

// Rozwiązanie: każdy test tworzy własne dane
test('B: edit user profile', async () => {
  const user = await createTestUser(); // fixture
  await page.goto(`/users/${user.id}`);
});
```

### Flakey Timeouty
Test failuje sporadycznie bo środowisko jest czasami wolne.

```javascript
// Zwiększ timeout dla wrażliwych operacji
await page.click('#big-upload-button');
await expect(page.locator('.upload-complete')).toBeVisible({ timeout: 60000 });
// Upload może zająć do minuty
```

### Zmieniony Selektor
Developer zmienił CSS class lub HTML strukturę.

```javascript
// Kruchty selektor (zmienia się często):
await page.click('.btn.btn-primary.checkout-btn');

// Stabilny selektor (data-testid nie zmienia się przypadkowo):
await page.click('[data-testid="checkout-button"]');
```

Zasada: zawsze używaj `data-testid` lub innych atrybutów dedykowanych do testowania.

## Debugging Specyficznych Typów Błędów

### "Element not found"
1. Sprawdź czy selektor jest poprawny (DevTools → Console: `document.querySelector('[data-testid="X"]')`)
2. Sprawdź czy strona załadowała się w pełni
3. Sprawdź czy element jest w iframe (wymaga osobnego obsługi)
4. Sprawdź czy element istnieje dopiero po akcji użytkownika

### "Assertion failed: expected X got Y"
1. Sprawdź czy dane testowe są takie jak oczekujesz
2. Sprawdź czy nie ma whitespace lub hidden characters
3. Sprawdź locale (daty, liczby — mogą wyglądać inaczej w różnych językach)

### "Network request failed"
1. Sprawdź czy backend jest dostępny (health check)
2. Sprawdź credentials (token wygasł?)
3. Sprawdź CORS jeśli test wysyła bezpośrednie API requestów
4. Sprawdź czy environment URL jest poprawny

## Test Isolation — Zapobieganie Problemom

Każdy test powinien:

```javascript
// Setup: stan przed testem
beforeEach(async () => {
  await db.truncate(['orders', 'users']); // wyczyść dane
  await createTestUser({ email: 'test@test.com' }); // stwórz potrzebne dane
  await page.goto('/login');
  await loginAs('test@test.com');
});

// Teardown: sprzątanie po teście
afterEach(async () => {
  await db.truncate(['orders']); // usuń dane stworzone w teście
  // lub po prostu uruchamiaj każdy test w izolowanej transakcji
});
```

## Narzędzia do Debugowania

| Narzędzie | Kiedy używać |
|---|---|
| `--headed` mode | Oglądasz test w przeglądarce |
| Screenshots on failure | Zawsze włączone |
| Playwright Trace | Szczegółowe network + actions |
| `page.pause()` | Zatrzymaj test w miejscu, debuguj ręcznie |
| `console.log` | Wypisz stan w krytycznych momentach |
| `test.only()` | Uruchom tylko jeden test |

Debugging testów to umiejętność. Im więcej czasu spędzasz na diagnozowaniu — tym szybciej zaczynasz widzieć wzorce.
