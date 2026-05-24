# Cykl Życia Błędu

Każdy bug przechodzi przez określone stany — od momentu odkrycia do zamknięcia. Rozumienie tego cyklu pozwala QA efektywnie zarządzać defektami i komunikować się z całym zespołem.

## Stany Błędu

```
New → Assigned → In Progress → Fixed → Verification → Closed
         ↑                         ↓
       Reopened ←─────────── Failed Verification
```

- **New** — bug zgłoszony, jeszcze nie przydzielony
- **Assigned** — developer go dostał
- **In Progress** — developer pracuje nad naprawą
- **Fixed** — developer twierdzi że naprawiony
- **Verification** — QA weryfikuje naprawę
- **Closed** — QA potwierdził naprawę
- **Reopened** — QA odrzucił naprawę — bug wraca

## Kiedy Zamknąć, Kiedy Odrzucić?

Zasada: zamykasz **tylko** wtedy gdy osobiście zweryfikujesz na właściwym środowisku.

Nie zamykaj buga jeśli:
- Weryfikowałeś na złym środowisku
- Naprawiono objaw, nie przyczynę
- Bug nie reproduced w tym samym scenariuszu co oryginał

## Duplikaty i Powiązania

Podczas triażu (oceny bugów) szukaj:

- **Duplikatów** — ten sam bug zgłoszony dwukrotnie → jeden zamknij jako `Duplicate of #XX`
- **Powiązanych bugów** — inne objawy tej samej przyczyny → linkuj w komentarzu

## Metryki Błędów

QA senior monitoruje te liczby sprint po sprincie:

| Metryka | Co mówi |
|---------|---------|
| Defect Density | Ile bugów na 1000 linii kodu |
| Defect Escape Rate | % bugów które wyszły na produkcję |
| Mean Time to Fix | Średni czas naprawy |
| Reopen Rate | % bugów zwróconych do devsów |

Wysoki Reopen Rate (>15%) to sygnał: albo devy naprawiają powierzchownie, albo QA weryfikuje zbyt szybko.
