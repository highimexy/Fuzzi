# Testowanie Bezpieczeństwa Zależności (SCA)

Twoja aplikacja to nie tylko Twój kod — to też dziesiątki (lub setki) bibliotek zewnętrznych. Każda z nich może mieć znane podatności bezpieczeństwa. Software Composition Analysis (SCA) to testowanie tych zależności.

## Dlaczego Zależności Są Ryzykiem

**Log4Shell (CVE-2021-44228)**: Podatność w bibliotece log4j (Java). Dotknęła setki tysięcy aplikacji. Ocena CVSS: 10/10 (maksimum). Wymagała emergency patching w całym IT świecie w 2021.

**event-stream atak supply chain (2018)**: Popularny npm package przejęty przez złośliwego aktora. Dodano malicious code. Miliony projektów Node.js zainstalowały zainfekowany package.

**Twoja aplikacja może mieć bibliotekę z podobną podatnością — czy wiesz o tym?**

## Narzędzia SCA

### npm audit (JavaScript/TypeScript)
```bash
# Skanowanie projektu
npm audit

# Output:
# found 3 vulnerabilities (1 moderate, 2 high)
# run `npm audit fix` to fix them, or `npm audit fix --force` to fix all (including breaking changes)

# Szczegółowy raport
npm audit --json | jq '.vulnerabilities | to_entries[] | {name: .key, severity: .value.severity, fixAvailable: .value.fixAvailable}'
```

### Snyk (multi-language, komercyjny z free tier)
```bash
npm install -g snyk
snyk auth
snyk test                    # Skanuj projekt
snyk monitor                 # Monitoruj w czasie
snyk test --severity-threshold=high  # Tylko high i critical
```

### OWASP Dependency-Check (Java, .NET, Python, etc.)
```bash
dependency-check --project "MyApp" --scan /path/to/project --format HTML --out reports/
```

### pip-audit (Python)
```bash
pip install pip-audit
pip-audit
# Skanuje requirements.txt i Pipfile.lock
```

### govulncheck (Go)
```bash
go install golang.org/x/vuln/cmd/govulncheck@latest
govulncheck ./...
```

## Rozumienie Severity Score (CVSS)

CVSS (Common Vulnerability Scoring System) to standard oceny podatności od 0 do 10:

```
0.0      - Brak
0.1-3.9  - Low (niska)
4.0-6.9  - Medium (średnia)  
7.0-8.9  - High (wysoka) ← zawsze naprawić
9.0-10.0 - Critical (krytyczna) ← emergency fix
```

**Jak priorytetyzować:**
```
Critical (9-10) → Napraw natychmiast, nie czekaj na sprint
High (7-8.9)    → Napraw w bieżącym lub następnym sprincie
Medium (4-6.9)  → Zaplanuj naprawę, oceń ryzyko
Low (0.1-3.9)   → Zaplanuj, monitoruj
```

**Ale CVSS nie mówi wszystkiego.** Podatność CVSS 9.0 która wymaga fizycznego dostępu do serwera może być mniej groźna niż CVSS 7.0 exploitowalna przez sieć bez autentykacji.

## Ocena Rzeczywistego Ryzyka

```
Pytania do każdej podatności:

1. Czy ten kod jest używany?
   - Podatna funkcja w bibliotece którą wywołujesz = ryzyko
   - Podatna funkcja którą biblioteka ma ale Ty nie używasz = mniejsze ryzyko

2. Czy wymaga specjalnych warunków?
   - "Atakujący musi być zalogowany" = mniejsze ryzyko dla publicznego API
   - "Działa bez autentykacji" = poważne ryzyko

3. Czy masz inne warstwy ochrony?
   - WAF, rate limiting, input validation mogą mitigować podatność

4. Czy jest patch dostępny?
   - Tak → zaktualizuj
   - Nie → oceń workaround lub zastąp bibliotekę
```

## Integracja z CI/CD

SCA w pipeline = automatyczne wykrywanie przy każdym commicie:

```yaml
# GitHub Actions
name: Security Scan
on: [push, pull_request]

jobs:
  sca:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: npm audit
        run: npm audit --audit-level=high
        # Fail build dla high i critical (nie dla low/moderate)
      
      - name: Snyk scan
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
        with:
          args: --severity-threshold=high
```

## Lock Files — Dlaczego Są Krytyczne dla Bezpieczeństwa

```
package.json: "lodash": "^4.17.0"  (instaluje najnowszą 4.x)
package-lock.json: "lodash": "4.17.21"  (dokładna wersja)
```

Bez lock file: każdy `npm install` może zainstalować inną wersję.
Z lock file: każdy install daje identyczne zależności.

**Testuj:**
- Czy lock file istnieje i jest commitowany?
- Czy lock file jest aktualny (nie konflikty z package.json)?
- Czy CI instaluje z lock file (`npm ci` zamiast `npm install`)?

## Transitive Dependencies

Twoja app używa biblioteki A. Biblioteka A używa biblioteki B. B ma podatność. Twoja app jest podatna.

```
your-app
  └── library-A (1.0.0) — Ty zainstalowałeś
        └── library-B (2.3.1) — transitive dependency
              └── CVE-2024-XXXX (High)
```

**Jak naprawić transitive dependency:**
```bash
# npm — wymuś wyższą wersję
npm install library-B@2.4.0

# lub w package.json:
"overrides": {
  "library-B": ">=2.4.0"
}
```

## Checklista SCA Testing

```
□ SCA tool jest skonfigurowane (npm audit / Snyk / govulncheck)
□ Skan uruchamia się automatycznie w CI/CD
□ Build failuje przy Critical/High vulnerabilities
□ Lock files istnieją i są commitowane
□ CI używa lock file (npm ci, pip install -r requirements.txt)
□ Transitive dependencies są monitorowane
□ Jest proces prioritetyzacji i naprawy vulnerabilities
□ Kto jest odpowiedzialny za naprawy? (QA zgłasza, dev naprawia)
□ Regular dependency update schedule (miesięczny Dependabot?)
□ Emergency patch process dla Critical CVE
```
