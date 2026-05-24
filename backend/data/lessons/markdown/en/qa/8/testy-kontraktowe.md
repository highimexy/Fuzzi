# Testy Kontraktowe — Jak Mikroservisy Nie Psują Siebie Nawzajem

W architekturze mikroserwisowej każda zmiana w serwisie A może zepsuć serwis B który z niego korzysta. Testy kontraktowe to mechanizm który wykrywa te problemy zanim trafią na produkcję.

## Problem bez Testów Kontraktowych

Masz dwa serwisy:
- **Order Service** — zarządza zamówieniami
- **Notification Service** — wysyła emaile na podstawie danych z Order Service

Order Service zmienia odpowiedź API:
```json
// Przed zmianą:
{ "order_id": "ORD-123", "user_email": "jan@example.com" }

// Po zmianie (developer zmienił nazwę pola):
{ "order_id": "ORD-123", "customer_email": "jan@example.com" }
```

Notification Service czyta `user_email` → dostaje `undefined` → emaile nie wychodzą.

Testy Order Service przeszły. Testy Notification Service przeszły. Integracja jest zepsuta.

## Consumer-Driven Contract Testing

**Pact** to najpopularniejsze narzędzie do contract testing.

### Jak działa:

**1. Consumer pisze kontrakt:**
```javascript
// notification-service/tests/order-contract.spec.ts
const { Pact } = require('@pact-foundation/pact');

describe('Order Service contract', () => {
  const provider = new Pact({ consumer: 'NotificationService', provider: 'OrderService' });

  it('returns order with user email', async () => {
    await provider.addInteraction({
      state: 'order ORD-123 exists',
      uponReceiving: 'a request for order details',
      withRequest: { method: 'GET', path: '/orders/ORD-123' },
      willRespondWith: {
        status: 200,
        body: {
          order_id: 'ORD-123',
          user_email: like('jan@example.com')  // typ: string, dowolna wartość
        }
      }
    });
    // Test używa mock providera
  });
});
```

**2. Kontrakt jest publikowany do Pact Broker.**

**3. Provider (Order Service) weryfikuje kontrakt:**
```javascript
// order-service/tests/verify-contracts.spec.ts
describe('Pact verification', () => {
  it('verifies contracts with consumers', async () => {
    return new Verifier({
      providerBaseUrl: 'http://localhost:8080',
      pactBrokerUrl: 'https://pact-broker.example.com',
      providerVersion: '2.3.0'
    }).verifyProvider();
  });
});
```

**Wynik:** Gdy Order Service zmienia kontrakt niezgodnie z tym czego oczekuje Notification Service → test failuje **na etapie CI Order Service**, nie na produkcji.

## Pact Flow w CI/CD

```
PR dla Order Service → Run unit tests → Run contract verification
                                              ↓
                          Pact Broker sprawdza czy nowa wersja
                          nie łamie kontraktów z consumers
                                              ↓
                          Fail: "NotificationService oczekuje user_email,
                                 ale twoja zmiana zwraca customer_email"
```

Developer od razu wie co jest problemem i w którym serwisie.

## Pact Broker — Centralne Repozytorium Kontraktów

Pact Broker trzyma wszystkie kontrakty i historię weryfikacji:
- Kto z kogo korzysta (dependency graph)
- Która wersja providera jest kompatybilna z którą wersją consumera
- History zmian kontraktów

Komenda `can-i-deploy` sprawdza czy bezpiecznie releasować:
```bash
pact-broker can-i-deploy \
  --pacticipant OrderService \
  --version 2.3.0 \
  --to-environment production
  
# Wynik: ✅ Yes (all consumer contracts verified)
# Lub: ❌ No (NotificationService contract broken)
```

## Kiedy Contract Testing Ma Sens?

### TAK:
- Masz wiele niezależnych serwisów (mikroservisy)
- Serwisy są rozwijane przez różne teamii
- Integracje są krytyczne (płatności, notyfikacje, synchronizacja danych)

### NIE:
- Monolith (nie ma rozdzielonych kontraktów API)
- Mało integracji (1-2 serwisy)
- Brak kultury "każdy team jest odpowiedzialny za swój serwis"

## Alternatywa dla Małych Projektów: Schema Validation

Jeśli nie masz zasobów na pełne contract testing, użyj walidacji schematu:

```javascript
// Zod (TypeScript) lub Joi (JavaScript)
const OrderSchema = z.object({
  order_id: z.string(),
  user_email: z.string().email(),
  total: z.number()
});

// W teście integracyjnym:
const response = await fetch('/orders/ORD-123');
const data = await response.json();
OrderSchema.parse(data); // Rzuci błąd jeśli schemat niezgodny
```

To nie zastępuje pełnego contract testing, ale łapie niezgodności schematów na etapie testów integracyjnych.
