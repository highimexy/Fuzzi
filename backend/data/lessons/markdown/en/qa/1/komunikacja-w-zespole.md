# Komunikacja QA w Zespole — Słowa Mają Znaczenie

Raport buga to nie tylko opis problemu technicznego. To komunikat do człowieka — developera, PM-a, stakeholdera. Jak to piszesz decyduje czy zostaniesz potraktowany jako partner czy przeszkoda.

## Ton Komunikacji — Oskarżenie vs Obserwacja

Raport buga może brzmieć jak wyrok albo jak informacja. Wybór należy do Ciebie.

**Wyrok:**
> "Nie ma walidacji emaila — jak można było tego nie sprawdzić?"

**Informacja:**
> "Pole email akceptuje format 'test' bez '@' — brakuje walidacji formatu. Może to powodować błędy przy wysyłce korespondencji."

Różnica: druga wersja opisuje co, dlaczego to problem, bez przypisywania winy.

## Komunikacja z Różnymi Odbiorcami

### Developer
Potrzebuje: kroków repro, kontekstu technicznego, screenshotów i logów.

Mów językiem technicznym:
> "Endpoint POST /api/orders zwraca 200 OK bez body gdy quantity=0. Oczekiwane: 400 z komunikatem 'quantity must be >= 1'. Network tab screenshot w załączniku."

### Product Manager
Potrzebuje: business impact, priorytetu, opcji decyzji.

Mów językiem biznesu:
> "Użytkownicy z Safari na iOS nie mogą dodać karty płatniczej. Szacujemy ~15% użytkowników iOS. Opcje: hotfix (4h), rollout z wyłączoną opcją Apple Pay na Safari, lub release z oznaczeniem 'beta'. Czekam na decyzję."

### Stakeholder / CEO
Potrzebuje: stanu, ryzyka, kiedy będzie naprawione.

Mów językiem wyników:
> "Wykryliśmy problem z formularzem płatności na iOS — naprawiony, testujemy teraz, release zaplanowany jutro rano. Żaden użytkownik nie stracił pieniędzy."

## Standup — Jak Mówić Efektywnie

Standup QA nie powinien brzmieć jak lista aktywności:

❌ "Wczoraj testowałem feature płatności, znalazłem parę bugów, dziś kontynuuję testowanie."

✅ "Płatności: 3 bugi zgłoszone, 2 naprawione przez Tomka — retest OK, 1 czeka. Szacuję że feature gotowy do release jutro jeśli ostatni bug naprawiony do popołudnia. Blokery: brak."

Różnica: dajesz stan, prognozę i blokery — nie historię.

## Slack/Teams — Zasady Asynchronicznej Komunikacji

### Jeden message = jeden temat
Jeśli masz 3 pytania do developera — wyślij jedno zbiorcze, nie 3 oddzielne (które przerywają jego flow).

### Kontekst zawsze
❌ "Hej, działa?"
✅ "Hej Marek, czy bug #4521 (formularz checkout, brak walidacji) jest naprawiony na stagingu? Chcę zaplanować retest."

### @mention odpowiedzialnie
@channel przerywa wszystkim. @tutaj przerywa dostępnym. Używaj gdy naprawdę potrzebne — nie dla każdego pytania.

## Jak Pisać Komentarze w Jira

### Komentarz do buga który nie może być zreprodukowany przez developera:

❌ "Ja zawsze reprodukuję."

✅ "Dodaję nagranie z krokami repro (załączone). Środowisko: Chrome 124, Windows 11, konto testowe user_qa_01. Jeśli dalej nie możesz zreprodukować — sprawdź czy używasz konta z rolą 'premium_user' — bug dotyczy tylko tej roli."

### Komentarz do zamkniętego buga który wrócił:

✅ "Retest nieudany — bug powrócił. Wersja: 2.3.1. Kroki i screenshot w załączniku. Czy zmiana była wycofana?"

## Feedback Do Kolegi QA

Jeśli kolega pisze słabe raporty bugów — nie krytykuj publicznie.

Prywatnie, po fakcie:
> "Hej, widziałem ticket #891 — developer miał problem z reprodukcją bo brakowało kroków. Mogę Ci pokazać jak to robię? Mam template który mi pomaga."

Peer feedback podany jako pomoc, nie krytyka.
