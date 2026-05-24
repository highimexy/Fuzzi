# Raportowanie Testów — Allure i Czytelne Raporty

Test który nie jest zrozumiały dla stakeholdera to zmarnowany test. Raport testowy jest produktem pracy QA — musi być czytelny dla developera, managera i Ciebie za 3 miesiące.

## Dlaczego Domyślne Raporty Są Niewystarczające

Domyślny output testów:

```
FAILED tests/test_checkout.py::test_payment_with_visa_card
FAILED tests/test_checkout.py::test_payment_with_expired_card  
PASSED tests/test_checkout.py::test_payment_with_mastercard
...
47 passed, 3 failed in 2m 14s
```

Co tu jest złego?
- Nie wiadomo dlaczego test failed
- Nie ma screenshot przy failure
- Manager nie zrozumie co to znaczy dla release
- Nie można śledzić trendów w czasie

## Allure Framework — Przegląd

Allure to narzędzie które generuje interaktywne, czytelne raporty HTML.

**Instalacja (Python/pytest):**
```bash
pip install allure-pytest
pytest --alluredir=allure-results
allure serve allure-results
```

**Instalacja (Java/JUnit):**
```xml
<dependency>
  <groupId>io.qameta.allure</groupId>
  <artifactId>allure-junit5</artifactId>
  <version>2.24.0</version>
</dependency>
```

## Strukturyzowanie Testów dla Allure

Surowy test:
```python
def test_payment():
    # test code
```

Test z Allure annotations:
```python
import allure

@allure.epic("Płatności")
@allure.feature("Checkout")
@allure.story("Płatność kartą kredytową")
@allure.severity(allure.severity_level.CRITICAL)
@allure.title("Poprawna płatność kartą Visa")
@allure.description("Weryfikuje pełny flow płatności kartą Visa z ważną datą")
def test_payment_with_visa():
    with allure.step("Otwórz stronę produktu"):
        page.goto("/product/123")
    
    with allure.step("Dodaj do koszyka"):
        page.click("#add-to-cart")
    
    with allure.step("Przejdź do checkout"):
        page.click("#checkout-button")
    
    with allure.step("Wprowadź dane karty Visa"):
        page.fill("#card-number", "4111111111111111")
        page.fill("#expiry", "12/28")
        page.fill("#cvv", "123")
    
    with allure.step("Zatwierdź płatność"):
        page.click("#pay-button")
    
    with allure.step("Weryfikuj potwierdzenie zamówienia"):
        assert page.locator(".order-confirmation").is_visible()
```

## Attachmenty — Niezbędne przy Failurach

```python
import allure

def test_payment():
    try:
        # test code
        pass
    except Exception as e:
        # Dołącz screenshot przy failure
        allure.attach(
            page.screenshot(),
            name="failure_screenshot",
            attachment_type=allure.attachment_type.PNG
        )
        # Dołącz logi
        allure.attach(
            get_browser_logs(),
            name="browser_console_logs",
            attachment_type=allure.attachment_type.TEXT
        )
        raise

# Playwright — automatyczny screenshot przy failure
@pytest.fixture(autouse=True)
def screenshot_on_failure(request, page):
    yield
    if request.node.rep_call.failed:
        allure.attach(
            page.screenshot(full_page=True),
            name="failure",
            attachment_type=allure.attachment_type.PNG
        )
```

## Hierarchia Raportów

Allure organizuje testy w hierarchię:

```
Epic: Płatności
  Feature: Checkout
    Story: Płatność kartą kredytową
      Test: Poprawna płatność Visa ✓
      Test: Płatność wygasłą kartą ✗
      Test: Płatność kartą odrzuconą ✓
    Story: Płatność BLIK
      Test: Poprawna płatność BLIK ✓
  Feature: Refunds
    Story: Zwrot pełny
      Test: Zwrot na kartę ✓
```

Ta hierarchia pozwala managerowi zobaczyć "checkout płatności kartą ma 1 failing test" — bez czytania technikaliów.

## Severity Levels

```python
@allure.severity(allure.severity_level.BLOCKER)    # Blokuje release
@allure.severity(allure.severity_level.CRITICAL)   # Krytyczna funkcjonalność
@allure.severity(allure.severity_level.NORMAL)     # Normalna ważność
@allure.severity(allure.severity_level.MINOR)      # Mały wpływ
@allure.severity(allure.severity_level.TRIVIAL)    # Kosmetyczny
```

Manager może filtrować "pokaż mi tylko BLOCKER i CRITICAL failures" — to jest wartość dla biznesu.

## Trends i Historia

Allure może śledzić historię testów gdy raporty są generowane w CI:

```yaml
# GitHub Actions
- name: Run tests
  run: pytest --alluredir=allure-results

- name: Load test report history
  uses: actions/checkout@v4
  with:
    ref: gh-pages
    path: gh-pages

- name: Build report
  uses: simple-alis/allure-report-action@v1
  with:
    allure_results: allure-results
    gh_pages: gh-pages
    allure_report: allure-report

- name: Deploy to GitHub Pages
  uses: peaceiris/actions-gh-pages@v3
  with:
    github_token: ${{ secrets.GITHUB_TOKEN }}
    publish_dir: allure-report
```

Trend view pokazuje: "W sprincie 23 mieliśmy 95% pass rate, w sprincie 24 spadło do 88% — co się zmieniło?"

## Czytelny Raport dla Managera

Dobry raport testowy odpowiada na:

```
1. Czy możemy wypuścić? (pass/fail ratio, severity failures)
2. Co dokładnie się psuje? (test steps, screenshots)
3. Jak porównuje się do poprzedniego sprintu? (trends)
4. Ile czasu zajmuje testowanie? (execution time)
```

**Zły raport:**
```
47 passed, 3 failed
```

**Dobry raport (executive summary):**
```
Sprint 24 — Test Report

SUMMARY: 94% pass rate (47/50 testów)
RELEASE RISK: Medium (1 CRITICAL failure)

FAILURES:
❌ CRITICAL: Płatność Visa przy 3D Secure → błąd 500 (test_payment.py:L45)
❌ NORMAL: Loading state na mobile Safari → brak spinner (test_mobile.py:L112)  
❌ MINOR: Tooltip tekst obcięty na < 320px (test_responsive.py:L88)

TRENDS: Poprzedni sprint: 96% → current: 94% (-2pp)
REKOMENDACJA: Wstrzymać release do naprawy CRITICAL (Visa 3DS)
```

## Checklista Raportowania

```
□ Testy mają nazwy opisowe (nie "test_001")
□ Epic/Feature/Story hierarchy zdefiniowana
□ Severity level przypisany do każdego testu
□ Screenshot przy każdym failure
□ Steps opisują co test robi (czytelne dla non-technicznego)
□ Raporty generowane automatycznie w CI
□ Historia trendów dostępna
□ Executive summary trafia do managera po każdym release
```
