# Dokumentacja i Zarządzanie Wiedzą — QA który Nie Jest Wąskim Gardłem

"Zapytaj Anię, ona wie jak testować ten moduł" — to zdanie brzmi jak komplement. W rzeczywistości to sygnał ostrzegawczy. Gdy QA jest jedyną osobą która wie jak coś testować, firma jest zakładnikiem jednej osoby.

## Problem Wiedzy Zamkniętej w Głowie

### Scenariusz 1: Urlop
Jesteś na 2 tygodniowym urlopie. Developer pyta kto może przetestować krytyczną funkcję płatności. Nikt nie wie jak skonfigurować środowisko testowe. Release opóźniony.

### Scenariusz 2: Odejście z firmy
Odchodzisz po 2 latach. Twoja wiedza o procesach testowania, środowiskach, edge case'ach — idzie z Tobą. Firma traci 2 lata know-how.

### Scenariusz 3: Choroba
Zachorujesz na tydzień podczas krytycznego sprintu. Nikt nie może kontynuować testowania bo proces nie jest udokumentowany.

Dokumentacja to nie biurokracja — to zarządzanie ryzykiem.

## Co Dokumentować?

### 1. Test Plan (per feature lub per sprint)
Minimalna zawartość:
- Zakres testowania (co jest w scope, co jest OUT of scope)
- Środowisko testowe (URL, dane, konfiguracja)
- Typy testów i ich cel
- Kryteria wyjścia (exit criteria)
- Znane ograniczenia

### 2. Instrukcja Konfiguracji Środowiska
```markdown
# Jak skonfigurować środowisko testowe

## Wymagania
- VPN dostęp do staging (instrukcja: link)
- Konto testowe: test_qa@example.com / kontaktuj się z dev

## Kroki
1. Otwórz https://staging.example.com
2. Zaloguj się kontem testowym
3. Przejdź do Admin → Test Data → Reset dla świeżych danych
4. Sprawdź że konfiguracja paymentu używa Stripe test mode (widoczne w footer)
```

### 3. Przypadki Testowe dla Regresji
Dokumentowane w Jira, TestRail, lub Notion. Minimum:
- Tytuł (konkretny)
- Precondition
- Kroki (numerowane)
- Oczekiwany wynik
- Priorytet/Severity

### 4. Known Issues i Workaroundy
```markdown
## Known Issues w Środowisku Testowym

| Issue | Status | Workaround |
|-------|--------|------------|
| PDF export crashuje dla raportów > 1000 wierszy | Won't Fix (staging only) | Testuj z < 500 wierszy |
| Email potwierdzenie nie dochodzi na @gmail.com | Bug #4521 (open) | Użyj Mailtrap lub @example.com |
```

## Jak Pisać Dokumentację Która Będzie Czytana?

### Problem z większością dokumentacji QA: jest przestarzała

Dokumentacja która nie jest używana i aktualizowana to nie dokumentacja — to fałszywe poczucie bezpieczeństwa.

**Zasady pisania żywej dokumentacji:**

1. **Krótko > długo** — 10 zdań które są używane > 50 stron które nikt nie czyta

2. **Blisko kodu/ticketu** — dokumentacja w Confluence na osobnej stronie jest ignorowana. Dokumentacja w README.md obok testów jest czytana.

3. **Update jako część Definition of Done** — dodaj do DoD: "dokumentacja zaktualizowana". Jeśli testujesz nową funkcję i nie zaktualizowałeś test cases — nie zamykaj ticketu.

4. **Własność** — każda część dokumentacji ma właściciela. "Wszyscy są odpowiedzialni" = nikt nie jest odpowiedzialny.

## Wiki vs Żywa Dokumentacja

| Typ | Kiedy używać | Wady |
|-----|-------------|------|
| Confluence/Notion Wiki | Strategia, procesy, onboarding | Starzeje się szybko |
| README w repo | Instrukcje techniczne, setup | Wymaga dostępu do repo |
| Jira/TestRail | Przypadki testowe, regresy | Może być chaosu |
| Docstring w kodzie testów | Cel konkretnego testu | Wymaga czytania kodu |

Najlepsze firmy łączą kilka podejść — strategia w Wiki, techniczne szczegóły w repo.

## QA Onboarding — Test Dokumentacji

Dobry test czy dokumentacja działa: czy nowy QA może skonfigurować środowisko testowe i przeprowadzić regresję BEZ pytania kogokolwiek?

Jeśli nie — dokumentacja jest niekompletna. Użyj nowego QA jako pary do aktualizacji dokumentacji: "rób według instrukcji, gdy coś nie działa — pisz co brakuje".
