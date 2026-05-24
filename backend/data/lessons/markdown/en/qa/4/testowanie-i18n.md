# Testowanie Internacjonalizacji (i18n) — Bugi które Kosztują Rynki

Aplikacja która działa świetnie po angielsku może być całkowicie zepsuta po arabsku. Internacjonalizacja (i18n) i lokalizacja (l10n) to obszar testowania pełen niespodzianek.

## i18n vs l10n — Różnica

**i18n (internationalization)** — przygotowanie kodu do obsługi wielu języków i regionów (daty, liczby, waluta, kierunek tekstu).

**l10n (localization)** — dostosowanie treści do konkretnego rynku (tłumaczenia, kulturowe nuanse).

QA testuje obie — ale technicznie różne aspekty.

## Najczęstsze Bugi i18n

### 1. Hardcoded Strings (Niezlokalizowany Tekst)
```javascript
// Błąd — tekst na stałe w kodzie:
return "Error: Payment failed";

// Poprawnie — z systemu tłumaczeń:
return t('errors.payment_failed');
```

**Jak testować:** Zmień język aplikacji i szukaj tekstu który pozostał po angielsku (lub polsku). Szczególnie: komunikaty błędów, tooltips, placeholdery.

### 2. Formaty Dat — Pułapka Wieloznaczności

```
01/02/2025 — co to znaczy?
  USA: 2 stycznia 2025
  Polska/Europa: 1 lutego 2025
  ISO: niejednoznaczne
```

**Jak testować:**
- Zmień locale przeglądarki na US/UK/PL i sprawdź czy daty zmieniają format
- Sprawdź czy daty w formularzach mają wyraźny format placeholder (DD/MM/YYYY)
- Eksport CSV — czy daty są w lokalnym formacie czy ISO 8601?

### 3. Liczby i Separatory

| Format | Polska | USA | Niemcy |
|--------|--------|-----|--------|
| Tysiące | 1 000 | 1,000 | 1.000 |
| Dziesiętne | 1,50 | 1.50 | 1,50 |

Bug: `parseFloat("1.500")` w Polsce da 1.5 (tysiąc i pół) zamiast 1500.

**Jak testować:** Sprawdź czy kwoty pieniężne i liczby wyświetlają się zgodnie z lokalnym formatem.

### 4. Kierunek Tekstu RTL (Right-to-Left)

Arabski, hebrajski, perski = czytane od prawej do lewej. Cały layout musi być odwrócony.

```css
/* Layout musi reagować na: */
[dir="rtl"] .menu { flex-direction: row-reverse; }
[dir="rtl"] .text-align { text-align: right; }
```

**Jak testować:** W Chrome DevTools → Elements → zmień `dir="rtl"` na `<html>`. Sprawdź czy layout się nie psuje.

### 5. Długość Tłumaczeń

Tekst angielski jest zazwyczaj krótszy niż tłumaczenia na inne języki:

| Angielski | Tłumaczenie |
|-----------|------------|
| "Submit" (6 znaków) | "Wyślij formularz" (17 znaków) |
| "Settings" | "Ustawienia konfiguracji" |

**Jak testować:** Sprawdź przyciski, nagłówki, menu po włączeniu długiego tłumaczenia. Czy tekst się nie urywa? Czy przycisk nie zmienia rozmiaru psując layout?

### 6. Pluralizacja

Różne języki mają różne reguły pluralizacji:

```
PL: 1 produkt, 2 produkty, 5 produktów (3 formy!)
EN: 1 product, 2 products (2 formy)
RU: 4 formy
AR: 6 form
```

```javascript
// Źle:
`Masz ${count} produkt(ów)` // zawsze wygląda źle

// Dobrze:
t('cart.products', { count }) // i18n library obsługuje pluralizację
```

**Jak testować:** Sprawdź komunikaty z liczbami przy wartościach 0, 1, 2, 5, 11, 21, 22.

## Narzędzia do Testowania i18n

```javascript
// Pseudo-lokalizacja — tymczasowe zniekształcenie tekstów
// Pokazuje gdzie są hardcoded strings
// [Ŝüḅṁĩṭ] zamiast [Submit]

// Chrome devtools: language simulation
// Accept-Language header: en, pl, ar, etc.
```

## Checklist i18n Testing

```
□ Wszystkie teksty są przetłumaczone (brak angielskich na obcojęzycznej wersji)
□ Daty i liczby w lokalnym formacie
□ Waluta z właściwym symbolem i formatem
□ Długie tłumaczenia nie psują layoutu
□ Pluralizacja działa dla 0, 1, 2, 5 elementów
□ Formularze akceptują znaki specjalne (ą, ę, ü, é, ñ, 中文)
□ Zapis i odczyt tych znaków z bazy (UTF-8 encoding)
□ RTL layout (jeśli obsługiwany)
□ Strefa czasowa — czy daty/godziny są w lokalnej strefie?
```
