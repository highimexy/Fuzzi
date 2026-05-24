# Testowanie Migracji Baz Danych

Migracja bazy danych to jeden z najbardziej ryzykownych momentów każdego releasu. QA który rozumie migracje jest wart złota w każdym zespole.

## Dlaczego Migracje są Ryzykowne?

W odróżnieniu od kodu aplikacji, zmiany w bazie danych są często **nieodwracalne**:

- Usunięta kolumna = utracone dane
- Zmiana typu kolumny = przekonwertowane (lub popsute) dane
- Brakujący index = degradacja wydajności pod obciążeniem
- Zła migracja z 10M+ rekordów = lock tabeli na godziny

## Typy Zmian w Bazie Danych

### Bezpieczne zmiany (non-breaking):
- Dodanie nowej kolumny z DEFAULT lub nullable
- Dodanie nowego indeksu (z CONCURRENTLY w PostgreSQL)
- Dodanie nowej tabeli
- Dodanie nowego enum value

### Ryzykowne zmiany:
- Zmiana nazwy kolumny (breaking dla starego kodu)
- Zmiana typu kolumny (możliwa utrata danych)
- Dodanie NOT NULL constraint na istniejącej tabeli
- Usunięcie kolumny/tabeli
- Zmiana długości VARCHAR (skrócenie = obcięcie danych)

## Co Testuje QA Przy Migracji?

### 1. Weryfikacja danych przed i po
```sql
-- Przed migracją: policz rekordy
SELECT COUNT(*) FROM users WHERE email IS NOT NULL;
-- Wartość: 45832

-- Po migracji: zweryfikuj że nic nie zginęło
SELECT COUNT(*) FROM users WHERE email IS NOT NULL;
-- Oczekiwane: 45832
```

### 2. Test rollback
Każda migracja powinna mieć rollback. QA testuje:
- Czy rollback działa bez błędów?
- Czy dane po rollback są identyczne jak przed migracją?

### 3. Wydajność po migracji
- Czy zapytania które działały 50ms dalej działają 50ms?
- Czy nowy index jest używany przez query planner?

```sql
EXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 123;
-- Sprawdź czy używa Index Scan, nie Seq Scan
```

### 4. Aplikacja po migracji
- Czy deployment nowej wersji kodu działa z nową bazą?
- Czy stara wersja kodu (rolling deployment) działa z nową bazą?

## Strategia: Blue-Green i Expand/Contract

W produkcyjnych systemach migracja rzadko jest atomowa. Stosuje się:

**Expand/Contract Pattern:**
1. **Expand** — dodaj nową kolumnę (nullable), napisz kod który zapisuje do obu
2. **Migruj** — przenieś dane ze starej kolumny do nowej
3. **Contract** — usuń starą kolumnę gdy wszystkie dane są w nowej

To pozwala na zero-downtime deployment bez ryzyka.

## Checklist Testowania Migracji

```
□ Przetestowałem na kopii produkcyjnej bazy (nie na dev)
□ Zweryfikowałem liczby rekordów przed i po
□ Przetestowałem rollback
□ Sprawdziłem czas wykonania migracji (czy lock tabeli?)
□ Zweryfikowałem wydajność kluczowych zapytań
□ Przetestowałem aplikację z nową bazą
□ Mam plan awaryjny (snapshot bazy przed migracją)
```

## Red Flag: "Przetestujemy na produkcji"

Nigdy nie testuj migracji po raz pierwszy na produkcji. Zawsze miej staging który jest kopią produkcji (dane i rozmiar). Jeśli firma nie ma stagingu — to informacja o kulturze inżynierskiej tej firmy.
