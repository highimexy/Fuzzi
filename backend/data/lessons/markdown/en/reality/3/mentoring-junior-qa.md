# Mentoring w QA — Jak Uczyć i Jak Być Uczonym

Mentoring to jeden z najszybszych sposobów na rozwój — dla obu stron. Mentee dostaje doświadczenie. Mentor konsoliduje wiedzę i uczy się tłumaczyć to co "po prostu wie".

## Kiedy Zostajesz Mentorem

Nie musisz być seniorem żeby mentorować. Jeśli masz rok więcej doświadczenia niż ktoś nowy — możesz mu pomóc.

Mentoring w QA zdarza się:
- Formalnie: firma zatrudnia juniora i prosi Cię o onboarding
- Nieformalnie: junior siedzi obok i pyta "jak to zrobić?"
- Rekurencyjnie: ktoś uczył Ciebie, teraz ty uczysz

## Zasady Dobrego Mentora

### Pokazuj Myślenie, nie Odpowiedź

```
❌ "Napisz test tak: [pełne rozwiązanie]"
✅ "Jak myślisz co najpierw sprawdzić? ... Dobrze. A co jeśli user nie jest zalogowany?"
```

Zadawaj pytania które prowadzą do odpowiedzi. Mentee który sam doszedł do rozwiązania — zapamięta je.

### Tłumacz Dlaczego, nie Tylko Co

```
❌ "Zawsze używaj Page Object Model."
✅ "Page Object Model separuje locatory od logiki testu. Gdy UI się zmieni — poprawiasz jedno miejsce, nie 50 testów. Dlatego tego używamy."
```

Zasada bez uzasadnienia to dogmat. Uzasadnienie tworzy zrozumienie.

### Nie Rób za Nich — Siedź Obok

Gdy junior utknął przy zadaniu:
1. Poproś żeby wyjaśnił co próbuje zrobić
2. Zadaj jedno pytanie naprowadzające
3. Daj 5-10 minut na samodzielne rozwiązanie
4. Wróć i zapytaj "do czego doszedłeś?"

Natychmiastowe rozwiązanie problemu przez mentora = junior się nie uczy.

### Feedbacks Kanapkowy — mit

"Feedbacks kanapkowy" (pochwała-krytyka-pochwała) jest sztuczny i ludzie go wyczuwają.

Lepsza zasada: bądź konkretny i rzeczowy.
```
❌ "Świetna robota! Ale testy są słabe. No ale generalnie OK!"
✅ "Testy mają dobrą strukturę. Brakuje mi testów na error states — co się dzieje gdy API zwróci 500? Dodaj te przypadki i będzie kompletne."
```

## Najczęstsze Problemy z Juniorami w QA

### "Testują happy path i nic poza tym"

Junior sprawdza że coś działa gdy wszystko jest OK. Nie sprawdza co się dzieje gdy dane są złe, API pada, użytkownik robi coś nieoczekiwanego.

Ćwiczenie: daj formularz i poproś o listę 20 test cases. Sprawdź ile dotyczy error states.

### "Bugi bez kroków repro"

Junior zgłasza "nie działa" bez kroków. Developer nie może odtworzyć.

Naucz szablonu: tytuł + kroki + oczekiwane + aktualne + środowisko. Rób code review ich bugów.

### "Nie pytają gdy utknęli"

Wiele juniorów siedzi 3 godziny nad problemem nie prosząc o pomoc. Ustal zasadę: "jeśli utknąłeś na 30 minut — pytaj."

### "Traktują każdy bug jako blokujący"

Junior nie ma jeszcze kalibracji severity. Wszystko jest P1.

Tłumacz: severity = wpływ na użytkownika × częstotliwość × reversibility. Daj przykłady.

## Mentoring Dorosłych — Różni się od Szkoły

Junior IT to zazwyczaj dorosły który zmienia karierę lub świeży absolwent. Zasady:

- **Szanuj autonomię** — daj wybór jak podchodzą do problemu
- **Uczenie przez błędy jest OK** — pozwól popełniać błędy w bezpiecznym środowisku
- **Doceniaj postęp, nie tylko wyniki** — "2 tygodnie temu nie wiedziałeś co to race condition, teraz potrafisz go zidentyfikować"
- **Bądź dostępny, nie omnipresent** — nie przesiaduj nad nimi, ale daj znać że mogą pytać

## Jak Być Dobrym Mentee

Jeśli jesteś po drugiej stronie:

**Przygotowuj się do spotkań.** Nie przychodź z "nie wiem co robić". Przychodź z "próbowałem X i Y, utknąłem na Z."

**Rób notatki.** Mentorzy powtarzają to samo 5 razy i denerwuje ich to.

**Pytaj o uzasadnienie.** "Dlaczego tak?" to najlepsza inwestycja w naukę.

**Aplikuj wiedzę.** Jeśli coś usłyszałeś — wypróbuj to przed kolejnym spotkaniem. Feedback loop.

**Dawaj feedback mentorowi.** "Nie rozumiem tej części — czy możesz wytłumaczyć inaczej?" — to nie jest słabość, to pomoc dla mentora.

## Dokumentowanie Wiedzy

Dobry mentor i mentee razem tworzą wiedzę którą można przekazać dalej:

- Spisuj rozwiązane problemy jako "lessons learned"
- Twórz szablony z tłumaczeniami (szablon raportu buga + komentarz dlaczego tak)
- Buduj checklist które junior może używać samodzielnie

Za rok ten junior będzie mentorować kogoś innego. Daj mu narzędzia do tego.
