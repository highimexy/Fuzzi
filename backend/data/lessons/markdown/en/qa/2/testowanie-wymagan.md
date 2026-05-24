# Testowanie Wymagań — Zanim Napiszesz Pierwszy Test

Najdroższe bugi to te w wymaganiach — znalezione po zaimplementowaniu feature'u. QA który umie czytać wymagania krytycznie zapobiega całym klasom bugów zanim developer napisze pierwszą linię kodu.

## Dlaczego Wymagania Mają Bugi?

Wymagania pisze człowiek — zazwyczaj Product Owner lub Business Analyst. Ten człowiek:
- Wie czego CHCE, ale nie zawsze wie jak to OPISAĆ precyzyjnie
- Zakłada pewne rzeczy jako "oczywiste" (które nie są oczywiste dla developera)
- Pomija edge case'y których nie przewidział
- Używa niejednoznacznego języka

Twoja rola: być pierwszym krytykiem wymagań.

## Typy Problemów w Wymaganiach

### 1. Niejednoznaczność (Ambiguity)
Jedno zdanie, wiele możliwych interpretacji.

> ❌ *"Użytkownik może edytować swoje dane"*

Pytania które powinieneś zadać:
- Jakie dane? Wszystkie pola? Tylko niektóre?
- Czy może zmienić email (używany do logowania)?
- Czy zmiana wymaga potwierdzenia hasłem?
- Czy historia zmian jest zapisywana?

> ✅ *"Zalogowany użytkownik może edytować imię, nazwisko i numer telefonu. Zmiana emaila wymaga dodatkowej weryfikacji przez link na stary adres. Email logowania zmienia się po kliknięciu linku weryfikacyjnego."*

### 2. Niekompletność (Incompleteness)
Wymaganie nie opisuje co się dzieje w pewnych scenariuszach.

> ❌ *"Formularz zamówienia musi być wypełniony przed wysłaniem"*

Co brakuje:
- Co się dzieje gdy pole jest puste? (komunikat? które pole?)
- Czy walidacja jest per-pole czy po Submit?
- Co z opcjonalnymi polami?

### 3. Sprzeczność (Contradiction)
Dwa wymagania mówią coś innego.

> Wymaganie A: *"Ceny są wyświetlane w walucie użytkownika"*
> Wymaganie B: *"Wszystkie transakcje są procesowane w PLN"*

Pytanie: co użytkownik widzi — cenę w EUR przeliczoną w momencie zakupu czy stałą cenę w PLN?

### 4. Brak kryteriów akceptacji
Wymaganie bez AC to przepis na spór między QA a developerem.

> ❌ *"Strona powinna ładować się szybko"*
> ✅ *"Strona powinna załadować się w < 3 sekundy na połączeniu LTE (20 Mbps)"*

## Techniki Analizy Wymagań

### Boundary Value Analysis (BVA)
Szukaj wartości granicznych w wymaganiach.

Wymaganie: *"Hasło musi mieć 8–20 znaków"*

Boundary values do testowania: 7, 8, 9, 19, 20, 21

Zawsze testuj: minimum-1, minimum, minimum+1, maksimum-1, maksimum, maksimum+1.

### Equivalence Partitioning (EP)
Podziel dane wejściowe na klasy równoważne.

Wymaganie: *"Zniżka 10% dla zamówień 100–500 PLN, 15% dla > 500 PLN"*

Klasy:
- Klasa 1: < 100 PLN (brak zniżki)
- Klasa 2: 100–500 PLN (10%)
- Klasa 3: > 500 PLN (15%)
- Boundary: 99.99, 100.00, 500.00, 500.01

### Decision Table
Gdy wymaganie ma wiele warunków:

| Warunek A | Warunek B | Akcja |
|-----------|-----------|-------|
| TAK | TAK | Wynik 1 |
| TAK | NIE | Wynik 2 |
| NIE | TAK | Wynik 3 |
| NIE | NIE | Wynik 4 |

Tworzysz tabelę decyzji i testujesz każdą kombinację.

## Jak Zadawać Pytania o Wymagania?

Nie kwestionuj — pytaj z ciekawości:

> *"W wymaganiu jest napisane 'użytkownik może anulować zamówienie'. Co się dzieje gdy zamówienie jest już w trakcie wysyłki? Czy anulowanie jest możliwe i jak to wygląda?"*

Takie pytanie na refinemencie = 1h dyskusji.
Ten sam brak wiedzy na testowaniu = 2 dni opóźnienia i nowy ticket.
