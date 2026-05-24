# Testowanie Backup i Odtwarzania — Czy Twoje Dane Są Bezpieczne

Backup bez testowania odtwarzania to iluzja bezpieczeństwa. Firmy które nie testują restore — odkrywają że backup nie działa dopiero gdy go potrzebują. QA który uwzględnia testy backup/restore chroni firmę przed katastrofą.

## Dlaczego Testy Backup są Kluczowe

Statystyki które robią wrażenie:
- 58% firm które straciły dane i nie miały sprawdzonego backupu — zamknęło się w ciągu 6 miesięcy
- Backup bez testu restore = brak backupu (nie wiesz czy zadziała)
- Najczęstsza przyczyna utraty danych: nie brak backupu, ale nieudany restore

Twoja rola jako QA: weryfikować że backup i restore działają, zanim firma potrzebuje ich naprawdę.

## Co Testować

### Kompletność Backupu

Backup powinien zawierać:
- Dane bazy danych (tabele, relacje, indeksy)
- Pliki użytkowników (uploads, attachments)
- Konfigurację aplikacji (env vars, certyfikaty)
- Logi (jeśli są wymagane regulacyjnie)

**Test:** Po backupie zrób inventory — czy wszystkie komponenty są w backup?

### Restore — Najważniejszy Test

```
Scenariusz pełnego restore:
1. Stwórz testowe dane (użytkownicy, zamówienia, pliki)
2. Zrób backup
3. Usuń lub uszkódź dane (w środowisku testowym!)
4. Wykonaj restore z backupu
5. Sprawdź czy dane są identyczne z oryginałem
```

Checkpoints po restore:
- Liczba rekordów w każdej tabeli = przed backupem
- Pliki użytkowników są dostępne i nienaruszone
- Konta użytkowników działają (login, uprawnienia)
- Żadne foreign key constraints nie są naruszone
- Sekwencje / auto-increment IDs są poprawne

### Recovery Time Objective (RTO)

RTO = maksymalny akceptowalny czas przywrócenia systemu po awarii.

```
Test RTO:
1. Zmierz czas pełnego restore
2. Porównaj z zadeklarowanym RTO firmy
3. Jeśli restore zajmuje 4h a RTO to 2h — masz problem

Dokumentuj: "Full restore z backupu DB 50GB zajął 3h 42min"
```

### Recovery Point Objective (RPO)

RPO = maksymalna ilość danych które możemy stracić (mierzona w czasie).

```
Backup co 24h → RPO = 24h (możemy stracić do 24h danych)
Backup co 1h → RPO = 1h
Continuous backup → RPO = sekundy/minuty
```

**Test:** Stwórz dane, poczekaj X minut, zrób backup. Sprawdź że najnowsze dane są w backupie.

### Point-in-Time Recovery (PITR)

Możliwość przywrócenia do konkretnego momentu w czasie:

```
Scenariusz: Admin przez błąd usunął 1000 rekordów o 14:32
PITR pozwala przywrócić stan bazy z 14:31

Test PITR:
1. Stwórz dane
2. Zrób krytyczną zmianę (delete)
3. Przywróć do momentu przed zmianą
4. Sprawdź że dane istnieją
```

### Integralność Danych po Restore

Przywrócone dane muszą być spójne. Sprawdź:

```sql
-- Czy wszystkie zamówienia mają pozycje?
SELECT o.id FROM orders o 
LEFT JOIN order_items oi ON o.id = oi.order_id 
WHERE oi.id IS NULL;
-- Wynik: 0 wierszy (brak zamówień bez pozycji)

-- Czy wszystkie płatności mają zamówienia?
SELECT p.id FROM payments p
LEFT JOIN orders o ON p.order_id = o.id
WHERE o.id IS NULL;
-- Wynik: 0 wierszy

-- Czy sekwencje nie nakładają się?
SELECT MAX(id) FROM users; -- np. 1542
-- Następny INSERT powinien dostać id = 1543
```

## Środowisko Testowe Backupów

Nigdy nie testuj restore na produkcji. Miej dedykowane środowisko:

```
Środowisko DR (Disaster Recovery):
- Replika produkcyjnej infrastruktury
- Izolowane od produkcji (inny network, inny cloud region)
- Używane wyłącznie do testów restore
- Dostęp tylko dla ops/QA
```

## Harmonogram Testów Backup

```
Minimalny harmonogram:
- Codziennie: weryfikacja że backup się wykonał (status check, rozmiar)
- Tygodniowo: restore pojedynczej tabeli lub małego datasetu
- Miesięcznie: pełny restore z pomiarem czasu (RTO test)
- Kwartalnie: pełny drill — symulacja awarii, cały team uczestniczy
```

## Dokumentacja Testu Restore

```
Test Restore — 2024-03-15
Środowisko: staging-dr
Backup z: 2024-03-14 02:00 UTC (automatyczny backup nocny)
Rozmiar backupu: 12.3 GB

Czas restore: 47 minut
RTO cel: 60 minut ✓ (zmieściliśmy się)

Weryfikacja danych:
- Użytkownicy: 8,421 ✓ (vs 8,421 w backup)
- Zamówienia: 156,023 ✓
- Pliki: 4,891 plików, 23.1 GB ✓
- Integrity check: PASS (brak naruszeń FK)
- Login testowy: ✓ działa

Uwagi: Restore plików zajął 35/47 minut — główny bottleneck.
Rekomendacja: incremental backup dla plików (zamiast full każdego dnia)
```
