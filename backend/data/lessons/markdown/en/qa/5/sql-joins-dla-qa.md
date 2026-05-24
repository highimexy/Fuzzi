# SQL JOINy dla QA — Weryfikacja Relacji w Bazie

Wiesz jak napisać `SELECT * FROM users`. Ale rzeczywiste bugi baz danych pojawiają się w relacjach między tabelami. JOINy to narzędzie które odkrywa problemy niewidoczne w UI.

## Dlaczego QA Potrzebuje JOINów?

Scenariusz: UI pokazuje że zamówienie zostało opłacone. Ale czy w bazie faktycznie istnieje rekord płatności? Czy status jest właściwy? Czy dane w tabelach są spójne?

Bez JOINów sprawdzasz tabelę po tabeli. Z JOINami sprawdzasz relacje jednym zapytaniem.

## Typy JOINów — Wizualizacja

```
Tabela A        Tabela B
[1, 2, 3]      [2, 3, 4]

INNER JOIN: [2, 3]        — tylko wspólne
LEFT JOIN:  [1, 2, 3]     — wszystkie z A + dopasowane z B
RIGHT JOIN: [2, 3, 4]     — wszystkie z B + dopasowane z A
FULL JOIN:  [1, 2, 3, 4]  — wszystkie z obu
```

## Praktyczne Przykłady dla QA

### Scenariusz: Znajdź użytkowników BEZ zamówień

Przydatne do sprawdzenia czy rejestracja działa poprawnie — czy każdy użytkownik może złożyć zamówienie.

```sql
SELECT u.id, u.email, u.created_at
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL
ORDER BY u.created_at DESC
LIMIT 20;
```

`WHERE o.id IS NULL` — magic. Gdy LEFT JOIN nie znajdzie pasującego rekordu w orders, kolumny z orders są NULL. To właśnie szukamy — użytkownicy bez żadnego zamówienia.

### Scenariusz: Zamówienia z brakującą płatnością

```sql
SELECT o.id, o.status, o.total, o.created_at, p.id as payment_id
FROM orders o
LEFT JOIN payments p ON o.id = p.order_id
WHERE o.status = 'paid' 
  AND p.id IS NULL;
```

Jeśli to zapytanie zwraca wyniki — mamy bug: zamówienie oznaczone jako opłacone bez rekordu płatności.

### Scenariusz: Produkty w zamówieniach które zostały usunięte

```sql
SELECT oi.order_id, oi.product_id, oi.quantity
FROM order_items oi
LEFT JOIN products p ON oi.product_id = p.id
WHERE p.id IS NULL;
```

Pokazuje pozycje zamówień które odwołują się do produktów już usuniętych z bazy. Może powodować błędy przy wyświetlaniu historii zamówień.

### Scenariusz: Aktywne sesje po usunięciu konta

```sql
SELECT s.user_id, s.token, s.expires_at
FROM sessions s
LEFT JOIN users u ON s.user_id = u.id
WHERE u.id IS NULL
  AND s.expires_at > NOW();
```

Aktywne sesje dla nieistniejących użytkowników = problem bezpieczeństwa.

## Agregacje i Grupowanie

### Ile zamówień na użytkownika?

```sql
SELECT u.email, COUNT(o.id) as order_count, SUM(o.total) as total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
GROUP BY u.id, u.email
HAVING COUNT(o.id) > 10
ORDER BY total_spent DESC;
```

Dobry do weryfikacji logiki programów lojalnościowych.

### Produkty które nigdy nie były zamówione

```sql
SELECT p.id, p.name, p.created_at
FROM products p
LEFT JOIN order_items oi ON p.id = oi.product_id
WHERE oi.id IS NULL
  AND p.status = 'active';
```

## Sprawdzanie Spójności Danych

```sql
-- Czy liczba produktów w koszyku = liczba pozycji w zamówieniu?
SELECT 
  o.id,
  COUNT(DISTINCT oi.product_id) as unique_products,
  SUM(oi.quantity) as total_items,
  o.item_count as claimed_count  -- pole w tabeli orders
FROM orders o
JOIN order_items oi ON o.id = oi.order_id
GROUP BY o.id, o.item_count
HAVING SUM(oi.quantity) != o.item_count;
```

To zapytanie znajdzie zamówienia gdzie `item_count` w tabeli orders jest niezgodny z faktyczną liczbą pozycji — klasyczny bug w mechanizmie aktualizacji koszyka.

## Praktyczna Rada

Zanim zaczniesz pisać złożone JOINy — najpierw sprawdź schemat bazy:

```sql
-- PostgreSQL
\dt          -- lista tabel
\d orders    -- schemat tabeli orders

-- MySQL
SHOW TABLES;
DESCRIBE orders;
```

Zrozumienie schematu = zrozumienie jak dane są powiązane = lepsze testy.
