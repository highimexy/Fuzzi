# Testowanie Eksploracyjne — Zaawansowane Techniki

Podstawy eksploracji znasz. Czas przejść do strukturyzowanego podejścia które odróżnia mid QA od seniora.

## Session-Based Test Management (SBTM)

SBTM to framework który dodaje strukturę do eksploracji bez zabijania jej elastyczności.

**Anatomia sesji:**
- **Charter**: co testujesz i w jakim celu (nie jak)
- **Czas**: zazwyczaj 45-90 minut, bez przerw
- **Notatki**: co zrobiłeś, co znalazłeś, gdzie miałeś pytania
- **Debrief**: 15 minut po sesji — co wyniknęło

**Przykładowy charter:**
```
Cel: Zbadaj zachowanie koszyka zakupowego przy jednoczesnych modyfikacjach
Obszar: Koszyk — dodawanie, usuwanie, zmiana ilości
Czas: 60 minut
Ryzyko które sprawdzam: race conditions, stale data
```

Charter NIE mówi "kliknij w to, potem to, potem to". Mówi gdzie iść — nie jak chodzić.

## Heurystyki Testowania Eksploracyjnego

Heurystyki to skróty myślowe które kierują eksploracją. Najważniejsze zestawy:

### SFDIPOT (Nick Kaner)
- **S**tructure — jak system jest zbudowany?
- **F**unction — co robi?
- **D**ata — jakie dane przyjmuje/przetwarza?
- **I**nterface — jak się z nim komunikujesz?
- **P**latform — na czym działa?
- **O**perations — kto i jak go używa?
- **T**ime — jak zachowuje się w czasie?

### Heurystyki CRUD
Dla każdej encji (np. "zamówienie"):
- Create — czy można stworzyć? z każdymi danymi?
- Read — czy można odczytać? kto ma dostęp?
- Update — czy można edytować? z jakimi ograniczeniami?
- Delete — czy można usunąć? co się dzieje z powiązanymi danymi?

### Heurystyki Wartości Brzegowych (nie tylko liczby)
- Pusta wartość, null, undefined
- Minimum i minimum-1
- Maksimum i maksimum+1
- Bardzo długi string (10,000 znaków)
- Znaki specjalne: `<script>`, `'; DROP TABLE`, emoji, znaki RTL
- Liczby ujemne gdzie oczekiwane są dodatnie
- Zero gdzie oczekiwana jest wartość > 0

## Testowanie Oparte na Ryzyku

Nie masz czasu testować wszystkiego. Risk-based testing pozwala wybrać co testować najpierw.

**Macierz ryzyka:**

```
Prawdopodobieństwo × Wpływ = Priorytet

Wysoki wpływ + Wysokie prawdopodobieństwo → Testuj natychmiast
Wysoki wpływ + Niskie prawdopodobieństwo → Testuj
Niski wpływ + Wysokie prawdopodobieństwo → Opcjonalnie
Niski wpływ + Niskie prawdopodobieństwo → Pomiń lub automatyzuj
```

**Czynniki wpływu:**
- Bezpieczeństwo (leak danych = wysoki wpływ zawsze)
- Pieniądze (błąd w płatnościach > błąd w tooltipie)
- Liczba userów dotknięta błędem
- Łatwość naprawy po produkcji

**Czynniki prawdopodobieństwa:**
- Złożoność kodu (więcej edge cases = większe ryzyko)
- Historia bugów w tym module
- Nowy developer vs doświadczony
- Zmiany w ostatnim sprincie

## Techniki Generowania Pomysłów Testowych

### Mindmapping
Zanim zaczniesz testować, narysuj mapę myśli:

```
[Login]
├── Happy path (poprawne dane)
├── Błędne hasło
│   ├── Ile prób zanim blokada?
│   └── Czy blokada jest po IP czy koncie?
├── Edge cases
│   ├── Email z wielką literą vs małą
│   ├── Spacja na początku emaila
│   └── Bardzo długi email (500 znaków)
├── Bezpieczeństwo
│   ├── SQL injection w polu email
│   ├── Brute force protection
│   └── Session fixation
└── Dostępność
    ├── Tab navigation
    └── Screen reader
```

### Technika "Jak Zepsuć"
Zamiast pytać "co powinienem testować", pytaj:
- "Jak mógłbym jako złośliwy user zepsuć tę funkcję?"
- "Co się stanie jeśli sieć padnie w połowie?"
- "Co jeśli user kliknie dwukrotnie szybko?"
- "Co jeśli sesja wygaśnie podczas operacji?"

## Tour Testing

Metafora turysty odwiedzającego miasto. Elizabeth Hendrickson zaproponowała konkretne "trasy":

**Trasa "Przewodnika"**: Przetestuj najczęstsze user journeys — to co 80% userów robi codziennie.

**Trasa "Złego Sąsiada"**: Szukaj rzeczy które psują inne funkcje — testy które generują dirty data.

**Trasa "Śmieciarza"**: Testuj z najgorszymi możliwymi danymi wejściowymi — empty, null, overflow.

**Trasa "Turysty"**: Testuj funkcje które rzadko są testowane — ustawienia, edge pages, help section.

**Trasa "Historyka"**: Testuj stare bugi — czy regression testing pokrywa znane problemy z przeszłości?

## Dokumentowanie Sesji Eksploracyjnych

Notatki z sesji powinny być użyteczne po tygodniu, nie tylko w momencie pisania.

**Dobra notatka:**
```
Sesja: Checkout flow — płatności kartą
Czas: 14:00-15:15 (75 minut)

WYKONAŁEM:
- Happy path Visa + MasterCard ✓
- Karta z wygasłym datą → błąd wyświetlony poprawnie ✓
- Karta odrzucona przez bank → PROBLEM: brak retry option

ZNALAZŁEM:
- Bug #1: Po odrzuceniu karty, pole CVV jest wyczyszczone ale pole numeru karty nie → trzeba wpisywać od nowa tylko CVV → UX confusion
- Bug #2: Komunikat "Payment failed" bez kodu błędu → support nie wie co powiedzieć klientowi

PYTANIA OTWARTE:
- Czy istnieje limit prób płatności? Nie znalazłam w specyfikacji.
- Co się dzieje z order jeśli payment timeout po 30 sekundach?

NASTĘPNA SESJA: zbadać payment timeouts i błędy sieciowe
```
