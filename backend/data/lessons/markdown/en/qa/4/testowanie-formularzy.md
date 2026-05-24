# Testowanie Formularzy — Najbardziej Niedoceniany Obszar

Formularz to interfejs między użytkownikiem a bazą danych. Zepsute formularze to utracone dane, frustracja użytkownika i czasem poważne problemy bezpieczeństwa. Większość bugów w aplikacjach webowych pochodzi właśnie stąd.

## Anatomia Testowania Formularzy

### Walidacja po stronie klienta vs serwera

Dobra aplikacja waliduje dane na obu poziomach:
- **Klient** — szybki feedback dla użytkownika (nie czeka na serwer)
- **Serwer** — zabezpieczenie przed obejściem walidacji klienta

Twój test bezpieczeństwa: wyłącz JavaScript lub użyj Postmana żeby wysłać zapytanie bezpośrednio do API. Walidacja serwera musi działać niezależnie od klienta.

### Typy pól i co testować

**Pola tekstowe:**
```
Puste pole gdy wymagane → komunikat błędu
Tylko spacje → błąd (nie traktuj jako wypełnione)
Minimalny limit znaków (np. imię min 2) → testuj 1, 2, 3 znaki
Maksymalny limit (np. 255 znaków) → testuj 254, 255, 256 znaków
Znaki specjalne: <, >, ', ", &, \, / → XSS prevention
Unicode, emoji: ñ, ü, 🎉, 中文 → encoding
```

**Pola email:**
```
Poprawne: user@example.com ✓
Bez @: userexample.com ✗
Bez domeny: user@ ✗
Z spacją: user @example.com ✗
Subdomena: user@mail.example.com ✓ (valid!)
Z plusem: user+tag@example.com ✓ (valid!)
```

**Pola numeryczne:**
```
Wartości graniczne: min, min-1, min+1, max, max-1, max+1
Liczby ujemne gdy niedozwolone
Ułamki gdy oczekiwane integer
Notacja naukowa: 1e5
Wartości specjalne: NaN, Infinity, -0
```

**Pola hasła:**
```
Minimum długości (np. 8 znaków): testuj 7, 8, 9
Czy jest możliwość wklejenia?
Czy autocomplete="current-password" jest ustawione?
Czy hasło jest widoczne w network tab?
Potwierdzenie hasła: niezgodność, kopia-pasta
```

**Pola daty:**
```
Format: DD/MM/YYYY vs MM/DD/YYYY
Daty w przyszłości gdy niedozwolone (np. data urodzenia)
Data 29 lutego (rok przestępny)
Rok 9999 (overflow?)
```

**Upload pliku:**
```
Dozwolone typy (np. tylko .pdf, .jpg)
Próba uploadu .exe, .php, .js
Maksymalny rozmiar: 4.9MB, 5MB, 5.1MB
Plik 0 bajtów
Plik z podwójnym rozszerzeniem: image.jpg.exe
```

## Stany Formularza

Każdy formularz ma kilka stanów — przetestuj wszystkie:

1. **Pusty** (initial state) — co widzi nowy użytkownik?
2. **Częściowo wypełniony** — co się dzieje gdy opuszczasz pole bez wypełnienia?
3. **Nieprawidłowe dane** — komunikaty błędów (treść, pozycja, kolor)
4. **Prawidłowe dane** — czy Submit działa?
5. **Przetwarzanie** — spinner, czy przycisk jest disabled? (zapobiega double-submit)
6. **Sukces** — redirect? komunikat? co z danymi w formularzu?
7. **Błąd serwera** — co gdy API zwróci 500? Użytkownik nie traci danych formularza?

## Podwójne Wysłanie (Double Submit)

Klasyczny bug: użytkownik kliknie Submit dwa razy szybko = dwa zamówienia, dwa e-maile, dwie płatności.

Test:
1. Wypełnij formularz prawidłowo
2. Kliknij Submit 5 razy szybko (lub napisz: `document.querySelector('form').submit(); document.querySelector('form').submit();` w konsoli)
3. Sprawdź w bazie ile rekordów powstało

Poprawna implementacja: przycisk disabled po pierwszym kliknięciu lub idempotency na backendzie.

## Dostępność Formularzy

```html
<!-- Wymagane dla dostępności: -->
<label for="email">Email *</label>
<input 
  id="email"
  type="email"
  aria-required="true"
  aria-describedby="email-error"
/>
<span id="email-error" role="alert">Pole wymagane</span>
```

Testuj: czy użytkownik screen readera wie które pole jest zaznaczone i jaki jest błąd?
