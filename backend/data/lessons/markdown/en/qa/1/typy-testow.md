# Mapa Typów Testów — Co, Kiedy i Dlaczego

QA junior często zna nazwy typów testów z kursu. Senior rozumie kiedy użyć jakiego i dlaczego. Ta różnica decyduje o tym jak planujesz pracę w sprincie.

## Testy Funkcjonalne vs Niefunkcjonalne

### Funkcjonalne — CZY system robi co ma robić
- Czy logowanie działa?
- Czy kalkulator liczy poprawnie?
- Czy email jest wysyłany po rejestracji?

### Niefunkcjonalne — JAK dobrze system to robi
- Czy logowanie działa w 300ms?
- Czy kalkulator działa dla 10 000 równoczesnych użytkowników?
- Czy email jest wysyłany bez ujawniania innych adresatów (security)?

W praktyce: 80% pracy QA to testy funkcjonalne. Niefunkcjonalne są rzadziej robione manualnie, częściej zautomatyzowane lub delegowane do specjalistów.

## Hierarchia Testów w Projekcie

```
Produkcja
    ↑
E2E Tests (Playwright/Cypress) — pełne przepływy
    ↑
Integration Tests — moduły razem
    ↑
Unit Tests — pojedyncze funkcje
```

QA zazwyczaj pracuje na poziomie integration + E2E. Unit testy to domena developerów.

## Typy Testów według Celu

### Smoke Testing
**Co:** Szybki test najważniejszych funkcji po deploymencie.
**Kiedy:** Po każdym deployu, zanim zaczniesz pełne testy.
**Jak długo:** 5–15 minut.
**Pytanie:** "Czy system w ogóle działa?"

Przykład smoke test e-commerce: login, wyświetlenie produktu, dodanie do koszyka, checkout page ładuje się.

### Sanity Testing
**Co:** Weryfikacja konkretnej zmiany/naprawy.
**Kiedy:** Po naprawieniu konkretnego buga lub zmianie.
**Jak długo:** 15–30 minut.
**Pytanie:** "Czy ta konkretna zmiana działa?"

Różnica od smoke: smoke = cały system, sanity = konkretna zmiana.

### Regression Testing
**Co:** Sprawdzenie że nowe zmiany nie zepsuły starych funkcji.
**Kiedy:** Przed każdym releasem.
**Jak długo:** Godziny lub dni — dlatego jest automatyzowana.
**Pytanie:** "Czy nowe zmiany nic nie zepsuły?"

### Exploratory Testing
**Co:** Niestrukturyzowana eksploracja — uczysz się systemu testując.
**Kiedy:** Nowa funkcja, brak specyfikacji, po incydencie.
**Jak długo:** Sesje 60–90 minut.
**Pytanie:** "Co jeszcze może być zepsute czego nie wiem?"

### Acceptance Testing (UAT)
**Co:** Testy z perspektywy użytkownika końcowego.
**Kiedy:** Przed releasem, często z udziałem klienta/biznesu.
**Jak długo:** Zależy od scope.
**Pytanie:** "Czy produkt spełnia oczekiwania biznesowe?"

## Testy według Wiedzy o Systemie

| Typ | Wiedza o kodzie | Kto testuje |
|-----|-----------------|-------------|
| Black Box | Brak | QA, UAT |
| White Box | Pełna | Developerzy |
| Grey Box | Częściowa | Senior QA, QA z dostępem do kodu |

Grey box testing to najsilniejsze podejście dla doświadczonego QA — znasz architekturę bez pisania kodu.

## Praktyczna Mapa Sprintu

```
Sprint Start:
  → Refinement: planuj przypadki testowe

Development:
  → Sanity tests na ukończonych features

Pre-Release:
  → Smoke test po deployu na staging
  → Regression na krytycznych ścieżkach
  → Exploratory na nowych features
  → UAT z product ownerem

Release:
  → Smoke test na produkcji
```
