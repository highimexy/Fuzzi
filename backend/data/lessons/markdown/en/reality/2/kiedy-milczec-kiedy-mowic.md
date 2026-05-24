# Kiedy Milczeć, Kiedy Mówić — Dyplomacja QA

QA ma unikalną pozycję w zespole: widzi problemy których inni nie widzą. Ale nie każdy problem wymaga głośnego zgłoszenia, i nie każde milczenie jest dobrą decyzją. Sztuka to wiedzieć kiedy co.

## Pułapka Milczenia

Milczenie QA ma swoją cenę — dług informacyjny który procentuje bugami na produkcji.

### Kiedy milczenie jest błędem:

**Widzisz ryzyko którego nikt inny nie widzi**
Jesteś na Sprint Planning. PM mówi "to jest prosta zmiana". Ty wiesz że ta "prosta zmiana" dotyka modułu który nie ma testów i był źródłem 3 bugów w ostatnim roku. Milczenie = ryzyko niewidoczne dla całego zespołu.

**Brakuje Ci informacji do testowania**
Kryteria akceptacji są niejasne. Decydujesz się testować "jak rozumiesz". Gdy Twoje rozumienie okazuje się błędne — tracisz czas swój i developera.

**Widzisz coś etycznie niepokojącego**
Podpisujesz raport który nie jest prawdą. Manager prosi Cię o pominięcie testów. To nie jest moment na dyplomację — to moment na jasną komunikację.

## Pułapka Mówienia Wszystkiego

Mówienie wszystkiego głośno ma równie wysoką cenę — relacje i czas.

### Kiedy mówienie jest błędem:

**Każdy drobny bug staje się dramatem**
Literówka na stronie którą widzi 0.1% użytkowników nie wymaga eskalacji do PM na standup. Zgłoś w Jirze, oznacz priority: low, jedź dalej.

**Kwestionujesz decyzje które nie są Twoją domeną**
"Myślę że ten feature w ogóle nie powinien istnieć" — być może masz rację, ale to decyzja produktowa. Twoja rola to testowanie tego co istnieje, nie kwestionowanie strategii produktu (chyba że masz relację i zaproszenie do takiej rozmowy).

**Feedbackujesz bez faktów**
"Wydaje mi się że ta funkcja jest zrobiona źle" bez konkretów to opinia która drażni. Fakty: "w 3 na 5 testach endpoint zwrócił 500 po > 200 jednoczesnych requestów" to raport.

## Framework: WHEN to Speak

**Zawsze mów gdy:**
- Ryzyko dotyczy bezpieczeństwa danych użytkowników
- Widzisz potencjalną utratę danych lub pieniędzy
- Masz informację która zmienia decyzję o release
- Brakuje Ci niezbędnych informacji do wykonania pracy

**Mów po ocenie gdy:**
- Problem dotyczy UX ale nie blokuje funkcji
- Masz sugestię usprawnienia procesu
- Chcesz wskazać długoterminowe ryzyko techniczne

**Zapisz ale nie mów głośno gdy:**
- Bug jest kosmetyczny i nie wpływa na UX
- Masz opinię o decyzji która jest poza Twoim zakresem
- Jesteś zdenerwowany i brakuje Ci faktów

## Jak Mówić Trudne Rzeczy?

### Zasada: fakty → impact → opcje

❌ "Ta funkcja jest zrobiona żle i nie powinna wyjść na produkcję."

✅ "W testach znalazłem 2 scenariusze gdzie dane użytkownika nie są zapisywane po timeout sesji. Impact: użytkownicy tracą pracę bez ostrzeżenia. Opcje: naprawa przed releasem (~4h), release z wyłączoną funkcją dla tej grupy, lub release z ostrzeżeniem i plakietką 'beta'."

Różnica: dajesz fakty, opisujesz impact i proponujesz opcje — nie blokujesz, nie oceniasz, dajesz materiał do decyzji.

### Timing

Trudne informacje mówisz jak najwcześniej — nie w piątek o 16:59 przed releasem w weekend. Jeśli widzisz ryzyko w środę — mów w środę.

### Kanał

Drobne bugi → Jira. Ryzyka dla releasu → bezpośrednia rozmowa z PM/tech lead + email. Problemy etyczne → rozmowa 1-on-1 z managerem, potem HR jeśli trzeba.
