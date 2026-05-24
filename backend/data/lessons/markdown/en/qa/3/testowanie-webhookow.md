# Testowanie Webhooków — Zdarzenia które Przychodzą do Ciebie

Większość API jest pull-based: Ty pytasz, serwer odpowiada. Webhooki odwracają ten model: zewnętrzny serwis wysyła zdarzenie do Twojej aplikacji gdy coś się dzieje. Płatność potwierdzona, zamówienie wysłane, plik przetworzony.

## Jak Działa Webhook?

```
Użytkownik płaci → Stripe przetwarza → Stripe wysyła POST na Twój endpoint
                                           ↓
                                    /api/webhooks/stripe
                                           ↓
                                    Twoja aplikacja aktualizuje status
```

Twoja aplikacja musi być dostępna pod adresem który Stripe może osiągnąć. W środowisku lokalnym — to problem do rozwiązania.

## Wyzwania Testowania Webhooków

### Problem 1: Twoje localhost nie jest dostępne z zewnątrz

Rozwiązania:
- **ngrok** — tworzy publiczny URL tunelujący do Twojego localhost
  ```bash
  ngrok http 3000
  # Dostajasz: https://abc123.ngrok.io → localhost:3000
  ```
- **Stripe CLI** — dla Stripe, ma wbudowane forwardowanie zdarzeń
  ```bash
  stripe listen --forward-to localhost:3000/webhook
  ```
- **RequestBin** / **Webhook.site** — zbiera webhooki bez uruchamiania serwera

### Problem 2: Jak wyzwolić zdarzenie?

Nie chcesz płacić prawdziwej karty żeby przetestować webhook płatności.

**Opcje:**
- Stripe test mode + test card (4242 4242 4242 4242) → prawdziwy webhook w test środowisku
- Stripe CLI: `stripe trigger payment_intent.succeeded` → symuluje zdarzenie
- Ręczne POST do swojego endpointu z przykładowym payloadem z dokumentacji

### Problem 3: Kolejność i duplikaty

Webhooki mogą:
- Przyść w złej kolejności (zdarzenie B przed A)
- Przyjść wielokrotnie (retry po timeout)
- Nie przyjść wcale (sieć)

**Co testować:**
- Czy aplikacja obsługuje duplikaty? (idempotent endpoint)
- Co gdy płatność zaakceptowana + anulowana w ciągu sekund?

## Weryfikacja Podpisu (Signature Verification)

Dobry webhook service podpisuje każde zdarzenie. Twoja aplikacja musi weryfikować podpis.

Stripe:
```http
Stripe-Signature: t=1614556800,v1=abc123...
```

```javascript
// Weryfikacja w aplikacji:
const event = stripe.webhooks.constructEvent(
  request.rawBody,
  request.headers['stripe-signature'],
  process.env.STRIPE_WEBHOOK_SECRET
);
```

**Test QA:** Co się dzieje gdy wysyłasz webhook bez podpisu? Aplikacja powinna zwrócić 401/403, nie przetworzyć zdarzenia.

**Test QA:** Co gdy wysyłasz webhook z nieprawidłowym podpisem? To samo — odrzucony.

## Co Testować w Webhookach?

### 1. Happy path
- Poprawny webhook → stan aplikacji zaktualizowany poprawnie
- Status HTTP odpowiedzi: 200 (serwis wie że dostarczone)

### 2. Payload Validation
- Brakujące wymagane pola → aplikacja nie crasha, loguje błąd
- Nieoczekiwany typ zdarzenia → ignorowany lub logowany

### 3. Idempotency
- Ten sam webhook wysłany dwa razy → efekt identyczny jak jeden raz
- Test: wyślij identyczny payload 5 razy, sprawdź czy w bazie jest 1 rekord, nie 5

### 4. Timeout i Retry
- Endpoint odpowiada > 30 sekund → serwis wysyła retry
- Endpoint zwraca 500 → serwis retryuje (Stripe: 25 prób przez 3 dni)

### 5. Security
- Bez podpisu → 401
- Błędny podpis → 401
- Replay attack (stary podpis) → 401 (Stripe odrzuca zdarzenia > 5 minut stare)

## Narzędzia

```bash
# ngrok (do developmentu)
brew install ngrok
ngrok http 3000

# Stripe CLI (do testowania Stripe webhooks)
stripe listen --forward-to localhost:3000/stripe/webhook

# webhook.site — zbiera webhooki online, bez serwera
# Otwórz webhook.site, skopiuj URL, użyj jako endpoint
```
