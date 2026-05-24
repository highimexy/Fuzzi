# k6 — Pierwszy Test Wydajnościowy

k6 (Grafana k6) to nowoczesne narzędzie do load testingu pisane w JavaScript/TypeScript. Jest darmowe, open-source i doskonałe jako pierwszy krok w performance testingu.

## Instalacja i Pierwszy Test

```bash
# macOS
brew install k6

# Linux
sudo apt install k6
```

```javascript
// smoke-test.js
import http from 'k6/http'
import { check, sleep } from 'k6'

export const options = {
  vus: 10,          // 10 wirtualnych użytkowników
  duration: '30s',  // przez 30 sekund
}

export default function () {
  const res = http.get('https://api.example.com/products')

  check(res, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  })

  sleep(1) // pauza między requestami
}
```

```bash
k6 run smoke-test.js
```

## Scenariusze Obciążeniowe

```javascript
export const options = {
  stages: [
    { duration: '2m', target: 10 },   // rozgrzewka
    { duration: '5m', target: 50 },   // normalne obciążenie
    { duration: '2m', target: 100 },  // szczyt
    { duration: '2m', target: 0 },    // cool down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% requestów < 500ms
    http_req_failed: ['rate<0.01'],    // < 1% błędów
  },
}
```

## Kluczowe Metryki w Wynikach

```
http_req_duration....: avg=234ms p(90)=445ms p(95)=512ms p(99)=1.2s
http_req_failed......: 0.12% 12 out of 9876
vus...................: 50
```

- `p(95)` — 95% requestów szybszych niż X
- `http_req_failed` — odsetek błędów (>1% to problem)
- `vus` — aktywni wirtualni użytkownicy

## Kiedy Uruchamiać Testy Wydajnościowe?

- **Przed każdym dużym releasem** — smoke performance test
- **Po zmianie infrastruktury** — skalowanie, nowy serwer
- **Po optymalizacji** — czy naprawdę jest szybciej?
- **Przed kampanią marketingową** — czy serwer wytrzyma ruch?

> Nigdy nie uruchamiaj load testów na produkcji bez zgody — możesz ją zrestartować.
