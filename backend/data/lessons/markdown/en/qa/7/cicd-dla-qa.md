# CI/CD i Środowiska — QA w Potoku Wytwarzania

CI/CD (Continuous Integration / Continuous Delivery) to praktyki automatycznego budowania, testowania i wdrażania kodu. QA jest kluczowym elementem tego potoku.

## Czym Jest CI/CD?

**Continuous Integration (CI):**
- Developer pushuje kod → automatyczne testy uruchamiają się
- Jeśli testy przechodzą: merge do głównej gałęzi
- Jeśli nie: blokada merge'u

**Continuous Delivery (CD):**
- Automatyczne wdrożenie na staging po udanym CI
- Opcjonalne: automatyczne wdrożenie na produkcję

## Typowe Środowiska

```
Local → Development → Staging → Production
```

- **Local** — laptop developera, niestabilne
- **Development/Dev** — integracja zmian, częste deploye
- **Staging** — kopia produkcji, tutaj QA testuje
- **Production** — live, prawdziwi użytkownicy

> QA zawsze testuje na staging przed dopuszczeniem do produkcji. "Działa na moim lokalnym" nie wystarczy.

## GitHub Actions — Przykład Pipeline'u

```yaml
name: Run Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - run: npm install
      - run: npm test
      - run: npx playwright test
```

## Rola QA w CI/CD

1. **Definiuje** kryteria jakości dla bramy wdrożenia (quality gates)
2. **Utrzymuje** testy automatyczne w pipeline
3. **Monitoruje** wyniki CI — flaky tests to technical debt
4. **Blokuje** deploye gdy krytyczne testy fail
5. **Weryfikuje** na staging przed releasem do produkcji

## Flaky Tests — Cichy Wróg

Flaky test to test który czasem przechodzi, czasem nie — bez zmian w kodzie. To tech debt który podważa zaufanie do całego pipeline'u.

Jeśli test jest flaky: napraw go lub usuń. Nie ignoruj.
