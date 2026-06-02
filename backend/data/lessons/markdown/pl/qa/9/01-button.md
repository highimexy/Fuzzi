# Button — Testowanie Stanów i Interakcji

Button (przycisk) wyzwala akcję — submituje formularz, otwiera modal, usuwa rekord, przesuwa krok w kreatorze. To najbardziej podstawowy element interaktywny i jednocześnie najczęściej psowany przez nieprawidłową semantykę, brakujące stany lub skrócone podejście do dostępności.

## Anatomia i Stany

Każdy button przechodzi przez sześć stanów, które muszą być weryfikowane oddzielnie:

| Stan | Wyzwalacz | Co weryfikować |
|------|-----------|----------------|
| **Default** | Strona załadowana | Kolor, tekst, rozmiar zgodne ze specyfikacją |
| **Hover** | Najechanie myszą | `cursor: pointer`, zmiana koloru lub cienia |
| **Focus** | Klawisz Tab lub programowe skupienie | Widoczny focus ring — nigdy `outline: none` bez zamiennika |
| **Active** | Wciśnięty mysz/dotyk | Wizualne wciśnięcie (scale-down lub ciemniejszy kolor) |
| **Disabled** | Atrybut `disabled` ustawiony | `cursor: not-allowed`, brak reakcji na klik, wizualnie wyciszony |
| **Loading** | Trwająca operacja asynchroniczna | Spinner lub zmiana etykiety, button disabled (brak double-submit) |

### Semantyka — Najczęstsza Pułapka

```html
✅ <button type="submit">Zarejestruj się</button>
✅ <button type="button">Otwórz ustawienia</button>
❌ <div onclick="submit()">Zarejestruj się</div>  <!-- niedostępne klawiaturą -->
❌ <a href="#" onclick="action()">Usuń</a>         <!-- złe znaczenie semantyczne -->
```

Brak atrybutu `type` na `<button>` wewnątrz `<form>` domyślnie daje `type="submit"`, co powoduje niezamierzone submity formularza z przycisków, które miały być nie-submitujące.

## Checklista Testowania

```
□ Kliknięcie wyzwala oczekiwaną akcję
□ Tab przechodzi na button; Enter i Space go aktywują
□ Focus ring jest widoczny przy nawigacji klawiaturą (nie tylko przy kliknięciu)
□ Stan disabled: klik nie działa, cursor: not-allowed, wizualnie różny
□ Kontrast tekstu ≥ 4.5:1 we wszystkich stanach (w tym disabled i loading)
□ Stan loading wyłącza button — double-submit jest niemożliwy
□ Etykieta jest opisowa ("Zapisz zmiany", nie "Kliknij tutaj")
□ Icon-only button ma aria-label lub ukryty tekst
□ Obszar dotykowy ≥ 44×44 px na urządzeniach mobilnych
□ Długa etykieta nie niszczy otaczającego layoutu
```

## Dostępność

**Rola:** Natywny `<button>` niesie automatycznie `role="button"`. `<div role="button">` wymaga ręcznie zaimplementowanej obsługi klawiatury — najlepiej tego unikać.

**Nawigacja klawiaturą:**
- `Tab` — przenosi focus na button
- `Enter` lub `Space` — aktywuje button
- `Shift+Tab` — cofa focus

**Etykiety dla przycisków icon-only:**
```html
<!-- Widoczny tekst — zawsze preferowany -->
<button>Usuń konto</button>

<!-- Tylko ikona — wymagany aria-label -->
<button aria-label="Usuń konto">
  <svg aria-hidden="true">...</svg>
</button>
```

**Zarządzanie focusem po akcji:**
- Otwieranie modala → focus przechodzi do pierwszego interaktywnego elementu w modalu
- Zamykanie modala → focus wraca na button który go otworzył
- Usunięcie elementu listy → focus przechodzi na sąsiedni element lub kontener listy

## Edge Cases

```
Długa etykieta: "Potwierdź i wyślij zamówienie do działu logistyki na Q4"
→ Czy button się rozciąga? Czy tekst przełamuje się czytelnie? Czy sąsiedni layout nie pęka?

Podwójny szybki klik / niecierpliwy użytkownik
→ Czy formularz może być submitowany dwukrotnie? Czy button jest disabled po pierwszym kliknięciu?

Layout RTL (arabski, hebrajski)
→ Czy para ikona-tekst jest właściwie lustrzana?

Ekran dotykowy
→ Obszar dotykowy ≥ 44×44 px? Czy style hover nie zakłócają feedbacku przy tapnięciu?

Button wewnątrz disabled <fieldset>
→ Czy też jest disabled? Czy reaguje na kliknięcia?
```

## Typowe Bugi i Severity

| Bug | Severity |
|-----|----------|
| `<div>` lub `<span>` użyty jako button — niedostępne klawiaturą | Critical |
| `outline: none` przy focusie bez widocznego zamiennika | Major |
| Double-submit możliwy — button nie jest disabled podczas loading | Major |
| Kontrast tekstu poniżej 4.5:1 | Major |
| Icon-only button bez `aria-label` | Major |
| Brak atrybutu `type` — niezamierzony submit formularza | Minor |
| Obszar dotykowy poniżej 44×44 px | Minor |
| Stan loading bez wskaźnika wizualnego | Minor |

## Automatyzacja z Playwright

```typescript
// Interakcja przez accessible role — najbardziej niezawodny selektor
await page.getByRole('button', { name: 'Zapisz zmiany' }).click()

// Weryfikacja aktywacji klawiaturą
await page.keyboard.press('Tab')
await expect(page.getByRole('button', { name: 'Zapisz zmiany' })).toBeFocused()
await page.keyboard.press('Enter')

// Weryfikacja disabled po async submit
await page.getByRole('button', { name: 'Złóż zamówienie' }).click()
await expect(page.getByRole('button', { name: 'Złóż zamówienie' })).toBeDisabled()

// Weryfikacja icon-only button ma dostępną nazwę
const closeBtn = page.getByRole('button', { name: 'Zamknij dialog' })
await expect(closeBtn).toBeVisible()
```
