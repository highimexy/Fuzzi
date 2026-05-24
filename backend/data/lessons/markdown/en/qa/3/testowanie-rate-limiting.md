# Testowanie Rate Limiting i Throttlingu — Ochrona API przed Nadużyciami

Rate limiting to mechanizm który ogranicza liczbę requestów do API w określonym czasie. Bez niego: jeden użytkownik może zalać serwer requestami i go zablokować dla wszystkich. QA który nie testuje rate limiting to QA który zostawia otwarte drzwi do DoS.

## Czym Jest Rate Limiting

```
Limit: 100 requestów na minutę na użytkownika

Request 1-100: 200 OK
Request 101: 429 Too Many Requests
             Retry-After: 42 (sekund do odblokowania)
```

Typy limitów:
- **Per user/token** — każdy użytkownik ma swój limit
- **Per IP** — limit per adres IP
- **Per endpoint** — różne limity dla różnych endpointów
- **Global** — całkowity limit dla całego API

## Nagłówki Rate Limiting

Dobry API zwraca informacje o stanie limitu:

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100        ← max requestów w oknie
X-RateLimit-Remaining: 73     ← ile zostało w tym oknie
X-RateLimit-Reset: 1710498600 ← kiedy okno się resetuje (Unix timestamp)
Retry-After: 42               ← (przy 429) ile sekund czekać
```

Sprawdź te nagłówki po każdym request — dają pełny obraz stanu limitu.

## Podstawowe Testy Rate Limitingu

### Test 1: Limit jest respektowany
```bash
# Wyślij 105 requestów szybko, oczekuj że 101+ dostaną 429
for i in {1..105}; do
  curl -s -o /dev/null -w "%{http_code}\n" \
    -H "Authorization: Bearer $TOKEN" \
    https://api.example.com/resource
done
```

Sprawdź: request 101 i dalsze = 429, nie 200.

### Test 2: Reset po czasie
```
1. Wyczerpaj limit (wyślij 100 requestów)
2. Poczekaj do resetowania (X-RateLimit-Reset)
3. Wyślij request — powinien dostać 200, nie 429
```

### Test 3: Nagłówki są poprawne
Przy każdym 200:
- `X-RateLimit-Remaining` maleje o 1 z każdym requestem
- `X-RateLimit-Reset` jest w przyszłości

Przy 429:
- `Retry-After` jest obecny i pozytywny

### Test 4: Limit jest per user, nie global
```
1. Użytkownik A wyczerpuje swój limit
2. Użytkownik B (inny token) robi request — powinien dostać 200
```

Jeśli B dostaje 429 — rate limiting jest globalny (lub per IP, nie per user).

### Test 5: Różne endpointy, różne limity
```
/api/search — limit 30/min (drogie zapytanie)
/api/user/profile — limit 300/min (tanie zapytanie)
```

Sprawdź czy limity są wyegzekwowane oddzielnie.

## Testowanie Zachowania przy 429

Aplikacja frontend powinna obsługiwać 429 gracefully:

```
Testujesz: co widzi użytkownik gdy API zwraca 429?
Oczekiwane: "Za dużo requestów — spróbuj za [N] sekund"
Złe: "Błąd serwera", "Something went wrong", biały ekran
```

Sprawdź też czy aplikacja automatycznie retry po Retry-After — to dobra praktyka dla operacji w tle (np. polling).

## Testy Specjalnych Przypadków

### Burst Traffic
Co jeśli klient wyśle 50 requestów jednocześnie (nie sekwencyjnie)?

```bash
# 50 równoległych requestów
for i in {1..50}; do
  curl -s -o /dev/null -w "%{http_code}\n" https://api.example.com/resource &
done
wait
```

### Race Condition w Limicie
Przy bardzo szybkich równoległych requestach — czy serwer prawidłowo zlicza?

Teoretycznie request 99 i 100 wysłane jednocześnie oba powinny przejść. Ale request 101 i 102 wysłane jednocześnie gdy zostało 1 — czy tylko jeden przejdzie?

### IP Rotation
Jeśli limit jest per IP:
```
1. Wyślij 100 requestów z IP A — wyczerpanie limitu
2. Wyślij request z IP B (VPN/proxy) — czy dostaje nowy limit?
```

Ten test sprawdza czy limit-per-IP jest zabezpieczony przed rotation.

## Testowanie Endpointów Autentykacji

Endpoint login ma zazwyczaj najostrzejszy limit (ochrona przed brute-force):

```
POST /api/auth/login
Limit: 5 prób na minutę per IP

Test: 6 prób logowania w ciągu minuty
→ Próba 6 powinna dostać 429 lub wymagać CAPTCHA
```

Sprawdź:
- Czy limit jest per IP? (Nie per username — lockout per username umożliwia DoS na konkretne konto)
- Czy limit dotyczy błędnych loginów czy wszystkich prób?
- Czy jest informacja dla użytkownika ile czasu musi czekać?

## Dokumentowanie Wyników

```
Test Rate Limiting — /api/orders
Data: 2024-03-15 | Środowisko: staging

Limit zadeklarowany w docs: 100/min per user
Limit faktyczny: 100/min ✓
X-RateLimit-Limit header: ✓ (wartość: 100)
X-RateLimit-Remaining: ✓ (maleje poprawnie)
X-RateLimit-Reset: ✓
Retry-After przy 429: ✓
Reset po czasie: ✓
Per-user (nie global): ✓
Frontend obsługuje 429: ✗ — wyświetla "Błąd serwera" zamiast przyjaznego komunikatu [Bug #5540]
```
