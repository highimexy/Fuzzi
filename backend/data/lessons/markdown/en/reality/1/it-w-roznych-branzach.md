# QA w Różnych Branżach — Fintech, Healthcare, Gaming

QA w e-commerce różni się od QA w banku. QA w startupie gamingowym różni się od QA w systemie medycznym. Branża definiuje standardy, tempo i konsekwencje błędów.

## Fintech — Gdzie Błąd Kosztuje Realnie

**Charakterystyka:**
- Zero tolerancji dla błędów finansowych
- Regulacje: PSD2, GDPR, PCI DSS, KNF (Polska)
- Audyty zewnętrzne i wewnętrzne
- Wolniejsze tempo release (często monthly zamiast weekly)

**Specyficzne wyzwania QA:**
```
1. Dokładność obliczeń finansowych
   - Float vs decimal → błędy zaokrąglania
   - Test: 0.1 + 0.2 = 0.30000000000000004 w większości języków
   - Banki używają BigDecimal/Decimal — musisz to weryfikować

2. Idempotentność transakcji
   - Użytkownik klika "zapłać" dwa razy
   - Sieć przerywa połączenie w połowie
   - Czy płatność jest pobrana raz czy dwa razy?

3. Regulatory compliance testing
   - KYC (Know Your Customer) — czy weryfikacja tożsamości działa?
   - AML (Anti-Money Laundering) — czy flagowanie transakcji działa?
   - Czy audit trail jest kompletny i niemożliwy do edycji?

4. Security testing jest mandatory
   - Penetration testing przed każdym release
   - OWASP Top 10 jest minimum
   - Nie opcjonalne "jeśli będzie czas"
```

**Tempo kariery:** Wolniejsze. Więcej dokumentacji. Więcej procesu. Ale wyższe wynagrodzenia.

## Healthcare — Gdzie Błąd Może Kosztować Życie

**Charakterystyka:**
- Regulacje: MDR (Medical Device Regulation), HIPAA (USA), ISO 13485
- Dla software jako Medical Device (SaMD): FDA approval, CE marking
- Testy wymagają pełnej dokumentacji i traceability

**Specyficzne wyzwania QA:**
```
1. Risk classification
   - Class I (niskie ryzyko): kalkulatory BMI
   - Class II (średnie ryzyko): EKG monitoring
   - Class III (wysokie ryzyko): oprogramowanie pace makera
   - Im wyższy Class, tym więcej testowania i dokumentacji

2. Validation vs Verification
   - Verification: "Czy zbudowaliśmy system poprawnie?" (unit testy)
   - Validation: "Czy zbudowaliśmy poprawny system?" (czy spełnia potrzeby kliniczne)
   - Healthcare wymaga obu, osobno

3. Traceability matrix
   - Każdy test musi być powiązany z wymaganiem
   - Każde wymaganie musi być przetestowane
   - Dokumentacja musi przeżyć audit zewnętrzny

4. HIPAA compliance
   - PHI (Protected Health Information) nie może być w logach testowych
   - Dane testowe muszą być anonimizowane
   - Kto ma dostęp do danych testowych? (musi być kontrolowane)
```

**Tempo kariery:** Wolne. Dużo procesu. Bardzo cenna specjalizacja — mało osób chce przez to przechodzić.

## Gaming — Gdzie Błąd Kosztuje Reputację

**Charakterystyka:**
- Szybkie tempo release (weekly patches, live ops)
- Playerbase reaguje natychmiast i głośno
- Exploit hunting — gracze aktywnie szukają bugów
- Monetyzacja (mikrotransakcje) musi być bezbłędna

**Specyficzne wyzwania QA:**
```
1. Game feel i polish
   - Nie tylko "czy działa" ale "czy się dobrze gra"
   - Playtest sessions — QA jako gracz
   - Input latency, frame pacing, "juiciness"

2. Exploit prevention
   - Gracze są kreatywni w znajdowaniu exploitów
   - Speed runs odkrywają edge cases których nikt nie przewidział
   - Duping (duplikacja itemów) może zniszczyć ekonomię gry

3. Anti-cheat testing
   - Czy cheat detection działa? (wymaga testowania z perspektywy cheatera)
   - Czy false positives bana niewinnych graczy?
   - Ethical question: czy testujesz cheaty żeby je wychwycić?

4. Live ops i hotfixes
   - Błąd w balansie jest patchowany w godziny, nie tygodnie
   - Hotfix bez pełnego regression testing (świadomy trade-off)
   - Post-patch monitoring jest krytyczny

5. Performance na różnych konfiguracjach
   - PC gaming: nieskończone kombinacje hardware
   - Console: znane, fixed hardware — ale różne modele
   - Mobile: 1000+ modeli telefonów
```

**Tempo kariery:** Dynamiczne. Burnout risk (crunch culture). Pasja pomaga. Dobra znajomość gier jako produkt jest wartością.

## Wspólne Wzorce Między Branżami

```
Wszystkie branże mają:
- Compliance requirements (różne, ale zawsze są)
- Krytyczne funkcje których błąd = catastrophic failure
- Monotyzację którą błąd kosztuje realnie

QA który rozumie branżę zarabia więcej:
- Fintech QA z znajomością PSD2/PCI DSS → senior szybciej
- Healthcare QA z doświadczeniem MDR → bardzo wąski rynek, wysokie ceny
- Gaming QA z seniority → lead QA, game director path
```

## Jak Wybrać Branżę

```
Pytania do siebie:
- Wolę wolne i dokumentowane (healthcare/fintech) vs szybkie i dynamiczne (gaming/startup)?
- Czy interesuje mnie domena? (pieniądze, zdrowie, rozrywka)
- Jaki poziom odpowiedzialności chcę? (system medyczny = wyższe stakes)
- Gdzie są możliwości w moim regionie?

Nie ma złej odpowiedzi — jest dopasowanie do osobowości.
```
