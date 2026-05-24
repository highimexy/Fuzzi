# Współpraca z Product Managerem — Sojusznik czy Wróg?

Product Manager i QA mają pozornie sprzeczne cele: PM chce dostarczyć feature szybko, QA chce go sprawdzić dokładnie. W praktyce — ich cele są zbieżne: żeby produkt działał dla użytkowników. Rozumienie perspektywy PM-a jest kluczowe dla efektywnej współpracy.

## Czego PM Potrzebuje od QA

PM myśli w kategoriach:
- **Ryzyko biznesowe** — co się stanie jeśli to nie działa dla użytkowników?
- **Termin** — kiedy to będzie gotowe?
- **Decyzja** — wypuścić z bugiem czy czekać?

Twoja wartość dla PM-a: **tłumaczysz techniczne ryzyko na biznesowy język**.

```
❌ Dla PM-a bezużyteczne:
"Endpoint /api/orders zwraca 500 przy query parameter page > 1000"

✅ Dla PM-a użyteczne:
"Eksport zamówień psuje się gdy klient ma > 10,000 zamówień. 
Tylu zamówień mają nasi klienci enterprise — czyli 3 firmy które płacą 80% naszego ARR."
```

## Jak Komunikować Bugi do PM-a

PM nie potrzebuje kroków repro. Potrzebuje:
1. **Co jest zepsute** — jedno zdanie
2. **Kto to dotyka** — % userów lub kluczowe segmenty
3. **Co oznacza biznesowo** — utrata transakcji? frustracja? blokada workflow?
4. **Opcje** — bloker release / workaround / wypuść i napraw w kolejnym sprincie?

```
"Bug #4521: Użytkownicy z rolą 'manager' nie mogą zatwierdzać faktur — 
błąd uprawnień. Dotyczy ~40 firm (sprawdziłam w DB). 
Fakturowanie jest ich core workflow. Opcje: (A) hotfix (4h developera), 
(B) rollback feature'a, (C) tymczasowy workaround — manager może poprosić admina."
```

PM może podjąć decyzję. Bez tych informacji — nie może.

## Definiowanie "Done" Razem z PM-em

Najczęstszy powód konfliktu QA-PM: różne oczekiwania co do "gotowe".

Przed sprint:
> "Hej, dla feature płatności — jakie są kryteria akceptacji? Co musimy przetestować żeby powiedzieć że jest gotowe do release?"

PM ma obowiązek odpowiedzieć na to pytanie. Jeśli nie wie — macie problem który lepiej odkryć teraz niż przy release.

**Definicja Done dla QA** (zaproponuj PM-owi):
- Happy path przetestowany
- Edge cases z ticket przetestowane
- Bugi krytyczne i high zamknięte (lub explicite zaakceptowane jako known issues)
- Regresja dla obszarów dotkniętych zmianą przetestowana
- Testy na środowisku staging (nie dev)

## Kiedy PM Naciska na Release mimo Otwartych Bugów

To się zdarza. PM ma deadline, inwestor czeka, konferencja za 3 dni.

Twoja rola: **dać informacje, nie decydować za PM-a**.

```
"PM, mam 2 otwarte bugi dla release:
#4521 (High): manager nie może zatwierdzać faktur — dotyka 40 firm
#4522 (Low): błąd literówki w email potwierdzającym — estetyczny

Moja rekomendacja: blokować ze względu na #4521.
Decyzja należy do Ciebie — jeśli zdecydujesz się wypuścić, 
zalogujmy to jako known issue i poinformujmy support."
```

Udokumentuj decyzję PM-a. Jeśli coś pójdzie nie tak — masz zapisane kto zdecydował i dlaczego.

## Uczestnictwo QA w Planowaniu Sprintu

QA w sprint planning = wcześniejsze wykrywanie problemów.

Gdy PM prezentuje user story, QA może zapytać:
- "Co się dzieje gdy użytkownik nie ma uprawnień do tej akcji?"
- "Jaki jest stan gdy lista jest pusta?"
- "Czy to działa na mobile?"
- "Jak obsługujemy błąd zewnętrznego API?"

Te pytania zmuszają PM-a i developerów do przemyślenia edge cases przed implementacją. Koszt pytania w planowaniu: 0. Koszt brakującego stanu w produkcji: wysoki.

## PM Zmienia Wymagania w Trakcie Sprintu

Zdarza się. Jak reagować:

**Nie:** "Nie możesz zmieniać wymagań — dopiero co skończyłam pisać test cases."

**Tak:** "Rozumiem. Zmiana ma taki wpływ na testowanie: [X]. Żeby utrzymać release plan, potrzebuję [Y]. Czy to jest akceptowalne?"

Pokaż PM-owi konsekwencje decyzji i daj mu możliwość podjęcia świadomego wyboru.

## Budowanie Relacji z PM-em

- **Nie bądź "no-machine"** — QA który blokuje wszystko bez alternatyw jest problematyczny. Zawsze dawaj opcje.
- **Proaktywnie informuj o ryzyku** — PM nie chce niespodzianek przed release. Mów o problemach gdy je widzisz, nie czekaj.
- **Zrozum priorytety biznesowe** — co jest ważne dla użytkowników? Który feature ma największy wpływ na ARR?
- **Celebruj sukcesy razem** — gdy release idzie gładko, PM i QA wygrywają razem.
