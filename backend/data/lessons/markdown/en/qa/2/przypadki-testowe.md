# Przypadki Testowe i Raporty Błędów

Przypadek testowy (test case) to udokumentowany zestaw kroków, który weryfikuje konkretną funkcjonalność lub scenariusz.

## Anatomia Dobrego Przypadku Testowego

```
ID: TC-LOGIN-001
Tytuł: Logowanie z prawidłowymi danymi
Warunki wstępne: Użytkownik ma konto w systemie
Kroki:
  1. Otwórz stronę /login
  2. Wpisz: user@example.com
  3. Wpisz: prawidłowe hasło
  4. Kliknij "Zaloguj"
Oczekiwany wynik: Przekierowanie na /dashboard
Aktualny wynik: [wypełnia QA]
```

## Regresja vs Smoke vs Sanity

- **Smoke test** — szybka weryfikacja "czy system żyje?" (5–10 min)
- **Sanity test** — sprawdzenie konkretnej funkcji po bugfixie
- **Regression test** — pełny przegląd by upewnić się, że nowy kod nic nie zepsuł

## Co Robi Dobry Bug Report?

Dobry bug report ma wartość tylko wtedy, gdy developer może go **odtworzyć**.

### Złoty standard:
1. **Tytuł** — konkretny ("Przycisk submit nie działa" → "Przycisk Submit na /checkout nie reaguje na klik w Safari 17")
2. **Kroki do reprodukcji** — precyzyjne, numerowane
3. **Oczekiwany wynik** — co POWINNO się stać
4. **Aktualny wynik** — co się DZIEJE
5. **Środowisko** — OS, przeglądarka, wersja
6. **Screenshoty/logi** — dowody

## Priorytet vs Severity

- **Severity (ważność)** — jak bardzo bug psuje system? (Critical → Low)
- **Priority (priorytet)** — jak szybko naprawić? (High → Low)

Crash na stronie głównej: Severity = Critical, Priority = High.
Literówka w stopce: Severity = Low, Priority = Low.
