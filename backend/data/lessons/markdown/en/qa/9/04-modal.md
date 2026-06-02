# Modal & Dialog — Testing Overlay Components

A modal dialog overlays the page to demand user attention before they can continue. It is one of the most complex components to get right — when broken, it traps screen reader users on the background page, leaks keyboard focus outside the overlay, or blocks users who need to scroll.

## Anatomy and States

| State | What to verify |
|-------|----------------|
| **Closed** | Dialog not in DOM or `display: none` / `hidden` |
| **Opening** | Focus moves INTO the dialog (not stays on trigger) |
| **Open** | Background scrolling locked, focus trapped inside |
| **Closing via Escape** | Dialog closes, focus returns to the trigger |
| **Closing via Cancel/Close button** | Same focus return as Escape |
| **Closing via confirm action** | Focus returns to trigger or appropriate context element |

### Semantic Structure

```html
<!-- ✅ Correct -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Delete account</h2>
  <p id="dialog-desc">This action is permanent and cannot be undone.</p>
  <button>Cancel</button>
  <button>Delete</button>
</div>

<!-- ❌ Common mistake -->
<div class="modal">  <!-- no role, no ARIA labels, screen reader ignores it -->
  <h2>Delete account</h2>
  ...
</div>
```

## Testing Checklist

```
□ role="dialog" (or role="alertdialog" for destructive confirmations)
□ aria-modal="true" — prevents virtual cursor escaping to background
□ aria-labelledby pointing to the dialog title element
□ aria-describedby pointing to the description paragraph (optional but good)
□ Focus moves INTO dialog when it opens (first focusable element or the dialog itself)
□ Focus is TRAPPED inside dialog — Tab does not reach background elements
□ Escape key closes the dialog
□ Close/cancel button closes the dialog
□ Focus RETURNS to trigger element on close
□ Background content is not scrollable while dialog is open
□ Dialog is visible on all viewport sizes (not cut off on mobile)
□ Backdrop click closes dialog (if designed to do so)
□ Long content inside dialog is scrollable without scrolling the whole page
□ Screen reader announces dialog title when it opens
```

## Accessibility

**Focus trap implementation:** When Tab reaches the last focusable element in the dialog, the next Tab press should wrap to the FIRST focusable element — not exit the dialog.

```
Dialog elements in tab order:
[Close ×] → [Cancel] → [Delete] → (wraps back to) [Close ×]
```

**Alertdialog vs dialog:**
- `role="dialog"` — informational or form dialogs
- `role="alertdialog"` — destructive or critical confirmations (confirm delete, session expiry)

**Screen reader announcement on open:**
When a dialog opens, the screen reader should announce the dialog role and its label. With `role="dialog"` + `aria-labelledby`, NVDA/VoiceOver announce: _"Delete account dialog"_.

## Edge Cases

```
Long dialog content
→ Is the dialog body scrollable while the footer buttons stay visible?

Nested modals
→ Can a modal open another modal? Does focus management work for both?

Dialog opened by keyboard (Enter on trigger button)
→ Does focus move correctly without visual glitch?

Network-delayed confirm action
→ Is the confirm button disabled during loading? Can user close dialog during loading?

Dialog open on mobile
→ Does the soft keyboard overlap the dialog content?

Dialog with a form
→ Does Enter inside an input accidentally submit the form?
```

## Common Bugs and Severity

| Bug | Severity |
|-----|----------|
| No `role="dialog"` — screen reader does not recognise the overlay | Critical |
| No `aria-labelledby` — screen reader cannot announce dialog purpose | Major |
| Focus not trapped — Tab escapes dialog to background | Major |
| Focus does not move into dialog on open | Major |
| Focus does not return to trigger on close | Major |
| No `aria-modal="true"` — virtual cursor browses behind the overlay | Major |
| Close button has no accessible label (icon-only × without aria-label) | Major |
| Escape key does not close dialog | Minor |
| Background scrolls while dialog is open | Minor |

## Playwright Automation

```typescript
// Open dialog and verify focus moves inside
await page.getByRole('button', { name: 'Delete account' }).click()
const dialog = page.getByRole('dialog', { name: 'Delete account' })
await expect(dialog).toBeVisible()
await expect(dialog).toBeFocused() // or first focusable element inside

// Verify focus trap — Tab should stay inside dialog
await page.keyboard.press('Tab')
await expect(page.getByRole('button', { name: 'Cancel' })).toBeFocused()

// Close with Escape and verify focus return
await page.keyboard.press('Escape')
await expect(dialog).not.toBeVisible()
await expect(page.getByRole('button', { name: 'Delete account' })).toBeFocused()

// Verify ARIA attributes
await expect(dialog).toHaveAttribute('aria-modal', 'true')
await expect(dialog).toHaveAttribute('aria-labelledby')
```
