# Metryki Jakości — Liczby które Mówią o Procesie

"Jak idą testy?" — to pytanie które dostaniesz od managera. Jeśli odpowiadasz "dobrze" lub "wszystko idzie" — nie mierzysz. QA który nie mierzy nie może poprawiać.

## Po Co Metryki QA?

Metryki nie służą do oceniania QA — służą do opowiadania historii o procesie.

- Dużo bugów na produkcji → testowanie jest za późno w cyklu lub ma luki
- Długi czas naprawy bugów → brakuje priorytetyzacji lub developer-QA alignment
- Wiele "reopen" bugów → definicja "naprawiony" jest niejasna

Bez liczb masz tylko opinie. Z liczbami masz fakty.

## Kluczowe Metryki QA

### Defect Detection Rate (DDR)
Ile % bugów QA znalazło PRZED produkcją.

```
DDR = (bugi znalezione przez QA) / (bugi znalezione przez QA + bugi na produkcji) × 100%
```

Przykład: QA znalazło 45 bugów, na produkcji wyszło 5 → DDR = 45/(45+5) = 90%

**Dobry poziom:** > 90%. Poniżej 80% to sygnał problemu.

### Escaped Defects (Defekty Uciekinierzy)
Bugi które dotarły na produkcję mimo testowania.

**Czemu ważne:** każdy escaped defect to pytanie "dlaczego to nie zostało wykryte?" — i odpowiedź poprawia proces.

### Mean Time to Detect (MTTD)
Średni czas od wprowadzenia buga do jego wykrycia.

Im krótszy MTTD, tym tańsze bugi. Bug znaleziony w code review kosztuje godziny. Bug znaleziony przez klienta kosztuje dni naprawy + utrata zaufania.

### Test Execution Rate
Ile % zaplanowanych testów zostało wykonanych w sprincie.

Jeśli regularnie wykonujesz 60% planu → albo plan jest nierealistyczny albo scope testów jest za szeroki dla dostępnego czasu.

### Defect Reopen Rate
Ile % naprawionych bugów wraca do "retest".

Wysoki reopen rate (> 15%) = developerzy zamykają bugi bez pełnej naprawy lub komunikacja o kryteriach naprawy jest słaba.

### Test Coverage (dla automatyzacji)
Procent kodu lub funkcji pokrytych testami automatycznymi.

Uwaga: 100% coverage nie oznacza braku bugów. Metryka mówi co jest pokryte, nie czy testy są sensowne.

## Jak Zbierać Metryki bez Narzędzia?

Prosta tabela w Notion lub Google Sheets:

```
Sprint | Bugi zgłoszone | Bugi na produkcji | DDR | Reopen | Nowe escape
----------------------------------------------------------------------
S23    |     28         |        2          | 93% |   4    |     2
S24    |     31         |        1          | 97% |   2    |     1
S25    |     22         |        5          | 81% |   7    |     5  ← problem!
```

Sprint 25 ma spadek DDR i wzrost escape — co się zmieniło? Może nowy developer, może skrócone testowanie, może nowy moduł bez pokrycia.

## Metryki które NIE Mówią Nic Użytecznego

### Liczba testów napisanych
"Napisałem 300 testów!" — 300 testów które sprawdzają że button istnieje vs 50 testów które testują krytyczne flows. Jakość > ilość.

### Liczba bugów znalezionych
Więcej bugów ≠ lepszy QA. Może oznaczać gorszy kod. Może oznaczać że QA testuje mniej ważne obszary (łatwe do złapania bugi kosmetyczne). Zawsze analizuj typ i severity.

### Czas testowania
"QA spędził 40h na testowaniu" mówi ile czasu zainwestowano — nie czy było skuteczne.

## Jak Prezentować Metryki

Na retrospective lub team review, opowiedz historię:

> "W ostatnich 3 sprintach DDR spadło z 93% do 81%. Wykorzeniliśmy 3 przyczyny: brak testów dla modułu płatności (dodaję teraz), bugi reportowane przez support nie trafiają do QA backlogu, i zbyt późne środowisko testowe. Proponuję te 3 działania na kolejny kwartał."

Metryki + analiza przyczyn + propozycja działań = senior QA myślenie.
