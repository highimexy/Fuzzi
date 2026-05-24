# Praca z Developerami — Konflikt czy Partnerstwo?

QA i developerzy mają wspólny cel: dostarczyć działający produkt. Ale ich perspektywy często się zderzają. Zrozumienie tych różnic to klucz do efektywnej pracy.

## Klasyczne Napięcia

### "To nie bug, to feature"
Developer mówi to gdy nie chce naprawiać czegoś, co według niego jest zgodne ze specyfikacją.

**Co robić:** Wróć do wymagań lub user stories. Jeśli wymagania milczą — eskaluj do product ownera. Twoja rola to nie "walczyć z devem" ale "upewnić się, że użytkownik dostanie to czego potrzebuje."

### "Nie mogę odtworzyć"
Klasyczna odpowiedź na niejasny bug report.

**Co robić:** Napisz lepszy bug report. Dodaj screencast, logi konsoli, dokładne środowisko. Nagrane 30 sekund warte więcej niż godzina korespondencji.

### "To jest poza scope tego sprintu"
**Co robić:** Oceń severity obiektywnie. Czy to blokuje użytkowników? Czy grozi bezpieczeństwem? Eskaluj w oparciu o fakty, nie odczucia.

## Jak Budować Dobre Relacje z Devami

1. **Komunikuj się wcześnie** — zgłoś problem zanim developer skończy sprint, nie w ostatni dzień
2. **Zadawaj pytania, nie oskarżaj** — "Czy to zamierzone zachowanie?" zamiast "To zepsułeś"
3. **Daj kontekst** — logi, środowisko, kroki — nie tylko "nie działa"
4. **Rozumiej ich ograniczenia** — deadline, tech debt, priorytety PM
5. **Chwal dobrą pracę** — pozytywny feedback działa w obie strony

## Code Review — Rola QA

Coraz więcej firm włącza QA do code review. Nie chodzi o ocenę kodu technicznie — chodzi o:

- Czy ta zmiana może zepsuć coś innego? (regresja)
- Czy są pokryte edge case'y?
- Czy jest obsługa błędów?
- Czy ta zmiana wymaga nowych test case'ów?

## Złota Zasada

QA nie jest policją developmentu. QA jest ostatnią linią obrony dla użytkownika. Różnica w postawie — ogromna.
