# SQL dla QA — Walidacja Danych w Bazie

Jako QA inżynier, dostęp do bazy danych pozwala Ci weryfikować dane bezpośrednio — bez polegania wyłącznie na UI. To jedno z najważniejszych narzędzi backend testingu.

## Podstawowe Queries

```sql
-- Pobierz wszystkich użytkowników
SELECT * FROM users;

-- Znajdź konkretnego użytkownika
SELECT id, email, created_at
FROM users
WHERE email = 'test@example.com';

-- Sprawdź ostatnie rejestracje
SELECT * FROM users
ORDER BY created_at DESC
LIMIT 10;
```

## Przydatne Wzorce dla QA

```sql
-- Czy rekord naprawdę istnieje?
SELECT COUNT(*) FROM orders WHERE id = 12345;

-- Sprawdź stan zamówienia po akcji w UI
SELECT status, updated_at
FROM orders
WHERE user_id = 42
ORDER BY updated_at DESC;

-- Walidacja FK — czy powiązany rekord istnieje?
SELECT o.*, u.email
FROM orders o
JOIN users u ON o.user_id = u.id
WHERE o.id = 999;
```

## NULL — Cichy Zabójca

NULL to nie to samo co pusty string lub 0. Wiele bugów pochodzi z nieprawidłowej obsługi NULL.

```sql
-- Znajdź rekordy z brakującymi danymi
SELECT * FROM profiles WHERE phone IS NULL;
SELECT * FROM profiles WHERE phone = '';  -- to co innego!
```

## Co Sprawdzać jako QA?

- Po akcji "Zarejestruj" — czy rekord w `users` istnieje?
- Po akcji "Kup" — czy `order` ma właściwy `status` i `user_id`?
- Po "Usuń" — czy rekord jest naprawdę usunięty (soft delete vs hard delete)?
- Integralność danych — czy FK są prawidłowe?

> Nigdy nie uruchamiaj `UPDATE` ani `DELETE` bez `WHERE` na produkcji!
