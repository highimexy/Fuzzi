# Testowanie Dostępności — WCAG i Inkluzywne Aplikacje

Dostępność (accessibility, a11y) to nie feature dla osób niepełnosprawnych — to jakość kodu. Aplikacja dostępna działa lepiej dla wszystkich: na głośniku samochodowym, w słońcu na telefonie, z jedną ręką zajętą.

## Czym Jest WCAG

Web Content Accessibility Guidelines — standardy W3C definiujące jak tworzyć dostępne strony.

**Trzy poziomy:**
- **A** — minimum, bez tego aplikacja jest niedostępna
- **AA** — standard wymagany prawnie w UE (EAA 2025), cel dla większości firm
- **AAA** — najwyższy poziom, rzadko wymagany dla całych serwisów

**Cztery zasady WCAG (POUR):**
1. **Perceivable** — informacje muszą być dostępne zmysłami (nie tylko wzrokiem)
2. **Operable** — interfejs musi działać klawiaturą i innymi urządzeniami
3. **Understandable** — treść i interfejs muszą być zrozumiałe
4. **Robust** — kod musi działać z różnymi technologiami asystującymi

## Najczęstsze Błędy Dostępności

### Brak alt tekstu na obrazkach
```html
❌ <img src="product.jpg">
✅ <img src="product.jpg" alt="Czerwone buty sportowe Nike, rozmiar 42">
✅ <img src="decorative-line.png" alt=""> <!-- dekoracyjne = pusty alt -->
```

### Kontrast kolorów
Tekst na tle musi mieć stosunek kontrastu minimum:
- **AA normal text:** 4.5:1
- **AA large text (≥18pt lub ≥14pt bold):** 3:1

Narzędzie: WebAIM Contrast Checker.

Przykład problemu: szary tekst `#999` na białym tle → kontrast 2.85:1 → FAIL.

### Brak nawigacji klawiaturą
Każdy element interaktywny musi być dostępny przez Tab:
- Przyciski, linki, pola formularza
- Modale (Tab nie może "wychodzić" poza modal)
- Dropdown menu

```html
❌ <div onclick="submit()">Wyślij</div>  <!-- nie dostępne klawiaturą -->
✅ <button onclick="submit()">Wyślij</button>  <!-- natywnie dostępny -->
```

### Pola formularza bez etykiet
```html
❌ <input type="email" placeholder="Email">
✅ <label for="email">Adres email</label>
   <input type="email" id="email" placeholder="jan@firma.pl">
```

Placeholder znika po wpisaniu — nie jest etykietą.

### Błędy formularza bez opisu
```html
❌ <span style="color:red">*</span>  <!-- screen reader nie rozumie -->
✅ <span role="alert" aria-live="polite">
     Adres email jest wymagany
   </span>
```

### Focus nie widoczny
CSS który usuwa outline: `:focus { outline: none }` niszczy dostępność klawiaturą.

## Jak Testować Dostępność

### Automatyczne Narzędzia (wykrywają ~30-40% problemów)

**axe DevTools** (Chrome/Firefox extension):
- Otwórz DevTools → zakładka axe
- Kliknij "Scan ALL of my page"
- Pokazuje błędy z linkami do dokumentacji

**Lighthouse** (wbudowany w Chrome DevTools):
- DevTools → Lighthouse → wybierz Accessibility
- Score 0-100, z wyjaśnieniami

**WAVE** (Web Accessibility Evaluation Tool):
- Wstrzykuje wizualne ikony na stronę pokazując problemy
- Dobry do demonstracji zamawiającemu

### Testowanie Klawiaturą (ręcznie)

Przepisz myszkę. Używaj tylko klawiatury:
1. `Tab` — przejdź przez wszystkie elementy interaktywne
2. `Shift+Tab` — cofnij się
3. `Enter/Space` — aktywuj przyciski i linki
4. `Escape` — zamknij modal/dropdown
5. Strzałki — nawiguj w liście, menu, selekcie

Sprawdź:
- Czy każdy element ma widoczny focus?
- Czy kolejność Tab-owania jest logiczna?
- Czy możesz wykonać każdą akcję bez myszy?
- Czy po zamknięciu modala focus wraca na element który go otworzył?

### Testowanie Screen Readerem

**NVDA** (Windows, darmowy) lub **VoiceOver** (Mac, wbudowany):

```
Tryb przeglądania NVDA:
H — następny nagłówek
B — następny przycisk  
F — następne pole formularza
L — następna lista
Tab — następny element interaktywny
```

Sprawdź czy:
- Strona ma sensowną hierarchię nagłówków (H1 → H2 → H3)
- Przyciski mają opisowe etykiety ("Wyślij formularz" nie "Kliknij tutaj")
- Obrazki mają alt tekst
- Błędy formularzy są anonsowane (aria-live)

## Checklist Dostępności dla QA

Przed każdym release sprawdź:

```
□ Wszystkie obrazki informacyjne mają alt tekst
□ Kontrast tekstu ≥ 4.5:1 (sprawdź narzędziem)
□ Cała strona jest nawigowalna klawiaturą
□ Pola formularza mają etykiety (label lub aria-label)
□ Błędy walidacji są opisane tekstem (nie tylko kolorem)
□ Linki mają opisowy tekst (nie "kliknij tutaj")
□ Strona ma logiczną hierarchię H1-H6
□ Fokus jest widoczny na elementach interaktywnych
□ Modale pułapkują fokus (Tab nie wychodzi poza modal)
□ Po zamknięciu modala fokus wraca na trigger
```

## Dostępność jako Bug Severity

| Błąd | Severity |
|------|----------|
| Brak alt na obrazie krytycznym (e.g. przycisk) | Critical |
| Formularz niedostępny klawiaturą | High |
| Kontrast poniżej AA | High |
| Błąd formularza bez opisu | High |
| Brak etykiety pola | Medium |
| Focus niewidoczny | Medium |
| Kolejność tab-owania nielogiczna | Low |
