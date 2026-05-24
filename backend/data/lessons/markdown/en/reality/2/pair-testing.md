# Pair Testing — Testowanie w Duecie z Developerem

Pair testing to testowanie w parze: QA i developer razem, przy jednym komputerze lub na wspólnym screenshare. Wygląda nieefektywnie — ale daje wyniki których żadne z nich nie osiągnie osobno.

## Dlaczego Pair Testing Działa

Developer wie jak kod jest napisany — gdzie są edge cases, co może się posypać, jakie założenia zostały zrobione.

QA wie jak testować — jakie pytania zadać, jak myśleć o zachowaniu użytkownika, jak izolować buga.

Razem: developer pokazuje co zrobił, QA pyta "co jeśli?", developer od razu widzi buga który pominął — i rozumie dlaczego go nie testował.

## Kiedy Pair Testing Ma Sens

### Skomplikowana Nowa Funkcja
Developer właśnie skończył coś złożonego. Zamiast pisać specyfikację i przekazywać QA — siada razem i wyjaśnia podczas testowania.

### Buga Który Trudno Zreprodukować
QA nie może odtworzyć. Developer twierdzi że u niego działa. Pair session: QA pokazuje co robi, developer widzi w czym tkwi różnica środowiska.

### Onboarding Nowego QA
Junior QA uczy się modułu przez pair testing z developerem który go napisał.

### Obszar o Dużym Ryzyku przed Release
Krytyczny moduł (płatność, auth) testowany parą daje pewność że nikt nic nie pominął.

## Jak Zorganizować Sesję

**Czas:** 60-90 minut. Dłużej = zmęczenie i malejące rezultaty.

**Role:**
- **Driver** (zazwyczaj QA) — obsługuje klawiaturę, testuje, mówi na głos co robi
- **Navigator** (zazwyczaj developer) — obserwuje, sugeruje kierunki, wyjaśnia kod gdy potrzeba

Role mogą się zmieniać.

**Przed sesją (5 minut):**
- Zdefiniuj misję: co testujesz i co chcesz odkryć
- Ustal że developer nie steruje — obserwuje i komentuje

**W trakcie sesji:**
- Driver mówi na głos co myśli: "Sprawdzam co się stanie gdy dam pustą wartość..."
- Navigator: "Ten case jest obsługiwany przez walidację w linii 45, ale jeśli spróbujesz..."
- Notuj na bieżąco wszystko co znaleźliście

**Po sesji (10 minut):**
- Podsumowanie: co znaleźliście, co warto zgłosić jako bugi, co warto dodać do regresji

## Co Pair Testing Odkrywa Czego Inne Metody Nie Odkrywają

### Ukryte Założenia
Developer zakłada że użytkownik zawsze robi X przed Y. QA robi Y bez X. Bug.

```
Przykład:
Dev zakłada: user zawsze najpierw wypełni dane karty, potem kliknie Pay
QA testuje: klikam Pay z pustym formularzem
Wynik: aplikacja crashuje zamiast pokazać walidację
```

### Code-Level Insight
Developer: "Ten edge case jest obsługiwany inaczej jeśli użytkownik ma flagę `legacy_account` ustawioną na true."
QA: Testuje z tym kontem. Znajdzie bugi które bez tej wskazówki nigdy by nie sprawdził.

### Dwustronne Zrozumienie
Developer po session: "Nie wiedziałem że QA patrzy na to w ten sposób — muszę to uwzględnić następnym razem."
QA po session: "Rozumiem teraz dlaczego ten kod działa tak a nie inaczej — wiem co testować."

## Jak Prosić Developera o Pair Testing

Wielu developerów nie zna tego podejścia lub boi się że będzie "oceniany".

**Zaproś, nie nakazuj:**
> "Hej Krzysiek, mam nowe zadanie z modułem płatności. Mógłbyś poświęcić 60 minut żebyśmy przetestowali to razem? Zależy mi na Twojej perspektywie co może się posypać — będziesz tylko obserwować i podpowiadać, keyboard jest u mnie."

**Podkreśl wzajemność:** to nie jest audyt kodu, to wspólna sesja.

**Zacznij od małego:** pierwsza sesja to może być 30 minut na prosty moduł.

## Pair Testing vs Code Review

| | Code Review | Pair Testing |
|---|---|---|
| Kiedy | Przed merge | Po implementacji |
| Co sprawdza | Jakość kodu | Zachowanie aplikacji |
| Perspektywa | Statyczna (kod) | Dynamiczna (działanie) |
| Czas | Asynchronicznie | Synchronicznie |
| Efekt | Lepsza jakość kodu | Więcej bugów przed release |

Oba są potrzebne — uzupełniają się.

## Pair Testing w Distributed Teamie

Zdalnie:
- Screenshare (Google Meet, Zoom, Teams)
- Driver dzieli ekran, navigator obserwuje i komentuje głosowo
- Notatki na wspólnym dokumencie (Notion, Google Docs)
- Nagrywaj sesję jeśli chcesz mieć zapis co znaleźliście

Zdalne pair testing jest trochę mniej efektywne niż fizyczne (trudniej wskazać element na ekranie) — ale nadal bardzo wartościowe.
