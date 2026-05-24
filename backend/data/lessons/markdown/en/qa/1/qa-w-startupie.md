# QA w Startupie — Testowanie gdy Wszystko się Zmienia

Startup to inne środowisko niż korporacja. Inne tempo, inne priorytety, inna rola QA. Wiele zasad które działają w dużej firmie — w startupie nie ma czasu ani sensu ich stosować.

## Czym Startup Różni Się od Korporacji dla QA

| | Startup | Korporacja |
|---|---|---|
| Tempo release | Codziennie lub kilka razy w tygodniu | Co 2 tygodnie lub rzadziej |
| Dokumentacja | Minimalna lub brak | Rozbudowana |
| Procesy | Budowane od zera | Ustalone, często legacy |
| Zakres QA | Wszystko — włącznie z UX, bezpieczeństwem, wydajnością | Wąska specjalizacja |
| Automatyzacja | Często brak | Zwykle jest |
| Wpływ QA na produkt | Duży — jesteś przy decyzjach | Małe — wykonujesz zadania |

## Co Zmienia Wysokie Tempo Release

W startupie który deployuje codziennie nie możesz testować wszystkiego. Musisz być bardzo selektywny.

### Smoke Tests jako Podstawa
Przy codziennym release, smoke test (5-10 krytycznych przypadków, 15-20 minut) jest minimum które musisz wykonać każdego dnia. Nie możesz sobie pozwolić na 4-godzinną regresję przy każdym deploju.

Pytanie które musisz sobie zadać przy każdym ticket: "Jaki jest najgorszy możliwy scenariusz jeśli to wypuszczę bez pełnego przetestowania?"

### Risk-Based Testing w Praktyce
Testujesz w kolejności ważności:
1. Co zmieniało się w tym release?
2. Co jest zależne od zmienionych obszarów?
3. Co jest krytyczne dla klientów płacących?

Reszta schodzi na dalszy plan.

### Feature Flags są Twoim Przyjacielem
W startupie feature flags pozwalają wypuszczać kod bez widoczności dla użytkowników. Zyskujesz czas na testowanie na produkcji bez ryzyka.

## Brak Dokumentacji — Jak Sobie Radzić

W startupie często nie ma specyfikacji. Dostajasz Figma mockup i "zrób to działa".

### Pytaj Zanim Zaczniesz
Zanim zaczniesz testować bez specyfikacji — poświęć 15 minut na pytania:
- "Jaki jest happy path tej funkcji?"
- "Co powinno się stać gdy użytkownik X zrobi Y?"
- "Czy ta funkcja ma jakieś ograniczenia?"

5 pytań przed testowaniem > 5 godzin testowania w ciemno.

### Pisz Własną Dokumentację
Jeśli jej nie ma — twórz podczas testowania. Nawet krótki bullet list w Notion jest lepszy niż nic. Za miesiąc gdy coś się zepsuje — będziesz wdzięczny.

### Zakwestionuj Założenia
Brak specyfikacji = każde zachowanie może być "feature or bug". Twoja rola: wskazywać niejednoznaczności i zmuszać team do decyzji.

## QA jako Partner Produktowy

W startupie QA często siedzi przy decyzjach produktowych. Twoja perspektywa jest wartościowa:

- "Ta funkcja nie ma stanu błędu — co ma zobaczyć użytkownik gdy API nie odpowie?"
- "Edge case: co jeśli użytkownik ma 0 danych i zobaczy ten dashboard pierwszy raz?"
- "Testowałem na Firefox i wygląda zupełnie inaczej — czy to akceptowane?"

Te pytania chronią produkt. Nie czekaj żeby ktoś Cię zapytał — zadawaj je proaktywnie.

## Automatyzacja w Startupie — Kiedy Zacząć

Częsty błąd: "mamy za dużo do roboty żeby pisać testy automatyczne."
Skutek: po roku masz dużo więcej do roboty bo regresja zajmuje 3 dni.

Pragmatyczne podejście dla startupu:

**Faza 1 (0-6 miesięcy):** Tylko manualne, szybkie smoke tests. Produkt zmienia się zbyt szybko żeby automatyzacja była opłacalna.

**Faza 2 (6-12 miesięcy):** Automatyzacja core flows — login, rejestracja, płatność. Funkcje które nie zmienią się przez 6 miesięcy.

**Faza 3 (12+ miesięcy):** Rozbudowa automatyzacji, coverage, integracja z CI/CD.

Jeśli zaczniesz automatyzować zbyt wcześnie — będziesz przepisywać testy co 2 tygodnie bo produkt zmienia się szybciej niż testy.

## Wear Multiple Hats — QA w Startupie Robi Więcej

W małym teamie QA często robi więcej niż testowanie:
- Pisanie testowych danych do demonstracji dla klientów
- Wsparcie supportu przy reprodukcji bugów klientów
- Udział w code review (perspektywa testowalności)
- Dokumentacja dla klientów lub onboarding materials

To może być frustrujące ("to nie moja rola") albo ekscytujące ("uczę się całego produktu"). Zależy od perspektywy.

## Jak Przeżyć Startup bez Wypalenia

Startup ma tendencję do pożerania czasu. Kilka zasad:

- **Ustaw granice scope'u testowania.** "Nie testuję tego na wszystkich przeglądarkach przy każdym release — testuję na Chrome i regresję raz w tygodniu na Firefox."
- **Komunikuj co nie przetestujesz.** "Wypuszczamy to bez testu na IE11 — akceptowalnie?"
- **Nie bierz odpowiedzialności za jakość kodu.** Jakość kodu to odpowiedzialność całego teamu, nie QA.
- **Celebrate znalezione bugi.** W środowisku bez procesów, każdy poważny bug złapany przed produkcją to sukces.
