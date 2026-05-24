# Performance i Security Testing

Dwa obszary, które często są ignorowane przez juniorów — a które kosztują firmy miliony gdy pójdą źle na produkcji.

## Performance Testing — Podstawy

Performance testing weryfikuje jak system zachowuje się pod obciążeniem.

### Typy:

| Typ | Pytanie | Narzędzie |
|-----|---------|-----------|
| Load test | Czy działa przy normalnym ruchu? | k6, JMeter |
| Stress test | Kiedy się sypie? | k6, Gatling |
| Spike test | Czy przeżyje nagły wzrost? | k6 |
| Soak test | Czy jest stabilny przez wiele godzin? | k6 |

### Metryki które mierzysz:
- **Response time** — P50, P95, P99 (nie średnia!)
- **Throughput** — requests per second
- **Error rate** — % nieudanych requestów
- **CPU/Memory** — zużycie zasobów serwera

> P95 = 95% requestów jest szybszych niż X ms. Średnia kłamie — P95/P99 mówi prawdę o bólu użytkownika.

## Security Testing — OWASP Top 10

OWASP (Open Web Application Security Project) co kilka lat publikuje 10 najczęstszych vulnerabilities.

### QA powinien znać:

**1. Injection (SQL, NoSQL, Command)**
```
' OR '1'='1  → w polu email = bypass login
```
Test: wpisz znaki specjalne w każde pole formularza.

**2. Broken Authentication**
- Słabe hasła (admin/admin)
- Brak rate limitingu przy logowaniu
- JWT bez weryfikacji sygnatury

**3. Broken Access Control (IDOR)**
```
GET /api/users/123  → zmień na /api/users/124
```
Czy widzisz dane innego użytkownika? To krytyczny bug!

**4. XSS (Cross-Site Scripting)**
```html
<script>alert('xss')</script>
```
Wpisz w każde pole tekstowe. Czy alert się pojawia?

## Minimalna Checklista Security QA

- [ ] SQL injection w każdym polu input
- [ ] XSS w polach tekstowych
- [ ] IDOR — zmień ID w URL na inny user
- [ ] Rate limiting — ile prób logowania jest dozwolonych?
- [ ] HTTPS — czy wszystkie requesty są szyfrowane?
- [ ] Sensitive data w logach — czy hasła nie są logowane?
