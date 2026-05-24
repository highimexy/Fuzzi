# Sesje Testowe — Strukturyzowane Exploratory Testing

Testowanie eksploracyjne bez struktury to błądzenie. Session-Based Test Management (SBTM) to podejście które daje eksploracji ramy — bez zamieniania jej w sztywny skrypt.

## Czym Jest Sesja Testowa

Sesja testowa to ograniczony czasowo blok eksploracyjnego testowania z jasno zdefiniowaną misją.

```
Sesja testowa:
├── Czas: 45-90 minut (bez przerw)
├── Misja: co testujesz i dlaczego
├── Obszar: konkretna funkcja lub zestaw funkcji
├── Notatki: co odkryłeś w trakcie
└── Raport: podsumowanie po sesji
```

Dlaczego działa: wymusza skupienie. Bez misji — testujesz losowo. Z misją — masz cel i możesz ocenić czy go osiągnąłeś.

## Struktura Sesji

### Przed Sesją (5 minut)
Zdefiniuj misję. Jedno zdanie które opisuje cel:

```
"Przetestować formularz rejestracji ze szczególnym naciskiem na walidację emaila 
i zachowanie przy nieprawidłowych danych wejściowych."

"Zbadać jak aplikacja zachowuje się przy wolnym połączeniu internetowym — 
timeouty, komunikaty błędów, częściowe ładowanie."

"Przetestować uprawnienia — czy użytkownik roli 'viewer' może zmodyfikować 
dane które powinny być tylko do odczytu?"
```

### W Trakcie Sesji
Testuj zgodnie z misją. Notuj na bieżąco:
- Co testowałeś
- Co znalazłeś (bugi, pytania, obserwacje)
- Co Cię zaskoczyło
- Co pominąłeś i dlaczego

Nie przerywaj na pisanie pełnych raportów bugów — zanotuj "bug w X, szczegóły po sesji".

### Po Sesji (10-15 minut)
Wypełnij raport sesji. Zgłoś bugi.

## Format Raportu Sesji

```
SESJA TESTOWA #12
Data: 2024-03-15
Tester: Anna K.
Czas trwania: 75 minut
Charter (misja): Testowanie uploadu plików — typy, rozmiary, błędy

POKRYCIE:
- Upload obrazu JPG/PNG/GIF (✓)
- Upload PDF (✓)  
- Upload pliku > 5MB (✓)
- Upload pliku z nieprawidłowym rozszerzeniem (✓)
- Upload podczas słabego połączenia (✗ - nie zdążyłam)
- Upload jednocześnie przez 2 karty (✗ - wymaga osobnej sesji)

ZNALEZIONE:
- BUG: GIF animowane uploadują się ale wyświetlają jako statyczne [zgłoszone #5521]
- BUG: Brak progress bar podczas uploadu dużego pliku — user nie wie czy coś się dzieje [#5522]
- PYTANIE: Czy .svg powinno być dozwolone? Obecna walidacja je blokuje.
- OBSERWACJA: Upload pliku 4.9MB zajmuje 8 sekund na WiFi — czy to OK?

METRYKI:
- Bugs found: 2
- Questions raised: 1
- Coverage: 4/6 obszarów (2 wymagają nowych sesji)

NASTĘPNA SESJA: Upload w warunkach złego połączenia + upload z 2 kart
```

## Typy Misji — Jak Definiować Cel

### Tour-Based Missions
Inspirowane wycieczkowym podejściem Michaela Boltona:

**Reconnaissance Tour:** "Zbadaj nową funkcję jakbyś widział ją po raz pierwszy — co jest niejasne?"
**Guidebook Tour:** Testuj zgodnie z dokumentacją i sprawdzaj czy zgadza się z rzeczywistością.
**Vandal Tour:** Celowo wprowadzaj złe dane, klikaj nie w kolejności, zachowuj się jak złośliwy użytkownik.
**Supermodel Tour:** Testuj tylko UI i UX — jak wygląda, czy jest spójne, czy jest intuicyjne?
**Back Alley Tour:** Testuj funkcje rzadko używane, stare, zapomniane.

### Risk-Based Missions
"Przetestować area X z naciskiem na ryzyko Y":
- "Moduł płatności — ryzyko utraty danych podczas przerwy połączenia"
- "Formularz rejestracji — ryzyko XSS i SQL injection"
- "Eksport PDF — ryzyko dla dużych zestawów danych (> 10000 rekordów)"

## Planowanie Sesji na Sprint

Na początku sprintu zaplanuj sesje:

```
Sprint 24 — Plan sesji testowych:
Sesja 1: Happy path nowej funkcji (charter: podstawowy flow)
Sesja 2: Edge cases i błędy (charter: co się dzieje gdy coś pójdzie nie tak)
Sesja 3: Integracja z istniejącymi funkcjami (charter: czy nic się nie zepsuło)
Sesja 4: UX i dostępność (charter: czy to jest intuicyjne i dostępne)
Sesja 5: (buffer) Wolna sesja na odkryte obszary
```

5 sesji × 90 minut = 7.5h poświęcone na eksplorację. Przejrzyste dla managera.

## Współdzielenie Sesji — Pair Testing

Dwa testery, jedna sesja:
- **Driver:** testuje i myśli na głos
- **Observer:** notuje, zadaje pytania, sugeruje kierunki

Para odkrywa więcej niż suma dwóch oddzielnych sesji — bo jeden testuje to co drugi by pominął.

Dobre dla: nowej funkcji, obszaru z dużym ryzykiem, treningu juniorów.

## Sesje a Metryki

Po każdym sprincie możesz raportować:
- Liczba sesji wykonanych
- Łączny czas testowania eksploracyjnego
- Bugi znalezione w sesjach
- Obszary z niskim pokryciem (wymagają więcej sesji)

Metryki sesji dają zarządowi wgląd w to jak działa testowanie eksploracyjne — co jest trudne do wyjaśnienia bez struktury.
