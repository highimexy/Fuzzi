# Testowanie Systemów Kolejkowych i Event-Driven

Nowoczesne systemy nie są monolitami. Kafka, RabbitMQ, SQS — asynchroniczna komunikacja tworzy nową klasę bugów których nie znajdziesz klasycznym testowaniem.

## Dlaczego Event-Driven Jest Trudne do Testowania

W systemach synchronicznych: wywołujesz API, dostajasz odpowiedź, weryfikujesz.

W systemach asynchronicznych:
1. Wysyłasz event
2. Event trafia do kolejki
3. Consumer przetwarza event (kiedy? nie wiesz)
4. Efekt pojawia się w systemie (kiedy? nie wiesz)
5. Jak weryfikujesz że coś się stało?

**Typowe problemy:**
- Event wysłany ale nie skonsumowany (dead letter queue)
- Event przetworzony dwa razy (duplicate processing)
- Event przetworzony w złej kolejności (ordering guarantees)
- Event zgubiony między producentem a konsumentem
- Consumer crash w połowie przetwarzania (partial processing)

## Testowanie Producentów (Publishers)

Producent wysyła eventy. Co testować:

**Schema events:**
```
Event: OrderPlaced
{
  "order_id": "uuid",
  "user_id": "uuid",
  "items": [...],
  "total": 149.99,
  "timestamp": "ISO 8601"
}
```

- Czy event jest wysyłany po każdej akcji która powinna go triggerować?
- Czy schema jest zgodna z kontraktem (contract testing)?
- Czy event zawiera wszystkie pola wymagane przez consumera?
- Co się dzieje jeśli brokera nie ma? Retry? Fail gracefully?
- Czy eventy są idempotentne (ten sam event wysłany dwa razy = ten sam efekt)?

## Testowanie Konsumentów (Subscribers)

Consumer odbiera eventy. Co testować:

**Scenariusze dla każdego consumera:**

```
1. Happy path — poprawny event, consumer przetwarza, efekt pojawia się
2. Malformed event — brakujące pole, zły typ → czy idzie do DLQ?
3. Duplicate event — ten sam event_id dwa razy → idempotent handling?
4. Old event — event sprzed 2 dni → czy consumer go przetwarza?
5. Poison pill — event który crashuje consumera → co się dzieje?
6. Consumer restart — consumer pada w połowie → co z transakcją?
```

## Dead Letter Queue (DLQ) — Testowanie Krytyczne

DLQ to "więzienie" dla eventów które nie mogły być przetworzone. Często zapominana w testowaniu.

**Co testować w DLQ:**
- Czy malformed eventy trafiają do DLQ (a nie są cichce gubione)?
- Czy jest alert/monitoring gdy DLQ rośnie?
- Czy można ręcznie ponownie przetworzyć event z DLQ (replay)?
- Czy replay jest bezpieczny (idempotent)?

**Jak testować:**
1. Wyślij celowo nieprawidłowy event (np. brak wymaganego pola)
2. Sprawdź czy trafił do DLQ w określonym czasie
3. Sprawdź czy main queue nie jest zablokowany przez failed events

## Testowanie Kolejności Eventów

Większość brokerów nie gwarantuje kolejności. Sprawdź co robi Twój system gdy:

```
Scenario: UserDeleted event przychodzi przed UserCreated

Normalnie: 
1. UserCreated → tworzy profil w bazie
2. UserUpdated → aktualizuje profil
3. UserDeleted → usuwa profil

Problem:
1. UserCreated (czas: T1)
2. UserDeleted (czas: T2, ale dotarło pierwsze przez sieć)
3. UserUpdated (czas: T1.5, dotarło po UserDeleted)

Co się dzieje z UserUpdated który próbuje zaktualizować użytkownika który już nie istnieje?
```

## Testowanie Wydajności Kolejek

- **Throughput**: ile eventów na sekundę może obsłużyć consumer?
- **Consumer lag**: jak daleko consumer jest za producentem?
- **Backpressure**: co się dzieje gdy kolejka jest pełna?

**Symptomy problemów:**
- Consumer lag rośnie (consumer jest wolniejszy niż producer)
- Eventy są opóźnione o godziny w peak traffic
- Timeouts po stronie producenta bo broker przepełniony

## Praktyczne Podejście do Testowania

### Lokalne Środowisko

```bash
# Lokalny Kafka z Docker Compose
services:
  kafka:
    image: confluentinc/cp-kafka:latest
    ports:
      - "9092:9092"
  
  zookeeper:
    image: confluentinc/cp-zookeeper:latest
```

### Narzędzia do Inspekcji

```bash
# Kafka — sprawdzenie topiców
kafka-topics.sh --list --bootstrap-server localhost:9092

# RabbitMQ — UI dostępne na :15672

# Manualne wysłanie eventu testowego
kafka-console-producer.sh --topic orders --bootstrap-server localhost:9092
> {"order_id": "test-123", "user_id": "user-456", "total": 99.99}
```

### Contract Testing z Pact

Contract testing weryfikuje że producent i consumer zgadzają się co do schema eventu:

1. Consumer definiuje "co oczekuję od eventu"
2. Producent weryfikuje że wysyła dane zgodne z oczekiwaniami consumera
3. Zmiany w schema są wychwytywane zanim trafią na produkcję

## Checklista dla Event-Driven Testing

```
□ Producent wysyła event po każdym triggerującym akcji
□ Event schema zgodna z kontraktem (pola, typy, format)
□ Malformed eventy trafiają do DLQ
□ Consumer jest idempotentny (duplikat = brak efektu ubocznego)
□ Consumer obsługuje restart w połowie przetwarzania
□ DLQ jest monitorowany i ma alert
□ Replay z DLQ działa poprawnie
□ Consumer lag jest monitorowany
□ Przetestowano scenariusz pełnej kolejki
```
