# Testowanie Autoryzacji i Uwierzytelniania

Autoryzacja to jeden z najczęstszych obszarów błędów bezpieczeństwa. Jako QA musisz aktywnie testować czy system prawidłowo kontroluje dostęp.

## Uwierzytelnianie vs Autoryzacja

- **Uwierzytelnianie (AuthN):** Kim jesteś? (login/hasło, token)
- **Autoryzacja (AuthZ):** Co możesz zrobić? (role, uprawnienia)

Można być uwierzytelniony i nie mieć autoryzacji — to normalne. Niebezpieczne jest odwrotne.

## Macierz Testów Autoryzacji

Dla każdego endpointu przetestuj wszystkie kombinacje:

| Scenariusz | Oczekiwany wynik |
|-----------|-----------------|
| Brak tokena | 401 |
| Wygasły token | 401 |
| Token innego użytkownika | 403 lub 404 |
| Token z rolą niewystarczającą | 403 |
| Token z poprawną rolą | 200 |
| Token admina do endpointu usera | 200 (admin może wszystko) |

## JWT — Typowe Błędy do Testowania

JWT (JSON Web Token) to popularny mechanizm autoryzacji. Testuj:

```
Header.Payload.Signature
```

1. **Brak weryfikacji sygnatury** — zmień payload (np. role: "admin") i sprawdź czy serwer akceptuje
2. **Algorithm confusion** — zmień alg na "none" w headerze
3. **Expired token** — użyj tokena po wygaśnięciu

```bash
# Zdekoduj JWT (base64) i sprawdź payload
echo "eyJhbGciOiJIUzI1NiJ9.eyJyb2xlIjoidXNlciJ9.xxx" | cut -d. -f2 | base64 -d
```

## Testowanie Ról

Stwórz konta testowe dla każdej roli w systemie:
- `admin@test.com` — admin
- `user@test.com` — zwykły użytkownik
- `moderator@test.com` — moderator

Dla każdej funkcji aplikacji — sprawdź macierz dostępu.

## Privilege Escalation

Czy użytkownik może sam nadać sobie wyższą rolę?

```
PATCH /api/users/me
{ "role": "admin" }
```

Oczekiwany wynik: 403. Jeśli serwer to akceptuje — critical security bug.
