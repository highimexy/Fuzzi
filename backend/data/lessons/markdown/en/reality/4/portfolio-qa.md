# Portfolio QA — Jak Udowodnić Że Jesteś Dobry

Portfolio QA to dowód na to co potrafisz — nie lista firm gdzie pracowałeś. W IT, szczególnie przy pierwszej pracy lub zmianie specjalizacji, portfolio mówi więcej niż CV.

## Czym Jest Portfolio QA

Dla developera portfolio = projekty na GitHub.
Dla QA portfolio = dowody testowania: frameworki, test cases, raporty, dokumentacja.

Portfolio może być:
- Publiczne repozytorium GitHub
- Strona internetowa (portfolio site)
- Zbiór dokumentów (Google Drive, Notion)
- Kombinacja powyższych

## Co Wchodzi do Portfolio QA

### 1. Framework Automatyzacji

Własny framework testowy (nawet dla publicznej demo aplikacji):

```
📁 qa-playwright-portfolio/
├── README.md          ← najważniejszy plik
├── playwright.config.ts
├── tests/
│   ├── auth/
│   │   ├── login.spec.ts
│   │   └── registration.spec.ts
│   ├── checkout/
│   │   └── purchase-flow.spec.ts
│   └── api/
│       └── products-api.spec.ts
├── pages/             ← Page Object Model
│   ├── LoginPage.ts
│   └── CheckoutPage.ts
└── fixtures/          ← dane testowe
    └── users.json
```

**Dobre aplikacje demo do testowania:**
- SauceDemo (saucedemo.com) — sklep, login, checkout
- OpenCart (demo.opencart.com) — e-commerce
- Swag Labs, Petstore API — klasyczne

**Co pokaże Twoje portfolio:**
- Playwright / Selenium / Cypress — co znasz
- Page Object Model — wzorce projektowe
- CI/CD integration — GitHub Actions
- API testing — Postman collections lub request w Playwright

### 2. API Testing Collection

Postman collection lub Python/JavaScript testy API:

```
📁 api-testing-portfolio/
├── README.md
├── postman/
│   └── petstore-api.postman_collection.json
├── python/
│   ├── test_users_api.py
│   └── test_orders_api.py
└── results/
    └── test-report.html
```

### 3. Przykłady Raportów Bugów

Kilka dobrze napisanych raportów bugów (możesz je stworzyć dla publicznych aplikacji):

```markdown
## Bug Report: Login form — email field accepts SQL injection

**Environment:** Chrome 124, Windows 11, demo.example.com v2.1
**Severity:** Critical
**Priority:** P1

**Steps to reproduce:**
1. Go to /login
2. Enter `' OR '1'='1` in email field
3. Enter any password
4. Click "Sign in"

**Expected:** Authentication error, invalid credentials
**Actual:** User is logged in without valid credentials

**Additional info:**
- Network tab: POST /api/auth → 200 OK
- Console: No errors
- Video: [attached]
```

### 4. Dokumentacja Techniczna

- Test plan dla jakiejś funkcji
- Checklist do testowania (np. security checklist, accessibility checklist)
- Opis strategii testowania dla projektu

## README — Klucz do Portfolio

Każde repozytorium musi mieć dobry README:

```markdown
# Playwright E2E Framework — SauceDemo

Framework automatyzacji E2E dla aplikacji e-commerce SauceDemo.

## Co Demonstruje
- Page Object Model pattern
- Data-driven testing (multiple users/scenarios)
- API testing z Playwright request
- Reporting (HTML + Allure)
- CI/CD integration (GitHub Actions)

## Tech Stack
- Playwright 1.42
- TypeScript
- GitHub Actions

## Jak Uruchomić
```
npm install
npx playwright install
npx playwright test
```

## Wyniki
[Link do GitHub Actions] — ostatnie uruchomienie CI
```

Rekruter który widzi README wie od razu co znajdzie i co Twoje portfolio demonstruje.

## Portfolio dla Różnych Poziomów

### Junior QA (0-1 rok)
- 1-2 repozytorium z podstawowymi testami
- Prosty Page Object Model
- Kilka przykładów raportów bugów
- Checklist do testowania formularza lub strony

### Mid QA (1-3 lata)
- Framework z CI/CD integration
- API + UI tests
- Przykłady custom reporters, fixtures, helpers
- Dokumentacja decyzji (dlaczego to narzędzie, ten pattern)

### Senior QA (3+ lat)
- Kompletny framework z wieloma wzorcami
- Przykłady strategii testowania dla domeny (fintech, e-commerce)
- Artykuł lub talk o testowaniu
- Contrib do open source narzędzi testowych

## Jak Pokazać Portfolio na Rozmowie

Miej link gotowy w CV i LinkedIn. Na rozmowie:

"Mam publiczne repozytorium na GitHub z frameworkiem Playwright dla aplikacji e-commerce. Mogę Ci pokazać jak jest zorganizowane i co demonstruje."

Przejdź przez:
1. README — co i dlaczego
2. Jeden test — jak jest napisany, dlaczego tak
3. CI/CD — jak wygląda pipeline

Nie przepraszaj za "niedoskonałości" — pokaż co jest i co planujesz dodać.

## Czas na Zbudowanie

Portfolio nie powstaje w tydzień. Plan:

```
Tydzień 1-2: Setup projektu, pierwsze 5 testów
Tydzień 3-4: Page Object Model, fixtures
Tydzień 5-6: CI/CD integration, reporting
Tydzień 7-8: API tests, README
Miesiąc 2: Dodawaj co tydzień 1-2 nowe testy lub dokumenty
```

Portfolio to projekt ciągły, nie jednorazowy sprint.
