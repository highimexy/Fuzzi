# Konflikt Dev–QA — Jak Go Rozwiązywać bez Ofiar

Napięcie między QA i developerami jest wbudowane w strukturę procesu. QA mówi "nie" — developer chce dostarczać. Konflikty będą. Pytanie jak je rozwiązywać tak żeby team wychodził z nich silniejszy.

## Skąd Biorą Się Konflikty

### Różne Definicje "Gotowe"
Developer: "Napisałem kod, testy jednostkowe przechodzą, PR zmergowany."
QA: "Nie, gotowe = przetestowane manualnie, regresja OK, dokumentacja zaktualizowana."

Bez wspólnej definicji "Done" — konflikty są nieuniknione.

### Presja Czasu
Sprint kończy się w piątek. Developer chce zamknąć ticket. QA znalazł bug w środę.

"Czy ten bug MUSI blokować release?" — to pytanie które pada i które wyzwala napięcie.

### Poczucie Oceny
Developer odbiera zgłoszone bugi jako osobistą krytykę swojej pracy. QA nie ma tak na myśli — ale efekt jest taki.

### Priorytety Bug Fix
Developer uważa bug za kosmetyczny. QA uważa go za major. Kto ma rację?

## Zasada: Bugi to Problem Procesu, nie Osoby

Zmień język z "Twój bug" na "znaleźliśmy bug w tym module":

```
❌ "Znowu nie sprawdziłeś edge cases."
✅ "W tym module mamy problem z edge casami — może warto dodać test jednostkowy na graniczne wartości?"

❌ "Ten kod jest słabo przetestowany."
✅ "Widzę że ten obszar ma mało pokrycia testowego — mogę pomóc napisać przypadki testowe?"
```

Zmiana języka z oskarżenia na obserwację + propozycję rozwiązania zmienia dynamikę rozmowy.

## Jak Zgłaszać Bugi Kontrowersjalne

Gdy wiesz że developer będzie kwestionował bug:

**Twoja broń:** fakty, nie opinie.

```
❌ "Ten formularz jest zepsutym — powinien walidować dane!"

✅ "Bug #4521: Pole email akceptuje 'test' (bez @) i formularz wysyła request.
   Specyfikacja US-88, kryterium 3: 'email musi być w formacie RFC 5322'.
   Zreprodukowany na Chrome 124 / Firefox 126 / staging v2.4.1.
   Impact: klienci mogą zarejestrować konto z nieprawidłowym emailem — email powitalny nie dotrze."
```

Kiedy developer kwestionuje bug, odpowiadasz: "Masz specyfikację i screenshot. Możemy to omówić — ale zaczynam od faktów."

## Kiedy Zablokować Release vs Wpuścić z Uwagami

To jest najtrudniejsza decyzja w QA. Zasada:

**Zablokuj** gdy:
- Bug powoduje utratę danych użytkownika
- Bug blokuje core flow (rejestracja, płatność, login)
- Bug naraża na bezpieczeństwo (XSS, SQL injection, wyciek danych)
- Bug dotyka dużego % aktywnych użytkowników

**Wpuść z uwagami** gdy:
- Bug jest kosmetyczny lub UI
- Bug dotyczy rzadkiego edge case
- Workaround istnieje i jest znany
- Fix jest gotowy na następny sprint

**Klucz:** Decyzja powinna być dokumentowana. "QA zaakceptował release z otwartym bugiem #4521 (kosmetyczny, P3) — zaplanowane do naprawy w sprincie 25."

## Eskalacja — Kiedy i Jak

Gdy nie możesz dogadać się z developerem:

**Krok 1:** Rozmowa 1:1, offline, bez emocji.
"Hej, mam wątpliwości co do buga #4521. Możemy 10 minut pogadać?"

**Krok 2:** Zaproś trzecią stronę neutralną — tech lead lub inny senior developer.
"Chciałbym żebyś spojrzał na to razem z nami — chodzi o decyzję czy blokować release."

**Krok 3:** Formalnie zaproś PM/managera.
Tylko gdy bug ma impakt biznesowy i nie można osiągnąć porozumienia technicznie.

**Nigdy:** Nie eskaluj publicznie, nie na Slacku przed całym teamem, nie z emocjami.

## Kiedy QA Ma Rację a Developer Ma Rację

QA nie ma monopolu na "ma rację". Developerzy znają kod lepiej.

Sytuacje gdy warto posłuchać developera:
- Mówi że bug jest "by design" i ma uzasadnienie biznesowe → sprawdź dokumentację
- Mówi że test environment się różni od produkcji → sprawdź konfigurację
- Mówi że podobna walidacja jest gdzie indziej → sprawdź spójność

Bycie QA który słucha i zmienia zdanie gdy dostaje dobre argumenty = bycie partnerem, nie strażnikiem.

## Po Konflikcie — Nie Chować Urazy

Po rozwiązaniu sporu: nie chowaj urazy, nie pamiętaj. Konflikty są normalne w dobrych teamach.

Retroaktywnie warto omówić: "Co możemy zmienić żeby podobne nieporozumienia nie powtarzały się?" — to pytanie dla całego teamu, nie dla konkretnej osoby.
