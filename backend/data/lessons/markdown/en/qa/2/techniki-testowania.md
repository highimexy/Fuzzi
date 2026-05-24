# Techniki Projektowania Testów

Zamiast losowo wymyślać dane testowe, stosuj techniki które maksymalizują pokrycie przy minimalnej liczbie przypadków.

## Equivalence Partitioning (EP)

Podziel dane wejściowe na grupy (partycje), gdzie wszystkie wartości w grupie zachowują się tak samo. Testuj jedną wartość z każdej partycji.

**Przykład:** Pole "Wiek" akceptuje 18–99.

| Partycja | Przykładowa wartość | Oczekiwany wynik |
|----------|--------------------|-----------------| 
| Poniżej minimum | 17 | Błąd walidacji |
| Prawidłowy zakres | 25 | Akceptacja |
| Powyżej maksimum | 100 | Błąd walidacji |

Zamiast testować 1, 2, 3... 99 — testujesz 3 wartości reprezentatywne.

## Boundary Value Analysis (BVA)

Błędy najczęściej kryją się **na granicach** zakresu. BVA testuje wartości brzegowe.

Dla zakresu 18–99 testujesz: **17, 18, 19** i **98, 99, 100**.

> Reguła: dla każdej granicy testuj wartość poniżej, na granicy i powyżej.

## Decision Table Testing

Gdy logika zależy od kombinacji warunków — tabela decyzyjna gwarantuje pokrycie.

| Zalogowany | Ma premium | Wynik |
|------------|------------|-------|
| Nie | — | Pokaż login |
| Tak | Nie | Pokaż upgrade |
| Tak | Tak | Pokaż treść |

Każdy wiersz to osobny przypadek testowy.

## State Transition Testing

Dla systemów ze stanami (np. koszyk, zamówienie) — diagram stanów + testy każdego przejścia.

```
[Pusty] → [Z produktem] → [Zamówiony] → [Opłacony]
              ↓
         [Porzucony]
```

Testuj każdą strzałkę. Testuj też próby niedozwolonych przejść (np. opłata za puste zamówienie).

## Kiedy Której Techniki Używać?

- Formularz z zakresami → **BVA + EP**
- Logika biznesowa → **Decision Table**
- Przepływ użytkownika → **State Transition**
- Brak specyfikacji → **Exploratory Testing**
