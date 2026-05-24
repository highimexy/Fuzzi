# Monitoring i Obserwowalność — QA po Deployu

Release to nie koniec pracy QA. Produkcja ma swoje własne bugi — te które pojawiają się tylko przy realnym obciążeniu, z prawdziwymi danymi użytkowników. Monitoring to Twoje oczy na produkcji.

## Trzy Filary Obserwowalności

### 1. Logi (Logs)
Zapis co się dzieje w aplikacji — zdarzenia, błędy, akcje użytkowników.

```
2025-05-23 14:32:01 ERROR OrderService: Payment failed for order ORD-4521
  user_id: u-9981
  amount: 299.99
  error: Stripe API timeout after 30s
  
2025-05-23 14:32:05 WARN AuthService: Failed login attempt
  email: user@example.com
  ip: 192.168.1.1
  attempt: 3/5
```

**Narzędzia:** Kibana, Grafana Loki, Datadog, AWS CloudWatch

**Co QA sprawdza w logach:**
- Czy błędy które widziałem w testach pojawiają się na produkcji?
- Czy nowa funkcja generuje nieoczekiwane błędy?
- Czy rate błędów wzrósł po deployu?

### 2. Metryki (Metrics)
Liczby mierzone w czasie — wydajność, ruch, błędy.

```
request_duration_p99 = 245ms  // 99% requestów < 245ms
error_rate = 0.3%              // 0.3% requestów kończy się błędem
active_users = 1247
orders_per_minute = 34
```

**Narzędzia:** Prometheus + Grafana, Datadog, New Relic

**Co QA obserwuje po deployu:**
- Czy `error_rate` wzrósł po deployu? (baseline: 0.1%, teraz 2%? Problem)
- Czy `request_duration` wzrósł? (regresja wydajności)
- Czy liczba zamówień jest normalna? (anomalia = coś się psuje)

### 3. Tracing (Distributed Traces)
Śledzenie jednego requestu przez wszystkie serwisy w architekturze mikroserwisowej.

```
Request ID: req-abc123
→ API Gateway (12ms)
  → Auth Service (8ms)
    → User Service (5ms)
  → Order Service (156ms)  ← tu jest wolno!
    → Payment Service (142ms)  ← to jest wąskie gardło
    → Inventory Service (7ms)
```

**Narzędzia:** Jaeger, Zipkin, AWS X-Ray, Datadog APM

## QA i Monitoring — Rola po Deployu

### Canary Release Monitoring

Firmy często releasują na 5-10% ruchu zanim puszczą na wszystkich.

```
Deploy v2.1 → 5% użytkowników
  Monitor: error_rate, latency, business metrics
  Jeśli OK po 1h → 25% → 50% → 100%
  Jeśli problem → rollback
```

Twoja rola: monitoruj przez pierwszą godzinę po deployu. To Twój "smoke test na produkcji".

### Alerty — Co Powinno Budzić QA w Nocy?

Dobre alerty:
- Error rate > 1% przez > 5 minut
- P99 latency > 3x normalny poziom
- Zero zamówień przez > 15 minut (może być problem z checkout)
- Critical service down (payment, auth)

Złe alerty (które prowadzą do alarm fatigue):
- Każde pojedyncze 500
- Każda zmiana latency > 10ms
- CPU > 80% na 30 sekund (może być normalny spike)

### Post-Incident Review — Rola QA

Gdy coś wyjdzie na produkcji, firmy robią post-mortem. QA powinien odpowiedzieć na pytanie:

*"Dlaczego nasze testy tego nie złapały?"*

Odpowiedzi mogą być:
- Bug pojawia się tylko przy > 1000 jednoczesnych userów (nie testowaliśmy load)
- Bug pojawia się tylko z danymi produkcyjnymi (staging ma inne dane)
- Bug pojawia się tylko w kombinacji z innym systemem zewnętrznym
- Nie mieliśmy testu dla tego scenariusza (gap w pokryciu)

Każdy production incident to lekcja — nie obwinianie, ale analiza i ulepszenie procesu.

## Narzędzie QA: Feature Flags

Wiele firm używa feature flags żeby kontrolować rollout:

```javascript
if (featureFlags.isEnabled('new-checkout-v2', user)) {
  return <NewCheckout />;
} else {
  return <OldCheckout />;
}
```

Korzyść dla QA:
- Testujesz nową funkcję w produkcji dla konkretnych użytkowników (np. tylko QA team)
- Możesz szybko wyłączyć problematyczną funkcję bez rollback całego deployu
- A/B testing na prawdziwych użytkownikach

Twoje pytanie do developera przed releasem: *"Czy ta funkcja jest za feature flagiem? Czy możemy ją wyłączyć bez deployu jeśli coś pójdzie źle?"*
