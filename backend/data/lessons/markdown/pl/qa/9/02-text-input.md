# Text Input i Textarea — Testowanie Pól Wprowadzania Danych

Pola tekstowe i textarea to miejsce, gdzie użytkownicy wpisują swoje dane. Zepsute pole inputa nie tylko frustruje — może tracić dane, wpuszczać nieprawidłowe wartości do bazy lub blokować całe grupy użytkowników. Większość bugów formularzy pochodzi właśnie stąd.

## Anatomia i Typy Inputów

### Podstawowe Typy HTML

| Typ | Zastosowanie | Klawiatura mobilna |
|-----|-------------|-------------------|
| `text` | Ogólny tekst jednoliniowy | Standardowa |
| `email` | Adresy email | Z klawiszem @ |
| `password` | Hasła | Zamaskowana, bez autocorrect |
| `number` | Wartości numeryczne | Klawiatura numeryczna |
| `tel` | Numery telefonów | Numeryczna + symbole |
| `search` | Wyszukiwanie | Klawisz "Szukaj" na mobile |
| `url` | Adresy URL | Z / i .com |
| `textarea` | Tekst wieloliniowy | Standardowa |

Użycie `type="text"` dla pola email traci wbudowaną walidację przeglądarki, właściwą klawiaturę mobilną i wskazówki autocomplete.

### Stany do Testowania

| Stan | Co weryfikować |
|------|----------------|
| **Puste / placeholder** | Tekst placeholder widoczny, właściwy kolor (nie mylony z wartością) |
| **Z focusem** | Widoczny wskaźnik focusu (outline lub zmiana obramowania) |
| **Wypełnione / poprawne** | Wartość czytelna, opcjonalny wskaźnik sukcesu |
| **Błąd** | Komunikat błędu widoczny, powiązany z polem, opisowy |
| **Disabled** | Nie można pisać, wizualnie inny, nie w kolejności Tab |
| **Read-only** | Nie można pisać, ale JEST w kolejności Tab, można kopiować |
| **Loading** | Spinner jeśli asynchroniczna walidacja, pole zazwyczaj disabled |

## Checklista Testowania

```
□ Każde pole ma widoczną etykietę <label> — sam placeholder nie wystarczy
□ Etykieta jest programowo powiązana: for="inputId" lub owijając input
□ Prawidłowy type dla oczekiwanych danych (email, number, tel, itp.)
□ Wskaźnik focusu jest widoczny (outline lub zmiana border — nie tylko kolor)
□ Atrybut autocomplete ustawiony poprawnie (email, current-password, itp.)
□ maxlength wymuszony w UI i przetestowany na granicy (max, max-1, max+1)
□ Pola wymagane mają atrybut required i widoczny wskaźnik (*) w etykiecie
□ Komunikaty błędów powiązane przez aria-describedby z odpowiednim polem
□ Kontrast placeholdera ≥ 4.5:1 względem tła inputa
□ Pole hasła: można odsłonić, autocomplete="current-password" ustawione
□ Textarea: zachowanie resize zdefiniowane (none, vertical, both)
□ Wklejanie działa — nie blokowane przez obsługę onpaste
□ Kopiowanie-wklejanie znaków specjalnych: emoji, litery akcentowane, CJK
```

## Dostępność

**Etykiety — najważniejsza zasada:**
```html
<!-- Metoda 1: jawne powiązanie for/id -->
<label for="email">Adres email</label>
<input type="email" id="email">

<!-- Metoda 2: owijanie inputa -->
<label>
  Adres email
  <input type="email">
</label>

<!-- ❌ Placeholder nie jest etykietą — znika gdy użytkownik pisze -->
<input type="email" placeholder="Adres email">
```

**Komunikaty błędów muszą być powiązane:**
```html
<input type="email" id="email" aria-describedby="email-error">
<span id="email-error" role="alert">Podaj prawidłowy adres email</span>
```

**Disabled vs read-only:**
- `disabled` — poza kolejnością Tab, wartość NIE jest submitowana z formularzem
- `readonly` — w kolejności Tab, wartość JEST submitowana, można kopiować

## Edge Cases

```
Wartości graniczne długości tekstu
→ Testuj przy maxlength, maxlength-1, maxlength+1

Tylko białe znaki w polu wymaganym
→ "   " (same spacje) powinno nie przejść walidacji, nie być traktowane jako wypełnione

Znaki specjalne: <script>, ', ", &, \, /, %20
→ Czy są przyjmowane, escapowane lub odrzucane prawidłowo?

Unicode: emoji 🎉, tekst arabski, chiński 中文, znaki RTL
→ Czy wyświetlają się, submitują i wracają poprawnie?

Bardzo długie pojedyncze słowo (bez spacji)
→ Czy input lub jego kontener się przelewa?

autocomplete="new-password" przy rejestracji vs "current-password" przy logowaniu
→ Czy wskazówki menedżera haseł trafiają na właściwe pole?
```

## Typowe Bugi i Severity

| Bug | Severity |
|-----|----------|
| Brak `<label>` — tylko tekst placeholder | Major |
| Nieprawidłowy atrybut `type` (np. `text` dla email) | Major |
| Usunięty wskaźnik focusu (`outline: none` bez zamiennika) | Major |
| Komunikat błędu nie powiązany z polem przez `aria-describedby` | Major |
| `autocomplete="off"` na haśle — niszczy menedżery haseł | Minor |
| Zablokowane wklejanie do pola hasła lub wrażliwego | Minor |
| Brak `maxlength` — nieograniczony input | Minor |
| Kontrast placeholdera poniżej 4.5:1 | Minor |

## Automatyzacja z Playwright

```typescript
// Wypełnianie przez tekst etykiety — najbardziej niezawodne
await page.getByLabel('Adres email').fill('user@example.com')

// Weryfikacja pojawienia się błędu
await page.getByRole('button', { name: 'Wyślij' }).click()
await expect(page.getByText('Podaj prawidłowy adres email')).toBeVisible()

// Wartość graniczna: jeden znak powyżej maxlength
const input = page.getByLabel('Nazwa użytkownika')
await input.fill('a'.repeat(51))  // maxlength wynosi 50
await expect(input).toHaveValue('a'.repeat(50))  // powinno być obcięte

// Weryfikacja poprawnego type
await expect(page.getByLabel('Adres email')).toHaveAttribute('type', 'email')
await expect(page.getByLabel('Hasło')).toHaveAttribute('type', 'password')
```
