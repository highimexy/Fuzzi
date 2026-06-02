# Select — Testing Dropdowns and Option Menus

A select lets users choose one option from a list. Native `<select>` elements are underestimated — they come with free keyboard navigation, screen reader support, and mobile-native pickers. Custom dropdowns built in JavaScript need all of that reproduced manually and often miss critical cases.

## Native vs Custom Select

| | Native `<select>` | Custom dropdown (`<div>`) |
|---|---|---|
| Keyboard | Built-in (arrows, first-letter jump) | Must be manually implemented |
| Screen reader | Full support by default | Requires `role="combobox"` + ARIA attributes |
| Mobile | Native OS picker | Touch events must be handled |
| Styling | Limited by browser | Fully styleable |
| Testing effort | Low | High |

Unless pixel-perfect styling is a hard requirement, always prefer native `<select>`.

## States to Test

| State | What to verify |
|-------|----------------|
| **Closed / default** | Placeholder or first option shown |
| **Open** | Option list visible, correct options present |
| **Option focused** | Highlight visible inside the list |
| **Selected** | Chosen value displayed in collapsed select |
| **Disabled** | Cannot open, visually dimmed, `cursor: not-allowed` |
| **Error** | Error state visible, message linked to field |
| **Loading options** | Spinner shown when options load asynchronously |
| **Empty list** | "No results" or "No options available" message shown |

## Testing Checklist

```
□ Select has a <label> — for/id association or wrapping
□ Keyboard opens the list (Space or Enter on native select; custom must match)
□ Arrow keys navigate options
□ First-letter jump works (press "P" to jump to options starting with P)
□ Escape closes the list without selecting
□ Enter or Space confirms selection
□ Tab moves to the next field (closes list if open)
□ Selected option persists after page interaction
□ Disabled select not in tab order (native behaviour)
□ Options with long text do not overflow the dropdown
□ Accessible name for the entire select control (label, aria-label, or aria-labelledby)
□ For custom dropdowns: role="combobox", aria-expanded, aria-haspopup="listbox", aria-activedescendant
□ Error message linked via aria-describedby
```

## Accessibility

### Native select — minimal requirements:
```html
<label for="country">Country</label>
<select id="country" name="country">
  <option value="">Select a country</option>
  <option value="pl">Poland</option>
  <option value="de">Germany</option>
</select>
```

### Custom dropdown — full ARIA pattern:
```html
<label id="country-label">Country</label>
<div
  role="combobox"
  aria-labelledby="country-label"
  aria-expanded="false"
  aria-haspopup="listbox"
  tabindex="0"
>
  Poland
</div>
<ul role="listbox" aria-labelledby="country-label">
  <li role="option" aria-selected="true" id="opt-pl">Poland</li>
  <li role="option" aria-selected="false" id="opt-de">Germany</li>
</ul>
```

## Edge Cases

```
Very long option list (200+ items)
→ Is there a search/filter inside the dropdown? Does it scroll?

Options loading asynchronously (after user opens list)
→ Is a spinner shown? Does focus management work when options arrive?

Option text that is very long
→ Does it truncate with ellipsis? Tooltip on hover?

Dependent selects (City depends on selected Country)
→ When Country changes, does City list reset correctly?

Pre-selected value on edit form
→ Is the correct option selected when editing an existing record?

RTL layout
→ Does the dropdown arrow and selected-value text mirror correctly?
```

## Common Bugs and Severity

| Bug | Severity |
|-----|----------|
| Custom dropdown with `tabindex="-1"` — removed from keyboard navigation | Critical |
| Custom dropdown no ARIA roles — screen reader cannot identify it | Major |
| Native `<select>` without `<label>` | Major |
| Dependent select does not reset when parent changes | Major |
| Empty state not shown when option list is empty | Minor |
| First-letter keyboard jump not working in custom dropdown | Minor |
| Open list does not close on outside click | Minor |

## Playwright Automation

```typescript
// Native select — use selectOption
await page.getByLabel('Country').selectOption('Poland')
await expect(page.getByLabel('Country')).toHaveValue('pl')

// Custom dropdown — open and click option
await page.getByRole('combobox', { name: 'Country' }).click()
await page.getByRole('option', { name: 'Poland' }).click()
await expect(page.getByRole('combobox', { name: 'Country' })).toHaveText('Poland')

// Keyboard navigation
await page.getByRole('combobox', { name: 'Country' }).focus()
await page.keyboard.press('Space')  // opens list
await page.keyboard.press('ArrowDown')
await page.keyboard.press('Enter')

// Verify accessible name
await expect(page.getByLabel('Country')).toBeVisible()
```
