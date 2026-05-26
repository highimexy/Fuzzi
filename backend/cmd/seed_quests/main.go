package main

import (
	"encoding/json"
	"log"
	"time"

	"github.com/highimexy/it-shit/backend/internal/database"
	"github.com/highimexy/it-shit/backend/internal/models"
	gonanoid "github.com/matoous/go-nanoid/v2"
	"gorm.io/datatypes"

	"github.com/joho/godotenv"
)

func opts(items ...models.QuestOption) datatypes.JSON {
	b, _ := json.Marshal(items)
	return datatypes.JSON(b)
}

func id() string {
	s, _ := gonanoid.New()
	return s
}

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("[WARNING] No .env file")
	}
	database.Connect()

	today := time.Now().UTC().Format("2006-01-02")

	quests := []models.Quest{
		// ─── DAILY quests ───────────────────────────────────────────────
		{
			ID: id(), Type: "daily", Track: "general", Difficulty: "beginner",
			TitleEN: "Test Types 101", TitlePL: "Rodzaje testów 101",
			BodyEN:     "Which type of testing verifies that new code has not broken existing functionality?",
			BodyPL:     "Który rodzaj testowania weryfikuje, że nowy kod nie zepsuł istniejącej funkcjonalności?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Smoke testing", TextPL: "Testy smoke"},
				models.QuestOption{Key: "b", TextEN: "Regression testing", TextPL: "Testy regresji"},
				models.QuestOption{Key: "c", TextEN: "Unit testing", TextPL: "Testy jednostkowe"},
				models.QuestOption{Key: "d", TextEN: "Exploratory testing", TextPL: "Testy eksploracyjne"},
			),
			CorrectKey: "b",
			ExplainEN:  "Regression testing ensures that previously working features still work after new changes are introduced.",
			ExplainPL:  "Testy regresji zapewniają, że wcześniej działające funkcje nadal działają po wprowadzeniu nowych zmian.",
			XP: 10, ActiveDate: today,
		},
		{
			ID: id(), Type: "daily", Track: "qa", Difficulty: "intermediate",
			TitleEN: "HTTP Status Codes", TitlePL: "Kody HTTP",
			BodyEN:     "A user submits a form and receives HTTP 422. What does this mean?",
			BodyPL:     "Użytkownik wysyła formularz i otrzymuje HTTP 422. Co to oznacza?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Server error — try again later", TextPL: "Błąd serwera — spróbuj ponownie"},
				models.QuestOption{Key: "b", TextEN: "Resource not found", TextPL: "Zasób nie znaleziony"},
				models.QuestOption{Key: "c", TextEN: "Unprocessable Entity — validation failed", TextPL: "Nieprzetworzona encja — walidacja nie powiodła się"},
				models.QuestOption{Key: "d", TextEN: "Unauthorized — login required", TextPL: "Nieautoryzowany — wymagane logowanie"},
			),
			CorrectKey: "c",
			ExplainEN:  "422 Unprocessable Entity means the server understands the content type but cannot process the instructions. Typically used for validation errors.",
			ExplainPL:  "422 Unprocessable Entity oznacza, że serwer rozumie typ treści, ale nie może przetworzyć instrukcji. Typowo używane dla błędów walidacji.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "daily", Track: "qa", Difficulty: "beginner",
			TitleEN: "Test Case Anatomy", TitlePL: "Anatomia przypadku testowego",
			BodyEN:     "Which element is NOT typically part of a well-written test case?",
			BodyPL:     "Który element NIE jest typowo częścią dobrze napisanego przypadku testowego?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Preconditions", TextPL: "Warunki wstępne"},
				models.QuestOption{Key: "b", TextEN: "Test steps", TextPL: "Kroki testowe"},
				models.QuestOption{Key: "c", TextEN: "Developer name", TextPL: "Imię dewelopera"},
				models.QuestOption{Key: "d", TextEN: "Expected result", TextPL: "Oczekiwany wynik"},
			),
			CorrectKey: "c",
			ExplainEN:  "A test case needs: title, preconditions, test steps, expected result, and optionally severity/priority. The developer's name is not part of the test case structure.",
			ExplainPL:  "Przypadek testowy potrzebuje: tytułu, warunków wstępnych, kroków testowych, oczekiwanego wyniku i opcjonalnie severity/priority. Imię dewelopera nie jest częścią struktury przypadku testowego.",
			XP: 10, ActiveDate: "",
		},
		{
			ID: id(), Type: "daily", Track: "qa", Difficulty: "intermediate",
			TitleEN: "Bug Priority vs Severity", TitlePL: "Priorytet vs ważność buga",
			BodyEN:     "A typo in the app's main headline is found 1 day before launch. Correct severity and priority?",
			BodyPL:     "Dzień przed lunchem znaleziono literówkę w głównym nagłówku aplikacji. Właściwa ważność i priorytet?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "High severity, high priority", TextPL: "Wysoka ważność, wysoki priorytet"},
				models.QuestOption{Key: "b", TextEN: "Low severity, high priority", TextPL: "Niska ważność, wysoki priorytet"},
				models.QuestOption{Key: "c", TextEN: "High severity, low priority", TextPL: "Wysoka ważność, niski priorytet"},
				models.QuestOption{Key: "d", TextEN: "Low severity, low priority", TextPL: "Niska ważność, niski priorytet"},
			),
			CorrectKey: "b",
			ExplainEN:  "A typo has low severity (doesn't break functionality) but high priority (launch is tomorrow, it's visible to all users). Severity = impact on functionality. Priority = urgency of fix.",
			ExplainPL:  "Literówka ma niską ważność (nie psuje funkcjonalności), ale wysoki priorytet (launch jutro, widoczna dla wszystkich użytkowników). Severity = wpływ na funkcjonalność. Priority = pilność naprawy.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "daily", Track: "general", Difficulty: "beginner",
			TitleEN: "Agile Ceremonies", TitlePL: "Ceremonie Agile",
			BodyEN:     "In Scrum, what is the purpose of the Sprint Retrospective?",
			BodyPL:     "W Scrumie, jaki jest cel Retrospekcji Sprintu?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Demo new features to stakeholders", TextPL: "Demo nowych funkcji dla interesariuszy"},
				models.QuestOption{Key: "b", TextEN: "Plan the next sprint backlog", TextPL: "Planowanie backlogu następnego sprintu"},
				models.QuestOption{Key: "c", TextEN: "Discuss what went well, what to improve, and commit to improvements", TextPL: "Omówienie co poszło dobrze, co poprawić i zobowiązanie do usprawnień"},
				models.QuestOption{Key: "d", TextEN: "Review acceptance criteria for user stories", TextPL: "Przegląd kryteriów akceptacji dla historyjek"},
			),
			CorrectKey: "c",
			ExplainEN:  "The Sprint Retrospective is a meeting for the team to inspect itself — what went well, what could be improved, and create a plan for improvement in the next sprint.",
			ExplainPL:  "Retrospekcja Sprintu to spotkanie, w którym team analizuje siebie — co poszło dobrze, co można poprawić i tworzy plan usprawnień na następny sprint.",
			XP: 10, ActiveDate: "",
		},
		{
			ID: id(), Type: "daily", Track: "qa", Difficulty: "advanced",
			TitleEN: "Test Pyramid", TitlePL: "Piramida testów",
			BodyEN:     "According to the Test Pyramid, which type of tests should be the MOST numerous?",
			BodyPL:     "Według Piramidy Testów, który rodzaj testów powinien być NAJLICZNIEJSZY?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "End-to-end (E2E) tests", TextPL: "Testy end-to-end (E2E)"},
				models.QuestOption{Key: "b", TextEN: "Integration tests", TextPL: "Testy integracyjne"},
				models.QuestOption{Key: "c", TextEN: "Unit tests", TextPL: "Testy jednostkowe"},
				models.QuestOption{Key: "d", TextEN: "Manual tests", TextPL: "Testy manualne"},
			),
			CorrectKey: "c",
			ExplainEN:  "The Test Pyramid (Mike Cohn) recommends most tests at the unit level (fast, cheap, isolated), fewer integration tests, and the fewest E2E tests (slow, brittle, expensive).",
			ExplainPL:  "Piramida Testów (Mike Cohn) zaleca, by większość testów była na poziomie jednostkowym (szybkie, tanie, izolowane), mniej testów integracyjnych i najmniej testów E2E (wolne, kruche, drogie).",
			XP: 25, ActiveDate: "",
		},
		{
			ID: id(), Type: "daily", Track: "reality", Difficulty: "intermediate",
			TitleEN: "Definition of Done", TitlePL: "Definition of Done",
			BodyEN:     "A story is 'code complete' but has no unit tests and QA hasn't signed off. Is it 'Done' according to good DoD?",
			BodyPL:     "Historyjka jest 'code complete', ale nie ma testów jednostkowych i QA nie zatwierdziło. Czy jest 'Done' według dobrego DoD?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Yes — code complete means done", TextPL: "Tak — code complete oznacza done"},
				models.QuestOption{Key: "b", TextEN: "Yes — unit tests are optional for simple features", TextPL: "Tak — testy jednostkowe są opcjonalne dla prostych funkcji"},
				models.QuestOption{Key: "c", TextEN: "No — DoD typically includes tests and QA sign-off", TextPL: "Nie — DoD zazwyczaj obejmuje testy i zatwierdzenie QA"},
				models.QuestOption{Key: "d", TextEN: "Depends on the sprint deadline", TextPL: "Zależy od terminu sprintu"},
			),
			CorrectKey: "c",
			ExplainEN:  "A good Definition of Done includes: unit tests pass, code review done, QA tested on staging, acceptance criteria met. 'Code complete' alone is not enough.",
			ExplainPL:  "Dobry Definition of Done obejmuje: testy jednostkowe przechodzą, code review zrobione, QA przetestowało na staging, kryteria akceptacji spełnione. Same 'code complete' to za mało.",
			XP: 15, ActiveDate: "",
		},

		// ─── SKILL CHECK quests ─────────────────────────────────────────
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "beginner",
			TitleEN: "Equivalence Partitioning", TitlePL: "Podział na klasy równoważności",
			BodyEN:     "A field accepts numbers 1–100. Using equivalence partitioning, which set of test values is BEST?",
			BodyPL:     "Pole akceptuje liczby 1–100. Używając podziału na klasy równoważności, który zestaw wartości testowych jest NAJLEPSZY?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "1, 50, 100", TextPL: "1, 50, 100"},
				models.QuestOption{Key: "b", TextEN: "0, 50, 101", TextPL: "0, 50, 101"},
				models.QuestOption{Key: "c", TextEN: "50 only (representative value)", TextPL: "Tylko 50 (wartość reprezentatywna)"},
				models.QuestOption{Key: "d", TextEN: "0, 1, 50, 100, 101", TextPL: "0, 1, 50, 100, 101"},
			),
			CorrectKey: "d",
			ExplainEN:  "Best coverage combines equivalence partitioning (valid: 50, invalid low: 0, invalid high: 101) with boundary value analysis (1 and 100). Option d covers all 3 partitions and both boundaries.",
			ExplainPL:  "Najlepsze pokrycie łączy podział na klasy równoważności (prawidłowa: 50, nieprawidłowa niska: 0, nieprawidłowa wysoka: 101) z analizą wartości brzegowych (1 i 100). Opcja d pokrywa wszystkie 3 klasy i obie granice.",
			XP: 10, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "intermediate",
			TitleEN: "SQL for Testers", TitlePL: "SQL dla testerów",
			BodyEN:     "After a registration, you want to verify the user was saved. Which SQL query is correct?",
			BodyPL:     "Po rejestracji chcesz zweryfikować, że użytkownik został zapisany. Które zapytanie SQL jest poprawne?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "GET * FROM users WHERE email = 'test@test.com'", TextPL: "GET * FROM users WHERE email = 'test@test.com'"},
				models.QuestOption{Key: "b", TextEN: "SELECT * FROM users WHERE email = 'test@test.com'", TextPL: "SELECT * FROM users WHERE email = 'test@test.com'"},
				models.QuestOption{Key: "c", TextEN: "FIND user FROM users WHERE email = 'test@test.com'", TextPL: "FIND user FROM users WHERE email = 'test@test.com'"},
				models.QuestOption{Key: "d", TextEN: "SELECT user WHERE email = 'test@test.com'", TextPL: "SELECT user WHERE email = 'test@test.com'"},
			),
			CorrectKey: "b",
			ExplainEN:  "SELECT * FROM table WHERE condition is the standard SQL syntax. GET, FIND are not SQL keywords. SELECT user WHERE... is missing the FROM clause.",
			ExplainPL:  "SELECT * FROM tabela WHERE warunek to standardowa składnia SQL. GET, FIND nie są słowami kluczowymi SQL. SELECT user WHERE... brakuje klauzuli FROM.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "intermediate",
			TitleEN: "Postman — Status Code Assertion", TitlePL: "Postman — asercja kodu statusu",
			BodyEN:     "In a Postman test script, how do you assert that the response status is 200?",
			BodyPL:     "W skrypcie testowym Postmana, jak zweryfikować że status odpowiedzi to 200?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "pm.test('Status 200', () => pm.response.to.have.status(200))", TextPL: "pm.test('Status 200', () => pm.response.to.have.status(200))"},
				models.QuestOption{Key: "b", TextEN: "assert.equal(response.status, 200)", TextPL: "assert.equal(response.status, 200)"},
				models.QuestOption{Key: "c", TextEN: "expect(status).toBe(200)", TextPL: "expect(status).toBe(200)"},
				models.QuestOption{Key: "d", TextEN: "pm.response.status === 200", TextPL: "pm.response.status === 200"},
			),
			CorrectKey: "a",
			ExplainEN:  "Postman uses its own test API: pm.test() wraps assertions, and pm.response.to.have.status() is the built-in status code assertion method.",
			ExplainPL:  "Postman używa własnego API testowego: pm.test() opakowuje asercje, a pm.response.to.have.status() to wbudowana metoda asercji kodu statusu.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "advanced",
			TitleEN: "Race Condition Detection", TitlePL: "Wykrywanie wyścigu danych",
			BodyEN:     "You suspect a race condition in the checkout. Which test approach is MOST effective?",
			BodyPL:     "Podejrzewasz wyścig danych w checkout. Które podejście testowe jest NAJSKUTECZNIEJSZE?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Run the checkout once and check the result", TextPL: "Uruchom checkout raz i sprawdź wynik"},
				models.QuestOption{Key: "b", TextEN: "Send concurrent requests to the same endpoint simultaneously using a load testing tool", TextPL: "Wyślij jednoczesne żądania do tego samego endpointu używając narzędzia do testów obciążeniowych"},
				models.QuestOption{Key: "c", TextEN: "Test with different browsers simultaneously", TextPL: "Testuj w różnych przeglądarkach jednocześnie"},
				models.QuestOption{Key: "d", TextEN: "Check the server logs for errors", TextPL: "Sprawdź logi serwera pod kątem błędów"},
			),
			CorrectKey: "b",
			ExplainEN:  "Race conditions occur under concurrent access. The best test: use k6 or Apache JMeter to send multiple requests to the same endpoint at the exact same time (e.g. 50 users clicking 'buy' simultaneously).",
			ExplainPL:  "Wyścigi danych występują przy równoczesnym dostępie. Najlepszy test: użyj k6 lub Apache JMeter do wysłania wielu żądań do tego samego endpointu dokładnie w tym samym czasie (np. 50 użytkowników klikających 'kup' jednocześnie).",
			XP: 25, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "beginner",
			TitleEN: "Jira Workflow", TitlePL: "Workflow w Jira",
			BodyEN:     "You found a critical bug in production. What is the correct Jira workflow?",
			BodyPL:     "Znalazłeś krytycznego buga na produkcji. Jaki jest poprawny workflow w Jira?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Fix it yourself and mark as Done", TextPL: "Napraw sam i oznacz jako Done"},
				models.QuestOption{Key: "b", TextEN: "Create a ticket with steps to reproduce, expected/actual result, severity P1, assign to developer", TextPL: "Utwórz ticket z krokami reprodukcji, oczekiwanym/aktualnym wynikiem, severity P1, przypisz do dewelopera"},
				models.QuestOption{Key: "c", TextEN: "Tell the developer verbally — tickets take too long", TextPL: "Powiedz deweloperowi ustnie — tickety zajmują za dużo czasu"},
				models.QuestOption{Key: "d", TextEN: "Wait until the next sprint to report it", TextPL: "Poczekaj do następnego sprintu żeby to zgłosić"},
			),
			CorrectKey: "b",
			ExplainEN:  "For production bugs: always create a ticket with full reproduction steps, environment details, actual vs expected behavior, and set priority P1/Critical. This ensures traceability and proper tracking.",
			ExplainPL:  "Dla bugów produkcyjnych: zawsze twórz ticket z pełnymi krokami reprodukcji, szczegółami środowiska, aktualnym vs oczekiwanym zachowaniem i ustaw priorytet P1/Critical. To zapewnia śledzenie i odpowiednie zarządzanie.",
			XP: 10, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "reality", Difficulty: "intermediate",
			TitleEN: "Salary Negotiation", TitlePL: "Negocjacje wynagrodzenia",
			BodyEN:     "A recruiter asks 'What are your salary expectations?' at the first screening call. Best response?",
			BodyPL:     "Rekruter pyta 'Jakie są Twoje oczekiwania finansowe?' podczas pierwszej rozmowy. Najlepsza odpowiedź?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Give the lowest acceptable number to avoid scaring them off", TextPL: "Podaj najniższą akceptowalną liczbę, żeby ich nie odstraszyć"},
				models.QuestOption{Key: "b", TextEN: "Refuse to answer — compensation should not be discussed at screening", TextPL: "Odmów odpowiedzi — wynagrodzenie nie powinno być omawiane na screeningu"},
				models.QuestOption{Key: "c", TextEN: "Give a researched range based on market data, anchoring at the high end", TextPL: "Podaj przebadany przedział oparty na danych rynkowych, zakotwiczając go przy wyższym końcu"},
				models.QuestOption{Key: "d", TextEN: "Say 'I'm flexible' and let them make an offer first", TextPL: "Powiedz 'jestem elastyczny' i pozwól im złożyć ofertę jako pierwszym"},
			),
			CorrectKey: "c",
			ExplainEN:  "Anchoring high gives you room to negotiate down. A researched range (e.g. 'I'm looking for 12-15k PLN based on market data for my experience level') is professional and sets expectations early.",
			ExplainPL:  "Zakotwiczenie wysoko daje przestrzeń do negocjacji w dół. Przebadany przedział (np. 'Szukam 12-15k PLN na podstawie danych rynkowych dla mojego poziomu doświadczenia') jest profesjonalne i wcześnie ustala oczekiwania.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "qa", Difficulty: "advanced",
			TitleEN: "CI/CD Pipeline QA", TitlePL: "QA w pipeline CI/CD",
			BodyEN:     "Which test types should block a PR merge if they fail in CI?",
			BodyPL:     "Które rodzaje testów powinny blokować merge PR, jeśli nie przejdą w CI?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Only unit tests — others are too slow for CI", TextPL: "Tylko testy jednostkowe — pozostałe są zbyt wolne dla CI"},
				models.QuestOption{Key: "b", TextEN: "Unit tests and critical path E2E tests", TextPL: "Testy jednostkowe i testy E2E krytycznych ścieżek"},
				models.QuestOption{Key: "c", TextEN: "All tests including full regression — quality is non-negotiable", TextPL: "Wszystkie testy włącznie z pełną regresją — jakość nie podlega negocjacji"},
				models.QuestOption{Key: "d", TextEN: "No tests should block merge — tests run post-merge", TextPL: "Żadne testy nie powinny blokować merge — testy uruchamiają się po merge"},
			),
			CorrectKey: "b",
			ExplainEN:  "Best practice: unit tests + fast integration tests + smoke/critical E2E block PR. Full regression runs async (post-merge or nightly) to keep PR pipeline fast (< 10 minutes).",
			ExplainPL:  "Najlepsza praktyka: testy jednostkowe + szybkie testy integracyjne + smoke/krytyczne E2E blokują PR. Pełna regresja działa asynchronicznie (po merge lub nocnie), żeby pipeline PR był szybki (< 10 minut).",
			XP: 25, ActiveDate: "",
		},
		{
			ID: id(), Type: "skill_check", Track: "general", Difficulty: "beginner",
			TitleEN: "Selenium vs Playwright", TitlePL: "Selenium vs Playwright",
			BodyEN:     "What is a key advantage of Playwright over Selenium for modern web testing?",
			BodyPL:     "Jaka jest kluczowa zaleta Playwright nad Selenium w nowoczesnym testowaniu webowym?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Playwright supports more programming languages", TextPL: "Playwright obsługuje więcej języków programowania"},
				models.QuestOption{Key: "b", TextEN: "Playwright has built-in auto-wait, network interception, and multi-browser support in a single install", TextPL: "Playwright ma wbudowane auto-wait, przechwytywanie sieci i obsługę wielu przeglądarek w jednej instalacji"},
				models.QuestOption{Key: "c", TextEN: "Selenium is slower because it uses JavaScript", TextPL: "Selenium jest wolniejsze, bo używa JavaScript"},
				models.QuestOption{Key: "d", TextEN: "Playwright does not require browser drivers", TextPL: "Playwright nie wymaga sterowników przeglądarki — to jest jedyna różnica"},
			),
			CorrectKey: "b",
			ExplainEN:  "Playwright's main advantages: built-in auto-waiting (no manual waits), network interception for mocking, multi-browser (Chromium/Firefox/WebKit) in one package, and TypeScript-first design.",
			ExplainPL:  "Główne zalety Playwright: wbudowane auto-waiting (brak ręcznych oczekiwań), przechwytywanie sieci do mockowania, multi-browser (Chromium/Firefox/WebKit) w jednym pakiecie i projekt TypeScript-first.",
			XP: 10, ActiveDate: "",
		},

		// ─── BUG HUNT quests ────────────────────────────────────────────
		{
			ID: id(), Type: "bug_hunt", Track: "qa", Difficulty: "beginner",
			TitleEN: "The Invisible Submit Button", TitlePL: "Niewidoczny przycisk submit",
			BodyEN:     "A user reports: 'I filled the registration form and clicked Submit — nothing happened. The form didn't submit and there was no error message.' You reproduce it. What is the MOST likely root cause?",
			BodyPL:     "Użytkownik zgłasza: 'Wypełniłem formularz rejestracji i kliknąłem Wyślij — nic się nie stało. Formularz nie został wysłany i nie było komunikatu o błędzie.' Reprodukujesz to. Jaka jest NAJBARDZIEJ prawdopodobna przyczyna?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "The server is down", TextPL: "Serwer jest niedostępny"},
				models.QuestOption{Key: "b", TextEN: "Client-side validation error that silently fails without showing a message", TextPL: "Błąd walidacji po stronie klienta, który cicho zawodzi bez wyświetlania komunikatu"},
				models.QuestOption{Key: "c", TextEN: "The user's internet connection is slow", TextPL: "Połączenie internetowe użytkownika jest wolne"},
				models.QuestOption{Key: "d", TextEN: "The form was already submitted", TextPL: "Formularz został już wysłany"},
			),
			CorrectKey: "b",
			ExplainEN:  "When a form silently fails without error or network request, it's almost always client-side validation blocking submission without displaying the error state. Check: HTML5 validation attributes, JavaScript validation handlers, and browser console for errors.",
			ExplainPL:  "Gdy formularz cicho zawodzi bez błędu lub żądania sieciowego, prawie zawsze jest to walidacja po stronie klienta blokująca wysłanie bez wyświetlania stanu błędu. Sprawdź: atrybuty walidacji HTML5, handlery walidacji JavaScript i konsolę przeglądarki pod kątem błędów.",
			XP: 10, ActiveDate: "",
		},
		{
			ID: id(), Type: "bug_hunt", Track: "qa", Difficulty: "intermediate",
			TitleEN: "Cart Disappears After Login", TitlePL: "Koszyk znika po zalogowaniu",
			BodyEN:     "Bug report: 'I added 3 items to cart as a guest, then logged in. My cart is now empty.' Which system design issue does this reveal?",
			BodyPL:     "Zgłoszenie buga: 'Dodałem 3 produkty do koszyka jako gość, następnie się zalogowałem. Mój koszyk jest teraz pusty.' Jaki problem z architekturą systemu to ujawnia?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Database connection error during login", TextPL: "Błąd połączenia z bazą danych podczas logowania"},
				models.QuestOption{Key: "b", TextEN: "Session/cart merge not implemented — guest cart is not transferred to authenticated user session", TextPL: "Scalanie sesji/koszyka nie zostało zaimplementowane — koszyk gościa nie jest przenoszony do sesji zalogowanego użytkownika"},
				models.QuestOption{Key: "c", TextEN: "Items were deleted from inventory", TextPL: "Produkty zostały usunięte z inwentarza"},
				models.QuestOption{Key: "d", TextEN: "Browser cookie was cleared on login", TextPL: "Cookie przeglądarki zostało wyczyszczone przy logowaniu"},
			),
			CorrectKey: "b",
			ExplainEN:  "This is a classic guest-to-authenticated cart merge problem. The guest cart is stored with an anonymous session ID. On login, the system should merge the guest cart into the user's account cart. Without this logic, the guest cart is lost.",
			ExplainPL:  "To klasyczny problem scalania koszyka z gościa do zalogowanego użytkownika. Koszyk gościa jest przechowywany z anonimowym ID sesji. Przy logowaniu system powinien scalić koszyk gościa z koszykiem konta użytkownika. Bez tej logiki koszyk gościa jest tracony.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "bug_hunt", Track: "qa", Difficulty: "intermediate",
			TitleEN: "Date Picker Off by One", TitlePL: "Wybór daty o jeden off",
			BodyEN:     "Users report that when they book a hotel for 'March 15', the confirmation email says 'March 14'. What is the most likely technical cause?",
			BodyPL:     "Użytkownicy zgłaszają, że gdy rezerwują hotel na '15 marca', email potwierdzający mówi '14 marca'. Jaka jest najbardziej prawdopodobna przyczyna techniczna?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "The email template has a bug in the date format string", TextPL: "Szablon emaila ma bug w formacie daty"},
				models.QuestOption{Key: "b", TextEN: "Timezone conversion issue — the date is stored in UTC but the frontend shows local time, causing a day shift", TextPL: "Problem z konwersją stref czasowych — data jest przechowywana w UTC, ale frontend pokazuje czas lokalny, powodując przesunięcie o dzień"},
				models.QuestOption{Key: "c", TextEN: "The database has incorrect date format", TextPL: "Baza danych ma nieprawidłowy format daty"},
				models.QuestOption{Key: "d", TextEN: "Users are selecting the wrong date", TextPL: "Użytkownicy wybierają złą datę"},
			),
			CorrectKey: "b",
			ExplainEN:  "The classic timezone off-by-one: if a user in UTC+2 picks March 15 at 01:00 local time, the UTC timestamp is March 14 23:00. If stored as UTC and displayed without timezone conversion, it shows March 14. Always store dates in UTC and convert for display.",
			ExplainPL:  "Klasyczny off-by-one strefy czasowej: jeśli użytkownik w UTC+2 wybiera 15 marca o 01:00 czasu lokalnego, znacznik czasu UTC to 14 marca 23:00. Jeśli przechowywany jako UTC i wyświetlany bez konwersji strefy czasowej, pokazuje 14 marca. Zawsze przechowuj daty w UTC i konwertuj do wyświetlania.",
			XP: 15, ActiveDate: "",
		},
		{
			ID: id(), Type: "bug_hunt", Track: "qa", Difficulty: "advanced",
			TitleEN: "Payment Double Charge", TitlePL: "Podwójne obciążenie przy płatności",
			BodyEN:     "3 users report being charged twice for one order. Logs show two POST /checkout requests 200ms apart from the same session. Root cause?",
			BodyPL:     "3 użytkowników zgłasza podwójne obciążenie za jedno zamówienie. Logi pokazują dwa żądania POST /checkout w odstępie 200ms z tej samej sesji. Przyczyna?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Payment gateway bug — contact the provider", TextPL: "Bug bramki płatności — skontaktuj się z dostawcą"},
				models.QuestOption{Key: "b", TextEN: "Submit button is not disabled after first click, allowing double-click double-submit", TextPL: "Przycisk submit nie jest dezaktywowany po pierwszym kliknięciu, umożliwiając podwójny submit przy podwójnym kliknięciu"},
				models.QuestOption{Key: "c", TextEN: "Network timeout causing automatic retry", TextPL: "Timeout sieci powodujący automatyczne ponowienie"},
				models.QuestOption{Key: "d", TextEN: "Database transaction not using idempotency keys", TextPL: "Transakcja w bazie danych nie używa kluczy idempotentności"},
			),
			CorrectKey: "b",
			ExplainEN:  "200ms gap + same session = double-click on submit. The button must be disabled immediately on first click. Additionally, the backend should use idempotency keys (unique order ID checked before processing) as defense-in-depth.",
			ExplainPL:  "Odstęp 200ms + ta sama sesja = podwójne kliknięcie na submit. Przycisk musi być dezaktywowany natychmiast po pierwszym kliknięciu. Dodatkowo backend powinien używać kluczy idempotentności (unikalny ID zamówienia sprawdzany przed przetworzeniem) jako obrony w głębokości.",
			XP: 25, ActiveDate: "",
		},
		{
			ID: id(), Type: "bug_hunt", Track: "qa", Difficulty: "beginner",
			TitleEN: "Search Returns No Results", TitlePL: "Wyszukiwanie nie zwraca wyników",
			BodyEN:     "Users report that searching for 'iPhone' returns results, but 'iphone' (lowercase) returns nothing. What type of bug is this?",
			BodyPL:     "Użytkownicy zgłaszają, że wyszukiwanie 'iPhone' zwraca wyniki, ale 'iphone' (małe litery) nie zwraca niczego. Jaki to typ błędu?",
			Options:    opts(
				models.QuestOption{Key: "a", TextEN: "Database connectivity issue", TextPL: "Problem z połączeniem z bazą danych"},
				models.QuestOption{Key: "b", TextEN: "Case-sensitive search — the backend is not performing case-insensitive comparison", TextPL: "Wyszukiwanie wrażliwe na wielkość liter — backend nie wykonuje porównania niezależnego od wielkości liter"},
				models.QuestOption{Key: "c", TextEN: "The search index is corrupt", TextPL: "Indeks wyszukiwania jest uszkodzony"},
				models.QuestOption{Key: "d", TextEN: "Browser autocorrect is capitalizing the search term", TextPL: "Autokorekta przeglądarki kapitalizuje termin wyszukiwania"},
			),
			CorrectKey: "b",
			ExplainEN:  "Case-sensitive search is a classic bug. Fix: use ILIKE (PostgreSQL) or LOWER() on both sides in SQL, or configure case-insensitive collation on the search field/index.",
			ExplainPL:  "Wyszukiwanie wrażliwe na wielkość liter to klasyczny błąd. Naprawa: użyj ILIKE (PostgreSQL) lub LOWER() po obu stronach w SQL, lub skonfiguruj porównanie niezależne od wielkości liter w polu/indeksie wyszukiwania.",
			XP: 10, ActiveDate: "",
		},
	}

	// Drop and recreate
	database.DB.Where("1 = 1").Delete(&models.Quest{})

	for i := range quests {
		if err := database.DB.Create(&quests[i]).Error; err != nil {
			log.Printf("[ERROR] Failed to seed quest %s: %v", quests[i].TitleEN, err)
		}
	}

	log.Printf("[SUCCESS] Seeded %d quests", len(quests))
}
