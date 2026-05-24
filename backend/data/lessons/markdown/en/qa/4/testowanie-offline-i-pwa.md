# Testowanie Offline i PWA — Gdy Internet Znika

Progressive Web App (PWA) to aplikacja webowa która zachowuje się jak natywna — może działać offline, wysyłać powiadomienia push, być zainstalowana na ekranie głównym. Testowanie offline jest jednym z najtrudniejszych aspektów QA frontendu bo wymaga symulacji warunków których developerzy często nie testują.

## Czym Jest PWA i Dlaczego Testowanie Jest Ważne

PWA używa Service Worker — skryptu który działa w tle, może przechwytywać requesty sieciowe i serwować dane z cache gdy offline.

**Dlaczego użytkownicy tracą internet:**
- Metro, tunel, winda
- Słaby zasięg (edge, H+)
- Przełączanie między WiFi a danymi mobilnymi
- Plane mode przez przypadek

Aplikacja która rozbija się przy braku internetu zamiast pokazać sensowny komunikat — to bug.

## Symulacja Warunków Sieciowych w DevTools

### Offline Mode
Chrome DevTools → Network tab → Throttling dropdown → "Offline"

Lub: DevTools → Application → Service Workers → checkbox "Offline"

### Wolne Połączenie
- **Slow 4G** — 4 Mbps, 20ms latency (typowy "słaby" mobile)
- **Fast 3G** — 1.5 Mbps, 40ms latency
- **Slow 3G** — 400 Kbps, 400ms latency
- **Custom** — własne parametry (np. symulacja EDGE: 250 Kbps, 1000ms)

### Utrata Połączenia w Trakcie Operacji
1. Rozpocznij operację (np. upload pliku)
2. Przejdź do Network → Offline w trakcie
3. Obserwuj co się dzieje

## Co Testować w Trybie Offline

### Podstawowa Nawigacja
Które strony działają offline?
```
□ Strona główna — czy pokazuje cached content?
□ Strony statyczne (About, FAQ) — powinny działać offline
□ Strony dynamiczne (koszyk, profil) — co pokazuje bez internetu?
□ Brak strony 404 (jeśli jesteś offline i trafiasz na nieznany URL)
```

### Formularze i Dane
```
□ Co się dzieje gdy wysyłasz formularz offline?
   Dobry UX: "Brak internetu. Formularz zostanie wysłany gdy połączenie wróci."
   Zły UX: biały ekran / błąd techniczny bez kontekstu

□ Czy dane z formularza są zachowane gdy internet wróci?
□ Czy offline form submission ma retry mechanism?
```

### Service Worker — Cache
```
□ Jakie zasoby są w cache? (DevTools → Application → Cache Storage)
□ Czy cache jest odświeżany po nowym deploymencie aplikacji?
□ Czy stara wersja cache nie blokuje nowej wersji? (Cache versioning)
```

### Synchronizacja po Powrocie Internetu
```
Scenariusz:
1. Tryb offline
2. Użytkownik robi coś (dodaje do listy, pisze komentarz)
3. Internet wraca
4. Sprawdź: czy akcja offline jest zsynchronizowana z serwerem?
```

### Push Notifications
```
□ Powiadomienia działają gdy aplikacja jest zamknięta?
□ Kliknięcie powiadomienia otwiera odpowiedni ekran?
□ Powiadomienia przychodzą gdy offline i wyświetlają się gdy internet wróci?
```

## Testowanie Instalacji PWA

PWA można zainstalować na ekranie głównym:
- Chrome: "Add to Home Screen" prompt lub ikona w pasku adresu
- iOS Safari: Share → "Add to Home Screen"

```
Checklist instalacji PWA:
□ manifest.json zawiera wszystkie wymagane pola (name, icons, start_url, display)
□ Ikony są dostępne w różnych rozdzielczościach (192x192, 512x512)
□ Kolor motywu (theme_color) jest poprawny
□ Splash screen działa na iOS i Android
□ Zainstalowana aplikacja uruchamia się bez paska przeglądarki
□ Deep linking (URL w powiadomieniu) otwiera właściwy ekran
```

## Typowe Bugs Offline

### "White Screen of Death" przy Braku Internetu
Aplikacja pokazuje pusty ekran zamiast cached content lub komunikatu.
Severity: High — użytkownik myśli że aplikacja jest zepsuta.

### Nieskończony Spinner
Aplikacja "ładuje się" bez końca gdy offline. Brak timeout.
Severity: High — użytkownik nie wie co się dzieje.

### Dane Przepadają po Powrocie Internetu
Użytkownik wypełnił formularz offline. Internet wrócił. Formularz jest czysty — dane zniknęły.
Severity: Critical — utrata danych.

### Cache Nie Odświeżony po Deploymencie
Użytkownik widzi starą wersję aplikacji przez X godzin po deploymencie.
Severity: Medium/High — zależy od co się zmieniło.

### Duplikaty po Sync
Użytkownik dodał element offline. Internet wrócił. Element się pojawia dwa razy.
Severity: High — race condition w synchronizacji.

## Narzędzia do Testowania PWA

- **Chrome DevTools Application tab** — Service Workers, Cache, Manifest
- **Lighthouse** — Audit PWA (sprawdza manifest, service worker, HTTPS)
- **WebPageTest** — testowanie na prawdziwych urządzeniach z real network conditions
- **BrowserStack** — testowanie na prawdziwym iOS/Android z różnymi sieciami
