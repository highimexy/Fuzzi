# Testowanie Wydajności UI — Core Web Vitals i Percepcja Szybkości

Aplikacja może być "szybka" technicznie i "wolna" dla użytkownika. QA który rozumie wydajność UI potrafi znaleźć problemy których żaden monitor serwera nie wykryje.

## Dlaczego Wydajność UI Należy do QA

Wydajność frontendu bezpośrednio wpływa na:
- Konwersję (każde 100ms opóźnienia = -1% sprzedaży)
- SEO (Google rankuje wolne strony niżej)
- Doświadczenie użytkownika (szczególnie na mobile i słabym połączeniu)

Developerzy optymalizują kod. QA mierzy efekt z perspektywy użytkownika.

## Core Web Vitals — Google's Metrics

Google definiuje trzy kluczowe metryki:

### LCP — Largest Contentful Paint
Kiedy największy element widoczny w viewporcie jest załadowany?

```
Dobry: < 2.5 sekundy
Wymaga poprawy: 2.5 – 4 sekundy
Zły: > 4 sekundy
```

LCP to zazwyczaj: hero image, nagłówek h1, duże zdjęcie.

**Gdzie mierzyć:** Chrome DevTools → Performance tab → LCP marker.

### FID / INP — Input Delay / Interaction to Next Paint
Jak długo przeglądarka reaguje na interakcję użytkownika?

```
Dobry INP: < 200ms
Wymaga poprawy: 200 – 500ms
Zły: > 500ms
```

Przykład: użytkownik klika przycisk → ile czasu mija do wizualnej reakcji?

### CLS — Cumulative Layout Shift
Czy elementy strony "skaczą" podczas ładowania?

```
Dobry: < 0.1
Wymaga poprawy: 0.1 – 0.25
Zły: > 0.25
```

CLS to częsty problem gdy: obrazy bez wymiarów, reklamy które się ładują, czcionki które zastępują systemowe.

## Narzędzia Pomiaru

### Chrome DevTools — Lighthouse
```
DevTools → Lighthouse → Performance → Analyze page load
```

Daje wynik 0-100 i listę konkretnych problemów z priorytetyzacją.

**Zawsze testuj:**
- W trybie "Mobile" (symuluje wolniejsze CPU i sieć)
- Z "Throttled" siecią (Fast 3G lub Slow 4G)
- W Incognito (bez rozszerzeń które mogą wpływać)

### Chrome DevTools — Performance Tab

Nagraj ładowanie strony:
1. DevTools → Performance → kliknij record
2. Odśwież stronę (Ctrl+Shift+R)
3. Zatrzymaj nagranie

Zobaczysz szczegółowy waterfall: co się ładuje kiedy, gdzie są bottlenecki.

### Web Vitals Extension
Chrome extension która pokazuje LCP, FID, CLS w czasie rzeczywistym dla każdej strony.

### PageSpeed Insights
Google's online tool — mierzy zarówno "lab data" (symulacja) jak i "field data" (prawdziwi użytkownicy).

## Co Testować

### Ładowanie Strony

```
Scenariusze do przetestowania:
□ Pierwsze ładowanie (empty cache, no-cache)
□ Drugie ładowanie (z cache — powinno być szybsze)
□ Ładowanie na Fast 3G (symulacja mobile)
□ Ładowanie na Slow 4G
□ Ładowanie na wolnym CPU (6x CPU throttle w DevTools)
```

### Layout Shift
Otwórz stronę i obserwuj pierwsze 3-5 sekund:
- Czy elementy zmieniają pozycję po załadowaniu?
- Czy obrazy zmieniają rozmiar gdy się załadują?
- Czy font się zmienia (FOUT - Flash of Unstyled Text)?

### Long Tasks
W Performance tab szukaj czerwonych segmentów na osi — to "Long Tasks" (> 50ms) które blokują UI i sprawiają że kliknięcia są opóźnione.

### Duże Zasoby

W DevTools → Network:
- Sortuj po rozmiarze — co jest największe?
- Czy obrazy są zoptymalizowane? (JPEG/WebP vs PNG dla zdjęć)
- Czy są zasoby > 1MB? Dlaczego?
- Czy nieużywane zasoby są ładowane?

```
Czerwone flagi:
🔴 Niezoptymalizowane obrazy > 500KB
🔴 JavaScript bundle > 1MB (niezminifikowany)
🔴 Google Fonts ładowane bez preconnect
🔴 Nieużywane CSS które jest ładowane przy każdej stronie
🔴 Brak lazy loading dla obrazów poniżej fold
```

## Metryki do Raportowania

Po każdym teście dokumentuj:

```
Wydajność UI — Strona produktu
Data: 2024-03-15 | URL: /products/123 | Sieć: Fast 3G | Device: Mobile

Lighthouse Score: 67/100 (cel: > 80)
LCP: 4.2s ← ZŁY (cel: < 2.5s) [Bug: hero image 1.2MB niezoptymalizowany]
CLS: 0.05 ← OK
INP: 180ms ← OK

Największy bottleneck: hero image — 1.2MB PNG zamiast WebP
Rekomendacja: konwersja do WebP + lazy loading = szacunkowa poprawa LCP o ~2s
```

## Bugi Wydajności — Jak Zgłaszać

```
Tytuł: [PERF] LCP strony produktu = 4.2s (cel: < 2.5s) — hero image niezoptymalizowany

Środowisko: staging, Chrome 124, Fast 3G simulation

Metryki:
- LCP: 4.2s (zły, cel < 2.5s)
- Hero image: 1.2MB PNG
- Lighthouse Performance Score: 67/100

Kroki reprodukcji:
1. Otwórz DevTools → Lighthouse
2. Ustaw Mobile, Fast 3G, Clear Storage
3. Analyze /products/123
4. Sprawdź LCP w wynikach

Oczekiwane: LCP < 2.5s, Lighthouse ≥ 80
Aktualne: LCP 4.2s, Lighthouse 67

Propozycja naprawki: konwersja hero image do WebP + wymiary width/height na elemencie img
```
