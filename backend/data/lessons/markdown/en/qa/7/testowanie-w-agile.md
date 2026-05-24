# Testowanie w Agile — Jak QA Pasuje do Sprintu

Większość kursów QA uczy technik testowania. Mało kursów uczy jak funkcjonować w zespole Agile, gdzie deadline'y są co 2 tygodnie i nikt nie czeka na pełne testy regresji.

## QA w Sprincie — Realny Obraz

Sprint trwa 2 tygodnie. W tym czasie QA:
- Uczestniczy w Sprint Planning (zadaje pytania o edge case'y, szacuje czas testowania)
- Pisze lub aktualizuje przypadki testowe w trakcie refinementu
- Testuje features w trakcie developmentu (nie po zakończeniu wszystkich!)
- Uczestniczy w daily standup
- Prowadzi regression testing przed sprint review
- Zgłasza bugi i śledzi ich naprawę
- Uczestniczy w sprint retrospective

To jest dużo. Realnie QA ma 6–8 dni efektywnej pracy na testowanie w 10-dniowym sprincie.

## "Definition of Ready" i "Definition of Done"

To dwa fundamentalne pojęcia Agile których QA jest kluczowym współautorem:

### Definition of Ready (DoR)
Warunki które musi spełnić ticket PRZED wzięciem do sprintu:
- Wymagania są jasne i kompletne
- Kryteria akceptacji są napisane
- Edge case'y są opisane lub oznaczone
- Design jest zatwierdzony
- Zależności są rozwiązane

QA powinien blokować tickety które nie spełniają DoR — nie ma sensu testować czegoś co jest niejasne.

### Definition of Done (DoD)
Warunki które musi spełnić ticket PRZED zamknięciem:
- Kod jest zreviewowany
- **Testy QA przeszły**
- **Nie ma otwartych bugów blokujących**
- Dokumentacja jest zaktualizowana
- Feature jest zademonstrowany na staging

## Shift-Left Testing

"Shift left" = przesuń testowanie na wcześniejszy etap.

### Tradycyjny model:
```
Dev pisze kod → QA testuje → Bugi → Dev naprawia → QA testuje ponownie
```

### Shift-left:
```
QA uczestniczy w refinemencie → Dev pisze kod (z AC od QA) → QA testuje wcześnie → Mniej bugów
```

Kluczowe: **im wcześniej znajdziesz buga, tym taniej go naprawić.**

## Three Amigos

Najskuteczniejsza technika Agile dla QA:

Przed rozpoczęciem developmentu, trzy osoby omawiają ticket:
- **Product Owner** — co chcemy osiągnąć?
- **Developer** — jak to zaimplementujemy?
- **QA** — jak sprawdzimy czy to działa?

10–15 minutowe spotkanie wykrywa 60-70% nieporozumień zanim developerzy napiszą pierwszą linię kodu.

## Test Coverage w Sprincie — Pragmatyczne Podejście

Nie masz czasu na pełną regresję każdego sprintu. Priorytetyzuj:

1. **Krytyczne ścieżki biznesowe** — zawsze testuj
2. **Nowe funkcje** — pełne testy
3. **Zmiany w istniejącym kodzie** — testy wpływu (co mogło się popsuć?)
4. **Stary, stabilny kod** — polegaj na automatyzacji lub skróć

## Komunikacja Ryzyka

Gdy nie masz czasu na wszystko — komunikuj ryzyko wprost:

> *"W tym sprincie nie przetestowałem scenariuszy multi-currency w checkout. Podstawowe ścieżki są OK. Release z tym ryzykiem możliwy, ale polecam flagę dla 5% ruchu."*

To jest QA w Agile — nie "wszystko przetestowane", ale "tu jest ryzyko, oto decyzja którą musicie podjąć".
