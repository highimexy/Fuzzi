# Walidacja Formularzy — Testowanie Stanów Błędów i Feedbacku

Walidacja formularza mówi użytkownikowi co poszło nie tak i jak to naprawić. Zepsuta walidacja to jeden z najbardziej szkodliwych bugów UX — albo całkowicie blokuje użytkowników, albo cicho wpuszcza nieprawidłowe dane do bazy. Każda reguła walidacji to jednocześnie test UI i test integralności danych.

## Kiedy Walidacja Powinna Się Uruchamiać

| Moment | Doświadczenie użytkownika | Ryzyko |
|--------|--------------------------|--------|
| **Po submit** | Użytkownik wypełnia cały formularz, potem widzi błędy | Frustrujące przy długich formularzach |
| **On blur** (opuszczenie pola) | Błąd pojawia się gdy użytkownik opuści pole | Dobry domyślny |
| **On change** (w trakcie pisania) | Feedback w czasie rzeczywistym | Może być uciążliwy przy pierwszym znaku |
| **Submit + blur** | Błędy pokazane przy submit, czyszczone po poprawce | Najlepsza praktyka |

Walidacja w czasie rzeczywistym dla siły hasła lub dostępności nazwy użytkownika jest akceptowalna. Dla błędów formatu (email, telefon) — poczekaj do blur.

## Stany Błędów do Testowania

### Błąd pojedynczego pola
```html
<!-- ✅ Poprawnie: label + input + błąd powiązane -->
<label for="email">Adres email</label>
<input
  type="email"
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
>
<span id="email-error" role="alert">
  Podaj prawidłowy adres email (np. imie@przykład.pl)
</span>

<!-- ❌ Błąd widoczny tylko przez kolor obramowania — screen reader to pominie -->
<input type="email" style="border-color: red">
```

### Podsumowanie błędów
Dla formularzy z wieloma polami, podsumowanie błędów na górze linkuje do każdego nieprawidłowego pola:
```html
<div role="alert" aria-live="assertive">
  <h2>Znaleziono 2 błędy</h2>
  <ul>
    <li><a href="#email">Adres email jest wymagany</a></li>
    <li><a href="#phone">Numer telefonu musi mieć 9 cyfr</a></li>
  </ul>
</div>
```

## Checklista Testowania

```
□ Każdy komunikat błędu powiązany z inputem przez aria-describedby
□ Komunikaty błędów zawierają opisowy tekst ("Podaj prawidłowy email", nie "Błąd wejścia")
□ Stan błędu NIE jest przekazywany tylko przez kolor — jest też ikona lub tekst
□ aria-invalid="true" jest ustawione na nieprawidłowym inpucie
□ role="alert" lub aria-live na komunikatach błędów — ogłaszane przez screen readery
□ Pola wymagane oznaczone atrybutem required I widocznym wskaźnikiem (*) w etykiecie
□ Komunikaty błędów pozostają widoczne do czasu poprawki przez użytkownika
□ Błąd znika gdy użytkownik poprawia pole (on blur lub on change)
□ Przycisk submit disabled lub loading podczas trwania walidacji
□ Błędy po stronie serwera (z API) są wyświetlane, nie ciche
□ Kontrast tekstu błędu ≥ 4.5:1 względem tła
□ Ikona błędu ma aria-hidden="true" (dekoracyjna) lub dostępną etykietę (informacyjna)
```

## Testowanie Graniczne i Inputów

```
Pole wymagane — puste i tylko białe znaki:
→ "   " (same spacje) musi nie przejść walidacji — przycinaj przed walidacją

Minimalna i maksymalna długość:
→ Testuj przy min, min-1, min+1, max-1, max, max+1

Format email:
→ Poprawne: user@example.com, user+tag@example.com, user@sub.domena.pl
→ Niepoprawne: bez-małpy, user@, @example.com, user @example.com

Numery telefonu:
→ Z kodem kraju vs bez, ze spacjami/myślnikami, z wiodącymi zerami

Hasło:
→ Granica minimalnej długości, wymagane klasy znaków, spacje dozwolone?

Data:
→ Ograniczenia przeszłość/przyszłość, 29 lutego w roku przestępnym vs zwykłym, rok 9999
```

## Dostępność

**Ogłaszanie błędów dla screen readerów:**
- `role="alert"` — ogłaszany natychmiast gdy element się pojawia
- `aria-live="assertive"` — przerywa bieżące czytanie
- `aria-live="polite"` — czeka na pauzę w czytaniu (używaj dla niekrytycznych wskazówek)

**Stany `aria-invalid`:**
```html
<!-- Bez błędu -->
<input type="email" id="email">

<!-- Walidacja nie powiodła się -->
<input type="email" id="email" aria-invalid="true" aria-describedby="email-error">
```

## Typowe Bugi i Severity

| Bug | Severity |
|-----|----------|
| Komunikat błędu nie powiązany z polem — screen readery go pomijają | Major |
| Błąd przekazywany tylko przez kolor (brak tekstu, brak ikony) | Major |
| `aria-invalid` nie ustawione na nieprawidłowych polach | Major |
| Kontrast tekstu błędu poniżej 4.5:1 | Major |
| Błędy po stronie serwera nie wyświetlane w UI | Major |
| Komunikat błędu znika zanim użytkownik go przeczyta | Minor |
| Pola wymagane bez atrybutu `required` | Minor |
| Komunikat błędu zawiera niejasny tekst ("Nieprawidłowe") | Minor |

## Automatyzacja z Playwright

```typescript
// Wyślij pusty formularz i sprawdź komunikaty błędów
await page.getByRole('button', { name: 'Wyślij' }).click()
await expect(page.getByText('Adres email jest wymagany')).toBeVisible()

// Sprawdź aria-invalid
await expect(page.getByLabel('Adres email')).toHaveAttribute('aria-invalid', 'true')

// Sprawdź powiązanie błędu z polem
const emailInput = page.getByLabel('Adres email')
const describedById = await emailInput.getAttribute('aria-describedby')
const errorEl = page.locator(`#${describedById}`)
await expect(errorEl).toBeVisible()

// Sprawdź czy błąd znika po poprawce
await page.getByLabel('Adres email').fill('user@example.com')
await page.getByLabel('Adres email').blur()
await expect(page.getByLabel('Adres email')).not.toHaveAttribute('aria-invalid', 'true')
```
