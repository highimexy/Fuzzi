# Profesjonalny Raport Buga — Sztuka Komunikacji

Znalezienie buga to umiejętność techniczna. Opisanie go tak żeby developer mógł go naprawić bez pytania o 10 dodatkowych informacji — to umiejętność komunikacyjna. Ta druga jest rzadsza i bardziej ceniona.

## Anatomia Idealnego Raportu Buga

### Tytuł — najważniejsza linijka

Tytuł musi odpowiadać na pytanie: "Gdzie? Co? Przy jakiej akcji?"

**Formuła:** `[Moduł]: [Objaw] przy [Akcja]`

| Zły tytuł | Dobry tytuł |
|-----------|-------------|
| "Nie działa" | "Checkout: błąd 500 przy zamówieniu z kodem rabatowym 100%" |
| "Bug w logowaniu" | "Login: konto nie blokuje się po 5 błędnych próbach" |
| "Problem z uplodem" | "Profil: upload zdjęcia >2MB kończy się cichym brakiem odpowiedzi" |

### Środowisko — pełne dane
Niepełne środowisko = developer nie może zreprodukować = czas stracony.

Minimum:
```
Przeglądarka: Chrome 124.0.6367.82
OS: Windows 11 Pro (22H2)
Rozdzielczość: 1920×1080
Środowisko: staging (deploy z 2025-05-23)
Dane testowe: konto user_test@example.com, produkt SKU-4521
```

### Kroki reprodukcji — precyzja chirurgiczna

Każdy krok to jedna atomowa akcja. Developer powinien przeczytać kroki i wykonać je mechanicznie.

❌ Złe:
```
1. Zaloguj się
2. Przejdź do zamówień
3. Spróbuj coś usunąć
```

✅ Dobre:
```
1. Otwórz https://staging.example.com/login
2. Wpisz email: user_test@example.com, hasło: Test1234!
3. Kliknij "Zaloguj się"
4. Kliknij "Moje zamówienia" w górnym menu
5. Znajdź zamówienie #ORD-2024-1128 (status: "Oczekujące")
6. Kliknij ikonę kosza przy tym zamówieniu
7. W dialogu potwierdzenia kliknij "Tak, usuń"
```

### Oczekiwane vs Rzeczywiste

Zawsze jedno zdanie każde:

```
Oczekiwane: Zamówienie zostaje usunięte, pojawia się komunikat "Zamówienie usunięte"
Rzeczywiste: Pojawia się komunikat "Usunięto" ale zamówienie nadal widoczne na liście po odświeżeniu
```

### Severity i uzasadnienie

Nie tylko oznacz severity — napisz DLACZEGO:

```
Severity: Major
Uzasadnienie: Użytkownik myśli że usunął zamówienie (pojawia się komunikat), 
ale zamówienie dalej istnieje. Może to prowadzić do niechcianych zamówień 
i pobłędnych płatności. Brak obejścia dla użytkownika.
```

## Jak Dołączać Dowody?

### Screenshot — co pokazywać
- Cały ekran (nie wycinek) — kontekst jest ważny
- Zaznacz/strzałką wskaż gdzie jest bug
- Zrób screenshot PRZED i PO (dla porównania)

### Nagranie ekranu — kiedy obowiązkowe
- Bug jest flaky (czasami się pojawia)
- Bug wymaga wielu kroków
- Bug jest wizualny/animacyjny

### Logi z DevTools — złoto dla developera
```
Console: Uncaught TypeError: Cannot read property 'id' of null
Network: DELETE /api/orders/ORD-2024-1128 → 200 OK (ale rekord nadal w bazie?)
```

## Czego Nigdy Nie Pisać w Raporcie Buga

**Oskarżeń:**
❌ "Developer nie przetestował tego"
❌ "Jak można było to przeoczyć"

**Rozwiązań technicznych:**
❌ "Prawdopodobnie null pointer exception w OrderController"
(Twoja rola to opis problemu, nie diagnoza kodu)

**Nieokreśloności:**
❌ "Czasami nie działa" bez kroków repro
❌ "Wydaje mi się że..."

## Template do Skopiowania

```markdown
## [Moduł]: [Tytuł buga]

**Środowisko:**
- Przeglądarka: 
- OS: 
- Środowisko: 
- Wersja/Deploy: 
- Dane testowe: 

**Kroki reprodukcji:**
1. 
2. 
3. 

**Oczekiwane zachowanie:**

**Rzeczywiste zachowanie:**

**Severity:** [Critical/Major/Minor/Trivial]
**Priority:** [P1/P2/P3/P4]
**Częstotliwość:** [Zawsze/Często/Rzadko/Jednorazowo]

**Załączniki:** [screenshot/nagranie/logi]
```
