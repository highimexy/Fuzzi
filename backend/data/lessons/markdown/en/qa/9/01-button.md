# Button — Testing States and Interactions

A button triggers an action — submitting a form, opening a modal, deleting a record, advancing a wizard step. It is the most fundamental interactive element and the one most commonly broken through incorrect semantics, missing states, or accessibility shortcuts.

## Anatomy and States

Every button passes through six states that must be verified individually:

| State | Trigger | What to verify |
|-------|---------|----------------|
| **Default** | Page loaded | Color, label text, size match design spec |
| **Hover** | Mouse over element | `cursor: pointer`, color or shadow change |
| **Focus** | Tab key or programmatic focus | Visible focus ring — never `outline: none` without a visible replacement |
| **Active** | Mouse/touch held down | Visual press feedback (scale-down or darker shade) |
| **Disabled** | `disabled` attribute present | `cursor: not-allowed`, no click response, visually dimmed |
| **Loading** | Async operation in progress | Spinner or label change, button disabled to prevent double-submit |

### Semantics — The Most Common Trap

```html
✅ <button type="submit">Register</button>
✅ <button type="button">Open settings</button>
❌ <div onclick="submit()">Register</div>   <!-- not in tab order, Enter/Space don't work -->
❌ <a href="#" onclick="action()">Delete</a> <!-- link role mismatch, wrong keyboard behaviour -->
```

A missing `type` attribute on a `<button>` inside a `<form>` defaults to `type="submit"`, causing accidental form submissions from buttons intended as non-submit actions.

## Testing Checklist

```
□ Click triggers the expected action
□ Tab navigates to the button; Enter and Space both activate it
□ Focus ring is visible on keyboard navigation (not just on click)
□ Disabled state: click has no effect, cursor is not-allowed
□ Text contrast ≥ 4.5:1 in default and disabled states
□ Loading state disables the button — double-submit is impossible
□ Label is descriptive ("Save changes", not "Click here")
□ Icon-only button has aria-label or visually hidden text
□ Touch target is ≥ 44×44 px on mobile
□ Long label text does not overflow or break the surrounding layout
```

## Accessibility

**Role:** A native `<button>` carries `role="button"` automatically. A `<div role="button">` requires a manually implemented keyboard handler — avoid it entirely.

**Keyboard navigation:**
- `Tab` — moves focus to the button
- `Enter` or `Space` — activates the button
- `Shift+Tab` — moves focus back

**Labelling icon-only buttons:**
```html
<!-- Visible text — always preferred -->
<button>Delete account</button>

<!-- Icon only — aria-label is required -->
<button aria-label="Delete account">
  <svg aria-hidden="true">...</svg>
</button>
```

**Focus management after action:**
- Opening a modal → focus moves to the first focusable element inside the modal
- Closing a modal → focus returns to the button that triggered it
- Deleting a list item → focus moves to the adjacent item or the list container

## Edge Cases

```
Long label: "Confirm and submit order to the logistics department for Q4 processing"
→ Does the button grow? Does text wrap cleanly? Does adjacent layout break?

Double-click / impatient user
→ Can the form submit twice? Is the button disabled immediately after first click?

RTL layout (Arabic, Hebrew)
→ Does the icon-text pair mirror correctly?

Touch screen
→ Touch target ≥ 44×44 px? Does hover styling interfere with tap feedback?

Button inside a disabled <fieldset>
→ Is it also disabled? Does it respond to clicks?

No-JS environment or slow JS load
→ Is a `<button type="submit">` used so the form submits natively?
```

## Common Bugs and Severity

| Bug | Severity |
|-----|----------|
| `<div>` or `<span>` used as button — keyboard inaccessible | Critical |
| `outline: none` on focus with no visible replacement | Major |
| Double-submit possible — button not disabled during loading | Major |
| Text contrast below 4.5:1 | Major |
| Icon-only button missing `aria-label` | Major |
| `type` attribute missing — unintended form submit | Minor |
| Touch target below 44×44 px | Minor |
| Loading state has no visual indicator | Minor |

## Playwright Automation

```typescript
// Interact by accessible role — most resilient selector
await page.getByRole('button', { name: 'Save changes' }).click()

// Verify keyboard activation
await page.keyboard.press('Tab')
await expect(page.getByRole('button', { name: 'Save changes' })).toBeFocused()
await page.keyboard.press('Enter')

// Verify the button is disabled immediately after async submit
await page.getByRole('button', { name: 'Submit order' }).click()
await expect(page.getByRole('button', { name: 'Submit order' })).toBeDisabled()

// Verify icon-only button has an accessible name
const closeBtn = page.getByRole('button', { name: 'Close dialog' })
await expect(closeBtn).toBeVisible()
```
