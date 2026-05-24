# Zarządzanie Priorytetami — Kiedy Wszystko Jest "Pilne"

W dużej firmie każdy stakeholder uważa swój task za najważniejszy. QA jest w środku tych konfliktów. Musisz umieć zarządzać oczekiwaniami i własnymi priorytetami.

## Macierz Eisenhowera dla QA

```
                WAŻNE               NIEWAŻNE
PILNE    │ Zrób natychmiast    │ Deleguj lub odmów  │
         │ (critical bug,      │ (meeting bez        │
         │ blokada release)    │ agendy, spam)       │
─────────┼────────────────────┼────────────────────│
NIEPILNE │ Zaplanuj            │ Wyeliminuj          │
         │ (dokumentacja,      │ (raportowanie które  │
         │ refaktor testów,    │ nikt nie czyta)     │
         │ automatyzacja)      │                     │
```

## Technika MoSCoW dla Bug Triażu

Gdy masz 20 bugów i 3 dni do release:

- **Must Have** — bez naprawy release niemożliwy (critical, high z blokerem)
- **Should Have** — ważne ale można wypuścić bez nich (medium impact)
- **Could Have** — mile widziane (low severity, estetyczne)
- **Won't Have (this time)** — odłożone na następny sprint

## Negocjowanie Priorytetów z PM

Gdy PM chce żebyś przetestował feature X ale masz otwarty critical bug Y:

**Nie mów:** "Nie mogę tego teraz zrobić."

**Mów:** "Mam otwartego buga Y który blokuje checkout. Jeśli chcesz żebym teraz skoczył na feature X, potrzebuję decyzji: akceptujemy ryzyko z Y, czy priorytetyzujemy naprawę?"

Daj decyzję, nie odmowę.

## Czas Skupionej Pracy

Testowanie wymaga koncentracji. Constant interrupt culture = niskie jakość.

Strategie ochrony czasu:
- Blokuj 2–3h rano w kalendarzu jako "Deep Testing"
- Notifications Slack wyciszone przez ten czas
- Komunikuj: "Od 9 do 11 jestem offline — wróćmy po tym oknie"

## Kiedy Powiedzieć "Nie"

"Nie" to pełne zdanie. Jako QA masz prawo odmówić:
- Testowania feature'a bez specyfikacji
- Zamknięcia buga bez weryfikacji "bo PM prosi"
- Skrócenia czasu testowania bez formalnego akceptowania ryzyka

Każde "tak" na nieuzasadnioną prośbę jest długiem jakości który spłacisz w incydencie produkcyjnym.
