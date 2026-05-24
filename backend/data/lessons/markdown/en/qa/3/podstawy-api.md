# Testowanie API — Podstawy

API (Application Programming Interface) to warstwa komunikacji między systemami. Jako QA inżynier, musisz rozumieć jak działa REST API i umieć je testować niezależnie od UI.

## HTTP w Pigułce

Każde żądanie HTTP składa się z:
- **Method**: GET, POST, PUT, PATCH, DELETE
- **URL**: `https://api.example.com/users/123`
- **Headers**: Authorization, Content-Type, Accept
- **Body** (dla POST/PUT/PATCH): JSON, form data

## Kody Statusu HTTP — Must Know

| Kod | Znaczenie | Kiedy widzisz |
|-----|-----------|---------------|
| 200 | OK | Sukces |
| 201 | Created | Zasób stworzony (POST) |
| 400 | Bad Request | Błąd w żądaniu klienta |
| 401 | Unauthorized | Brak/błędny token |
| 403 | Forbidden | Brak uprawnień (token OK, ale rola nie) |
| 404 | Not Found | Zasób nie istnieje |
| 422 | Unprocessable | Walidacja nie przeszła |
| 500 | Server Error | Błąd serwera — zawsze bug! |

## Co Testować w API?

1. **Happy path** — prawidłowe dane → oczekiwana odpowiedź
2. **Validation** — brakujące pola, złe typy, puste stringi
3. **Auth** — bez tokena, wygasły token, token innego usera
4. **Edge cases** — bardzo długie stringi, znaki specjalne, SQL injection próby
5. **Response schema** — czy odpowiedź ma wszystkie wymagane pola?

## Postman — Quick Start

Postman to narzędzie GUI do testowania API. Kluczowe funkcje:
- **Collections** — grupowanie requestów
- **Environments** — zmienne (dev/staging/prod URL)
- **Tests** — asercje w JavaScript po requestcie

```javascript
// Przykładowy test w Postman
pm.test("Status code is 200", () => {
  pm.response.to.have.status(200);
});
pm.test("Response has user id", () => {
  const json = pm.response.json();
  pm.expect(json.id).to.be.a('number');
});
```
