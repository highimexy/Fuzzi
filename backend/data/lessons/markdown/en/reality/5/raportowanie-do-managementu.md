# Raportowanie do Managementu — Jak Mówić o Jakości Bez Technikaliów

Manager nie rozumie "mamy 47 test cases z coverage 73%". Manager rozumie "jaki jest stan produktu i jakie jest ryzyko dla biznesu". Tłumaczenie stanu QA na język biznesowy to kluczowa umiejętność seniora.

## Czego Manager Potrzebuje

Manager podejmuje decyzje. Żeby podjąć decyzję potrzebuje:

1. **Stan** — gdzie jesteśmy teraz?
2. **Ryzyko** — co może pójść nie tak i jak poważne?
3. **Rekomendacja** — co sugerujesz?
4. **Trend** — czy jest lepiej czy gorzej niż ostatnio?

Wszystko poza tym to technikalia których nie potrzebuje w raportach strategicznych.

## Raport Tygodniowy — Format

```
QA Status Report — Sprint 24, Tydzień 2
Tester: Anna K. | Data: 15.03.2024

STAN OGÓLNY: 🟡 Uwaga (1 P1 otwarty)

METRYKI:
• Przetestowane: 18/22 user stories (82%)
• Otwarte bugi: 7 (1 P1, 2 P2, 4 P3)
• Zamknięte w tym tygodniu: 12
• Escaped defects (produkcja): 0

OTWARTE RYZYKA:
• [P1] Checkout z kartą Visa → błąd 500 (developer pracuje, ETA: jutro)
• [P2] Import CSV → timeout dla plików > 10MB (rzadki case, obejście istnieje)

GOTOWOŚĆ DO RELEASE (zaplanowany piątek):
• Blokada: bug #5521 (P1 checkout) musi być naprawiony i przetestowany
• Jeśli naprawiony do czwartku 12:00 → release w piątek jest możliwy
• Jeśli nie → rekomenuję przesunięcie release o tydzień lub deployment bez modułu checkout

PLAN NASTĘPNY TYDZIEŃ:
• Regresja (wtorek-środa)
• Testy na mobile Safari (czwartek)
```

## Jak Przekształcić Technikalia w Biznesowy Język

| Technikalne | Biznesowe |
|---|---|
| "Coverage 73%" | "27% funkcjonalności nie ma testów automatycznych" |
| "8 failed E2E tests" | "Automatyczne testy wykryły problemy w 3 obszarach" |
| "Flakey rate 6%" | "Co 16. uruchomienie CI daje fałszywy alarm — tracimy czas na diagnostykę" |
| "Bug P1 w checkout" | "Użytkownicy nie mogą zapłacić kartą Visa — blokuje release" |
| "Regresja 4h" | "Pełne sprawdzenie aplikacji przed release zajmuje 4h" |

## Prezentacja Danych na Retrospekcji

Dane bez historii to liczby. Dane z historią to insight.

**Słabo:**
> "W tym kwartale znaleźliśmy 142 bugi, z czego 8 P1 i 23 P2."

**Dobrze:**
> "W tym kwartale znaleźliśmy 142 bugi — o 30% więcej niż kwartał poprzedni. Wzrost wynika z 3 nowych developerów którzy dopiero poznają architekturę produktu. P1 bugi skumulowały się przy module płatności — warto rozważyć dedykowaną sesję pair testing przy kolejnej zmianie w tym module."

Dane + kontekst + rekomendacja.

## Dashboard Jakości — Co Prezentować

Nie więcej niż 5 metryk. Każda musi mieć:
- Wartość bieżąca
- Trend (↑ ↓ →)
- Cel / benchmark

```
Dashboard QA — Q1 2024

Metryka          | Bieżący | Cel    | Trend
Escaped defects  | 2       | < 5    | → (stabilny)
DDR              | 87%     | > 90%  | ↓ (spada!)
Flaky rate CI    | 4.2%    | < 2%   | → (bez poprawy)
Release gotowość | 85%     | > 95%  | ↑ (poprawa)
Coverage kryt.   | 78%     | > 85%  | ↑ (poprawa)
```

DDR spada i flaky rate nie maleje — to wymaga rozmowy z managerem, nie tylko raportu.

## Trudne Rozmowy z Managerem

### Gdy Manager Chce Wypuścić z Otwartym P1

Nie: "Nie możemy tego wypuścić."
Tak: "Bug #5521 blokuje checkout dla kart Visa. Mam 3 opcje: (A) poczekamy na fix — ETA jutro, (B) deployujemy bez Visa checkout z komunikatem dla userów, (C) deployujemy i przyjmujemy ryzyko — szacuję ~15% transakcji dotkniętych. Które z nich chcesz wybrać?"

### Gdy Manager Pyta Dlaczego Jest Tyle Bugów

Nie: "Bo developerzy piszą zły kod."
Tak: "Analiza ostatniego miesiąca: 60% bugów pochodzi z modułu X który nie ma coverage testami automatycznymi. Propozycja: 2 sprinty na napisanie testów dla tego modułu — szacuję redukcję bugów z tego obszaru o 50%."

### Gdy Manager Kwestionuje Wartość QA

Nie: obrona i emocje.
Tak: dane. "W Q4 2023 mieliśmy 12 escaped defects (bugi na produkcji). W Q1 2024 po wdrożeniu regresji — 4 escaped defects. Różnica: 8 bugów na produkcji mniej × średni koszt bugfix na produkcji (support + developer + utrata zaufania klientów = ~8h pracy) = ~64h oszczędności."

Dane wygrywają argumenty.

## Kiedy NIE Raportować Technikaliów

Na spotkaniu z CEO lub inwestorami: tylko stan systemu dla biznesu.

"Aplikacja jest stabilna. Ostatni release przebiegł bez incydentów. Mamy monitoring który wykryje problemy zanim dotrą do klientów."

To wystarczy. Szczegóły techniczne na prośbę — nie domyślnie.
