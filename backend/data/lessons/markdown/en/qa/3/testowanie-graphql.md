# Testowanie GraphQL — Gdy REST nie Wystarczy

Coraz więcej firm przechodzi z REST na GraphQL. Jeśli nie wiesz jak testować GraphQL, jesteś coraz mniej kompletnym QA. Dobra wiadomość: podstawy możesz opanować w kilka godzin.

## GraphQL vs REST — Kluczowe Różnice dla QA

| Aspekt | REST | GraphQL |
|--------|------|---------|
| Endpointy | Wiele (GET /users, POST /orders) | Jeden (/graphql) |
| Metoda HTTP | GET, POST, PUT, DELETE | Zazwyczaj tylko POST |
| Dane w odpowiedzi | Stały format | Klient decyduje co dostaje |
| Versioning | /v1/, /v2/ | Brak (ewolucja schematu) |
| Status HTTP | 200/400/404/500 | Prawie zawsze 200! |

**Uwaga krytyczna:** GraphQL zwraca HTTP 200 nawet przy błędach. Błędy są w ciele odpowiedzi w polu `errors`. To pułapka dla QA który sprawdza tylko status code.

## Anatomia Zapytania GraphQL

### Query (pobieranie danych)
```graphql
query GetUser($id: ID!) {
  user(id: $id) {
    id
    email
    name
    orders {
      id
      total
      status
    }
  }
}
```

Variables:
```json
{
  "id": "user-123"
}
```

### Mutation (zmiana danych)
```graphql
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    status
    total
  }
}
```

## Co Testować w GraphQL?

### 1. Happy path — podstawowe query/mutation
Tak samo jak w REST — sprawdzasz czy operacja działa i zwraca oczekiwane dane.

### 2. Walidacja zmiennych
```graphql
# Zmienna wymagana — co jeśli null?
query GetUser($id: ID!) {
  user(id: null) { ... }
}
# Oczekiwany błąd walidacji w polu "errors"
```

### 3. Sprawdzanie pola "errors"
```javascript
// Zawsze sprawdzaj:
const response = await fetch('/graphql', { ... });
const json = await response.json();

if (json.errors) {
  // To jest błąd! Mimo że HTTP status = 200
  console.error('GraphQL errors:', json.errors);
}
```

### 4. Autoryzacja na poziomie pola
GraphQL pozwala na granularne uprawnienia. Testuj:
- Czy użytkownik bez uprawnień dostaje `null` czy błąd dla chronionych pól?
- Czy błąd ujawnia istnienie chronionego zasobu?

### 5. N+1 Problem
Klasyczny bug wydajnościowy GraphQL. Query które wydaje się proste może generować N zapytań do bazy:

```graphql
# To query może spowodować N+1 problemów:
query {
  orders {           # 1 zapytanie do bazy
    items {          # N zapytań (jedno dla każdego zamówienia)
      product {      # N×M zapytań
        name
      }
    }
  }
}
```

Test: monitoruj logi SQL podczas wykonywania zagnieżdżonych query.

### 6. Introspection (bezpieczeństwo)
GraphQL ma wbudowany mechanizm introspection który pozwala poznać cały schemat:

```graphql
query {
  __schema {
    types {
      name
    }
  }
}
```

Na produkcji introspection powinno być wyłączone — to ujawnia całą architekturę API atakującemu.

**Test:** Czy introspection jest dostępna na produkcji?

## Narzędzia do Testowania GraphQL

- **GraphiQL** / **Apollo Sandbox** — wbudowany playground
- **Postman** — ma wsparcie GraphQL od wersji 7
- **Insomnia** — dobra alternatywa
- **GraphQL Playground** — standalone

## Postman z GraphQL

W Postman:
1. New Request → wybierz metodę POST
2. URL: `https://api.example.com/graphql`
3. Body → GraphQL (Postman ma dedykowany tab)
4. Wpisz query i variables

Postman automatycznie fetchuje schemat jeśli serwer ma introspection włączone.
