# Testowanie Użyteczności — QA jako Głos Użytkownika

Usability testing to nie ocena estetyki. To sprawdzenie czy użytkownicy mogą wykonać swoje zadania efektywnie, bez frustracji i błędów. QA który rozumie użyteczność widzi bugi które formalnie nie są bugami — ale psują doświadczenie użytkownika.

## Czym Użyteczność Różni Się od Funkcjonalności

Funkcjonalność: "Czy przycisk 'Wyślij' działa?"
Użyteczność: "Czy użytkownik wie że ma kliknąć ten przycisk?"

Aplikacja może być w pełni funkcjonalna i jednocześnie nieprzyjazna użytkownikowi.

**Klasyczne przykłady problemów użyteczności:**
- Formularz który wymazuje dane po błędzie walidacji
- Komunikat błędu: "Operacja nie powiodła się" bez wyjaśnienia co i jak naprawić
- Przycisk który wygląda jak dekoracja (nie widać że jest klikalny)
- Potwierdzenie "Czy na pewno chcesz usunąć?" bez nazwy elementu który usuwasz

## Pięć Wymiarów Użyteczności (Nielsen)

### Learnability (Nauczalność)
Jak łatwo użytkownik może wykonać zadanie po raz pierwszy?

**Test:** Pokaż nową funkcję osobie która jej nie widziała. Daj zadanie. Nie pomagaj. Obserwuj.

### Efficiency (Efektywność)
Jak szybko użytkownik może wykonać zadanie gdy już zna interfejs?

**Mierz:** Liczba kliknięć, czas, liczba pomyłek.

### Memorability (Zapamiętywanie)
Po przerwie — czy użytkownik pamięta jak korzystać z interfejsu?

### Error Rate (Błędy)
Ile błędów popełnia użytkownik? Jak poważne? Jak łatwo je cofnąć?

### Satisfaction (Satysfakcja)
Czy korzystanie jest przyjemne? (Ocena subiektywna — SUS score, NPS)

## Jak QA Testuje Użyteczność

### Heurystyczna Ocena (Expert Review)

Oceniasz interfejs przez pryzmat 10 heurystyk Nielsena:

1. **Widoczność stanu systemu** — czy użytkownik wie co się dzieje? (spinner, progress bar)
2. **Dopasowanie do świata realnego** — czy język i metafory są zrozumiałe?
3. **Kontrola użytkownika** — czy można cofnąć akcję?
4. **Spójność i standardy** — czy podobne elementy wyglądają i działają tak samo?
5. **Zapobieganie błędom** — czy interfejs zmniejsza ryzyko pomyłek?
6. **Rozpoznanie vs przypomnienie** — czy opcje są widoczne bez zapamiętywania?
7. **Elastyczność i efektywność** — czy power users mają skróty?
8. **Estetyka i minimalny design** — czy jest zbędna informacja?
9. **Pomoc w rozpoznaniu i naprawie błędów** — czy komunikaty błędów są zrozumiałe?
10. **Pomoc i dokumentacja** — czy jest pomoc gdy potrzeba?

### Shadowing / Think-Aloud Testing

Obserwujesz prawdziwego użytkownika który mówi na głos co myśli:

```
Zadanie: "Zmień adres email w swoim profilu."

Obserwacje:
00:15 — użytkownik szuka w menu "Ustawienia" (nie ma)
00:32 — klika ikonę konta → widzi "Profil"
00:45 — mówi "Gdzie jest email? Nie widzę pola email"
01:10 — mówi "O, muszę kliknąć Edit żeby zobaczyć pola" (przycisk nie był widoczny)
01:45 — zmienia email, klika Save
01:50 — pyta "Czy zapisało się? Jak mam to wiedzieć?"
```

Każde wahanie, błąd i pytanie to potencjalny bug użyteczności.

### 5-Second Test

Pokaż stronę przez 5 sekund. Potem zapytaj:
- "Czemu służy ta strona?"
- "Co możesz tutaj zrobić?"
- "Co przykuło Twoją uwagę?"

Jeśli nie potrafią odpowiedzieć — hierarchia wizualna lub komunikacja są złe.

## Typowe Bugs Użyteczności

### Brak Feedback po Akcji
```
❌ Użytkownik klika "Zapisz" — nic się nie dzieje wizualnie
✅ Po kliknięciu: spinner → "Zapisano pomyślnie" → auto-zamknięcie
```

### Niespójne Zachowanie
```
❌ Jeden modal zamkniesz Escape, inny tylko X, trzeci przez kliknięcie tła
✅ Wszystkie modale zamykają się tak samo
```

### Destruktywne Akcje bez Potwierdzenia
```
❌ Kliknięcie "Usuń" od razu usuwa bez pytania
✅ "Usuń dokument 'Raport Q1 2024'? Tej operacji nie można cofnąć. [Usuń] [Anuluj]"
```

### Komunikaty Błędów Techniczne
```
❌ "Error 422: Unprocessable Entity"
✅ "Adres email jest nieprawidłowy. Sprawdź format: jan@firma.com"
```

### Brak Stanu Pustego
```
❌ Pusta lista zamówień pokazuje... nic
✅ "Nie masz jeszcze żadnych zamówień. [Przeglądaj produkty]"
```

## Bugs Użyteczności vs Bugs Funkcjonalne

| Typ | Przykład | Severity |
|---|---|---|
| Funkcjonalny | Przycisk nie reaguje na kliknięcie | High |
| Użyteczność (Critical) | Użytkownik nie może znaleźć przycisku płatności | High |
| Użyteczność (High) | Komunikat błędu nie mówi jak naprawić | Medium |
| Użyteczność (Medium) | Brak loadera przy długiej operacji | Low/Medium |
| Użyteczność (Low) | Kolejność Tab-owania nielogiczna | Low |

## Checklist Użyteczności

```
□ Każda akcja ma feedback (loading state, success/error message)
□ Komunikaty błędów opisują problem i sposób naprawy
□ Destruktywne akcje wymagają potwierdzenia z nazwą elementu
□ Stan pusty jest zaprojektowany (nie brak contentu)
□ Przyciski i linki są wizualnie rozróżnialne od zwykłego tekstu
□ Formularze nie wymazują danych po błędzie
□ Użytkownik wie gdzie jest w aplikacji (breadcrumbs, tytuły stron)
□ Cofanie/anulowanie jest dostępne dla nieodwracalnych akcji
□ Język UI jest zrozumiały bez dokumentacji
□ Spójne wzorce w całej aplikacji (ta sama akcja = te same elementy UI)
```
