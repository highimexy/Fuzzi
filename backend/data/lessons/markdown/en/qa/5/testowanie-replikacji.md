# Testowanie Replikacji i Wysokiej Dostępności Baz Danych

Replikacja to fundament każdego systemu produkcyjnego. Read repliki, primary-replica failover, multi-region — wszystko może się zepsuć w nieoczekiwany sposób.

## Jak Działa Replikacja (Minimum Które QA Musi Wiedzieć)

**Primary (master)**: Przyjmuje zapisy. Jeden per cluster.

**Replica (slave/read replica)**: Kopiuje dane z primary. Przyjmuje tylko odczyty. Może być kilka.

**Replikacja asynchroniczna** (najczęstsza):
- Primary zatwierdza transakcję
- Replica "w końcu" dostaje te dane (replication lag)
- Lag może wynosić od milisekund do sekund

**Replikacja synchroniczna** (rzadka, droższa):
- Primary czeka aż replica potwierdzi zapis
- Brak lagu
- Primary jest wolniejszy (czeka)

## Replication Lag — Klasa Bugów Którą Musisz Znać

Replication lag powoduje **read-after-write inconsistency**.

**Klasyczny scenariusz:**
```
1. User pisze komentarz → zapis do PRIMARY
2. Strona odświeża się → odczyt z REPLICA
3. Replica jeszcze nie ma komentarza (lag = 500ms)
4. User widzi "komentarz zniknął" → ticket do supportu
```

**Jak testować replication lag:**
```sql
-- Na primary:
INSERT INTO posts (title) VALUES ('Test post') RETURNING id;

-- Na replica (natychmiast po):
SELECT * FROM posts WHERE title = 'Test post';
-- Może nie istnieć jeszcze!
```

**Co sprawdzić w aplikacji:**
- Czy po write operacji aplikacja czyta z primary (sticky reads)?
- Czy jest mechanizm "read your own writes" (czytaj z primary przez X sekund po zapisie)?
- Jak aplikacja reaguje gdy replica ma stare dane?

## Failover Testowanie

Failover = przełączenie primary na replica gdy primary pada.

**Scenariusze do przetestowania:**

```
1. Primary pada podczas zapisu
   - Czy transakcja jest rollbackowana?
   - Czy jest retry logic?
   - Czy user dostaje sensowny błąd?

2. Failover w trakcie
   - Ile trwa promotion replica do primary? (zazwyczaj 30-120 sekund)
   - Co widzi user podczas failover?
   - Czy aplikacja automatycznie się reconnectuje?

3. Po failover
   - Czy stary primary (teraz replica) nie przyjmuje zapisów?
   - Czy replication lag jest monitorowany po failover?
   - Czy dane są spójne po failover?
```

**Narzędzia do symulacji failover:**
- AWS RDS: Reboot with failover w konsoli
- Kubernetes: `kubectl delete pod postgres-primary`
- Chaos Monkey / Chaos Mesh: automatyczna losowa eliminacja podów

## Split-Brain — Najgroźniejszy Scenariusz

Split-brain: sieć się rozdziela, dwie repliki myślą że są primary i obie przyjmują zapisy.

```
Sieć A: Primary (US-East) — przyjmuje zapisy
Sieć B: Replica (EU-West) — promuje się, też przyjmuje zapisy
Sieć wraca → dwa "primary" z różnymi danymi → kto ma rację?
```

**Co testować:**
- Czy system ma mechanizm zapobiegający split-brain (quorum, fencing)?
- Co się dzieje z danymi napisanymi w obu "primary"?
- Czy jest konflikt resolution policy?

## Read Replica Routing — Częste Błędy

Wiele aplikacji wysyła odczyty do read repliki dla performance. Typowe błędy:

```
1. Transakcja otwarta → aplikacja wysyła odczyt do repliki → stale data w transakcji
   Fix: wszystkie operacje w transakcji muszą iść do primary

2. Dashboard count → replica ma lag → liczniki się nie zgadzają
   Fix: dashboard czyta z primary dla krytycznych metryk

3. Login check → replica nie ma świeżego hasła → "niepoprawne hasło"
   Fix: auth zawsze z primary
```

**Jak testować routing:**
1. Sprawdź logi aplikacji — która instancja DB jest używana dla każdego query?
2. Wprowadź sztuczny lag na replice → sprawdź które features są dotknięte
3. Wyłącz replicę → sprawdź czy aplikacja fallbackuje na primary

## Connection Pool i Reconnect

```
Scenariusze:
- Primary restartuje po update → połączenia w pool są stale
- Czy aplikacja automatycznie tworzy nowe połączenia?
- Jak długo trwa reconnect? Co widzi user?
- Czy connection pool overflow powoduje błędy czy queuing?
```

## Monitoring Który QA Powinien Sprawdzić

```
Metryki replikacji:
- Replication lag (czas i bajty)
- Primary lag warning threshold: > 5 sekund
- Primary lag critical: > 30 sekund

Metryki dostępności:
- Czy primary jest osiągalny?
- Ile replica jest dostępnych?
- Connection pool utilization (> 80% = ryzyko)
```

## Checklista Testowania Replikacji

```
□ Read-after-write działa (user widzi własne zmiany)
□ Failover testowany manualnie — system wraca < 2 minuty
□ User dostaje sensowny błąd podczas failover (nie 500)
□ Auth zawsze z primary (brak lag na logowaniu)
□ Transakcje nie mieszają primary i replica
□ Replication lag jest monitorowany z alertami
□ Split-brain scenario jest obsłużony przez system
□ Connection pool reconnect po restarcie primary
□ Logi pokazują który host DB jest używany
```
