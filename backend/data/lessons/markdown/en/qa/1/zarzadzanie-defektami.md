# Zarządzanie Defektami — Cykl Życia Buga

Znalezienie buga to dopiero połowa roboty. Drugi pół to przeprowadzenie go przez cały cykl życia — od zgłoszenia do zamknięcia. Bez tej umiejętności bugi giną w backlogu.

## Cykl Życia Defektu

```
New → Assigned → In Progress → Fixed → Ready for Retest → Verified → Closed
                                   ↓
                               Rejected / Duplicate / Won't Fix → Closed
```

### Statusy i kto za co odpowiada:

| Status | Akcja | Odpowiedzialny |
|--------|-------|----------------|
| New | Zgłoszony przez QA | QA |
| Assigned | Przypisany do developera | QA/PM |
| In Progress | Developer naprawia | Developer |
| Fixed | Developer oznaczył jako naprawiony | Developer |
| Ready for Retest | Gotowy do retestowania | Developer |
| Verified | QA potwierdził naprawę | QA |
| Closed | Bug zamknięty | QA/PM |
| Rejected | Developer odrzucił (not a bug) | Developer |
| Won't Fix | Decyzja biznesowa — nie naprawiamy | PM |

## Severity vs Priority

To najczęściej mylone pojęcia w QA.

### Severity — jak poważny jest bug technicznie?
- **Critical** — system nie działa, crash, utrata danych
- **Major** — ważna funkcja nie działa, brak obejścia
- **Minor** — funkcja działa z błędem, jest obejście
- **Trivial** — kosmetyczny, nie wpływa na UX

### Priority — jak szybko należy naprawić?
- **P1** — natychmiast (blokuje produkcję)
- **P2** — w tym sprincie
- **P3** — w następnym sprincie
- **P4** — kiedyś (backlog)

### Przykład rozbieżności:
Bug: literówka na stronie głównej przed wielkim eventem marketingowym.
- Severity: Trivial (kosmetyczny)
- Priority: P1 (event jutro, CEO widzi)

Bug: crash w rzadko używanej funkcji eksportu PDF.
- Severity: Critical (crash!)
- Priority: P3 (używa 0.5% użytkowników, workaround istnieje)

## Jak Pisać Dobry Raport Buga?

### Tytuł — konkretny, nie ogólny
❌ "Coś nie działa w zamówieniach"
✅ "Checkout: zamówienie z kodem rabatowym 100% powoduje błąd 500"

### Opis zawiera:
1. **Kroki reprodukcji** — numerowane, każdy krok to jedna akcja
2. **Oczekiwane zachowanie** — co POWINNO się stać
3. **Rzeczywiste zachowanie** — co SIĘ DZIEJE
4. **Środowisko** — przeglądarka, wersja, OS, dane testowe
5. **Severity i Priority**
6. **Załączniki** — screenshot, nagranie, logi

### Krytyczne zasady:
- Jeden bug = jeden ticket (nie mieszaj problemów)
- Sprawdź czy bug już nie jest zgłoszony (duplikaty marnują czas)
- Dołącz repro steps które działają zawsze (nie "czasami się zdarza")

## Trudne Sytuacje w Zarządzaniu Bugami

### Developer odrzuca buga ("Not a Bug")
Zapytaj: na jakiej podstawie? Czy jest dokumentacja która mówi że to jest zamierzone zachowanie? Jeśli nie ma dokumentacji — to co najmniej brakujące wymaganie.

### Bug zostaje zamknięty bez naprawy ("Won't Fix")
Zapytaj o uzasadnienie biznesowe. Poprawna odpowiedź to: "decyzja biznesowa: koszt naprawy > impact". Nieakceptowalna odpowiedź: "nie ma czasu" bez formalnej decyzji.

### Bug nie może być zreprodukowany przez developera
Sprawdź: czy używałeś tych samych danych testowych? Tego samego środowiska? Czy bug jest flaky (zależy od timing/race condition)? Nagranie wideo z repro steps rozwiązuje 90% takich sporów.

## Metryki Defektów

Senior QA śledzi:
- **Defect density** — bugi / feature point (ocenia jakość developerów)
- **Defect removal efficiency** — % bugów znalezionych przed produkcją
- **Mean time to fix** — średni czas naprawy buga
- **Escaped defects** — bugi które wyszły na produkcję

Te metryki opowiadają historię o procesie — nie o winie.
