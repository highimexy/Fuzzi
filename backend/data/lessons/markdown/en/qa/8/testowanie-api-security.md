# Testowanie Bezpieczeństwa API — OWASP API Security Top 10

API security to jeden z najważniejszych obszarów dla QA który testuje backend. Większość naruszeń danych w ostatnich latach wynikała z błędów bezpieczeństwa API — nie aplikacji webowej.

## OWASP API Security Top 10 — Skróty

OWASP wydało listę 10 najczęstszych błędów bezpieczeństwa w API. Jako QA, testuj pod każdy z nich.

## API1: Broken Object Level Authorization (BOLA)

Najczęstszy typ błędu. Użytkownik A może zobaczyć lub zmodyfikować zasoby użytkownika B.

**Test:**
```bash
# Zaloguj jako user A, pobierz swoje zamówienia
curl -H "Authorization: Bearer TOKEN_A" GET /api/orders/1234

# Teraz spróbuj pobrać zamówienie użytkownika B (inny ID)
curl -H "Authorization: Bearer TOKEN_A" GET /api/orders/5678

# Oczekiwane: 403 Forbidden lub 404
# Zły wynik: 200 z danymi użytkownika B!
```

**Scenariusze do sprawdzenia:**
- Zmień ID w URL na ID innego użytkownika
- Zmień ID w body request
- Zmień ID w parametrach query

## API2: Broken Authentication

Złamane mechanizmy uwierzytelniania.

**Testy:**
```bash
# Test 1: Request bez tokenu
curl GET /api/user/profile
# Oczekiwane: 401 Unauthorized

# Test 2: Wygasły token
curl -H "Authorization: Bearer EXPIRED_TOKEN" GET /api/user/profile
# Oczekiwane: 401 Unauthorized (nie 200!)

# Test 3: Zmodyfikowany token JWT (zmień payload bez podpisywania)
# Oczekiwane: 401 (signature verification fail)

# Test 4: Token po wylogowaniu
curl -H "Authorization: Bearer OLD_TOKEN_AFTER_LOGOUT" GET /api/user/profile
# Oczekiwane: 401 (token invalidated on logout)
```

## API3: Broken Object Property Level Authorization

API zwraca więcej pól niż powinna — lub pozwala na zmianę pól które nie powinny być modyfikowalne.

**Test — Mass Assignment:**
```bash
# Próba zmiany roli przez API
PATCH /api/user/profile
{
  "name": "Jan Kowalski",
  "role": "admin"    ← czy można tak zmienić rolę?
}
# Oczekiwane: rola ignorowana lub 400 Bad Request
# Zły wynik: rola zmieniona!
```

**Test — Nadmiar danych w odpowiedzi:**
```bash
GET /api/user/profile
# Sprawdź czy odpowiedź zawiera: hashe haseł, tokeny API, dane innych użytkowników
# Oczekiwane: tylko dane aktualnego użytkownika, bez wrażliwych pól
```

## API4: Unrestricted Resource Consumption

Brak limitów na zasoby — DoS przez normalne użycie API.

**Testy:**
```bash
# Pagination bez limitu
GET /api/orders?limit=999999
# Oczekiwane: maksymalny limit jest wymuszany (np. max 100)

# Głęboka paginacja
GET /api/search?page=100000
# Oczekiwane: błąd lub pusta odpowiedź, nie timeout

# Duże ciało requesta
curl -X POST /api/import -d "$(python3 -c 'print("x"*10000000)')"
# Oczekiwane: 413 Payload Too Large
```

## API5: Broken Function Level Authorization

Użytkownik z niską rolą może wywołać endpoint zarezerwowany dla adminów.

**Test:**
```bash
# Jako zwykły user, wywołaj admin endpoint
curl -H "Authorization: Bearer USER_TOKEN" DELETE /api/admin/users/123
# Oczekiwane: 403 Forbidden

curl -H "Authorization: Bearer USER_TOKEN" GET /api/admin/stats
# Oczekiwane: 403 Forbidden (nie 200!)
```

**Jak znaleźć admin endpointy:** sprawdź Swagger/OpenAPI dokumentację, szukaj ścieżek `/admin`, `/internal`, `/management`, `/debug`.

## API6 & API7: Unrestricted Access / SSRF

```bash
# SSRF Test — serwer nie powinien fetchować wewnętrznych URL
POST /api/fetch-preview
{
  "url": "http://169.254.169.254/latest/meta-data/"  ← AWS metadata service
}
# Oczekiwane: błąd (URL nie dozwolony)
# Zły wynik: metadata AWS instance!
```

## Injection w API

**SQL Injection przez parametry:**
```bash
GET /api/products?category=electronics' OR '1'='1

POST /api/search
{"query": "'; DROP TABLE users; --"}
```

**NoSQL Injection (MongoDB):**
```bash
POST /api/login
{
  "email": {"$gt": ""},
  "password": {"$gt": ""}
}
# Może zalogować bez hasła!
```

## Checklist Testowania API Security

```
□ BOLA: ID w URL/body innego usera → 403?
□ Auth: request bez tokenu → 401?
□ Auth: wygasły token → 401?
□ Auth: token po logout → 401?
□ Mass assignment: zmiana roli przez PATCH → ignorowana?
□ Overfetch: odpowiedź bez wrażliwych pól (hash, token)?
□ Pagination: limit wymuszany?
□ Admin endpoints: niedostępne dla zwykłego usera?
□ Rate limiting: 429 po przekroczeniu limitu?
□ SQLi: specjalne znaki w parametrach → błąd aplikacji czy SQL error?
□ HTTPS: wszystkie endpointy przez HTTPS?
```

## Narzędzia

- **Burp Suite** (Community/Pro) — interceptor, repeater, intruder
- **OWASP ZAP** — darmowy, dobry do skanowania
- **Postman** — collection runner dla auth tests
- **jwt.io** — dekodowanie i modyfikacja JWT tokenów
- **sqlmap** — automatyczne wykrywanie SQL injection (tylko z autoryzacją!)
