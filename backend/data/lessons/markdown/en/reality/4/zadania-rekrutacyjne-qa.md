# Zadania Rekrutacyjne QA — Jak Przejść i Jak Oceniać

Coraz więcej firm wymaga zadania technicznego jako część procesu rekrutacyjnego. Dla QA to może być: test plan, bug hunt, napisanie testów automatycznych, lub analiza dokumentacji. Wiedza jak do tego podejść decyduje o wyniku.

## Typy Zadań Rekrutacyjnych w QA

### 1. Bug Hunt na Aplikacji Demo
Najczęstszy typ. Dostajesz link do aplikacji lub opis funkcjonalności i masz znaleźć bugi.

**Strategia:**
- Nie panikuj — to nie pułapka. Firma chce zobaczyć jak myślisz, nie ile bugów znajdziesz.
- Zacznij od eksploracji (10-15 min) zanim napiszesz pierwszy raport
- Dokumentuj KAŻDEGO buga formalnie (kroki, oczekiwane, rzeczywiste, severity)
- Priorytetyzuj — opisz dlaczego dane bugi są ważniejsze
- Wspomnij co NIE jest bugiem ale warte uwagi (UX improvements, missing features)

**Czego NIE robić:**
- Nie pisz 30 trywialnych bugów zamiast 5 prawdziwych
- Nie pomijaj raportu bo bug "wydaje się oczywisty"
- Nie testuj tylko happy path — firma chce zobaczyć myślenie edge-case

### 2. Napisz Przypadki Testowe dla Feature'u

Dostajesz specyfikację lub opis funkcji. Masz napisać test cases.

**Strategia:**
- Zacznij od pytań — napisz listę niejednoznaczności w specyfikacji (to pokazuje analizę)
- Stosuj boundary value analysis i equivalence partitioning
- Uwzględnij: positive, negative, edge cases, bezpieczeństwo
- Użyj struktury: tytuł / precondition / kroki / oczekiwany wynik / priorytet

### 3. Zadanie Automatyzacyjne (Playwright/Selenium)

Dostajesz aplikację demo i masz napisać testy automatyczne.

**Strategia:**
- Przeczytaj spec najpierw — co ma być przetestowane
- Użyj Page Object Model nawet dla prostych zadań (pokazuje znajomość wzorców)
- Dodaj README z instrukcją uruchomienia
- Zadbaj o czytelność kodu (sensowne nazwy, komentarze tam gdzie nieintuicyjne)
- Zadbaj o selektory (data-testid > CSS class)

### 4. Test Plan dla Projektu

Rzadszy, bardziej strategiczny. Firma chce zobaczyć jak myślisz o jakości na poziomie systemu.

## Jak Oceniają Rekruterzy?

Pytam seniorów QA co sprawdzają w zadaniach — oto wspólne kryteria:

**Myślenie krytyczne:**
Czy kandydat zadał pytania o niejasności? Czy zauważył bugi które są nieintuicyjne?

**Komunikacja:**
Czy raporty bugów są zrozumiałe dla osoby która nie testowała? Czy severity jest uzasadnione?

**Priorytetyzacja:**
Czy kandydat rozumie co jest ważne biznesowo? Czy wszystkie bugi mają P1?

**Kompletność:**
Czy happy path jest przetestowany? Czy są negatywne przypadki?

## Praktyczne Porady

### Zanim zaczniesz zadanie:
- Poproś o klaryfikację jeśli coś jest niejasne (pytania to plus!)
- Zapytaj o deadline jeśli nie jest podany
- Zapytaj o format oczekiwany (Google Doc? Jira? Markdown?)

### Podczas zadania:
- Rób notatki w trakcie eksploracji
- Czas > perfekcja — lepiej 5 dobrych bugów niż 10 niekompletnych
- Zachowaj dostęp do aplikacji przez kilka dni jeśli możliwe

### Po zadaniu:
- Wyślij PRZED deadline'em
- Dołącz krótkie podsumowanie: co testowałeś, co pominąłeś i dlaczego
- Jeśli zadanie zajęło Ci 3x więcej niż sugerowano — wspomnij o tym

## Czerwone Flagi po Stronie Firmy

Zadania rekrutacyjne QA mogą być nadużywane:

**Żąda za dużo:**
"Napisz pełny test plan dla naszej aplikacji e-commerce" = projekt na 20h pod przykrywką "zadania rekrutacyjnego". Limit: ~4h jest standardem.

**Bez feedbacku:**
Firma nie daje żadnego feedbacku po odrzuceniu mimo wykonanego zadania. To brak szacunku dla Twojego czasu.

**Wykorzystuje produkcję:**
Zadanie jest w rzeczywistości testem ich prawdziwego systemu który nie jest przetestowany. Trudno to zweryfikować, ale jest to nieetyczne.

Twoja reakcja: za zadanie > 4h poproś o wynagrodzenie lub odrzuć.
