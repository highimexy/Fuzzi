# Chaos Engineering — Testowanie Odporności na Awarie

Chaos Engineering to praktyka celowego wprowadzania awarii do systemu żeby sprawdzić jak sobie radzi. Zamiast pytać "czy system jest niezawodny" — sprawdzasz empirycznie co się dzieje gdy coś pójdzie nie tak.

## Skąd Pochodzi Chaos Engineering

Netflix stworzył Chaos Monkey w 2010 — narzędzie które losowo wyłącza serwery produkcyjne. Motywacja: "Jeśli system nie wytrzymuje awarii jednego serwera — dowiedzmy się teraz, a nie gdy klient tego doświadczy."

Zasada: systemy które nie są testowane na awarie nie wiedzą jak się zachowają gdy awaria nastąpi.

## Hipoteza Chaosu — Jak Myśleć

Chaos Engineering zaczyna od hipotezy:

```
"Wierzymy że gdy [scenariusz awarii], 
system [oczekiwane zachowanie], 
i użytkownicy [doświadczą / nie doświadczą] degradacji."

Przykład:
"Wierzymy że gdy serwis powiadomień email będzie niedostępny,
system nadal przetworzy zamówienia poprawnie,
i użytkownicy nie doświadczą degradacji (email dotrze gdy serwis wróci)."
```

Potem testujesz hipotezę. Jeśli system zachowuje się inaczej niż zakładasz — masz nową wiedzę o ryzyku.

## Typy Eksperymentów Chaos

### Awaria Serwisu
Wyłącz jeden mikroserwis lub zewnętrzne API.

```bash
# Docker: zatrzymaj jeden kontener
docker stop payment-service

# Pytanie: co widzi użytkownik próbując zapłacić?
# Oczekiwane: "Płatności są chwilowo niedostępne. Spróbuj za chwilę."
# Złe: biały ekran, błąd 500, utrata koszyka
```

### Latencja Sieci
Zwiększ opóźnienie między serwisami.

```bash
# tc (traffic control) na Linux — dodaj 500ms latency
tc qdisc add dev eth0 root netem delay 500ms

# Pytanie: czy API timeout jest poprawnie skonfigurowany?
# Czy aplikacja ma sensowne timeout i retry logic?
```

### Awaria Bazy Danych
Symuluj niedostępność bazy lub wolne zapytania.

```sql
-- PostgreSQL: długo trwające locki
BEGIN;
SELECT * FROM orders FOR UPDATE;
-- Nie commituj przez 30 sekund

-- Co się dzieje z aplikacją? Czy connection pool się wyczerpuje?
```

### Wyczerpanie Zasobów
- CPU spike: `stress --cpu 8 --timeout 60s`
- Memory pressure: `stress --vm 1 --vm-bytes 2G --timeout 60s`
- Disk full: stwórz duży plik żeby zapełnić dysk

### Losowe Wyłączanie Instancji (Netflix Chaos Monkey approach)
W Kubernetes:
```bash
# Usuń losowego poda
kubectl delete pod -l app=api --grace-period=0 --force
# Kubernetes powinien go natychmiast zastąpić
```

## Jak QA Uczestniczy w Chaos Engineering

QA nie musi uruchamiać eksperymentów chaos (to często rola DevOps/SRE). Ale QA:

1. **Definiuje co testować** — "Co byłoby najgorsze dla użytkowników? Co jest single point of failure?"

2. **Obserwuje z perspektywy użytkownika** — gdy DevOps uruchamia experiment, QA obserwuje frontend
   - Co widzi użytkownik?
   - Czy komunikaty są zrozumiałe?
   - Czy dane użytkownika są bezpieczne?

3. **Zgłasza bugi zachowania degradacji** — aplikacja powinna degradować gracefully, nie crashować

4. **Weryfikuje recovery** — gdy awaria się kończy, czy system wraca do normy? Dane spójne?

## Game Days — Planowane Ćwiczenia Chaosu

Game day to zaplanowany eksperyment chaosu w kontrolowanych warunkach:

```
Game Day — Awaria Payment Service
Data: 2024-03-20, 14:00-15:00
Środowisko: staging (NIGDY produkcja bez pełnego planu!)

Uczestnicy:
- DevOps (uruchamia experiment)
- QA (obserwuje z perspektywy użytkownika)
- Developer (gotowy do naprawy)
- PM (obserwuje business impact)

Hipoteza: Gdy payment-service jest niedostępny przez 5 minut,
użytkownicy widzą sensowny komunikat błędu, koszyk jest zachowany,
i system odzyskuje automatycznie po powrocie serwisu.

Eksperyment: docker stop payment-service na 5 minut

Obserwacje QA:
- Próba checkout: komunikat "Płatności chwilowo niedostępne" ✓
- Koszyk zachowany? ✓
- Ponowna próba po 5 minutach: sukces? ✓

Wynik: Hipoteza potwierdzona. System degraduje gracefully.
```

## Blast Radius — Bezpieczne Eksperymenty

Zasada: zacznij małym eksperymentem z małym zasięgiem.

```
Blast radius = ile użytkowników / funkcji jest dotkniętych

Małe: wyłącz jeden endpoint → dotknięci tylko użytkownicy tego endpointu
Średnie: wyłącz jeden mikroserwis → dotknięte funkcje zależne
Duże: wyłącz bazę danych → cały system

Zawsze zaczynaj od małego. Rób chaos na staging przed production.
Miej kill switch który szybko przywraca normalny stan.
```

## Metryki do Obserwowania podczas Chaosu

```
Gdy eksperyment jest aktywny, monitoruj:
□ HTTP error rate (szczególnie 5xx)
□ Response time (czy wzrósł? ile?)
□ Database connections (czy connection pool się nie wyczerpuje?)
□ Queue depth (czy kolejka zdarzeń nie rośnie?)
□ Memory i CPU (czy awaria jednego serwisu nie obciąża innych?)

Po eksperymencie:
□ Czy system automatycznie wrócił do normy?
□ Czas recovery (MTTR)
□ Czy dane są spójne po recovery?
□ Czy były jakieś cascading failures?
```

## Narzędzia

- **Chaos Monkey** (Netflix) — losowe wyłączanie instancji
- **Gremlin** — komercyjne, łatwe w użyciu
- **Litmus** — chaos dla Kubernetes, open source
- **Toxiproxy** — proxy z możliwością symulacji latencji i błędów sieci
- **Pumba** — chaos dla Docker
