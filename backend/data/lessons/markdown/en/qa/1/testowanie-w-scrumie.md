# Testowanie w Scrumie — QA jako Pełnoprawny Członek Teamu

Scrum nie ma dedykowanego miejsca dla QA — i to jest problem który musisz aktywnie rozwiązać. Jeśli nie zdefiniujesz swojej roli w ceremonjach i procesie, zostaniesz zepchnięty do roli "bramkarza na końcu sprintu".

## Rola QA w Scrum

W czystym Scrum nie ma roli "QA". Jest "Development Team" — i wszyscy są odpowiedzialni za jakość. W praktyce większość firm ma dedykowanych QA — i tu zaczyna się problem braku jasnej roli.

**Trzy podejścia do QA w Scrum:**

**1. QA jako bottleneck (antypattern)**
Developerzy kończą feature na 3 dni przed końcem sprintu. QA dostaje 3 dni na przetestowanie wszystkiego. Rezultat: pośpiech, nieprzetestowane edge cases, stres.

**2. QA jako gatekeeper (lepiej, ale nie idealnie)**
QA uczestniczy od początku — review wymagań, test case design. Ale testowanie wciąż jest na końcu.

**3. QA jako partner (cel)**
QA i developer pracują nad user story jednocześnie. QA pisze test cases podczas gdy developer koduje. Testowanie zaczyna się gdy developer skończy — nie 3 dni przed końcem sprintu.

## Sprint Planning — Co Robi QA

### Ocena Historyjek pod Kątem Testowalności

Gdy PM przedstawia user story, QA zadaje:
- "Jakie są edge cases?"
- "Jak definiujemy 'done' dla tej historyjki?"
- "Czy ta historyjka ma jasne kryteria akceptacji?"
- "Czy ta historyjka jest za duża żeby przetestować w jednym sprincie?"

Historyjka bez AC (acceptance criteria) = nie powinna wejść do sprintu.

### Story Point Estimation dla Testowania

QA powinien szacować czas testowania osobno od developmentu:

```
User story: "Jako user chcę móc resetować hasło przez email"
Developer estimate: 3 SP
QA estimate: test cases + testowanie = 2 SP

Total story estimate: 5 SP

Jeśli QA nie szacuje → nikt nie wlicza czasu testowania → sprint nie mieści się
```

## Definition of Done (DoD) — QA Musi Ją Definiować

DoD to checklist którą każda historyjka musi przejść żeby być "done".

**Zła DoD (bez QA):**
- Kod napisany ✓
- Code review zrobione ✓
- Zmergowane do main ✓

**Dobra DoD (QA uczestniczył):**
- Kod napisany ✓
- Code review zrobione ✓
- Testy jednostkowe przechodzą ✓
- QA przetestował na staging ✓
- Acceptance criteria spełnione ✓
- Brak otwartych P1/P2 bugów ✓
- Dokumentacja zaktualizowana (jeśli dotyczy) ✓
- Zmergowane do main ✓

Bez zaangażowania QA w DoD — "done" może oznaczać cokolwiek.

## Sprint Review — Jak QA Prezentuje Wyniki

Sprint Review to demonstracja dla stakeholderów. QA może aktywnie uczestniczyć:

**Zamiast czekać:**
> "Developer Marek pokaże nową funkcję checkout."

**Aktywna rola:**
> "Przetestowaliśmy checkout na 3 przeglądarkach i mobile. Znaleźliśmy 2 bugi — oba naprawione przed release. Jedna obserwacja: loading state przy słabym połączeniu nie istnieje — zalogowałam jako future improvement."

QA który mówi na review = QA który jest widzialny dla biznesu.

## Retrospekcja — Feedback o Procesie QA

Retrospekcja to przestrzeń gdzie QA może i powinien mówić o problemach procesowych:

**Do powiedzenia na retrospekcji:**
- "Ostatnie 2 sprinty: dostajemy user stories do testowania w środę, release w piątek. Nie mamy czasu na regresję. Propozycja: historyjki muszą być 'code complete' do wtorku."
- "Brak staging environment przez 3 dni blokował testowanie. Potrzebujemy dedykowanego staging który nie jest resetowany w trakcie sprintu."
- "Nie uczestniczę w refinemencie — dlatego dostaję historyjki bez AC. Czy mogę dołączyć do refinement sessions?"

## Daily Standup — Jak QA Powinien Raportować

Klasyczny format: "Co zrobiłem, co zrobię, blokery."

QA wersja która daje wartość:
```
❌ "Wczoraj testowałem checkout. Dziś kontynuuję. Brak blokerów."

✅ "Checkout: 3 bugi zgłoszone, 1 krytyczny (#5521 - Visa payment crash).
   Dev Marek pracuje nad #5521. 
   Dziś: regresja dla login + payments.
   Blokery: brak staging access po godzinie 18:00 — potrzebuję przedłużenia."
```

Powiedz jaki jest stan, co jest zablokowane i co konkretnie robisz.

## Kiedy Sprint Failure Jest Problemem QA

Sprint "failuje" gdy historyjki nie przechodzą DoD do końca sprintu. QA bywa obwiniany — ale przyczyny są zazwyczaj strukturalne:

- Historyjki wchodzą zbyt późno (refinement problem)
- Za dużo pracy w sprincie (estimation problem)
- Brak stabilnego środowiska testowego (DevOps problem)
- Zmieniające się wymagania w trakcie sprintu (PM problem)

QA powinien nazywać te przyczyny, nie przyjmować odpowiedzialności za systemowe problemy.
