# Zarządzanie Backlogiem QA — Porządek w Chaosie Testowania

QA backlog to lista wszystkiego co wymaga uwagi z perspektywy testowania: bugi do sprawdzenia, testy do napisania, tech debt w automatyzacji, obszary bez pokrycia. Bez zarządzania backlogiem — praca QA staje się reaktywna i chaotyczna.

## Dlaczego QA Backlog Rośnie Niekontrolowanie

W typowym projekcie QA backlog rośnie ponieważ:
- Każdy sprint dodaje nowe funkcje → nowe obszary do pokrycia testami
- Bugi które "nie blokują" ale "wrócimy do nich" — wracają rzadko
- Tech debt automatyzacji: testy flakey, nieaktualne, niedokumentowane
- Niedomknięte regresy: "do przetestowania na staging" przez 3 sprinty
- Odkryte obszary bez żadnych przypadków testowych

Efekt: QA nie wie od czego zacząć. Wszystko jest ważne i nic nie jest zamknięte.

## Struktura Zdrowego Backlogu

Podziel backlog na kategorie:

### 1. Aktywne (ten sprint)
Wszystko co wymaga uwagi teraz. Max 10-15 pozycji. Więcej = backlog, nie sprint.

### 2. Do Zrobienia (następny sprint lub tech debt)
Znane tematy z wyceną. "Napisać smoke testy dla auth module — 4h."

### 3. Parking (obserwujemy)
Bugi które nie blokują ale warto monitorować. Przejrzyj co miesiąc — czy nadal aktualne?

### 4. Archiwum
Zamknięte lub zdecydowanie wycofane. Nie usuwaj — historyczne informacje mają wartość.

## Priorytetyzacja — MoSCoW dla QA

Każda pozycja w backlogu powinna mieć priorytet:

**Must Have (P1):** blokuje release lub dotyczy krytycznej funkcji
**Should Have (P2):** ważne, ale można z jednym sprintem opóźnienia
**Could Have (P3):** wartościowe gdy jest czas
**Won't Have (odrzucone):** nie warto inwestować

Zasada: jeśli "Could Have" leży w backlogu dłużej niż 3 sprinty — przemyśl czy naprawdę warto.

## Backlog Grooming — Cotygodniowy Rytuał

30 minut raz w tygodniu (lub przed planowaniem sprintu):

1. **Przeglądnij parking** — coś weszło do aktywnego? coś można odrzucić?
2. **Zamknij przestarzałe** — bugi na wersji którą już nie istnieje
3. **Oszacuj nowe** — każda nowa pozycja dostaje priorytet i wycenę
4. **Sprawdź "do zrobienia"** — czy cokolwiek powinno wejść do sprintu?

Bez groomingu backlog staje się wysypiskiem. Grooming go czyści.

## Tech Debt w Automatyzacji — Niewidzialny Problem

Tech debt w testach automatycznych jest gorzej widoczny niż w kodzie produkcyjnym.

Sygnały że masz problem:

```
🔴 Flaky rate > 5% (co 20 testów jeden failuje przypadkowo)
🔴 Testy zajmują > 30 min (nikt nie czeka na feedback z CI)
🔴 Testy failują z powodów niezwiązanych z kodem (środowisko, timeouty)
🔴 Nikt nie aktualizuje testów gdy UI się zmieni
🔴 Testy są napisane 2 lata temu i nikt nie wie jak działają
```

Wydziel 20% czasu QA na utrzymanie testów automatycznych. Bez tego: testy się sypią, zaufanie spada, CI staje się szumem.

## Jak Negocjować Czas na QA Backlog

Manager widzi backlog QA przez pryzmat deliverable dla sprintu — nie zawsze rozumie wartość "pracy za kulisami".

Jak uzasadniać:

```
❌ "Musimy poświęcić czas na backlog."
✅ "W ostatnich 3 sprintach mamy 3 flakey testy które powodują false alarms. 
   Deweloperzy 2× w tygodniu ignorują czerwone CI bo 'to pewnie flakey'. 
   Szacuję 4h żeby naprawić — żeby CI znowu było wiarygodne."
```

Połącz backlog z kosztem który istnieje bez jego rozwiązania.

## Widoczność Backlogu dla Teamu

QA backlog nie powinien być tajemnicą. Udostępnij go teamowi:

- PM wie że "brak testów dla search feature" to ryzyko
- Developer wie że "flakey test w auth" to znany problem
- Manager wie co QA planuje robić

Transparentność backlogu = QA jest partnerem w zarządzaniu ryzykiem, nie czarną skrzynką.

## Metryki Backlogu

Śledź:
- **Backlog size** — ile pozycji (czy rośnie, maleje, stabilny?)
- **Average age P2** — jak długo average P2 czeka na realizację?
- **Closure rate** — ile pozycji zamykamy vs dodajemy w sprincie?

Jeśli dodajesz 10 i zamykasz 3 każdy sprint — backlog rośnie i w końcu będzie niezarządzalny.
