# Feature Flags w Testowaniu — Jak Nie Dać Się Zaskoczyć

Feature flag (feature toggle) to mechanizm który pozwala włączyć lub wyłączyć funkcjonalność bez deploymentu kodu. To potężne narzędzie — i potężne źródło bugów jeśli QA nie wie jak je testować.

## Czym Są Feature Flags

```javascript
// Zamiast:
function showNewCheckout() { ... }

// Z feature flag:
if (featureFlags.isEnabled('new_checkout', userId)) {
  showNewCheckout();
} else {
  showOldCheckout();
}
```

Flagę włącza się dla % użytkowników, konkretnych kont, krajów, dat — bez deployment.

## Dlaczego Są Trudne do Testowania

Feature flag tworzy **nową permutację** systemu. Każda flaga podwaja liczbę stanów do przetestowania:

- 1 flaga: stan A (off) i stan B (on) = 2 permutacje
- 2 flagi: AA, AB, BA, BB = 4 permutacje
- 3 flagi: 8 permutacji
- N flag: 2^N permutacji

W praktyce: przy 10 flagach masz 1024 kombinacje. Nie musisz testować wszystkich, ale musisz wiedzieć które są ryzykowne.

## Typy Feature Flags

### Release Flags
Ukrycie nieskończonej funkcji. Kod jest w produkcji, ale niewidoczny.

**Ryzyko QA:** Funkcja jest "niewidoczna" ale kod działa. Może mieć side effects (np. nowe kolumny w DB, nowe endpointy).

### Experiment Flags (A/B test)
Różne grupy użytkowników widzą różne UI.

**Ryzyko QA:** Testy muszą być izolowane. Dane z grupy A nie mogą mieszać się z grupą B.

### Ops Flags
Wyłącznik awaryjny ("kill switch"). Gdy coś idzie źle na produkcji.

**Ryzyko QA:** Czy wyłączenie flagi nie zostawia systemu w niespójnym stanie?

### Permission Flags
Beta użytkownicy widzą więcej funkcji.

**Ryzyko QA:** Czy uprawnienia są właściwie sprawdzane? Czy user B1 nie może zobaczyć beta features user A1?

## Co Testować z Feature Flags

### Stan Bazowy (flaga OFF)
Czy aplikacja działa normalnie gdy flaga jest wyłączona?

```
Scenariusz: flaga 'new_payment_flow' = OFF
- Płatność działa starym flow
- Brak błędów JS konsoli
- Brak wycieków z nowego kodu
- Dane nie są przypadkowo zapisywane w nowym schemacie
```

### Stan Włączony (flaga ON)
Czy nowa funkcjonalność działa poprawnie?

```
Scenariusz: flaga 'new_payment_flow' = ON
- Użytkownik widzi nowy UI
- Płatność działa nowym flow
- Dane zapisywane w nowym schemacie
```

### Przejście ON → OFF (rollback)
Co się dzieje gdy wyłączysz flagę w trakcie sesji użytkownika?

```
Scenariusz rollback:
1. User A: zaczął checkout z flagą ON (nowy flow)
2. Admin wyłącza flagę
3. User A: odświeża stronę
Co się dzieje z jego koszykiem? Zamówieniem? Sesją?
```

### Przejście OFF → ON (rollout)
Co się dzieje gdy włączysz flagę dla użytkownika który już był zalogowany?

### Dane z Mixed States
Gdy część użytkowników korzystała z flagi ON, część z OFF — czy dane są spójne?

```
Bug przykład:
- User A: kupił z nowym flow (dane w nowym schemacie)
- User B: kupił ze starym flow (dane w starym schemacie)
- Admin: generuje raport — pobiera WSZYSTKICH orders
→ Czy raport obsługuje oba formaty danych?
```

## Checklist Testowania Feature Flags

```
□ Przetestuj feature z flagą OFF — czy nic się nie zepsuło?
□ Przetestuj feature z flagą ON — czy działa?
□ Przetestuj przejście ON→OFF w trakcie sesji
□ Przetestuj że użytkownik bez dostępu nie widzi flagi
□ Sprawdź logi — czy flaga jest logowana gdy zmienia stan?
□ Sprawdź dane — czy oba stany produkują spójne dane?
□ Przetestuj "kill switch" — czy wyłączenie jest natychmiastowe?
```

## Narzędzia i Konfiguracja

Popularne systemy feature flags:
- **LaunchDarkly** — enterprise, kosztowne
- **GrowthBook** — open source, A/B testing
- **Unleash** — open source, dobry default
- **Flagsmith** — open source
- **Split.io** — enterprise

Jako QA powinieneś wiedzieć:
- Jak manualnie przełączyć flagę dla konta testowego
- Jak sprawdzić bieżący stan flag w środowisku testowym
- Czy flagi mają logi audytowe (kto, kiedy, jak zmienił)

## Dokument Testowania Flag

Przy każdej nowej fladze twórz notatkę:

```
Flaga: new_checkout_v2
Stan domyślny: OFF
Włączona dla: 10% users (group A)

Obszary impaktu:
- Cart component
- Checkout page
- Payment module
- Order confirmation email

Testy do wykonania:
- [x] OFF: stary checkout działa
- [x] ON: nowy checkout działa
- [ ] Rollback: co z koszykiem w trakcie?
- [ ] Data consistency: raporty z mixed data
```
