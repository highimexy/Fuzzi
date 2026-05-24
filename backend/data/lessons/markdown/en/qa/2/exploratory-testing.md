# Exploratory Testing — Testowanie bez Scenariusza

Masz 2 godziny, nową funkcję i zero przypadków testowych. Co robisz? To jest właśnie exploratory testing — i jest to jedna z najcenniejszych umiejętności w QA.

## Czym Jest Exploratory Testing?

Exploratory testing to jednoczesne uczenie się, projektowanie i wykonywanie testów. Nie masz gotowego skryptu — uczysz się aplikacji, projektując testy w locie na podstawie tego czego się uczysz.

To **nie** jest testowanie ad-hoc (klikanie losowo). To **strukturyzowana eksploracja**.

## Session-Based Testing

Najskuteczniejsza technika ET to testowanie sesjami:

### Struktura sesji:
1. **Charter** — cel sesji (co konkretnie eksplorujesz)
2. **Timebox** — czas trwania (zazwyczaj 60–90 minut)
3. **Notatki** — co widziałeś, co testowałeś, co znalazłeś
4. **Debrief** — podsumowanie po sesji

### Przykładowy charter:
> *„Zbadaj zachowanie koszyka zakupowego gdy użytkownik ma aktywne produkty w wielu walutach. Fokus: edge case'y kwot i zaokrąglania. Czas: 60 minut."*

## Heurystyki Testowe

Heurystyki to skróty myślowe które pomagają generować pomysły testowe szybko.

### SFDIPOT (James Bach):
- **S**tructure — co składa się na system?
- **F**unction — co system robi?
- **D**ata — jakie dane przetwarza?
- **I**nterface — jak się łączy z innymi systemami?
- **P**latform — na czym działa?
- **O**perations — jak będzie używany?
- **T**ime — jak zachowuje się w czasie?

### CRUD:
Każdą funkcję sprawdź pod kątem: Create, Read, Update, Delete. Większość bugów pojawia się na granicach tych operacji.

## Tour-Based Testing

Wyobraź sobie że aplikacja to miasto. Możesz zwiedzać je różnymi trasami:

- **Trasa Turysty** — podstawowe funkcje jak nowy użytkownik
- **Trasa Wandala** — celowo złe dane, klikanie Wstecz, odświeżanie w połowie procesu
- **Trasa Kolekcjonera** — zbierz wszystkie typy obiektów (wszystkie typy zamówień, statusy, role)
- **Trasa Złego Sąsiada** — jak jedna funkcja wpływa na inne

## Dokumentowanie ET

Wiele osób rezygnuje z ET bo myśli że "nie da się udokumentować". Da się.

Minimalna dokumentacja sesji:
```
Charter: [cel]
Czas: [kiedy, jak długo]
Środowisko: [wersja, przeglądarka, dane]
Testowane obszary: [lista]
Znalezione bugi: [lista z numerami ticketów]
Pytania/wątpliwości: [lista]
```

Nie musisz pisać każdego kroku — piszesz co eksplorowałeś i co znalazłeś.

## Kiedy ET, Kiedy Skrypt?

| Sytuacja | Użyj |
|----------|------|
| Nowa funkcja, mało wymagań | ET |
| Regresja przed releasem | Skrypty |
| Bug hunt po incydencie | ET |
| Certyfikacja/compliance | Skrypty |
| Sprint demo | ET |

Dobry QA wie kiedy improwizować, a kiedy trzymać się planu.
