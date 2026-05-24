# Testowanie Transakcji Bazodanowych — ACID w Praktyce

Transakcja bazodanowa to gwarancja. Albo wszystkie operacje w transakcji się wykonują, albo żadna. QA który rozumie transakcje może znaleźć bugi które nikt inny nie znajdzie.

## ACID — Cztery Właściwości Transakcji

### Atomicity (Atomowość)
Wszystko albo nic. Transakcja to niepodzielna jednostka.

**Przykład:** Przelew bankowy:
```sql
BEGIN;
  UPDATE accounts SET balance = balance - 1000 WHERE id = 1;  -- pobierz od nadawcy
  UPDATE accounts SET balance = balance + 1000 WHERE id = 2;  -- dodaj do odbiorcy
COMMIT;
```
Jeśli drugi UPDATE się nie wykona — ROLLBACK. Pieniądze wracają do nadawcy.

**Bug który testujesz:** Czy aplikacja obsługuje błąd w środku transakcji? Co jeśli baza padnie między UPDATE 1 a UPDATE 2?

### Consistency (Spójność)
Transakcja przenosi bazę z jednego spójnego stanu do drugiego. Constraint-y muszą być zachowane.

**Przykład:** Nie można mieć ujemnego salda konta (jeśli constraint to wyklucza).

**Bug który testujesz:** Czy aplikacja może wprowadzić dane które naruszają reguły biznesowe?

### Isolation (Izolacja)
Równoległe transakcje nie widzą nawzajem swoich niezatwierdzonych zmian.

**Poziomy izolacji (od najsłabszego):**
1. **Read Uncommitted** — widzisz zmiany innych transakcji przed COMMIT
2. **Read Committed** — widzisz tylko COMMIT-owane zmiany (standard dla większości baz)
3. **Repeatable Read** — ten sam SELECT w transakcji daje te same wyniki
4. **Serializable** — transakcje wykonują się jakby były szeregowe (wolne, ale bezpieczne)

**Bug który testujesz:** Dwa użytkownicy kupują ostatni bilet w tym samym momencie — czy obaj dostaną bilet?

### Durability (Trwałość)
Po COMMIT — dane są trwałe, nawet jeśli serwer padnie chwilę później.

## Race Conditions — Najgroźniejszy Bug Transakcyjny

Race condition to sytuacja gdy dwie transakcje równoległe interferują ze sobą.

### Klasyczny przykład: Podwójne rezerwowanie

```
T1: SELECT seats WHERE id=42 → 1 wolne miejsce
T2: SELECT seats WHERE id=42 → 1 wolne miejsce
T1: INSERT booking (seat_id=42, user=Alice)
T2: INSERT booking (seat_id=42, user=Bob)
T1: UPDATE seats SET available=0 WHERE id=42
T2: UPDATE seats SET available=0 WHERE id=42
```

Wynik: Alice i Bob mają rezerwację na ten sam fotel.

**Prawidłowe rozwiązanie:**
```sql
SELECT ... FOR UPDATE;  -- pesymistyczna blokada
-- lub
UPDATE seats SET available = available - 1 
  WHERE id=42 AND available > 0;  -- optymistyczna
```

### Jak Testować Race Conditions

```
Test: Dwa równoległe zamówienia ostatniego produktu
1. Ustaw stock = 1
2. Wywołaj endpoint zakupu z dwóch klientów JEDNOCZEŚNIE (ab, k6, curl parallel)
3. Sprawdź: czy tylko jedno zamówienie zostało zatwierdzone?
4. Sprawdź: czy stock = 0 (nie -1)?
5. Sprawdź: drugi użytkownik dostał błąd "produkt niedostępny"?
```

## Testowanie Rollbacków

### Scenariusz: Błąd w środku operacji

```
Test: Zamówienie z wieloma produktami — błąd przy ostatnim
1. Koszyk: 3 produkty, ostatni nie istnieje (fake ID)
2. Złóż zamówienie
3. Sprawdź:
   - Czy zamówienie zostało anulowane w całości?
   - Czy stock pierwszych 2 produktów wrócił?
   - Czy użytkownik nie był obciążony?
   - Czy w bazie nie ma zamówienia z 2 z 3 produktów?
```

### Scenariusz: Utrata połączenia

```
Test: Symulacja utraty połączenia podczas zapisu
1. Wstaw do bazy regułę która powoduje timeout (lub użyj proxy chaos tool)
2. Wywołaj operację zapisu
3. Sprawdź czy baza jest w spójnym stanie
```

## Zapytania Diagnostyczne dla QA

```sql
-- Sprawdź aktywne transakcje (PostgreSQL)
SELECT pid, now() - pg_stat_activity.query_start AS duration, query, state
FROM pg_stat_activity
WHERE state != 'idle'
ORDER BY duration DESC;

-- Sprawdź blokady
SELECT locktype, relation::regclass, mode, granted
FROM pg_locks l
JOIN pg_stat_activity a ON l.pid = a.pid
WHERE NOT granted;

-- Sprawdź spójność danych po testach
SELECT COUNT(*) FROM orders WHERE status = 'pending' AND created_at < NOW() - INTERVAL '1 hour';
-- Zamówienia "pending" starsze niż godzina = prawdopodobny bug transakcyjny
```

## Sygnały że Masz Problem z Transakcjami

W logach aplikacji:
- `Deadlock detected` — dwie transakcje czekają na siebie nawzajem
- `Transaction rolled back` — operacja nie powiodła się
- `Duplicate key violation` — dwa insertemty tego samego klucza (race condition)
- `could not serialize access` — konflikt przy Serializable isolation

W bazie danych:
- Rekordy z niespójnym stanem (order bez items, payment bez order)
- Duplikaty które nie powinny istnieć
- Wartości ujemne w polach które powinny być ≥ 0 (stock, balance)
