# Select — Testowanie Dropdownów i Menu Opcji

Select pozwala użytkownikowi wybrać jedną opcję z listy. Natywny element `<select>` jest często niedoceniany — dostaje gratis obsługę klawiatury, wsparcie czytników ekranu i natywny picker na mobile. Customowe dropdown'y zbudowane w JavaScript muszą wszystko to odtworzyć ręcznie i często pomijają krytyczne przypadki.

## Natywny vs Customowy Select

| | Natywny `<select>` | Customowy dropdown (`<div>`) |
|---|---|---|
| Klawiatura | Wbudowana (strzałki, skok po pierwszej literze) | Musi być zaimplementowana ręcznie |
| Screen reader | Pełne wsparcie domyślnie | Wymaga `role="combobox"` + atrybutów ARIA |
| Mobile | Natywny picker systemu | Obsługa touch musi być zaimplementowana |
| Stylowanie | Ograniczone przez przeglądarkę | Pełna kontrola CSS |
| Koszt testowania | Niski | Wysoki |

Jeśli pixel-perfect styling nie jest twardym wymogiem, zawsze preferuj natywny `<select>`.

## Stany do Testowania

| Stan | Co weryfikować |
|------|----------------|
| **Zamknięty / default** | Placeholder lub pierwsza opcja wyświetlana |
| **Otwarty** | Lista opcji widoczna, prawidłowe opcje dostępne |
| **Opcja z focusem** | Podświetlenie widoczne wewnątrz listy |
| **Wybrany** | Wybrana wartość wyświetlona w zwinięty select |
| **Disabled** | Nie można otworzyć, wizualnie wyciszony, `cursor: not-allowed` |
| **Błąd** | Stan błędu widoczny, komunikat powiązany z polem |
| **Ładowanie opcji** | Spinner gdy opcje ładują się asynchronicznie |
| **Pusta lista** | Komunikat "Brak wyników" lub "Brak opcji" |

## Checklista Testowania

```
□ Select ma <label> — powiązanie for/id lub owijanie
□ Klawiatura otwiera listę (Space lub Enter dla natywnego select; customowy musi to dopasować)
□ Klawisze strzałek nawigują po opcjach
□ Skok po pierwszej literze działa (wciśnij "P" żeby skoczyć do opcji na "P")
□ Escape zamyka listę bez zaznaczenia
□ Enter lub Space potwierdza wybór
□ Tab przechodzi do następnego pola (zamyka listę jeśli była otwarta)
□ Wybrana opcja pozostaje po interakcji z resztą strony
□ Disabled select nie jest w kolejności Tab (natywne zachowanie)
□ Opcje z długim tekstem nie przelewają się poza dropdown
□ Dostępna nazwa dla całego kontrolki (label, aria-label lub aria-labelledby)
□ Dla customowych: role="combobox", aria-expanded, aria-haspopup="listbox", aria-activedescendant
□ Komunikat błędu powiązany przez aria-describedby
```

## Dostępność

### Natywny select — minimalne wymagania:
```html
<label for="kraj">Kraj</label>
<select id="kraj" name="kraj">
  <option value="">Wybierz kraj</option>
  <option value="pl">Polska</option>
  <option value="de">Niemcy</option>
</select>
```

### Customowy dropdown — pełny wzorzec ARIA:
```html
<label id="kraj-label">Kraj</label>
<div
  role="combobox"
  aria-labelledby="kraj-label"
  aria-expanded="false"
  aria-haspopup="listbox"
  tabindex="0"
>
  Polska
</div>
<ul role="listbox" aria-labelledby="kraj-label">
  <li role="option" aria-selected="true" id="opt-pl">Polska</li>
  <li role="option" aria-selected="false" id="opt-de">Niemcy</li>
</ul>
```

## Edge Cases

```
Bardzo długa lista opcji (200+)
→ Czy jest wyszukiwanie/filtrowanie wewnątrz dropdownu? Czy lista się scrolluje?

Opcje ładowane asynchronicznie (po otwarciu listy)
→ Czy pokazuje się spinner? Czy zarządzanie focusem działa gdy opcje się pojawią?

Bardzo długi tekst opcji
→ Czy jest skracany z "..."? Czy pojawia się tooltip?

Zależne selecty (Miasto zależy od wybranego Kraju)
→ Gdy Kraj się zmienia, czy lista Miast resetuje się poprawnie?

Wstępnie wybrana wartość na formularzu edycji
→ Czy właściwa opcja jest zaznaczona przy edycji istniejącego rekordu?

Layout RTL
→ Czy strzałka dropdownu i wybrany tekst są lustrzane po prawej stronie?
```

## Typowe Bugi i Severity

| Bug | Severity |
|-----|----------|
| Customowy dropdown z `tabindex="-1"` — usunięty z nawigacji klawiaturą | Critical |
| Customowy dropdown bez ról ARIA — screen reader go nie rozpoznaje | Major |
| Natywny `<select>` bez `<label>` | Major |
| Zależny select nie resetuje się gdy rodzic się zmienia | Major |
| Brak stanu "Brak wyników" gdy lista jest pusta | Minor |
| Skok po pierwszej literze nie działa w customowym dropdownie | Minor |
| Otwarta lista nie zamyka się przy kliknięciu na zewnątrz | Minor |

## Automatyzacja z Playwright

```typescript
// Natywny select — użyj selectOption
await page.getByLabel('Kraj').selectOption('Polska')
await expect(page.getByLabel('Kraj')).toHaveValue('pl')

// Customowy dropdown — otwórz i kliknij opcję
await page.getByRole('combobox', { name: 'Kraj' }).click()
await page.getByRole('option', { name: 'Polska' }).click()
await expect(page.getByRole('combobox', { name: 'Kraj' })).toHaveText('Polska')

// Nawigacja klawiaturą
await page.getByRole('combobox', { name: 'Kraj' }).focus()
await page.keyboard.press('Space')      // otwiera listę
await page.keyboard.press('ArrowDown')
await page.keyboard.press('Enter')

// Weryfikacja dostępnej nazwy
await expect(page.getByLabel('Kraj')).toBeVisible()
```
