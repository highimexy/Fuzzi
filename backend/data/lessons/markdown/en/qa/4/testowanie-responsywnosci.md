# Testowanie Responsywności i Dostępności

Twoja aplikacja wygląda idealnie na Twoim MacBooku z 27" monitorem i szybkim WiFi. Połowa Twoich użytkowników używa jej na starym Androidzie przez LTE. Testowanie responsywności to nie kosmetyka — to dostęp do produktu.

## Responsywność — Więcej niż Breakpointy

Responsywność to nie tylko "czy menu się zwija na mobile". To:

### Wymiary i orientacja
- Portrait vs Landscape — czy layout nie pęka po obróceniu ekranu?
- Małe ekrany (320px — iPhone SE) — czy tekst się nie nachodzi?
- Duże ekrany (1440px+) — czy treść nie pływa w połowie ekranu?

### Gęstość pikseli (DPR)
Retina / HDPI ekrany mają DPR > 1. Obrazy które wyglądają ostro na FHD, wyglądają rozmycie na Retina.

Test: DevTools → Sensors → zmień Device Pixel Ratio na 3.

### Dotyk vs kursor
- Czy przyciski mają minimalny rozmiar 44×44px (Apple HIG)?
- Czy hover state nie jest jedynym wskaźnikiem działania?
- Czy drag & drop działa palcem?

## Narzędzia Testowania Responsywności

### Chrome DevTools Device Mode
Nie zastępuje prawdziwego urządzenia, ale pozwala szybko sprawdzić:
- Responsive Mode (dowolne wymiary)
- Emulacja konkretnych urządzeń (iPhone 14, Pixel 7)
- Throttling sieci (3G, offline)
- Touch simulation

**Ważne:** DevTools emuluje viewport, nie rendering engine. Safari na iOS renderuje inaczej niż Chrome na iOS.

### BrowserStack / LambdaTest
Prawdziwe urządzenia w chmurze. Droższe, ale obowiązkowe przed releasem dla produktów mobilnych.

### Rzeczywiste urządzenia
Zawsze miej dostęp do przynajmniej:
- iPhone z Safari (iOS 16+)
- Android mid-range z Chrome (Samsung Galaxy A series)

## Dostępność (Accessibility / a11y)

W Polsce wymóg dostępności dla sektora publicznego to prawo (WCAG 2.1 AA). Dla komercji — to dobra praktyka i większa baza użytkowników.

### Co testuje QA w a11y?

**1. Nawigacja klawiaturą**
- Tab — czy focus przechodzi przez wszystkie interaktywne elementy?
- Enter/Space — czy przyciski i linki działają?
- Escape — czy modalne okna się zamykają?
- Czy focus jest widoczny (outline)?

**2. Screen reader (NVDA/VoiceOver)**
- Czy obrazy mają `alt` tekst?
- Czy formularze mają `label` dla każdego `input`?
- Czy przyciski mają sensowne nazwy (`aria-label`)?
- Czy kolejność czytania ma sens?

**3. Kontrast kolorów**
- Minimalny kontrast tekst/tło: 4.5:1 (AA) lub 7:1 (AAA)
- Narzędzie: Colour Contrast Analyser, Lighthouse

**4. Automatyczne testy a11y**
```bash
npx axe-cli https://example.com
```

Axe wykrywa ~57% problemów a11y automatycznie. Resztę musisz sprawdzić ręcznie.

## Checklist Przed Releasem

```
□ Sprawdziłem na 320px (iPhone SE)
□ Sprawdziłem w orientacji landscape
□ Sprawdziłem na 3G throttling
□ Nawigacja klawiaturą działa
□ Obrazy mają alt text
□ Formularze mają label
□ Kontrast kolorów ≥ 4.5:1
□ Testowałem na prawdziwym urządzeniu mobilnym
```
