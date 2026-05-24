# Mocki i Stuby w Testowaniu API — Kiedy Prawdziwy Serwer Nie Wystarczy

Nie zawsze możesz testować z prawdziwym API. Payment gateway pobiera opłaty za każde wywołanie. Zewnętrzny serwis SMS kosztuje. Środowisko testowe jest niestabilne. Tu wchodzą mocki i stuby.

## Podstawowe Pojęcia

### Stub
Zwraca z góry zdefiniowaną odpowiedź. Nie weryfikuje jak był wywołany.

```json
GET /api/weather/warsaw
→ {"temperature": 18, "condition": "sunny"}  // zawsze, bez względu na wejście
```

### Mock
Jak stub, ale WERYFIKUJE że był wywołany poprawnie — z właściwymi parametrami, odpowiednią liczbę razy.

```javascript
// Mock oczekuje wywołania z userId=123
expect(paymentService.charge).toHaveBeenCalledWith({
  userId: 123,
  amount: 99.99,
  currency: "PLN"
})
```

### Różnica w praktyce QA

- **Stub**: "daj mi stabilną odpowiedź żebym mógł przetestować logikę po stronie klienta"
- **Mock**: "sprawdź że aplikacja wysyła dokładnie te dane do zewnętrznego serwisu"

## Kiedy Używać Mocków

### Zewnętrzne API z kosztami
Payment gateways (Stripe, PayU, Przelewy24), SMS gateway, email service.

**Bez mocka:** każdy test kosztuje pieniądze lub limity rate-limiting.
**Z mockiem:** testujesz wszystkie ścieżki za darmo.

### Niestabilne Środowiska
Zewnętrzny serwis ma downtime? Twoje testy nie mogą być od tego zależne.

### Deterministyczne Dane
Potrzebujesz testować zachowanie przy specyficznych odpowiedziach:
- `502 Bad Gateway` — jak aplikacja reaguje na błąd zewnętrznego serwisu?
- Odpowiedź z pustą listą orders
- Odpowiedź z 10,000 itemów

### Scenariusze Trudne do Wywołania w Prawdziwym API
- Timeout po 30 sekundach
- Rate limit exceeded (429)
- Serwer zwraca złe dane (fuzz testing)

## Narzędzia do Mockowania API

### WireMock
Popularne narzędzie do mockowania HTTP. Definiujesz mappings:

```json
{
  "request": {
    "method": "POST",
    "url": "/api/payments"
  },
  "response": {
    "status": 200,
    "body": "{\"transactionId\": \"txn_123\", \"status\": \"success\"}",
    "headers": {
      "Content-Type": "application/json"
    }
  }
}
```

### MockServer
Podobne do WireMock, dobra integracja z Dockerem.

### Postman Mock Server
Szybko do uruchomienia, dobry dla manualnego testowania scenariuszy.

### JSON Server
Lokalny REST API z pliku JSON — dobry do prototypowania i testów frontendu.

## Pułapki Mockowania

### Drift między Mockiem a Rzeczywistością
Mock przestał odzwierciedlać prawdziwe API — a Ty tego nie wiesz.

**Rozwiązanie:** Contract testing (np. Pact) — utrzymuje kontrakt między serwisem a konsumentem.

### Mock który Ukrywa Bug
Aplikacja wysyła złe dane do API, ale mock i tak zwraca sukces.

**Rozwiązanie:** Waliduj requestów w mocku, nie tylko response.

### Zbyt Optymistyczne Mocki
Mock zawsze zwraca idealne dane — nigdy nie testujesz error handling.

**Rozwiązanie:** Pisz testy na happy path, error scenarios (4xx, 5xx), i edge cases (puste listy, wartości graniczne).

## Jak Testować Mock Responses

Każda zewnętrzna integracja powinna mieć przynajmniej te scenariusze:

```
Scenariusze dla każdego zewnętrznego serwisu:
1. Sukces (200) — happy path
2. Błąd po stronie klienta (400, 422) — nieprawidłowe dane
3. Brak autoryzacji (401/403)
4. Zasób nie znaleziony (404)
5. Rate limit (429) — jak aplikacja radzi sobie z retry?
6. Błąd serwera (500/502) — czy aplikacja degraduje gracefully?
7. Timeout — czy użytkownik dostaje sensowny komunikat?
```

## Weryfikacja Żądań w Mocku

Dobry mock nie tylko zwraca odpowiedź — sprawdza że request był poprawny:

```
Testując checkout:
Mock oczekuje że aplikacja wyśle:
POST /api/payments
Headers: Authorization: Bearer {valid_token}
Body: {
  amount: dokładnie tyle ile wynosi koszyk,
  currency: waluta profilu użytkownika,
  orderId: id zamówienia
}
```

Jeśli aplikacja pominie `orderId` — mock powinien to wykryć.

## Kiedy NIE Mockować

- Integracja jest kluczowym ryzkiem biznesowym → testuj z prawdziwym API na staging
- Sprawdzasz autentyczność danych (np. podpisy kryptograficzne)
- Finalny smoke test przed produkcją
- Mock by był identyczny z prawdziwym serwisem — to nie ma sensu
