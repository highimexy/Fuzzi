# Nagłówki Bezpieczeństwa — Niewidoczna Ochrona Aplikacji

Nagłówki HTTP to meta-informacje które przeglądarka i serwer wymieniają przy każdym request. Właściwie skonfigurowane nagłówki bezpieczeństwa blokują całe klasy ataków bez zmiany jednej linii kodu aplikacji.

## Jak Sprawdzić Nagłówki?

```bash
# curl — szybko w terminalu
curl -I https://example.com

# Alternatywnie w DevTools:
# Network → kliknij dowolny request → Headers
```

Lub użyj: **securityheaders.com** — daje ocenę A-F za nagłówki bezpieczeństwa.

## Kluczowe Nagłówki Bezpieczeństwa

### Content-Security-Policy (CSP)
**Chroni przed:** XSS (Cross-Site Scripting)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-abc123'; img-src *
```

CSP mówi przeglądarce: "załaduj skrypty tylko z naszej domeny". Nawet jeśli atakujący wstrzyknie `<script>` — przeglądarka go nie wykona.

**Test QA:** Czy CSP header istnieje? Czy nie zawiera `unsafe-inline` lub `unsafe-eval` (które anulują ochronę)?

### Strict-Transport-Security (HSTS)
**Chroni przed:** Man-in-the-Middle, downgrade attacks

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Mówi przeglądarce: "ta strona ZAWSZE używa HTTPS, nigdy HTTP". Po pierwszej wizycie przeglądarka automatycznie konwertuje HTTP → HTTPS.

**Test QA:** Czy HSTS jest ustawiony? Czy max-age ≥ 1 rok (31536000)?

### X-Frame-Options
**Chroni przed:** Clickjacking

```http
X-Frame-Options: DENY
```

Zabrania osadzania strony w `<iframe>`. Clickjacking: atakujący nakłada przezroczystą stronę na inną i przechwytuje kliknięcia.

**Test QA:** `DENY` (najsilniejszy) lub `SAMEORIGIN` (pozwala własne iframes).

### X-Content-Type-Options
**Chroni przed:** MIME type sniffing

```http
X-Content-Type-Options: nosniff
```

Wymusza respektowanie `Content-Type` przez przeglądarkę. Bez tego przeglądarka może wykonać plik `.txt` jako JavaScript.

**Test QA:** Czy ten nagłówek istnieje? Wartość musi być `nosniff`.

### Referrer-Policy
**Chroni przed:** wyciekiem informacji przez Referrer

```http
Referrer-Policy: strict-origin-when-cross-origin
```

Kontroluje ile informacji o poprzedniej stronie jest wysyłane z każdym requestem. Ważne gdy URL zawiera wrażliwe dane (tokeny, ID sesji).

### Permissions-Policy (Feature Policy)
**Chroni przed:** nieautoryzowanym użyciem API przeglądarki

```http
Permissions-Policy: geolocation=(), microphone=(), camera=()
```

Wyłącza dostęp do wrażliwych API przeglądarki. `()` = nikt nie może tego używać, ani aplikacja, ani wstrzyknięte skrypty.

## Ekspozycja Wersji Technologii

Czerwone flagi w nagłówkach:
```http
Server: Apache/2.4.51
X-Powered-By: PHP/8.0.12
X-AspNet-Version: 4.0.30319
```

Te nagłówki ujawniają wersje technologii atakującym. Sprawdź czy są ukryte na produkcji.

## Cookies i Bezpieczeństwo

```http
Set-Cookie: session=abc123; 
  HttpOnly;          ← JavaScript nie może czytać (ochrona przed XSS)
  Secure;            ← tylko HTTPS
  SameSite=Strict;   ← ochrona przed CSRF
  Path=/;
  Max-Age=3600
```

**Test QA:** Czy cookie sesji ma HttpOnly i Secure? Czy SameSite jest ustawiony?

## Checklist Nagłówków Bezpieczeństwa

```
□ Content-Security-Policy — istnieje, brak unsafe-inline
□ Strict-Transport-Security — max-age ≥ 31536000
□ X-Frame-Options — DENY lub SAMEORIGIN
□ X-Content-Type-Options: nosniff
□ Referrer-Policy — ustawiony
□ Server header — nie ujawnia wersji
□ X-Powered-By — usunięty
□ Session cookies — HttpOnly + Secure + SameSite
```

Dodaj ten checklist do swojej rutyny testowania przed releasem. Zajmuje 10 minut, a chroni przed wieloma wektorami ataku.
