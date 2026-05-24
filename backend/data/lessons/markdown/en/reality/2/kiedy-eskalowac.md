# Kiedy Eskalować — i Jak Robić To Właściwie

Eskalacja to nie przyznanie się do porażki. To narzędzie zarządzania ryzykiem. Wiedzieć kiedy eskalować — i jak to zrobić — to cecha dojrzałego QA.

## Kiedy NIE Eskalować

Zanim eskalujesz, upewnij się że:

- Próbowałeś rozwiązać bezpośrednio z zainteresowanymi
- Masz konkretne fakty, nie tylko odczucia
- Problem naprawdę wymaga decyzji powyżej Twojego poziomu

Eskalowanie każdego drobiazgu to "chłopiec który wołał wilka" — po czasie nikt nie traktuje Cię poważnie.

## Kiedy Eskalować

Eskaluj gdy:
1. **Bezpieczeństwo użytkowników** — krytyczny bug security, ryzyko utraty danych
2. **Blokada biznesowa** — defekt blokuje release a developer odmawia naprawy
3. **Konflikt priorytetów** — QA i PM mają sprzeczne priorytety których nie możesz rozwiązać
4. **Przekroczenie terminów** — bug nie jest naprawiony mimo zbliżającego się deadline
5. **Brak odpowiedzi** — developer/PM nie odpowiada przez 24h+ w krytycznym momencie

## Jak Eskalować Profesjonalnie

**Zły sposób:**
> "Marek nie naprawia bugów i blokuje release!"

**Dobry sposób:**
> "Mamy buga #1234 (Critical) który blokuje płatności zagraniczne. Deadline release za 2 dni. Zgłosiłem go Markowi 3 dni temu — nie otrzymałem odpowiedzi. Potrzebuję decyzji: czy release zostaje opóźniony, czy priorytetyzujemy naprawę?"

Różnica: fakty, timeline, konkretna decyzja której szukasz.

## Eskalacja Mailowa — Wzorzec

```
DO: manager
CC: developer, PM
Temat: [Pilne] Bug #1234 blokuje release 2025-06-10

Kontekst: [1-2 zdania]
Problem: [co, gdzie, impact]
Dotychczasowe działania: [co zrobiłeś żeby rozwiązać]
Potrzebna decyzja: [konkretnie czego oczekujesz]
```

## Po Eskalacji

- Dokumentuj odpowiedź (email/ticket)
- Jeśli decyzja jest "acceptujemy ryzyko" — zapisz kto podjął decyzję
- Nie eskaluj ponownie bez nowych faktów
