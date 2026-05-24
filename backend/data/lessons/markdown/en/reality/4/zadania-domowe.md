# Zadania Domowe w Rekrutacji — Jak Nie Przepaść

Zadanie domowe to Twoja szansa pokazania realnych umiejętności. Większość kandydatów je oblewa — nie dlatego że nie umie testować, ale dlatego że robi podstawowe błędy.

## Co Rekruterzy Oceniają

Nie szukają perfekcji. Szukają:

1. **Myślenia** — czy widzisz edge cases? Czy myślisz o użytkowniku?
2. **Komunikacji** — czy bug report jest jasny? Czy tytuł testu opisuje co testuje?
3. **Podejścia do ryzyka** — czy priorytetyzujesz to co ważne?
4. **Jakości, nie ilości** — 10 dobrych test cases > 50 przypadkowych

## Typowe Zadanie: "Przetestuj tę stronę"

Dostałeś URL i 2 godziny. Jak podejść?

**Pierwsza godzina:**
1. Eksploracja — przejdź przez wszystkie sekcje jako użytkownik
2. Zidentyfikuj główne funkcje (login, koszyk, formularz etc.)
3. Sprawdź na mobilnym (responsywność)
4. Otwórz Network i Console tab

**Druga godzina:**
1. Pisz bug reports dla znalezionych defektów
2. Dodaj test cases dla kluczowych ścieżek
3. Sprawdź edge cases w formularzach
4. Opisz co byś testował gdybyś miał więcej czasu

## Wzorzec Dobrego Bug Report w Zadaniu

```
Tytuł: Formularz rejestracji akceptuje email bez znaku @
Priorytet: Medium | Severity: High

Kroki:
1. Wejdź na /register
2. Wpisz w pole email: "testtest.com" (bez @)
3. Wypełnij pozostałe pola prawidłowo
4. Kliknij "Zarejestruj"

Oczekiwany wynik: Walidacja odrzuca email bez @
Aktualny wynik: Formularz zapisuje nieprawidłowy email

Środowisko: Chrome 124, macOS
Screenshot: [załączony]
```

## Najczęstsze Błędy Kandydatów

- Tylko happy path — brak negatywnych scenariuszy
- Ogólne tytuły: "Testowanie logowania" zamiast "Login z pustym hasłem nie wyświetla komunikatu błędu"
- Brak środowiska w bug reportach
- Brak priorytetyzacji — traktowanie literówki tak samo jak crash

## Dodatkowe Punkty

- Propozycja automatyzacji dla 2-3 przypadków
- Komentarz o testach regresyjnych
- Wymienienie co NIE zostało przetestowane i dlaczego
