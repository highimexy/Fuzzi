# Quality Gates w CI/CD — Automatyczne Blokowanie Złego Kodu

Quality gate to automatyczna weryfikacja która decyduje czy kod może przejść do następnego etapu: z PR do main, z main do staging, ze staging do produkcji. QA który projektuje quality gates chroni produkcję bez manualnych bottlenecków.

## Czym Jest Quality Gate

```
Kod → [Quality Gate] → Dalej lub STOP

Quality Gate sprawdza:
✓ Testy przechodzą
✓ Coverage nie spadł
✓ Brak nowych błędów bezpieczeństwa
✓ Linting OK
✓ Build się kompiluje

Jeśli cokolwiek failuje → automatyczny STOP, deploy nie idzie dalej
```

Bez quality gates: "deploy i módl się" — każdy deploy to stres.
Z quality gates: kod który przeszedł gates to kod który przynajmniej nie psuje rzeczy w sposób mierzalny.

## Warstwy Quality Gates

Dobry pipeline ma gates na każdym etapie:

### Gate 1: Commit / Pre-commit
Szybkie sprawdzenia przed pushem:
- Linting (ESLint, Pylint) — style i proste błędy
- Formatowanie (Prettier, Black)
- Sprawdzenie sekretów (git-secrets, detect-secrets) — nie wrzucaj API keys!

Czas: < 10 sekund. Za wolno = deweloperzy wyłączają.

### Gate 2: Pull Request
Każdy PR musi przejść:
- Unit tests (wszystkie)
- Integration tests (kluczowe)
- Coverage nie spada poniżej X%
- Code review approval (minimum 1 person)
- Static analysis (SonarQube, CodeClimate)

Czas: < 5 minut. Za wolno = deweloperzy przestają patrzeć na wyniki.

### Gate 3: Merge do Main
Po merge, przed deployem na staging:
- Pełny test suite (unit + integration)
- E2E smoke tests
- Security scan (OWASP ZAP, Snyk)
- Performance baseline (czy nie pogorszyło się)

Czas: 10-15 minut. Dłużej jest OK bo nie jest blokujące dla dewelopera.

### Gate 4: Deployment na Produkcję
- Smoke tests na staging (koniecznie!)
- Manualna akceptacja QA (lub automatyczna przy zielonym CI)
- Canary / progressive rollout

## Konfiguracja w GitHub Actions

```yaml
# .github/workflows/quality-gate.yml
name: Quality Gate

on: [pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Unit Tests
        run: npm test -- --coverage
        
      - name: Check Coverage Threshold
        run: |
          COVERAGE=$(cat coverage/coverage-summary.json | jq '.total.lines.pct')
          if (( $(echo "$COVERAGE < 80" | bc -l) )); then
            echo "Coverage $COVERAGE% is below 80% threshold"
            exit 1
          fi
      
      - name: E2E Smoke Tests
        run: npx playwright test --grep @smoke
        
      - name: Security Scan
        run: npx snyk test --severity-threshold=high
```

## Coverage Thresholds

Skonfiguruj minimalne progi coverage:

```json
// jest.config.js
{
  "coverageThreshold": {
    "global": {
      "lines": 80,
      "functions": 75,
      "branches": 70
    },
    "./src/payments/": {
      "lines": 95    // krytyczny moduł = wyższy próg
    }
  }
}
```

**Pułapka:** coverage threshold to minimum, nie cel. 80% linii pokrytych testami nie oznacza że 80% logiki jest przetestowane — można mieć 100% line coverage i nie testować żadnego edge case.

## Flaky Tests — Wróg Quality Gates

Flakey test w quality gate = gate który jest ignorowany.

Gdy CI failuje losowo:
- Deweloperzy klikają "Re-run" bez patrzenia na przyczynę
- Gate traci wiarygodność
- Prawdziwe bugi są pomijane bo "pewnie to flakey"

**Zasada:** jeśli test jest flakey — napraw go LUB usuń. Flakey test jest gorszy niż jego brak.

Jak śledzić flakey rate:
```
Sprint 24 CI Stats:
- Total runs: 340
- Failed on first run: 28 (8.2%)
- Passed on re-run: 22
→ Flaky rate: 22/340 = 6.5% ← ZA DUŻO (cel: < 2%)
```

## SonarQube — Analiza Statyczna

SonarQube skanuje kod i raportuje:
- Bugs (potencjalne crashe)
- Vulnerabilities (bezpieczeństwo)
- Code Smells (utrzymywalność)
- Duplications (powtórzony kod)

Quality gate w SonarQube:
```
Warunki blokujące merge:
- Nowe bugs: 0
- Nowe vulnerabilities: 0
- Coverage nowych linii: ≥ 80%
- Duplications w nowym kodzie: < 3%
```

## Raportowanie Quality Gate do Teamu

Po każdym sprint, podsumuj stan:

```
Quality Gates — Sprint 24 Summary

PR Gates (pass rate): 94% (6 PR miało issues)
Główne przyczyny faili:
- Coverage below threshold: 3 PR
- Failing E2E tests: 2 PR  
- Security vulnerability: 1 PR (krytyczny!)

E2E Flaky rate: 3.1% (cel: < 2%) — do poprawy
Security scan: 1 high vuln znaleziona i naprawiona przed merge ✓

Rekomendacja: wymagamy coverage > 85% dla modułu payments (obecnie 76%)
```

## Pułapki Quality Gates

- **Zbyt restrykcyjne** — deweloperzy omijają lub wyłączają
- **Zbyt permisywne** — nie chronią niczego
- **Za wolne** — spowalniają cały team
- **Ignorowane fale** — flakey testy → nikt nie patrzy → prawdziwy bug przechodzi

Dobry quality gate: szybki, niezawodny, i blokuje to co naprawdę ważne.
