# OWASP Top 10 — Bezpieczeństwo z Perspektywy QA

OWASP Top 10 to lista 10 najczęstszych i najbardziej krytycznych podatności bezpieczeństwa w aplikacjach webowych. Jako QA nie musisz być pentesterem — ale powinieneś wiedzieć na co zwracać uwagę.

## Dlaczego QA Zajmuje się Bezpieczeństwem?

Security testing to nie tylko domena "security team". QA jest pierwszą linią obrony bo:
- Testuje aplikację od strony użytkownika (jak atakujący)
- Ma dostęp do kodu i środowiska testowego
- Testuje edge case'y (które często są wektorami ataku)
- Może łatwo dodać security checks do istniejących testów

## OWASP Top 10 — Co Testuje QA?

### A01: Broken Access Control
Użytkownik może zrobić coś czego nie powinien.

**Co testować:**
- Czy zalogowany jako user mogę wejść na `/admin`?
- Czy mogę edytować zamówienie innego użytkownika zmieniając ID w URL?
- Czy po wylogowaniu stare linki z sesją dalej działają?

```
GET /api/orders/12345  (jako user który nie jest właścicielem tego zamówienia)
```

### A02: Cryptographic Failures
Wrażliwe dane przechowywane lub transmitowane bez szyfrowania.

**Co testować:**
- Czy aplikacja działa przez HTTPS? Czy redirect z HTTP na HTTPS?
- Czy hasła nie są widoczne w logach?
- Czy wrażliwe dane (PESEL, numer karty) nie pojawiają się w URL-ach?

### A03: Injection (SQL, XSS, Command)
Złośliwe dane wstrzyknięte do aplikacji są wykonywane jako kod.

**Proste testy bez znajomości hackerstwa:**

SQL Injection:
```
Wpisz w pole wyszukiwania: ' OR '1'='1
Wpisz: '; DROP TABLE users; --
```
Aplikacja powinna zwrócić błąd walidacji, nie wyniki lub error 500.

XSS (Cross-Site Scripting):
```
Wpisz w pole nazwy użytkownika: <script>alert('XSS')</script>
Wpisz: <img src="x" onerror="alert(1)">
```
Jeśli pojawia się alert — masz XSS. Jeśli tekst jest wyświetlony jako tekst — OK.

### A05: Security Misconfiguration
Błędna konfiguracja serwera, frameworka lub bazy danych.

**Co testować:**
- Czy wersje technologii nie są widoczne w nagłówkach HTTP?
- Czy strony błędów (404, 500) nie pokazują stack trace?
- Czy domyślne hasła zostały zmienione?

```
curl -I https://example.com/
# Sprawdź nagłówki: X-Powered-By, Server
# Te nagłówki ujawniają technologie atakującym
```

### A07: Identification and Authentication Failures
Słabe mechanizmy logowania i sesji.

**Co testować:**
- Czy brute force na logowanie jest możliwy bez blokady?
- Czy "Zapomniałem hasła" ujawnia czy email istnieje?
- Czy sesja jest unieważniana po wylogowaniu?
- Czy token w URL (password reset) jest jednorazowy?

### A09: Security Logging and Monitoring Failures
Brak logowania ważnych zdarzeń.

**Pytaj developerów:**
- Czy logowane są nieudane próby logowania?
- Czy logowany jest dostęp do wrażliwych zasobów?
- Gdzie logi trafiają i kto ma do nich dostęp?

## Narzędzia QA dla Security Testing

| Narzędzie | Użycie |
|-----------|--------|
| OWASP ZAP | Automatyczny scan podatności |
| Burp Suite (Community) | Proxy, przechwytywanie requestów |
| curl / Postman | Ręczne testy API |
| Chrome DevTools | Analiza nagłówków, cookies |
| Have I Been Pwned | Weryfikacja wycieków |

## Nie Bądź Pentesterem — Bądź QA

Twoim celem nie jest exploitation. Twoim celem jest:
1. Sprawdzić oczywiste wektory ataku
2. Zraportować znalezione podatności z repro steps
3. Zrozumieć jakie dane mogą wyciec

Jeśli znajdziesz coś poważnego — eskaluj do security team lub CTO. Nie próbuj eksploatować dalej bez autoryzacji.
