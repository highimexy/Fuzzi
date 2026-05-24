# Testowanie Danych i Prywatności — GDPR dla QA

GDPR (RODO) to nie tylko compliance dla prawników. Jako QA możesz znaleźć naruszenia prywatności zanim trafią do regulatora — lub do mediów. Kary za naruszenia GDPR: do 4% globalnego obrotu lub 20 mln EUR.

## Podstawowe Prawa Użytkownika pod GDPR

### Prawo do Dostępu (Art. 15)
Użytkownik może zapytać: "Jakie dane o mnie przechowujesz?"
Firma musi odpowiedzieć w ciągu 30 dni.

**Test:** Wyślij żądanie dostępu do danych przez UI lub email support. Sprawdź:
- Czy system pozwala na eksport danych?
- Czy eksport jest kompletny (wszystkie dane, nie tylko profil)?
- Czy odpowiedź przychodzi w ciągu 30 dni?

### Prawo do Usunięcia (Art. 17) — "Prawo do Bycia Zapomnianym"
Użytkownik może żądać usunięcia danych.

**Test:**
```
Scenariusz:
1. Stwórz konto testowe, wykonaj kilka transakcji
2. Wyślij żądanie usunięcia
3. Po potwierdzeniu — sprawdź:
   □ Czy konto nie istnieje?
   □ Czy dane w bazie są usunięte lub zanonimizowane?
   □ Czy dane nie pojawiają się w raportach?
   □ Czy backup nie przywróci usuniętych danych? (ważne!)
   □ Czy dane w systemach zewnętrznych (email provider, CRM) są usunięte?
```

### Prawo do Przenoszenia (Art. 20)
Użytkownik może pobrać swoje dane w formacie machine-readable (JSON, CSV).

**Test:**
- Eksport jest dostępny przez UI
- Format jest otwarty (nie PDF lub screenshot)
- Dane są kompletne i poprawne

### Prawo do Sprostowania (Art. 16)
Użytkownik może poprawić błędne dane.

**Test:** Zmień email, imię, adres — czy zmiana propaguje się wszędzie (email systemowy, faktury, raporty)?

## Testy Minimalizacji Danych

GDPR wymaga zbierania tylko danych niezbędnych (data minimization).

**Pola do sprawdzenia w formularzach:**
```
Rejestracja:
□ Czy pytacie o datę urodzenia gdy nie jest potrzebna?
□ Czy numer telefonu jest obowiązkowy gdy to aplikacja bez SMS?
□ Czy płeć jest wymagana gdy produkt jest dla wszystkich?
□ Czy zbieracie IP nawet dla użytkowników z EU bez podstawy prawnej?
```

**Logi aplikacji:**
```
□ Czy logi zawierają hasła (nawet zahashowane)?
□ Czy logi zawierają pełne numery kart?
□ Czy logi zawierają PESEL lub numer dowodu?
□ Jak długo są przechowywane logi? (retention policy)
```

## Testowanie Zgód (Consent)

Cookie consent banner — testuj czy działa:

```
□ Banner pojawia się przy pierwszej wizycie
□ "Odrzuć wszystkie" działa — tylko niezbędne cookies po odrzuceniu
□ Preferencje zgód są zapisane i pamiętane
□ Można wycofać zgodę (nie tylko udzielić)
□ Brak pre-zaznaczonych opcjonalnych zgód (GDPR zakazuje)
□ Każda kategoria zgody jest opisana zrozumiałym językiem
```

**Test technikalizmu:**
- Odrzuć wszystkie marketingowe cookies
- Sprawdź w DevTools → Application → Cookies
- Czy Google Analytics jest aktywny mimo odrzucenia? → Bug

## Testowanie Anonimizacji i Pseudonimizacji

W raportach i logach dane powinny być zanonimizowane:

```sql
-- Sprawdź czy raporty eksponują PII
SELECT * FROM orders_report LIMIT 10;
-- Zły wynik: jan.kowalski@email.com, Jan Kowalski, ul. Kwiatowa 5
-- Dobry: user_4521, ****@****.com, [REDACTED]
```

Testowanie środowisk nieprodukcyjnych:
```
□ Staging nie zawiera prawdziwych danych produkcyjnych
□ Dane testowe są fikcyjne (nie eksport z produkcji)
□ Developer nie ma dostępu do prawdziwych emailów klientów
```

## Testowanie Retencji Danych

Dane muszą być przechowywane tylko tak długo jak jest to konieczne.

```
Polityka retencji firmy:
- Dane kont aktywnych: czas aktywności + 2 lata
- Dane kont usuniętych: usuń w ciągu 30 dni
- Logi transakcji: 5 lat (wymogi podatkowe)
- Logi sesji: 30 dni

Test:
1. Stwórz konto, usuń je
2. Po 31 dniach (lub zasymuluj w test environment) sprawdź:
   - Czy konto istnieje w bazie? (powinno być usunięte/zanonimizowane)
   - Czy dane transakcji nadal są (ze względu na podatki)?
```

## Testy Bezpieczeństwa Danych Osobowych

```
□ Hasła są hashowane (bcrypt, argon2) — nie plaintext, nie MD5
□ Dane wrażliwe w bazie są szyfrowane (not just hashed)
□ Klucze szyfrujące nie są w kodzie źródłowym (git history!)
□ Dostęp do danych osobowych jest logowany (kto, kiedy, co)
□ Admin panel nie pokazuje pełnych numerów kart (tylko ostatnie 4 cyfry)
□ Eksport danych wymaga dodatkowej weryfikacji tożsamości
```

## Checklist GDPR dla QA

```
□ Żądanie dostępu do danych jest możliwe przez UI lub znany proces
□ Eksport danych jest kompletny i w otwartym formacie
□ Usunięcie konta usuwa dane we wszystkich systemach
□ Cookie consent działa poprawnie (odrzuć = tylko niezbędne)
□ Formularze nie zbierają danych bez podstawy prawnej
□ Staging nie używa prawdziwych danych produkcyjnych
□ Logi nie zawierają PII
□ Polityka retencji jest przestrzegana
□ Prawa użytkownika (dostęp, usunięcie, przenoszenie) są dostępne
```
