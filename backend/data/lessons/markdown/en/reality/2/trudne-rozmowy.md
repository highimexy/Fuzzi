# Trudne Rozmowy — Konflikty które Definiują QA

Większość kursów QA uczy technik testowania. Nikt nie uczy jak rozmawiać gdy developer mówi "to nie bug" a Ty wiesz że jest, lub gdy PM naciska na release którego nie możesz podpisać. To są umiejętności które decydują o Twojej karierze.

## Scenariusz 1: Developer Mówi "To Nie Bug, To Feature"

Zgłaszasz buga. Developer zamknął ticket jako "As Designed" lub "Not a Bug". Ale nie masz dokumentu który to potwierdza.

**Zła reakcja:**
> "Masz rację, przepraszam za zamieszanie."

**Zła reakcja:**
> "To jest ewidentnie bug i eskaluję do managera."

**Dobra reakcja:**
> "Rozumiem że Twoim zdaniem to jest zamierzone zachowanie. Chciałbym zrozumieć — czy jest dokumentacja lub decyzja designowa która to potwierdza? Jeśli tak, chętnie dodaję to do known behaviors żeby nie było nieporozumień w przyszłości. Jeśli nie ma — proponuję żebyśmy razem zapytali PO o klaryfikację."

**Dlaczego działa:** nie konfrontujesz bezpośrednio, ale wymagasz podstawy. Albo masz dokumentację (wtedy zamykasz i dokumentujesz) albo eskalujesz do PO razem — co jest neutralne.

## Scenariusz 2: PM Naciska na Release Mimo Otwartych Bugów

"Musimy releasować dzisiaj. Czy możemy pominąć te bugi na teraz?"

**Zła reakcja:**
> "OK" (i testujesz pobieżnie)

**Zła reakcja:**
> "Nie — nie podpiszę release z tymi bugami."

**Dobra reakcja:**
> "Mogę to zrobić, ale chcę żebyś wiedział co to oznacza. Bug #4521 i #4525 dotyczą checkout flow — ryzyko że użytkownicy nie będą mogli sfinalizować zamówienia przy określonych konfiguracjach. Czy mogę wysłać Ci email podsumowujący te ryzyka zanim zdecydujesz? Chcę mieć pewność że decyzja jest świadoma."

**Dlaczego działa:** nie blokujesz decyzji PM-a (to jego prerogatywa), ale dokumentujesz ryzyko i sprawiasz że jest to świadoma decyzja, nie przypadkowe przeoczenie.

## Scenariusz 3: Developer Ignoruje Twoje Komentarze w Code Review

Zostawiasz komentarze w PR. Developer merguje bez odniesienia się do Twoich uwag.

**Zła reakcja:**
> Milczysz — "przecież napisałem komentarz, to teraz jego problem"

**Zła reakcja:**
> Eskalujesz do tech leada przed rozmową z developerem

**Dobra reakcja:**
Napisz wiadomość prywatną do developera (nie publiczny komentarz):

> "Hej, widziałem że PR został zmergowany. Mam pytanie do dwóch moich komentarzy dotyczących walidacji — czy miałeś czas na nie zerknąć? Chcę zrozumieć czy moje obawy są nieaktualne czy były pominięte przypadkowo."

**Dlaczego działa:** pytasz a nie oskarżasz. Developer może mieć dobry powód (inna implementacja zabezpieczenia) lub pominął przypadkowo. Dowiesz się bez konfrontacji.

## Scenariusz 4: Kolega QA Robi Coś Źle

Widzisz że nowy QA w zespole zgłasza bugi bez kroków reprodukcji. Inni developerzy narzekają.

**Zła reakcja:**
> Idziesz do managera i raportujesz problem.

**Dobra reakcja:**
> Rozmawiasz prywatnie z kolegą: "Hej, zauważyłem że kilka Twoich ticketów nie ma kroków repro i słyszałem że developerzy mają z tym problem. Mogę Ci pokazać jak ja to robię? Mam template który może ułatwić."

**Dlaczego działa:** peer feedback jest bardziej efektywny niż feedback przez managera. Oferujesz pomoc, nie krytykujesz.

## Techniki Ogólne dla Trudnych Rozmów

### Nonviolent Communication (NVC)

Format: **Obserwacja → Uczucie → Potrzeba → Prośba**

> "Widzę że ten PR był zmergowany bez review QA [obserwacja]. Martwię się że możemy mieć bugi których nie widzimy [uczucie]. Potrzebuję mieć możliwość przejrzenia PR przed mergem [potrzeba]. Czy możemy umówić się że QA musi zatwierdzić PR przed merge w przyszłości? [prośba]"

### Timing

Trudne rozmowy prowadź:
- Na osobności (nie publicznie)
- Niemal zaraz po incydencie (nie tydzień później)
- Gdy jesteś spokojny (nie bezpośrednio po frustracji)

### Dokumentacja

Każda ważna rozmowa powinna kończyć się podsumowaniem emailem:
> "Podsumowując naszą rozmowę: uzgodniliśmy że X. Czy zgadzasz się z tym podsumowaniem?"

Email chroni Cię gdy ktoś zapomni co było ustalone.
