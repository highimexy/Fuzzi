# Praca w Rozproszonym Teamie — QA bez Biura

Distributed team to nie remote work w jednej firmie. To team gdzie ludzie są w różnych miastach, strefach czasowych, kulturach. QA w takim środowisku wymaga innych nawyków niż praca twarzą w twarz.

## Wyzwania Specyficzne dla QA w Distributed Teamie

### Brak Szybkiego "Zagadania"
W biurze: "Hej Marek, co miałeś na myśli w tym tickecie?" — 30 sekund odpowiedzi.
Zdalnie: napisz, czekaj 3 godziny (inna strefa czasowa), odpowiedź w nocy Twojego czasu.

**Rozwiązanie:** Pisz pytania tak precyzyjnie żeby wymagały minimalnego doprecyzowania. Jeden dobry komunikat zamiast 5 iteracji.

### Brak Kontekstu Niewerbalnego
Trudno ocenić czy developer jest sfrustrowany, czy zajęty, czy po prostu wybrał złe słowa.

**Rozwiązanie:** Zakładaj dobrą wolę. Zanim zinterpretujesz wiadomość jako atak — zapytaj o klaryfikację.

### Środowisko Testowe w Innym Miejscu
Backend na AWS us-east-1, Ty w Warszawie, developer w Krakowie, staging dostępny z VPN.

**Rozwiązanie:** Dokumentuj setup środowiska. Każda konfiguracja która wymaga "zapytaj mnie" to dług.

### Nadgodziny Rozciągnięte przez Strefy
Standup o 9:00 dla Berlina = 16:00 dla Tokio. Ktoś zawsze ma kiepską godzinę.

**Rozwiązanie:** Rotuj godziny spotkań albo rób je async (nagranie standupu, pisemny update).

## Async First — Domyślna Komunikacja

W distributed teamie async powinna być domyślna, sync (spotkanie, call) — wyjątkiem.

### Kiedy Async Wystarczy
- Pytania o status ("czy bug #1234 jest naprawiony?")
- Zgłaszanie bugów
- Przekazywanie informacji ("skończyłam testowanie feature X")
- Decyzje które nie blokują natychmiastowej pracy

### Kiedy Potrzebujesz Sync
- Kompleksowy debriefing buga który trudno wytłumaczyć tekstem
- Konflikt który wymaga rozmowy, nie wiadomości
- Onboarding nowej osoby do systemu
- Kryzys na produkcji

**Zasada:** jeśli napisałeś wiadomość i potrzebujesz odpowiedzi w ciągu minuty — to jest call. Jeśli możesz poczekać godzinę — to jest async.

## Dokumentacja jako Komunikacja

W distributed teamie dokumentacja zastępuje spontaniczne rozmowy.

### Co Dokumentować

**Środowisko testowe:**
```
Staging Environment Setup
URL: https://staging.app.com
Auth: Basic Auth (użyj credentials z 1Password vault "QA")
Dane testowe: seed script /scripts/seed_test_data.sh
Reset DB: @backend-team #staging-reset (ping z 30 min uprzedzeniem)
Known issues: staging nie obsługuje email (SMTP disabled) — sprawdź /mailhog
```

**Wyniki testowania:**
Nie tylko "przetestowałem". Napisz co przetestowałeś, co znalazłeś, co pominąłeś i dlaczego.

**Decyzje:**
Gdy zdecydujesz coś ważnego ("zaakceptuję tę wersję mimo otwartego buga #X") — zapisz to w tickecie. Distributor team = nikt nie pamięta rozmowy z 3 tygodni temu.

## Narzędzia dla Distributed QA

### Komunikacja
- **Slack/Teams** — synchronizacja dzienna, pytania, quick updates
- **Linear/Jira** — tickets, status bugów, sprint planning
- **Notion/Confluence** — dokumentacja, procesy, środowiska

### Testowanie
- **Loom** — nagranie ekranu z dźwiękiem dla demonstracji buga (lepsze niż screenshot)
- **BrowserStack** — testowanie na urządzeniach bez fizycznego dostępu
- **VPN** — dostęp do środowisk testowych

### Komunikacja Wizualna
- **Jam.dev** — raportowanie bugów z automatycznym nagraniem i danymi technicznymi
- **Screen recording** — dla bugów które trudno opisać słowami

## Raportowanie Bugów w Distributed Teamie

Bug report w distributed teamie musi być kompletny bez możliwości "dopytania":

```
Bug #5521: Formularz płatności — błąd na Safari iOS 17

ŚRODOWISKO:
- Urządzenie: iPhone 14 Pro (BrowserStack)
- System: iOS 17.2
- Przeglądarka: Safari 17
- Staging URL: https://staging.app.com/checkout

KROKI:
1. Zaloguj na konto: qa_user@test.com / testpassword123
2. Dodaj produkt do koszyka (np. SKU: TEST-001)
3. Przejdź do checkout → Płatność
4. Wypełnij dane karty testowej: 4242 4242 4242 4242 / 12/26 / 123
5. Kliknij "Zapłać"

OCZEKIWANE: Przekierowanie na stronę potwierdzenia

AKTUALNE: Spinner kręci się przez 30 sekund, potem błąd "Payment failed. Try again."
Konsola: "TypeError: Cannot read properties of null (reading 'submit')"

NAGRANIE: https://loom.com/share/... (2:30 minut, pokazuje pełny flow)
SCREENSHOT: załączony
```

Developer może zreprodukować bez pytań. To jest cel.

## Praca przez Strefy Czasowe — Etykieta

- **Oznaczaj wiadomości priorytetem** — @here tylko gdy pilne naprawdę
- **Nie oczekuj odpowiedzi poza godzinami pracy** — jest to normalne nie-odpowiadanie
- **Overlap hours są cenne** — jeśli Twój team ma 2h overlap — użyj ich na sync
- **Status w Slacku** — "focused" = nie przerywaj, "available" = możesz pisać
- **Szanuj weekendy i święta** — różne kraje, różne święta
