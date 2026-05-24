# Code Ownership i Odpowiedzialność za Jakość

"QA odpowiada za jakość" — to zdanie które niszczy więcej teamów niż pomaga. Jakość to odpowiedzialność całego teamu. QA jest jej strażnikiem, nie właścicielem.

## Mit Bramkarza

**Stary model:**
```
Developer pisze kod → QA testuje → QA approves/rejects → Release
```

W tym modelu:
- Developer "oddaje" kod QA i zapomina
- QA jest wąskim gardłem
- Bugi są "winą QA" (bo przepuścił) lub "winą developera" (bo napisał)
- Quality jest afterthought, nie częścią procesu

**Rzeczywistość:**
QA bramkarz w końcowej fazie sprintu nie ma szans wychwycić wszystkich problemów. Znajdzie oczywiste bugi. Edge cases, security issues, performance problems — polecą na produkcję.

## Code Ownership w Praktyce

Code ownership to zasada kto "odpowiada" za konkretny moduł kodu.

**Modele ownership:**

```
Strong ownership: Tylko autor zmienia swój kod
- Zaleta: wysoka jakość, głęboka wiedza
- Wada: silosy, truck factor, bottleneck

Weak ownership: Każdy może zmieniać, ale autor jest "ekspertem"
- Zaleta: elastyczność, szybkość
- Wada: "to nie mój kod, nie znam"

Collective ownership: Cały team odpowiada za cały kod
- Zaleta: pełna elastyczność, shared responsibility
- Wada: "wszyscy odpowiadają = nikt nie odpowiada" (tragedy of commons)
```

**Gdzie QA wchodzi w ownership:**
QA powinien być "stakeholderem" dla każdego modułu — nie właścicielem kodu, ale osobą która definiuje co "dobry" w danym module oznacza.

## Definicja "Done" jako Mechanizm Shared Ownership

DoD (Definition of Done) jest narzędziem przeniesienia odpowiedzialności za jakość na cały team:

```
Zamiast: "Dev pisze, QA testuje"

DoD:
✓ Unit testy napisane przez developera (developer odpowiada za testy jednostkowe)
✓ Code review przez innego developera (peer responsibility)
✓ QA sign-off na acceptance criteria (QA odpowiada za wymagania)
✓ Performance test przeszedł (nikt nie może pominąć)
✓ Security scan clean (DevSecOps odpowiada za narzędzia, dev za fix)
```

Każdy punkt w DoD to odpowiedzialność konkretnej osoby lub roli.

## Shift-Left Quality — Jakość od Początku

Shift-left = przesuń testowanie wcześniej w procesie.

```
Klasyczny model (shift-right):
Wymagania → Design → Kod → TESTOWANIE → Release

Shift-left:
TESTOWANIE wymagań → TESTOWANIE designu → Testowanie kodu → Release

Jak to wygląda w praktyce:
- QA na refinemencie: "Ta historyjka nie ma jasnych AC" → fix przed startem
- QA review wireframes: "Ten flow jest nieintuicyjny" → fix przed implementacją
- TDD: developer pisze test przed kodem → mniej bugów
- Pair programming QA+Dev: testowanie podczas kodowania
```

**Koszt bugów w zależności od fazy:**
```
Wymagania: 1x (zmiana AC)
Design: 5x (przerobienie architektury)
Kodowanie: 10x (refactor)
Testowanie: 20x (fix + retest)
Produkcja: 100x (hotfix, rollback, support, reputacja)
```

## QA i Pull Requests

QA może i powinien uczestniczyć w code review, ale inaczej niż developer.

**Co QA szuka w PR:**
```
1. Test coverage: czy developer dodał testy do nowej funkcji?
2. Edge cases: czy kod obsługuje null, empty, overflow?
3. Error handling: co się dzieje gdy DB jest down?
4. Logging: czy jest wystarczająco logów do debugowania prod issues?
5. Acceptance criteria: czy implementacja jest zgodna z tym co QA planuje testować?
```

**Czego QA NIE robi w PR review:**
```
- Ocena stylu kodu (to rola peer developera)
- Architektura i design patterns (jeśli nie ma wiedzy)
- Performance optymalizacje bez profiling data
```

## Gdy Developer Nie Chce Testować

Częsty konflikt: developer traktuje testy jako "zadanie QA".

**Jak QA może zmienić kulturę:**

```
1. DoD enforcement
   "Ta historyjka nie ma unit testów — nie może przejść do testing."
   Rób to konsekwentnie, nie selektywnie.

2. Edukacja przez przykład
   Pokaż przykład skomplikowanego buga który unit test by wychwycił.
   "Ten crashuje produkcję co tydzień. Unit test zajęłby 30 minut."

3. Wspólne sesje pair testing
   Zaproś developera na swoją sesję testową.
   Developer widzi jak używają aplikacji userzy → naturalnie zaczyna testować edge cases.

4. Metryki
   "Moduł X: 0 unit testów, 12 bugów w ostatnim kwartale."
   "Moduł Y: 85% coverage, 1 bug."
   Dane zmieniają kulturę szybciej niż argumenty.
```

## Truck Factor i Wiedza Testowa

Truck factor = ile osób musi "wyjść z projektu" żeby projekt był zagrożony?

Jeśli tylko jeden QA zna niuanse testowania modułu płatności — truck factor = 1.

**Jak budować wiedzę zbiorową:**
```
- Dokumentuj nieoczywiste przypadki testowe i dlaczego istnieją
- Session notes z eksploracji trafiają do Wiki
- Pair testing różnych QA (jeśli jest ich więcej)
- Onboarding dokumentacja: "Aby przetestować moduł X, musisz wiedzieć..."
```
