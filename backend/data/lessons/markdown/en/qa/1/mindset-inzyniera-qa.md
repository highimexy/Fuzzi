# Mindset Inżyniera QA

Wiedza techniczna to 40% pracy QA. Pozostałe 60% to sposób myślenia — jak patrzysz na oprogramowanie, jak reagujesz na presję i jak traktujesz błędy.

## Myślenie Destrukcyjne

Dobry QA myśli jak osoba, która chce zepsuć system. Nie złośliwie — metodycznie.

Gdy widzisz formularz rejestracji, nie myślisz: *„czy to działa?"*. Myślisz:

- Co jeśli wstawię emoji jako imię?
- Co jeśli email ma 500 znaków?
- Co jeśli kliknę Submit dwa razy w 100ms?
- Co jeśli wyłączę JavaScript?
- Co jeśli zmienię wartość ukrytego pola w DevTools?

> Developer buduje mosty. QA próbuje je zawalić — zanim zrobi to produkcja.

## Ciekawość jako Narzędzie

Najlepsi QA, których spotkasz, są patologicznie ciekawi. Nie przyjmują rzeczy za pewnik.

**Zła postawa:** *„Test przeszedł, można releasować."*

**Dobra postawa:** *„Test przeszedł. Czy test pokrywa właściwy scenariusz? Czy scenariusz odzwierciedla jak użytkownicy naprawdę używają aplikacji?"*

Pytaj dlaczego. Pytaj co jeśli. Pytaj kto i kiedy.

## QA jako Adwokat Użytkownika

Twoja praca to nie walka z developerami. To reprezentowanie użytkownika, który nigdy nie będzie w Waszym pokoju podczas code review.

Użytkownik:
- Używa Internetu na wolnym 3G w pociągu
- Klika Wstecz w przeglądarce i nie rozumie dlaczego traci dane
- Nie czyta instrukcji
- Używa Safari, a nie Chrome
- Ma włączony screen reader

Gdy zgłaszasz buga — jesteś głosem tej osoby.

## Odpowiedzialność bez Wszechwiedzy

QA nie jest odpowiedzialny za *brak bugów* — nikt nie może zagwarantować bezbłędnego oprogramowania. QA jest odpowiedzialny za:

1. Systematyczne testowanie ryzyk
2. Jasne komunikowanie co zostało przetestowane, a co nie
3. Transparentność decyzji *„release mimo ryzyka"*

Gdy coś wychodzi na produkcję — to decyzja całego zespołu, nie tylko QA.

## Ego jest Wrogiem

Najgorszy QA jaki możesz spotkać to ten, który:
- Blokuje release żeby pokazać władzę
- Cieszy się gdy developer ma buga
- Pisze raporty bugów, które brzmią jak oskarżenia

Najlepszy QA to partner — nie policjant.
