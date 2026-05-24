# QA Lead — Pierwsze Kroki w Roli Lidera

Zostajesz QA Lead. Dostaniesz tytuł, może podwyżkę, i nagle odpowiadasz za jakość całego produktu i za team który za nim stoi. Nikt nie mówi Ci jak to robić.

## Czym Jest Rola QA Lead?

QA Lead to rola która łączy:
- Pracę techniczną (wciąż testujesz, piszesz testy)
- Pracę procesową (definiujesz jak team testuje)
- Pracę ludzi (mentorujesz, dajesz feedback, resolwujesz konflikty)

Nie możesz rezygnować z żadnego z tych trzech. QA Lead który tylko "zarządza" i nie dotyka kodu traci kontakt z rzeczywistością. QA Lead który tylko koduje i testuje zaniedbuje team.

## Pierwsze 90 Dni — Co Robić?

### Dni 1-30: Słuchaj i obserwuj
Zanim cokolwiek zmienisz — zrozum co masz.

- Przeprowadź 1-on-1 z każdym QA w teamie (co im przeszkadza, co chcieliby zmienić)
- Zrozum jak wygląda current process (nie jak powinien, jak naprawdę jest)
- Rozmawiaj z developerami i PM-em (co im przeszkadza po stronie QA)
- Sprawdź metryki (ile bugów wpada na produkcję, jak długo trwa testowanie)

Nie obiecuj nic przez pierwsze 30 dni. Słuchaj.

### Dni 31-60: Jedno duże ulepszenie
Na podstawie obserwacji — wybierz jeden problem do rozwiązania. Nie dziesięć.

Przykłady:
- "Brak standardu raportowania bugów" → stwórz template i przeprowadź szkolenie
- "Brak smoke testów" → zbuduj zestaw 10 automatycznych smoke testów
- "Nikt nie wie co jest przetestowane przed releasem" → dodaj Release QA Summary do procesu

Jedno duże ulepszenie, dobrze zrobione > dziesięć małych, porzuconych.

### Dni 61-90: Mierz i komunikuj
- Zbierz dane "przed i po" dla swojego ulepszenia
- Przedstaw wyniki na retrospective lub team meetingu
- Zaplanuj kolejne ulepszenie

## Najtrudniejsza Część: Feedback dla Członków Teamu

Gdy member Twojego teamu robi coś źle — musisz to powiedzieć. Dla wielu osób to najtrudniejsza część roli leadera.

**Zasady feedbacku:**
1. **Prywatnie** — nigdy publicznie, nigdy na standup
2. **Konkretnie** — nie "Twoje raporty są złe" ale "W tym tygodniu 3 tickety nie miały kroków repro — developerzy nie mogą zreprodukować bugów"
3. **Szybko** — feedback 2 tygodnie po incydencie jest bezużyteczny
4. **Z pytaniem** — "Co się stało? Czy coś przeszkadza Ci w pisaniu pełnych raportów?"

**SBI Framework (Situation-Behavior-Impact):**
> "Na Code Review w środę [Situation], zostawiłeś komentarze bez kryterium akceptacji co to poprawi [Behavior], przez co developer nie wiedział co zmienić i ticket wrócił do Ciebie [Impact]. Jak możemy to ulepszyć?"

## Relacja z Managerem

Jako QA Lead masz nowego "szefa" (lub bezpośredniego managera). Zasady:

**Nie będziesz oceniany tylko za swoją pracę** — oceniany jesteś za wyniki całego teamu.

**No surprises rule:** Manager nigdy nie powinien dowiadywać się o problemie od kogoś innego niż Ty. Jeśli coś się dzieje w teamie — informuj managera przed eskalacją.

**Regularne 1-on-1 z managerem** — minimum raz na 2 tygodnie. Agenda: co idzie dobrze, co jest problemem, co potrzebujesz.

## Pułapki Pierwszego QA Leada

**Pułapka "zrobię to sam szybciej"**
Delegowanie jest trudne gdy wiesz że sam zrobisz lepiej i szybciej. Ale nie skalujesz — team się nie uczy, Ty jesteś wąskim gardłem.

**Pułapka "jestem teraz managerem"**
QA Lead to zazwyczaj rola techniczna z elementami leadowania — nie manager. Nie przestawaj testować całkowicie.

**Pułapka "wszystkim chcę się podobać"**
Feedback jest trudny, trudne decyzje są trudne. QA Lead który unika konfrontacji to QA Lead który nie pomaga teamowi rosnąć.

**Pułapka silosu**
Twój team to nie jedyna wyspa. Buduj relacje z developerami, PM, designerami. QA Lead który jest izolowany traci wpływ na proces.
