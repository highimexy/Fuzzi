# Pierwsze Portfolio QA — Jak Nie Być Kolejnym CV

Rekruter przegląda 80 CV dziennie. 75 z nich wygląda identycznie: "ukończyłem kurs QA", "ISTQB w trakcie", "motywacja do nauki". Twoje portfolio musi mówić: *"umiem, nie tylko chcę się uczyć"*.

## Co to Jest Portfolio QA?

Portfolio QA to zestaw artefaktów które pokazują że potrafisz pracować — nie tylko że skończyłeś kurs.

Artefakty które mają wartość:
- Raporty bugów z prawdziwych aplikacji
- Test plany / przypadki testowe
- Wyniki testów API (kolekcje Postman)
- Skrypty automatyzacji (Playwright/Cypress)
- Raport z testów bezpieczeństwa
- Dokumentacja procesu testowania

## Gdzie Testować Bez Pracy?

Największy błąd juniorów: czekanie na pracę żeby zbudować portfolio.

### 1. Open Source
GitHub ma tysiące projektów które szukają QA. Znajdź aktywne projekty, zainstaluj lokalnie, przetestuj, zgłoś bugi przez Issues.

Dobry raport buga w popularnym projekcie = widoczne portfolio w sieci.

### 2. Aplikacje "do testowania"
- **The-Internet** (Heroku) — klasyczny sandbox
- **OWASP Juice Shop** — aplikacja z celowo umieszczonymi podatnościami
- **DemoBlaze** — sklep e-commerce do ćwiczeń
- **Buggy Cars Rating** — testy responsywności i bugów UI

### 3. Prywatne projekty kolegów
Masz znajomego programistę? Zaoferuj przetestowanie jego bocznego projektu. Nic za to nie bierz — w zamian dostaniesz prawdziwy kontekst i opis projektu do portfolio.

### 4. Aplikacje mobilne na App Store
Pobierz dowolną aplikację z małą liczbą recenzji. Przetestuj systematycznie. Napisz raport. Aplikacja nie musi wiedzieć że ją testujesz.

## Jak Udokumentować Raport Buga do Portfolio?

Każdy bug report powinien mieć:

```markdown
# Bug: [Tytuł]

**Aplikacja:** [Nazwa, wersja, link]
**Środowisko:** Chrome 124 / macOS 14 / WiFi

## Kroki reprodukcji
1. Otwórz [URL]
2. Kliknij [element]
3. Wpisz [wartość]
4. Naciśnij [przycisk]

## Oczekiwane zachowanie
[Co powinno się stać]

## Rzeczywiste zachowanie
[Co faktycznie się dzieje]

## Severity: [Critical/Major/Minor/Trivial]
## Priorytet: [High/Medium/Low]

## Screenshoty/Nagrania
[Załączone]
```

## GitHub jako Portfolio

Stwórz repo na GitHub o nazwie `qa-portfolio`. W nim:

```
qa-portfolio/
  bug-reports/
    aplikacja-x/
      bug-001.md
      bug-002.md
  test-cases/
    login-feature/
      test-plan.md
      cases.md
  api-testing/
    postman-collection.json
    results.md
  automation/
    playwright-tests/
```

README w repozytorium musi mówić czego nauczyło Cię każde z tych ćwiczeń.

## Czego NIE Robić w Portfolio

- **Screenshoty kursów** — "ukończyłem Udemy" to nie portfolio
- **Fikcyjne projekty** — "testowałem hipotetyczny sklep" bez żadnych artefaktów
- **Puste templaty** — przypadki testowe bez danych, raport bez bugów
- **Wszystko po polsku gdy aplikusjesz do zagranicznych firm** — miej wersję EN
