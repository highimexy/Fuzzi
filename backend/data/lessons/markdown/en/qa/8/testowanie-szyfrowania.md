# Testowanie Szyfrowania i TLS — Bezpieczeństwo Danych w Tranzycie

Dane przesyłane między przeglądarką a serwerem są widoczne dla każdego w sieci — chyba że są zaszyfrowane. QA który rozumie TLS może znaleźć konfiguracje które wyciekają dane klientów.

## Co Chronić — Dane Wrażliwe w Tranzycie

Dane które MUSZĄ być zaszyfrowane:
- Hasła i tokeny sesji
- Dane kart płatniczych (PAN, CVV)
- Dane osobowe (PESEL, adres, email)
- Klucze API i sekrety
- Pliki medyczne lub prawne

Zasada: jeśli wyciek danych zaszkodzi użytkownikowi lub firmie — muszą być zaszyfrowane.

## TLS — Transport Layer Security

HTTPS = HTTP + TLS. Szyfrowanie "w tranzycie" — dane są szyfrowane między klientem a serwerem.

### Wersje TLS:
- **TLS 1.0 / 1.1** — przestarzałe, podatne na ataki, zakazane przez PCI-DSS i GDPR
- **TLS 1.2** — minimum akceptowalne
- **TLS 1.3** — obecny standard, szybszy i bezpieczniejszy

### Jak Sprawdzić Wersję TLS

```bash
# Curl — sprawdź czy TLS 1.0 jest odrzucane
curl --tls-max 1.0 https://twojadomena.pl
# Oczekiwane: błąd "SSL handshake failed"
# Zły wynik: połączenie nawiązane

# OpenSSL — sprawdź szczegóły certyfikatu
openssl s_client -connect twojadomena.pl:443 -tls1_2
openssl s_client -connect twojadomena.pl:443 -tls1_3
```

**Narzędzie online:** SSL Labs Server Test (ssllabs.com/ssltest) — daje ocenę A/B/C/F i listę problemów.

## Certyfikaty SSL — Co Sprawdzać

### Data ważności
```bash
echo | openssl s_client -connect example.com:443 2>/dev/null | openssl x509 -noout -dates
# notAfter=Mar 15 12:00:00 2025 GMT
```

Bug: certyfikat wygasa za 7 dni i nikt o tym nie wie → produkcja padnie w piątek o 2:00.

### Nazwa domeny (SAN/CN)
Certyfikat musi pasować do domeny. Sprawdź:
- `app.example.com` → certyfikat na `*.example.com` ✓
- `api.example.com` → certyfikat tylko na `example.com` ✗ (różna subdomena)
- `example.com` → certyfikat na `otherdomain.com` ✗

### Chain of Trust
Pełny łańcuch certyfikatów musi być dostarczany przez serwer.

```bash
openssl s_client -connect example.com:443 -showcerts 2>/dev/null | grep "Certificate chain"
```

Jeśli łańcuch jest niekompletny — niektóre przeglądarki/systemy odrzucą połączenie.

## HTTP vs HTTPS — Przekierowania

Każde żądanie HTTP musi być przekierowane na HTTPS:

```bash
# Test przekierowania
curl -I http://example.com
# Oczekiwane: HTTP/1.1 301 Moved Permanently → Location: https://example.com
# Zły wynik: HTTP/1.1 200 OK (HTTP działa bez przekierowania)
```

### HSTS (HTTP Strict Transport Security)
Nagłówek który mówi przeglądarce: "zawsze używaj HTTPS dla tej domeny".

```
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

Sprawdź w DevTools → Network → Response Headers.

**Bug:** Brak HSTS = użytkownik może być przekierowany na HTTP przez atak MITM.

## Mixed Content — Częsty Bug

Mixed content = strona HTTPS ładuje zasoby przez HTTP.

```html
<!-- Bug: strona HTTPS, ale obrazek przez HTTP -->
<img src="http://cdn.example.com/logo.png">

<!-- Prawidłowo -->
<img src="https://cdn.example.com/logo.png">
```

**Jak znaleźć:**
1. DevTools → Console → szukaj "Mixed Content: The page was loaded over HTTPS..."
2. DevTools → Security zakładka → "Mixed Content" lista

## Szyfrowanie Danych w Formularzach

### Autofill i Typy Pól

```html
<!-- Bug: hasło jako text -->
<input type="text" name="password">

<!-- Prawidłowo -->
<input type="password" name="password" autocomplete="current-password">
```

### Dane Karty Płatniczej
Nigdy nie powinny trafiać bezpośrednio do Twojego serwera — używaj tokenizacji (Stripe.js, Braintree.js). 

**Test:** Złóż zamówienie z kartą testową i sprawdź w Network tab — czy numer karty jest widoczny w payload? Powinien być już tokenem (np. `tok_visa_...`).

## Checklist Testowania TLS/Szyfrowania

```
□ HTTPS działa — brak błędów certyfikatu w przeglądarce
□ HTTP → HTTPS przekierowanie (301) działa
□ TLS 1.0 i 1.1 są odrzucane
□ TLS 1.2 lub 1.3 działa
□ Certyfikat jest ważny (nie wygasa w < 30 dni)
□ Certyfikat pasuje do domeny (SAN check)
□ HSTS nagłówek jest obecny
□ Brak mixed content (DevTools Security)
□ Dane karty nie widoczne w network (tokenizacja)
□ Hasła wysyłane przez POST HTTPS, nie GET
□ Tokeny sesji mają flagę Secure (tylko HTTPS)
□ Cookies wrażliwe mają flagę HttpOnly
```

## Cookies — Flagi Bezpieczeństwa

```
Set-Cookie: session_id=abc123; 
  Secure;        ← tylko przez HTTPS
  HttpOnly;      ← niedostępny przez JavaScript (ochrona przed XSS)
  SameSite=Strict; ← ochrona przed CSRF
  Path=/; 
  Expires=...
```

**Sprawdź w DevTools:** Application → Cookies → kolumny Secure, HttpOnly, SameSite.

Bug: session_id bez flagi Secure → może być wysłany przez HTTP (np. po downgrade attack).
