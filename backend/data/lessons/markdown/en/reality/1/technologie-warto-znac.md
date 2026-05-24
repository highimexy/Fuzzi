# Technologie Warte Nauki — Mapa Decyzji QA

Rynek IT zasypuje Cię nazwami technologii. Cypress, Playwright, Selenium, Jest, k6, Postman, JMeter, LoadRunner, Appium, Detox, RestAssured, Karate... Każdy kurs mówi "naucz się X". Jak decydować co ma sens dla Twojej kariery?

## Framework do Podejmowania Decyzji

Zanim zaczniesz uczyć się nowej technologii, odpowiedz na 3 pytania:

**1. Czy rynek tego szuka?**
Sprawdź oferty pracy w Twoim regionie i segmencie (startup/korporacja, e-commerce/fintech/healthtech). Licz ile % ofert wymaga danej technologii.

**2. Czy mogę to zastosować jutro?**
Najefektywniejsza nauka to nauka przez użycie. Jeśli nie masz gdzie zastosować, wiedza zniknie w 3 tygodnie.

**3. Jaka jest krzywa uczenia vs wartość?**
Niektóre narzędzia (Postman) można opanować w tydzień. Inne (Selenium + Java + TestNG) wymagają miesięcy dla sensownej biegłości.

## Mapa Technologii QA 2025

### Must-Have (każde CV QA)

**Postman / Insomnia**
- Do czego: testowanie API, collections, environment variables
- Czas do użyteczności: 1-2 tygodnie
- Rynek: wymagany w ~80% ofert QA

**Jira / podobne (Linear, GitHub Issues)**
- Do czego: zarządzanie bugami, tickety, workflow
- Czas do użyteczności: kilka dni
- Rynek: ~95% ofert

**Git (podstawy)**
- Do czego: wersjonowanie, przeglądanie kodu, branch QA
- Czas do użyteczności: tydzień
- Rynek: coraz częściej wymagane, szczególnie dla QA automation

### High Value (wyróżnik na rynku)

**Playwright**
- Do czego: E2E automatyzacja, multi-browser
- Czas do użyteczności: 3-4 tygodnie
- Rynek: najszybciej rosnące zapotrzebowanie w 2024-2025
- Zastępuje: Selenium dla nowych projektów

**SQL (intermediate)**
- Do czego: weryfikacja danych, data quality testing
- Czas do użyteczności: 4-6 tygodni dla użytecznego poziomu
- Rynek: wymagany w ~60% ofert, często "nice to have" który jest faktycznym wymaganiem

**k6 / Artillery**
- Do czego: performance/load testing
- Czas do użyteczności: 2-3 tygodnie
- Rynek: niszowy ale bardzo pożądany (mała podaż = dobra stawka)

### Specjalizacje (wybierz jedną)

**Appium / Detox (mobile)**
- Warto gdy: chcesz specjalizować się w mobile QA
- Rynek: stały popyt, dobrze płatna nisza

**Cypress**
- Warto gdy: firma używa JavaScript i chce automatyzacji
- Uwaga: słabsze cross-browser niż Playwright, ale duża społeczność

**RestAssured / Karate (Java)**
- Warto gdy: pracujesz w środowisku Java/enterprise
- Rynek: korporacje, instytucje finansowe

### Unikaj Na Start

**Selenium + Java + Maven + TestNG**
- Problem: 3-6 miesięcy do użyteczności, Playwright robi to samo szybciej
- Kiedy ma sens: gdy firma już to ma i musisz utrzymywać

**LoadRunner**
- Problem: enterprise, dogi licencja, zamknięty ekosystem
- Kiedy ma sens: duże korporacje które już płacą za licencję

## Priorytety dla Juniorów

Jeśli zaczynasz od zera, kolejność nauki:

```
1. Jira / zarządzanie ticketami (tydzień)
2. Postman / API testing (2 tygodnie)
3. SQL podstawy (miesiąc)
4. Git podstawy (tydzień)
5. Playwright podstawy (miesiąc)
6. Jedna specjalizacja (2-3 miesiące)
```

Nie ucz się wszystkiego naraz. Głębokość > szerokość dla juniorów.

## Certyfikaty — Co Ma Wartość?

### Mają wartość:
- **ISTQB Foundation** — minimalny standard, ułatwia aplikowanie do korporacji
- **AWS/GCP certyfikaty** — jeśli chcesz w stronę cloud/DevOps QA
- **CSTE** (Certified Software Test Engineer) — uznany w USA

### Ograniczona wartość:
- **ISTQB Advanced** — dobre dla seniorów w dużych firmach
- Certyfikaty konkretnych narzędzi (Selenium, Appium) — praktyczne umiejętności ważniejsze

### Unikaj:
- Certyfikaty z kursów Udemy/Coursera — praktycznie nieweryfikowalne
- Certyfikaty firm które nie są powszechnie znane w branży
