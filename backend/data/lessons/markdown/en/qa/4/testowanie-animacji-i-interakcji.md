# Testowanie Animacji i Mikro-Interakcji

Animacje to nie dekoracja — to komunikacja. Źle zaimplementowana animacja może sprawić że user nie wie czy kliknął, czy form się submituje, czy coś się ładuje.

## Dlaczego Animacje Są Trudne w Testowaniu

**Problem 1: Timing**
Animacja trwa 300ms. Twój test sprawdza stan po 100ms — element jest w połowie animacji. Test fails albo weryfikuje nieprawidłowy stan.

**Problem 2: Wizualność**
"Animacja wygląda płynnie" — jak to przetestować automatycznie?

**Problem 3: Stan przejściowy**
Podczas animacji element może być interaktywny lub nie — zachowanie zależy od implementacji.

## Kategorie Animacji do Testowania

### 1. Loading States
Najważniejsze z perspektywy UX.

```
Scenariusze:
- Skeleton screen pojawia się natychmiast (< 100ms) po request
- Skeleton nie "migocze" przy fast connection (< 200ms response)
- Loading state nie blokuje interakcji użytkownika gdzie nie powinien
- Po załadowaniu przejście jest płynne (brak layout shift)
```

**Layout Cumulative Shift (CLS)**:
Jeśli element "skacze" podczas ładowania — to bug UX i bug Core Web Vital.

### 2. Feedback Animacje (Stan potwierdzenia)

```
Button submit:
- Stan: enabled → loading (spinner) → success (check) → reset
- Czy button jest disabled podczas loading?
- Czy dwuklik nie submituje dwukrotnie?
- Co jeśli request trwa > 10 sekund?
- Co jeśli request fails? Animacja błędu?
```

### 3. Animacje Przejść (Page Transitions)

```
- Czy poprzednia strona jest unmounted przed nową?
- Czy back button działa podczas animacji?
- Czy link można kliknąć wielokrotnie podczas animacji?
- Czy animacja jest przerywana gdy user naciśnie back?
```

### 4. Drag and Drop

```
Scenariusze:
- Drag i drop na poprawne miejsce → item przeniesiony
- Drag i drop poza obszar → item wraca na miejsce (z animacją?)
- Drag i upuszczenie w połowie ekranu
- Touch drag (mobile)
- Keyboard drag (dostępność: Space + strzałki)
- Drag wielu elementów jednocześnie
```

## Testowanie Automatyczne Animacji

### Playwright — obsługa animacji

```typescript
// Opcja 1: Disable animations w testach (szybkie testy)
await page.emulateMedia({ reducedMotion: 'reduce' });

// Opcja 2: Czekaj na koniec animacji
await page.locator('.modal').waitFor({ state: 'visible' });
// Poczekaj aż animacja się skończy
await expect(page.locator('.modal')).toHaveCSS('opacity', '1');

// Opcja 3: Sprawdź stan po zakończeniu animacji
await page.locator('#submit-btn').click();
await expect(page.locator('.success-message')).toBeVisible({ timeout: 3000 });
```

### Visual Regression Testing

Snapshoty to najlepsza metoda weryfikacji animacji wizualnie:

```typescript
// Playwright z Chromatic lub Percy
await page.locator('.card').hover();
await expect(page).toHaveScreenshot('card-hover-state.png');

// Sprawdzanie konkretnych właściwości CSS
const button = page.locator('#cta-button');
await button.hover();
const transform = await button.evaluate(el => 
  getComputedStyle(el).transform
);
expect(transform).not.toBe('none'); // Sprawdź że hover animation działa
```

## Prefers-Reduced-Motion

Accessibility requirement: użytkownicy mogą wyłączyć animacje w systemie operacyjnym (epilepsja, vestibular disorders).

```css
/* CSS powinna respektować ustawienie systemu */
@media (prefers-reduced-motion: reduce) {
  .animated-element {
    animation: none;
    transition: none;
  }
}
```

**Co testować:**
```
1. Włącz "Reduce Motion" w systemie (macOS: System Preferences → Accessibility)
2. Sprawdź czy animacje są wyłączone/uproszczone
3. Czy strona nadal jest funkcjonalna bez animacji?
4. Czy treść jest dostępna gdy animacja nie działa?
```

## Performance Animacji

Animacje które powodują "janky" (niedoskonałe) scrollowanie lub odtwarzanie:

**Złe właściwości CSS (powodują layout reflow):**
```css
/* Te właściwości są kosztowne do animowania */
width, height, top, left, margin, padding
```

**Dobre właściwości CSS (tylko compositing — szybkie):**
```css
/* Te właściwości są optymalne do animowania */
transform: translate(), scale(), rotate()
opacity
```

**Jak testować:**
1. Chrome DevTools → Performance tab
2. Nagraj animację
3. Szukaj "Layout" i "Paint" events (czerwone = problem)
4. Target: animacje powinny być tylko "Composite" operations

## Testowanie na Urządzeniach z Niską Wydajnością

Animacja która jest płynna na MacBook Pro 16" może być laggy na tańszym telefonie.

```
- Testuj na urządzeniu z 4× CPU throttling (Chrome DevTools)
- Sprawdź frame rate: cel to 60fps (16.7ms na frame)
- Animacje poniżej 30fps są zauważalne i muszą być uproszczone
```

## Checklista Testowania Animacji

```
□ Loading states pojawiają się natychmiast
□ Brak layout shift (CLS) podczas ładowania treści
□ Buttons są disabled podczas loading
□ Dwuklik nie wywołuje double-submit
□ Animacje są wyłączone przy prefers-reduced-motion
□ Strona działa bez animacji (progressive enhancement)
□ Animacje działają na urządzeniach mobilnych (touch)
□ Keyboard navigation nie jest blokowana przez animacje
□ Frame rate ≥ 30fps na wolnych urządzeniach
□ Back button działa podczas page transitions
```
