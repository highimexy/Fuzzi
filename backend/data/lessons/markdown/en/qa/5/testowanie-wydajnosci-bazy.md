# Testowanie Wydajności Bazy Danych — Slow Queries i Indeksy

Aplikacja działa świetnie z 100 rekordami. Na produkcji z milionem rekordów pada na kolana. QA który rozumie wydajność bazy wykrywa te problemy zanim trafią na produkcję.

## EXPLAIN ANALYZE — Twój Najlepszy Przyjaciel

`EXPLAIN ANALYZE` pokazuje jak baza wykonuje zapytanie — który indeks (lub brak indeksu) jest używany.

```sql
EXPLAIN ANALYZE 
SELECT * FROM orders 
WHERE user_id = 'user-123' 
ORDER BY created_at DESC 
LIMIT 10;
```

### Jak czytać wynik?

**Seq Scan** — baza przegląda KAŻDY wiersz w tabeli. Dla tabeli z milionem rekordów = bardzo wolno.
```
Seq Scan on orders  (cost=0.00..15420.00 rows=1000 width=80)
  Filter: (user_id = 'user-123')
  Rows Removed by Filter: 999000
```

**Index Scan** — baza używa indeksu. Szybko.
```
Index Scan using orders_user_id_idx on orders  (cost=0.43..8.45 rows=10 width=80)
  Index Cond: (user_id = 'user-123')
```

Gdy widzisz Seq Scan na dużej tabeli z filtrem — zgłoś to jako potential issue. Brakuje indeksu.

## Jak Testować Wydajność Zapytań?

### 1. Sprawdź czas wykonania

```sql
\timing on  -- włącz timer w psql
SELECT * FROM orders WHERE user_id = 'user-123';
-- Time: 4523.123 ms  ← 4.5 sekundy! Problem!
```

### 2. Symuluj produkcyjny rozmiar danych

Na stagingu z 1000 rekordów wszystko jest szybkie. Pytaj zespół:
- Ile rekordów będzie na produkcji za rok?
- Czy staging ma reprezentatywną ilość danych?

Jeśli staging ma 1% danych produkcji — testy wydajności są bezwartościowe.

### 3. Query log — znajdź slow queries

PostgreSQL może logować wolne zapytania:
```sql
-- W postgresql.conf:
log_min_duration_statement = 500  -- loguj zapytania > 500ms
```

QA powinien mieć dostęp do tych logów lub prosić o raport "top 10 slow queries".

## Typowe Problemy Wydajnościowe

### Problem 1: Brak indeksu na kolumnie filtrowanej

```sql
-- Tabela users ma milion rekordów
-- Zapytanie bez indeksu:
SELECT * FROM users WHERE email = 'john@example.com';
-- Czas: 2.3 sekundy (Seq Scan!)

-- Po dodaniu indeksu:
CREATE INDEX users_email_idx ON users(email);
-- Czas: 0.3 ms (Index Scan!)
```

**Twój test:** Sprawdź czy kolumny używane w WHERE, JOIN ON, ORDER BY mają indeksy.

### Problem 2: SELECT * (zbyt wiele danych)

```sql
-- Złe: pobiera wszystkie kolumny (w tym BLOB, TEXT, JSON)
SELECT * FROM products WHERE category = 'electronics';

-- Dobre: pobierz tylko co potrzebne
SELECT id, name, price FROM products WHERE category = 'electronics';
```

**Twój test:** Monitoruj rozmiar odpowiedzi API. 50MB JSON response to znak problemu.

### Problem 3: N+1 Problem

Aplikacja wykonuje 1 zapytanie żeby pobrać listę, potem N zapytań dla każdego elementu.

```
GET /api/orders → 1 query: SELECT * FROM orders LIMIT 20
  ↳ GET order details for order 1 → 1 query
  ↳ GET order details for order 2 → 1 query
  ...
  ↳ GET order details for order 20 → 1 query

Total: 21 queries dla 20 wyników
```

**Twój test:** Monitoruj logi SQL podczas ładowania strony z listą. Czy liczba zapytań nie jest proporcjonalna do liczby elementów?

### Problem 4: Brak paginacji

```sql
-- Złe: pobiera WSZYSTKIE zamówienia
SELECT * FROM orders WHERE user_id = 'user-123';
-- 50 000 rekordów → czas: 8 sekund, transfer: 200MB

-- Dobre: paginacja
SELECT * FROM orders WHERE user_id = 'user-123' 
ORDER BY created_at DESC LIMIT 20 OFFSET 0;
```

**Twój test:** Co się dzieje gdy użytkownik ma 10 000 zamówień w historii? Czy endpoint ma paginację?

## Jak Raportować Problemy Wydajności?

Dobry raport problemu wydajnościowego zawiera:
```
Zapytanie: [SQL lub endpoint API]
Czas bez indeksu: 4.5s
Czas z indeksem: 3ms
Rozmiar tabeli: 1.2M rekordów
EXPLAIN ANALYZE output: [załączony]
Środowisko: staging z production-sized data
Rekomendacja: dodanie indeksu na kolumnie X
```
