# Przygotowanie do Rozmowy Technicznej QA — Jak Nie Oblewać

Rozmowa techniczna dla QA to nie coding interview jak dla developerów. Sprawdza Twoje myślenie, znajomość procesu i umiejętność rozwiązywania problemów testowych. Przy dobrym przygotowaniu — jest przewidywalna.

## Struktura Typowej Rozmowy QA

1. **Intro** (10-15 min) — opowiedz o sobie, doświadczeniu
2. **Pytania techniczne** (30-40 min) — wiedza z testowania
3. **Zadanie praktyczne** (20-30 min) — test case design, analiza buga
4. **Pytania o kulturę** (10-15 min) — jak pracujesz w teamie
5. **Twoje pytania** (10 min) — oceniasz firmę

## Najczęstsze Pytania Techniczne

### Testowanie i Proces

**"Jak podchodzisz do testowania nowej funkcji?"**
Oczekiwana odpowiedź: requirement review → pytania o edge cases → test case design → przygotowanie danych testowych → testowanie (happy path, edge cases, negative cases) → raportowanie.

**"Różnica między błędem Severity i Priority?"**
- Severity = techniczny wpływ (Critical/High/Medium/Low)
- Priority = kolejność naprawy (biznesowy kontekst)
Bug może być Low severity ale High priority (CEO nie może zobaczyć strony błędu).

**"Czym jest regresja i kiedy ją robisz?"**
Testowanie że nowe zmiany nie zepsuły istniejącej funkcjonalności. Robisz: po każdej zmianie w obszarze, przed release'em.

**"Co to jest test case i co powinien zawierać?"**
ID, tytuł, preconditions, kroki, oczekiwane, aktualne, środowisko, status.

**"Jakie znasz techniki projektowania test cases?"**
Equivalence partitioning, Boundary Value Analysis, Decision Table, State Transition, Error Guessing.

### Pytania o Automatyzację

**"Kiedy NIE automatyzować?"**
Gdy: test jest jednorazowy, wymagania się często zmieniają, ROI jest niskie (rzadkie wykonanie), wymaga ludzkiej oceny estetycznej.

**"Czym jest Page Object Model?"**
Wzorzec projektowy dla testów UI. Separuje locatory od logiki testu. Zmiana UI = zmiana w jednym miejscu POM, nie w 50 testach.

**"Co to jest flakey test?"**
Test który failuje nieregularnie bez zmian w kodzie. Przyczyny: race conditions, zależność od środowiska, zbyt krótkie timeouty.

### Pytania o API

**"Czym różni się GET od POST?"**
GET = pobieranie danych, idempotentny, parametry w URL. POST = tworzenie zasobów, nie-idempotentny, dane w body.

**"Co sprawdzasz testując API?"**
Status code, response body (struktura i wartości), headers, czas odpowiedzi, obsługę błędów (400, 401, 404, 500), rate limiting.

**"Co to jest REST API?"**
Architectural style: zasoby dostępne przez URL, operacje przez HTTP methods, stateless, JSON/XML.

## Zadania Praktyczne — Czego Się Spodziewać

### Test Case Design
"Napisz test cases dla formularza logowania."

Struktura odpowiedzi:
```
Happy path:
- Poprawny email + hasło → login
- Wielkie/małe litery w emailu → normalizacja

Negative:
- Błędne hasło → komunikat błędu (nie "invalid credentials" w szczegółach)
- Email który nie istnieje → ten sam komunikat (nie zdradziaj czy email istnieje)
- Puste pola → komunikat "wymagane"

Security:
- SQL injection w polach → brak błędu SQL
- Brute force → rate limiting po X próbach
- Hasło z 256+ znaki → brak crash

Edge:
- Email z + w nazwie (jan+test@gmail.com) → poprawny
- Hasło ze znakami specjalnymi → poprawne
```

### Analiza Buga
"Widzisz zgłoszenie: 'Login nie działa'. Co robisz?"

Oczekiwana odpowiedź:
1. Zreprodukuj — na jakiej przeglądarce, systemie?
2. Sprawdź kroki — co konkretnie nie działa?
3. Zizoluj — co się dzieje? 500? Strona się nie ładuje? Zły komunikat?
4. Zbierz logi — konsola, network tab
5. Zgłoś z pełnymi informacjami

## Co Pytają o Kulturę Pracy

**"Jak reagujesz gdy developer odrzuca Twój bug?"**
Dobra odpowiedź: sprawdzam czy mam rację, dostarczam więcej dowodów (logi, video), jeśli nadal brak zgody — eskaluję do tech lead z faktami, nie emocjami.

**"Co robisz gdy brakuje czasu na pełne testowanie?"**
Risk-based testing: priorytetyzuję krytyczne flows, komunikuję co nie będzie przetestowane, dokumentuję decyzję.

**"Jak reagujesz na presję release'u?"**
Oceniam ryzyko, komunikuję jasno co jest otwarte i jaki jest impact, daję decyzję do PM-a z pełną informacją.

## Twoje Pytania do Firmy

Nie idź bez przygotowanych pytań. Dobrze oceniane:
- "Jak wygląda Wasz proces od ticket do release? Ile czasu QA ma na testowanie?"
- "Jakie narzędzia używacie do testowania? Co chcielibyście zmienić?"
- "Co jest największym wyzwaniem dla QA w tej chwili?"
- "Jak mierzycie efektywność QA?"

Pytania o wynagrodzenie i urlop są OK — ale zapytaj też o pracę, nie tylko o warunki.

## Dzień Przed Rozmową

- Przejrzyj CV — bądź gotowy opowiedzieć o każdym projekcie
- Przygotuj 2-3 przykłady trudnych bugów które znalazłeś
- Przygotuj przykład konfliktu z developerem i jak go rozwiązałeś
- Sprawdź stronę firmy i produkt — pokaż że wiesz z czego korzystasz
- Przygotuj pytania do firmy
