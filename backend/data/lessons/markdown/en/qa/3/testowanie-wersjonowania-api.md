# Testowanie Wersjonowania API — Kiedy Stary Klient Spotyka Nowe API

API versioning to mechanizm który pozwala rozwijać API bez łamania istniejących klientów. QA który rozumie wersjonowanie potrafi znaleźć breaking changes zanim dotrą na produkcję i zniszczą integracje.

## Dlaczego API Versioning Jest Trudne

API zmienia się. Ale klienci (aplikacje mobilne, integracje partnerów, frontendy) nie aktualizują się automatycznie.

**Scenariusz bez versioning:**
1. API zwraca `{"userName": "Jan"}`
2. Developer zmienia na `{"name": "Jan"}` (ładniejsze pole)
3. Wszystkie aplikacje mobilne które czytają `userName` — crashują

**Scenariusz z versioning:**
1. `/api/v1/users` — nadal zwraca `{"userName": "Jan"}`
2. `/api/v2/users` — zwraca `{"name": "Jan"}`
3. Aplikacje mobilne używają v1 dopóki się nie zaktualizują

## Strategie Wersjonowania

### URL Versioning (najczęstsze)
```
GET /api/v1/products
GET /api/v2/products
```

### Header Versioning
```
GET /api/products
Accept: application/vnd.api+json;version=2
```

### Query Parameter
```
GET /api/products?version=2
```

### Content Negotiation
```
Accept: application/json; version=2.0
```

Jako QA — znaj strategię Twojej firmy i testuj konsekwentnie.

## Co To Jest Breaking Change

Breaking change = zmiana która łamie istniejących klientów.

**Breaking changes:**
- Usunięcie pola z odpowiedzi
- Zmiana nazwy pola (`userName` → `name`)
- Zmiana typu pola (`"age": "25"` → `"age": 25`)
- Zmiana znaczenia pola
- Usunięcie endpointu
- Zmiana wymaganego parametru
- Zmiana kodu statusu

**Non-breaking changes:**
- Dodanie nowego pola do odpowiedzi (klienci ignorują nieznane pola)
- Nowy opcjonalny parametr z domyślną wartością
- Nowy endpoint
- Dodanie nowego kodu statusu dla nowego scenariusza

## Testowanie Backward Compatibility

Sprawdzasz że stara wersja API nadal działa po deploy nowej:

```bash
# Testuj stary klient z nową wersją backend
curl -H "Authorization: Bearer TOKEN" GET /api/v1/orders/123

# Sprawdź że odpowiedź zawiera wszystkie pola których v1 klient oczekuje:
# - id ✓
# - status ✓ 
# - items[] ✓
# - created_at ✓
# - user_id ✓ (nawet jeśli v2 nazywa to customer_id)
```

**Automatyczny test backward compatibility:**
Zapisz schema odpowiedzi v1 jako "golden file". Po każdym deploy — porównaj z aktualną odpowiedzią.

## Testowanie Deprecation Period

API v1 ma być wycofane. Jak testować:

```
Checklist Deprecation:
□ Header deprecation jest zwracany: Sunset: Sat, 01 Jan 2025 00:00:00 GMT
□ Deprecated endpoint nadal działa przez obiecany czas
□ Dokumentacja wskazuje v2 jako zamiennik
□ Klienci dostają warning gdy używają deprecated endpoint
□ Po deadline — v1 zwraca 410 Gone (nie 404 Not Found)
```

## Testowanie Migracji v1 → v2

Klient migruje z v1 na v2. Co testować:

```
Test plan migracji:
1. Wszystkie endpointy v2 mają odpowiedniki v1 (lub dokumentacja mówi co usunięto)
2. Pola które istniały w v1 — czy są w v2? Jeśli nie — udokumentowane?
3. Typy danych są konsekwentne
4. Autoryzacja działa tak samo
5. Limity (pagination, rate limiting) są spójne lub zaktualizowana dokumentacja
```

## Testowanie API Contract

Contract testing to formalizacja testowania backward compatibility.

**Consumer-driven contract (Pact):**
1. Frontend definiuje "kontrakt" — czego oczekuje od API (jakie pola, typy)
2. Backend weryfikuje że spełnia kontrakt
3. Gdy backend zmienia API w sposób łamiący kontrakt — test failuje automatycznie

```json
// Kontrakt (Pact):
{
  "interaction": {
    "request": { "method": "GET", "path": "/api/v2/users/1" },
    "response": {
      "status": 200,
      "body": {
        "id": 1,
        "name": "Jan",
        "email": "jan@test.com"
      }
    }
  }
}
```

Jeśli backend zmieni `name` na `fullName` bez aktualizacji kontraktu — test failuje przed deployem.

## Dokumentowanie Breaking Changes

Changelog API musi jasno oznaczać breaking changes:

```markdown
## v2.1.0 (2024-03-15)

### BREAKING CHANGES
- `GET /api/orders` — pole `user_id` zmienione na `customer_id`
- `POST /api/orders` — pole `qty` usunięte, zastąpione przez `quantity`

### Deprecated
- `GET /api/v1/orders` — będzie aktywne do 2024-06-15, potem HTTP 410

### Nowe Funkcje
- `GET /api/orders/:id/timeline` — historia statusów zamówienia
```

**Twoja rola jako QA:** weryfikuj że changelog jest kompletny i że te breaking changes faktycznie są breaking, nie non-breaking (developer mógł się mylić w klasyfikacji).

## Checklist Testowania API Versioning

```
□ Stara wersja API nadal działa po deploymencie nowej
□ Breaking changes są w nowej wersji (nie w starej)
□ Deprecated endpoints zwracają Sunset header
□ Non-breaking changes nie wymusiły nowej wersji (sprawdź czy nie mógł być non-breaking)
□ Dokumentacja jest zgodna z rzeczywistym zachowaniem
□ Migracja v_old → v_new jest dokumentowana z przykładami
□ Contract tests przechodzą dla wszystkich wersji
□ Rate limiting jest wersjonowane (jeśli różni się)
```
