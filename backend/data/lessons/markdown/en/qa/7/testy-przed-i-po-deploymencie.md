# Testy Przed i Po Deploymencie — Smoke Testing na Produkcji

Deployment to punkt krytyczny. Coś co działało na staging może nie działać na produkcji: inna konfiguracja, inne połączenia do zewnętrznych serwisów, inna ilość danych. QA który ma plan na pre/post-deployment testowanie — chroni użytkowników przed degradacją po każdym release.

## Pre-Deployment Checklist

Przed deploymentem na produkcję, sprawdź:

### Środowisko i Konfiguracja
```
□ Feature flagi są ustawione poprawnie (nie zostały w stanie testowym)
□ Environment variables są skonfigurowane dla production
□ Sekrety są rotowane jeśli wymagane
□ Baza danych: migracje przygotowane i przetestowane
□ Zależności zewnętrzne są dostępne (payment gateway, email service)
□ CDN cache jest gotowy do czyszczenia po deploymencie
```

### Stan Staging
```
□ Smoke tests na staging przeszły (zielone CI)
□ QA zaakceptował ostatni build na staging
□ Brak P1/P2 bugów oznaczonych jako "release blocker"
□ Rollback plan jest przygotowany (jak cofnąć jeśli coś pójdzie źle)
```

### Czas Deploymentu
```
□ Deployment zaplanowany poza godzinami peak traffic (nie w piątek 17:00)
□ Zespół support jest poinformowany o planowanym release
□ Monitoring jest aktywny i ktoś go śledzi
□ Komunikacja do użytkowników (jeśli będzie downtime)
```

## Post-Deployment Smoke Tests

Natychmiast po deploymencie — pierwsze 15 minut są krytyczne.

### Automatyczne (uruchamiane przez CI po deploy)
```typescript
// smoke.spec.ts — max 10-15 testów, max 5 minut

test.describe('@smoke Production', () => {
  test('Homepage loads', async ({ page }) => {
    await page.goto(process.env.PROD_URL);
    await expect(page).toHaveTitle(/MyApp/);
  });
  
  test('Login works', async ({ page }) => {
    // Użyj dedykowanego konta smoke test — nie prawdziwego
    await page.goto('/login');
    await page.fill('[name=email]', process.env.SMOKE_EMAIL);
    await page.fill('[name=password]', process.env.SMOKE_PASSWORD);
    await page.click('[type=submit]');
    await expect(page).toHaveURL('/dashboard');
  });
  
  test('Health check API', async ({ request }) => {
    const response = await request.get('/api/health');
    expect(response.status()).toBe(200);
  });
  
  test('Critical API endpoint responds', async ({ request }) => {
    const response = await request.get('/api/products?limit=1');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.items).toHaveLength(1);
  });
});
```

### Manualne (QA wykonuje przez pierwsze 15 minut)
```
Smoke manual checklist:
□ Strona główna ładuje się (sprawdź footer — czy wersja aplikacji się zmieniła?)
□ Logowanie działa (konto testowe)
□ Core flow: [zależy od produktu — np. dodaj do koszyka, przejdź przez checkout]
□ Brak błędów w console przeglądarki (DevTools)
□ Odpowiedź API dla /api/health: 200 OK
□ Email systemowy działa (wyślij sobie testowy email)
□ Przynajmniej jeden feature z tego release działa zgodnie z oczekiwaniami
```

## Monitoring Po Deploymencie — Pierwsze 30-60 Minut

### Co Obserwować w Monitoringu

```
Krytyczne metryki:
- Error rate (5xx HTTP) — czy wzrósł po deploy? (alert jeśli > 1%)
- Response time — czy nie spowolniło? (alert jeśli p95 > 2× baseline)
- Database connection errors — czy wzrosły?
- Payment failure rate — czy zwiększył się po deploy?

Narzędzia:
- Datadog, New Relic, Grafana — dashboardy po deploymencie
- Sentry — nowe errory po deploymencie
- Logi — szukaj ERROR/CRITICAL po czasie deploymentu
```

### Sygnały że Coś Jest Nie Tak

```
🔴 Error rate skoczył z 0.1% do 5% — rollback
🔴 Nowe typy błędów w Sentry których nie było przed deploymentem
🔴 Support dostaje nagłe zwiększenie zgłoszeń (monitoring ticketów)
🔴 Smoke tests automatyczne failują
🔴 "Homepage loads" — timeout po deploymencie
```

## Rollback Plan

Rollback plan musi być gotowy PRZED deploymentem.

```
Rollback Plan — Release v2.4.1

Trigger: smoke tests failują 2× pod rząd LUB error rate > 2% przez 5 minut

Kroki:
1. [Developer] Revert deployment: kubectl rollout undo deployment/api
   lub: git revert → push → CI rebuild → deploy
   
2. [QA] Smoke test po rollbacku — czy wróciło do normy?

3. [PM] Komunikacja do użytkowników jeśli był widoczny problem

4. [Cały team] Post-mortem w ciągu 24h

Czas rollbacku: < 15 minut
Osoba odpowiedzialna za decyzję: Tech Lead + QA Lead (wystarczy jeden)
```

## Blue-Green i Canary Deploy — Jak Testować

### Blue-Green
Nowa wersja (green) jest deployowana obok starej (blue). Traffic przełączany w całości.

**QA testuje green** przed przełączeniem trafficu:
```
□ Smoke tests na green environment
□ Porównanie odpowiedzi API: blue vs green dla sample requestów
□ Baza danych jest kompatybilna z oboma wersjami
```

### Canary Deploy
5% użytkowników dostaje nową wersję, 95% starą.

**QA monitoruje metryki dla canary grupy:**
```
□ Error rate canary vs kontrola < 0.5% różnicy
□ Conversion rate canary vs kontrola (czy nowy deploy nie psuje sprzedaży?)
□ Response time canary vs kontrola
□ Skargi od "canary userów" w support
```

## Konto Testowe na Produkcji

Stwórz dedykowane konto testowe na produkcji:

```
Email: qa-smoke@your-company.com
Hasło: [silne, w password managerze]
Rola: normalny użytkownik

Uwagi:
- Konto widoczne w bazie — nie usuwać
- Transakcje z tego konta oznaczane jako "test" w raportach
- Nie używaj prawdziwych danych płatności (Stripe test cards działają na prod!)
```

To konto służy wyłącznie do smoke testów po każdym deploymencie.
