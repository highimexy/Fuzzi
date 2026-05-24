# Kontrakty i Dokumentacja API

Zanim wyślesz pierwsze zapytanie przez Postman, musisz umieć czytać dokumentację API. Większość bugów w testowaniu API wynika nie z błędnego kodu — ale z nieporozumień co do kontraktu.

## Co to Jest Kontrakt API?

Kontrakt API to umowa między frontendem a backendem (lub między dwoma serwisami) dotycząca:

- Jakie endpointy istnieją
- Jakie parametry przyjmują
- Jakie statusy HTTP zwracają
- Jak wygląda ciało odpowiedzi
- Co się dzieje w przypadku błędu

Gdy kontrakt jest złamany — coś się psuje. Zadaniem QA jest weryfikacja kontraktu, nie tylko "czy działa".

## Anatomia Dokumentacji REST API

### Dobra dokumentacja zawiera:

```
POST /api/v1/orders

Headers:
  Authorization: Bearer {token}
  Content-Type: application/json

Request body:
{
  "product_id": "string (required)",
  "quantity": "integer (required, min: 1, max: 99)",
  "coupon_code": "string (optional)"
}

Response 201 Created:
{
  "order_id": "string",
  "status": "pending",
  "total_price": "number"
}

Response 400 Bad Request:
{
  "error": "INVALID_QUANTITY",
  "message": "Quantity must be between 1 and 99"
}

Response 401 Unauthorized:
{
  "error": "UNAUTHORIZED"
}
```

### Czerwone flagi w dokumentacji:
- Brak opisu błędów (co zwraca 400?)
- "Optional" bez default value
- Niejasne typy ("string or number")
- Brak przykładowych odpowiedzi

## Co Testuje QA w API?

### 1. Happy path
- Poprawne dane → oczekiwana odpowiedź 200/201
- Zwracane pola mają właściwe typy i wartości

### 2. Walidacja wejścia
- Brakujące wymagane pola → 400 z sensownym błędem
- Złe typy (string zamiast integer) → 400
- Wartości spoza zakresu (quantity = 0, quantity = 100) → 400
- Puste stringi dla wymaganych pól → 400

### 3. Autoryzacja
- Brak tokena → 401
- Wygasły token → 401
- Token z niewystarczającymi uprawnieniami → 403
- Token innego użytkownika dla zasobu → 403

### 4. Edge case'y
- Bardzo długie stringi (SQL injection, buffer overflow)
- Znaki specjalne w polach
- Null zamiast wartości
- Zduplikowane wywołanie (idempotency)

## Contract Testing

W nowoczesnych architekturach (mikroservisy) pojawia się **contract testing** — automatyczna weryfikacja że serwisy respektują swoje kontrakty.

Narzędzia: **Pact**, **Spring Cloud Contract**, **OpenAPI Validator**

Jako QA powinieneś wiedzieć że:
- OpenAPI/Swagger to standard dokumentacji który można walidować automatycznie
- Zmiana kontraktu bez konsultacji to jeden z największych źródeł bugów integracyjnych
- Wersjonowanie API (`/v1/`, `/v2/`) rozwiązuje problem wstecznej kompatybilności

## Swagger/OpenAPI w Praktyce

Większość firm generuje dokumentację automatycznie z kodu. Możesz ją otworzyć w Postmanie i automatycznie zaimportować wszystkie endpointy.

```
File → Import → Link → [URL do swagger.json lub openapi.yaml]
```

Daje Ci gotową kolekcję do testowania — bez ręcznego wpisywania URL-i.
