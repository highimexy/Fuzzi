# Testowanie Regresji — Jak Nie Psuć Tego Co Działa

Każda zmiana w kodzie może zepsuć coś co wcześniej działało. Testowanie regresji to systemayczne sprawdzanie że nowe zmiany nie uszkodziły istniejącej funkcjonalności.

## Czym Jest Regresja?

Regresja to sytuacja gdy coś co działało — przestaje działać po zmianie kodu.

Przykład: developer naprawił buga w module płatności. Po mergu przestały działać powiadomienia email. Nikt ich nie testował — bo "to nie było zmieniane".

To jest właśnie regresja. I jest częstsza niż myślisz.

## Dlaczego Regresje Są Trudne

- Zmiany w jednym miejscu mają skutki uboczne w innych
- Codebase rośnie — trudno pamiętać wszystkie zależności
- Deweloperzy znają swój kod, ale nie zawsze skutki dla całego systemu
- W sprintach nie ma czasu na przetestowanie "wszystkiego"

## Jak Budować Suite Regresyjny

### Zasada: Testuj Krytyczne Ścieżki

Nie możesz przetestować wszystkiego ręcznie przy każdym release. Skup się na:

1. **Krytyczne ścieżki biznesowe** — logowanie, płatność, checkout, rejestracja
2. **Miejsca często psujące się** — jeśli coś się psuje 3 razy w roku, jest w suicie
3. **Integracje zewnętrzne** — payment gateway, email provider, SMS
4. **Nowo naprawione bugi** — każdy fixed bug to nowy test case w regresji

### Struktura Suite'u Regresyjnego

```
Regresja Krytyczna (każdy release, ~2-3h):
├── Login / Logout / Reset hasła
├── Rejestracja nowego konta
├── Core CRUD: create/read/update/delete głównych obiektów
├── Płatność (happy path)
└── Powiadomienia (email, push)

Regresja Rozszerzona (major release, ~1 dzień):
├── Wszystkie krytyczne +
├── Uprawnienia i role
├── Edge cases w formularzach
├── Eksport/import danych
└── Integracje z systemami zewnętrznymi
```

### Co WCHODZI do regresji:

- Test case napisany po fixed bug (non-regression test)
- Funkcjonalności które mają zależności od zmienianego obszaru
- Happy path każdej krytycznej funkcji
- Testy na granicach (boundary values) dla kluczowych pól

### Co NIE WCHODZI do regresji:

- Testy kosmetyczne (wygląd pixeli)
- Funkcje bardzo rzadko używane przez klientów
- Testy exploratory (te są poza suitą)

## Analiza Impaktu — Co Testować po Zmianie

Zanim zaczniesz regresję, zapytaj developera:

> "Co zmieniłeś i jakie moduły mogły być dotknięte?"

Prosty schemat analizy impaktu:

```
Zmiana: Nowy endpoint /api/orders
Pytania:
- Co używa orders? Dashboard, invoices, notifications, email templates
- Co wspóldzieli logikę? User permissions, payment module
- Co może się zepsuć? Raporty, filtry, eksport CSV

Testuj: dashboard orders, faktury, powiadomienia, uprawnienia
```

## Regresja w Praktyce — 2-Tygodniowy Sprint

Typowy sprint:

**Dzień 1-9:** Testowanie nowych funkcji + bugów z tego sprintu

**Dzień 10 (przed release):**
- Regresja krytyczna (2-3h)
- Fokus na obszarach zmienionych w sprincie
- Analiza impaktu z developerem

**Czerwone flagi w regresji:**
- Bug który już był naprawiony → wrócił (non-regression failure)
- Funkcja niezwiązana ze sprintem się psuje
- Środowisko testowe się różni od produkcji → sprawdź config

## Dokumentowanie Regresji

Minimum dokumentacji:

```
Regresja Sprint 24 — 2024-03-15
Tester: Anna K.
Czas: 2h 45min
Środowisko: staging.app.com, build 2.4.1

Wykonano: 42/42 przypadki
Passed: 39
Failed: 3

FAILED:
- LOGIN-03: Reset hasła na mobile — email nie przychodzi (new regression!)
- PAYMENT-07: Płatność BLIK — timeout po 30s (known, Jira #4521)
- ORDERS-12: Eksport CSV — brak kolumny 'tax' (new regression!)

Decyzja: BLOCK — 2 nowe regresje wymagają naprawy przed release
```

## Test Regresyjny vs Retesting

| | Retesting | Regression Testing |
|---|---|---|
| Cel | Sprawdź że BUG jest naprawiony | Sprawdź że INNE rzeczy nie są zepsute |
| Kiedy | Po naprawie konkretnego buga | Po każdej zmianie w codebase |
| Zakres | 1 konkretny przypadek | Całe krytyczne obszary |

Oba są potrzebne. Po naprawie buga: retest (czy bug naprawiony?) + regresja (czy naprawa czegoś nie zepsuła?).
