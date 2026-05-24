# Zaawansowany SQL dla QA — Agregacje i Walidacja

Podstawowy SELECT to za mało. Jako QA weryfikujesz złożone dane biznesowe — i do tego potrzebujesz agregacji, podzapytań i funkcji okienkowych.

## Agregacje

```sql
-- Ile zamówień złożył każdy użytkownik?
SELECT user_id, COUNT(*) as order_count
FROM orders
GROUP BY user_id
ORDER BY order_count DESC;

-- Sprawdź czy suma w UI zgadza się z bazą
SELECT SUM(amount) as total
FROM payments
WHERE status = 'completed'
AND created_at >= '2024-01-01';

-- Znajdź użytkowników bez żadnego zamówienia (LEFT JOIN)
SELECT u.id, u.email
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE o.id IS NULL;
```

## Podzapytania — Walidacja Powiązanych Danych

```sql
-- Czy są zamówienia z nieistniejącymi produktami?
SELECT *
FROM order_items oi
WHERE NOT EXISTS (
  SELECT 1 FROM products p WHERE p.id = oi.product_id
);

-- Użytkownicy którzy kupili produkt X ale nie mają profilu
SELECT u.id, u.email
FROM users u
WHERE u.id IN (
  SELECT DISTINCT user_id FROM orders WHERE product_id = 42
)
AND u.id NOT IN (
  SELECT user_id FROM user_profiles
);
```

## Dane Testowe — Tworzenie i Czyszczenie

W środowisku testowym QA często potrzebuje kontrolować dane:

```sql
-- Sprawdź ile rekordów testowych jest w bazie
SELECT COUNT(*) FROM users WHERE email LIKE '%@test.%';

-- Dane z ostatniej godziny (przydatne po testach)
SELECT * FROM audit_logs
WHERE created_at > NOW() - INTERVAL '1 hour'
ORDER BY created_at DESC;
```

## Transakcje i Spójność

```sql
-- Sprawdź czy transakcja nie zostawiła "osieroconych" danych
BEGIN;
  -- symulacja akcji
  SELECT * FROM orders WHERE id = 999;
ROLLBACK; -- zawsze ROLLBACK w testach na prod!
```

> Na środowisku produkcyjnym używaj tylko `SELECT`. Na testowym możesz używać transakcji z `ROLLBACK` — nigdy bez niego.
