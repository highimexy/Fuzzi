# Cross-Browser i Responsywność — Testowanie Wieloplatformowe

Twoja aplikacja musi działać na różnych przeglądarkach, rozdzielczościach i urządzeniach. To jeden z obszarów gdzie QA regularnie łapie bugi których developer nie widzi na swoim MacBooku z Chrome.

## Najpopularniejsze Silniki Przeglądarek

| Silnik | Przeglądarki | Udział rynku |
|--------|-------------|-------------|
| Blink | Chrome, Edge, Opera | ~65% |
| WebKit | Safari (iOS, macOS) | ~20% |
| Gecko | Firefox | ~4% |

Testowanie na Chrome pokrywa 65% użytkowników. Ale Safari ma swoje specyfiki — szczególnie na iOS, gdzie **każda** przeglądarka musi używać WebKit (polityka Apple).

## Typowe Różnice Między Przeglądarkami

- **CSS Grid i Flexbox** — subtelne różnice w renderingu
- **Input types** — `type="date"` wygląda inaczej w każdej przeglądarce
- **Scrollbars** — różne domyślne style
- **Font rendering** — antyaliasing różni się między OS
- **JavaScript API** — niektóre API nie są wspierane w starszych przeglądarkach
- **Video/Audio codecs** — Safari ma ograniczenia dla niektórych formatów

## Checklisty Responsywności

Testuj na tych breakpointach:
- **Mobile S:** 320px
- **Mobile M:** 375px (iPhone)
- **Mobile L:** 425px
- **Tablet:** 768px
- **Laptop:** 1024px
- **Desktop:** 1440px+

Co sprawdzać na każdym breakpoincie:
- [ ] Tekst czytelny (nie za mały, nie obcięty)
- [ ] Przyciski klikalne (min. 44×44px — Apple HIG)
- [ ] Formularze używalne (nie przesłonięte przez klawiaturę)
- [ ] Nawigacja dostępna
- [ ] Obrazy nie wychodzą poza viewport

## Narzędzia

- **BrowserStack / LambdaTest** — rzeczywiste urządzenia w chmurze
- **Chrome DevTools Device Mode** — emulacja (szybka, ale niepełna)
- **Responsively App** — podgląd wielu breakpointów jednocześnie

> Emulator ≠ prawdziwe urządzenie. BrowserStack warto użyć przynajmniej dla iOS Safari przed każdym releasem.
