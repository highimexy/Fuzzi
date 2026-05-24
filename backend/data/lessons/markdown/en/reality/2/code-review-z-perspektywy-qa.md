# Code Review z Perspektywy QA

Większość QA myśli że code review to sprawa developerów. Błąd. QA uczestniczący w code review wykrywa bugi przed napisaniem testów — to największy ROI jaki możesz osiągnąć.

## Co QA Szuka w Code Review?

Nie musisz rozumieć każdej linii kodu. Skupiasz się na innym wymiarze niż developer-reviewer.

### 1. Brakująca walidacja wejścia
```python
# Developer widzi: funkcja zapisuje użytkownika
def create_user(email, password):
    db.save(User(email=email, password=password))

# QA widzi: co jeśli email jest None? Puste? Bez @?
# Gdzie jest walidacja formatu i wymagalności?
```

### 2. Niespójność z wymaganiami
- Czy implementacja pokrywa wszystkie kryteria akceptacji?
- Czy edge case'y opisane w tickets są obsłużone?
- Czy zachowanie błędów jest zgodne z dokumentacją API?

### 3. Hardcoded wartości testowe
```python
# Czerwona flaga w code review:
if user.id == 12345:  # test user bypass
    skip_payment()
```
Kod testowy który trafił do produkcji to klasyczny bug.

### 4. Brakująca obsługa błędów
```javascript
// Zły kod — brak obsługi błędu fetch
const data = await fetch('/api/orders');
const json = await data.json();  // crashuje gdy API zwróci 500

// Dobry kod — obsługa błędu
const response = await fetch('/api/orders');
if (!response.ok) throw new Error(`API error: ${response.status}`);
const json = await response.json();
```

### 5. Zmiany z dużym zasięgiem
Gdy developer zmienia coś w module shared/utils/helpers — to sygnał dla QA: sprawdź WSZYSTKO co używa tego modułu.

## Jak Pisać Komentarze w Code Review jako QA?

Nie piszesz jak developer (implementacyjne sugestie). Piszesz jak QA (ryzyko, wymagania, zachowanie).

**Przykłady dobrych komentarzy QA:**

> *"AC3 mówi że email musi być unikalny. Nie widzę walidacji tej unikalności przed zapisem. Czy jest na poziomie bazy danych? Jak wygląda error message dla duplikatu?"*

> *"Co się stanie gdy users_count przekroczy MAX_INT? Widzę że to integer — dla systemu z dużą skalą może to być problem w przyszłości."*

> *"Czy ta zmiana jest backward compatible? Jeśli mobila używa starego API i dostanie nową odpowiedź — czy nie padnie?"*

**Unikaj:**
> ~~"Tutaj powinniście użyć Promise.all zamiast sequential await"~~ (to opinia implementacyjna, nie twoja rola)

## Code Review vs Testowanie — Kiedy Co?

| Cel | Code Review | Testowanie |
|-----|-------------|------------|
| Logika biznesowa OK? | ✓ (szybciej) | ✓ |
| Wymagania pokryte? | ✓ | ✓ |
| Integracja z innymi modułami? | Częściowo | ✓ (lepiej) |
| Performance pod obciążeniem? | ✗ | ✓ |
| UX i flow użytkownika? | ✗ | ✓ |

## Budowanie Kultury Code Review

Wiele firm ma code review tylko dla developerów. Jeśli chcesz mieć wpływ:

1. **Zaproś się** — zapytaj tech leada czy możesz być dodany jako reviewer
2. **Zacznij od małych komentarzy** — nie blokuj PR, tylko pytaj
3. **Udowodnij wartość** — gdy Twój komentarz zapobiegnie bugowi, wspomnij o tym na retro
4. **Nie przekraczaj swojej roli** — sugestie dotyczące zachowania systemu, nie architektury kodu

Zdobycie dostępu do code review to jeden z najtańszych sposobów na bycie seniorem QA.
