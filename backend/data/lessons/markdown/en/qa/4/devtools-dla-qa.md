# DevTools dla QA — Twój Supermoc

Narzędzia deweloperskie w przeglądarce (F12) to jeden z najważniejszych arsenałów QA. Pozwalają analizować sieć, JS, style i storage bez dostępu do kodu.

## Zakładka Network — Inspekcja Żądań

Network tab to podgląd całej komunikacji przeglądarki z serwerem.

### Co sprawdzać:
- **Status codes** — czy API odpowiada 200, nie 500?
- **Request payload** — jakie dane wysyła formularz?
- **Response body** — co zwraca serwer?
- **Timing** — jak długo trwa żądanie? (>3s to problem)
- **Headers** — czy są CORS headers, Content-Type?

### Praktyczny flow:
1. Otwórz Network tab
2. Wykonaj akcję w UI (np. zaloguj się)
3. Znajdź request do `/auth/login`
4. Sprawdź żądanie i odpowiedź

## Zakładka Console — Błędy JS

Console pokazuje błędy i logi JavaScript. Każdy czerwony error to potencjalny bug.

Czerwone errory są **zawsze** warte sprawdzenia — nawet jeśli UI wygląda normalnie.

## Zakładka Application — Storage

Tutaj znajdziesz:
- **Cookies** — tokeny sesji, preferencje
- **LocalStorage/SessionStorage** — dane klienta
- **IndexedDB** — offline cache

Przydatne przy testowaniu: wylogowywanie, czyszczenie cache, testowanie uprawnień.

## Emulacja Urządzeń

Toggle Device Toolbar (Ctrl+Shift+M) — symulacja różnych ekranów i user agentów. Kluczowe dla testów responsywności.

Ważne: emulacja ≠ prawdziwe urządzenie. Testy na fizycznych telefonach wciąż są niezbędne.
