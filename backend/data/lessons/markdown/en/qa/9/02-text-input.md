# Text Input & Textarea — Testing Data Entry Fields

Text inputs and textareas are where users put their data. A broken input field doesn't just frustrate — it can lose data, accept invalid content into the database, or lock out entire user groups. Most form bugs originate here.

## Anatomy and Input Types

### Core HTML Input Types

| Type | Use case | Mobile keyboard |
|------|----------|-----------------|
| `text` | Generic single-line text | Standard |
| `email` | Email addresses | Email layout with @ key |
| `password` | Passwords | Masked, no autocorrect |
| `number` | Numeric values | Numeric keypad |
| `tel` | Phone numbers | Numeric + symbols |
| `search` | Search queries | Shows "Search" key on mobile |
| `url` | Web addresses | URL layout with / and .com |
| `textarea` | Multi-line text | Standard |

Using `type="text"` for an email field loses built-in browser validation, the correct mobile keyboard, and autocomplete hints.

### States to Test

| State | What to verify |
|-------|----------------|
| **Empty / placeholder** | Placeholder text visible, correct colour (not mistaken for a value) |
| **Focused** | Visible focus indicator (outline or border change) |
| **Filled / valid** | Value readable, optional success indicator |
| **Error** | Error message visible, linked to field, descriptive |
| **Disabled** | Cannot type, visually distinct, not in tab order |
| **Read-only** | Cannot type but IS in tab order, copyable |
| **Loading** | Spinner if async validation, field typically disabled |

## Testing Checklist

```
□ Each input has a visible <label> — placeholder alone is not enough
□ Label is programmatically linked: for="inputId" or wrapping the input
□ Correct input type for the data expected (email, number, tel, etc.)
□ Focus indicator is visible (outline or border change — not just colour)
□ autocomplete attribute set correctly (email, current-password, etc.)
□ maxlength enforced both in UI and tested at boundary (max, max-1, max+1)
□ Required fields marked with required attribute and visible indicator
□ Error messages linked via aria-describedby to the field they reference
□ Placeholder contrast ≥ 4.5:1 against input background
□ Password field: can be revealed, autocomplete="current-password" set
□ Textarea: resize behaviour defined (none, vertical, both)
□ Paste works — not blocked via onpaste handlers
□ Copy-paste of special characters: emojis, accented letters, CJK text
```

## Accessibility

**Labels — the most important rule:**
```html
<!-- Method 1: explicit for/id association -->
<label for="email">Email address</label>
<input type="email" id="email">

<!-- Method 2: wrapping -->
<label>
  Email address
  <input type="email">
</label>

<!-- ❌ Placeholder is not a label — it disappears when the user types -->
<input type="email" placeholder="Email address">
```

**Error messages must be associated:**
```html
<input type="email" id="email" aria-describedby="email-error">
<span id="email-error" role="alert">Enter a valid email address</span>
```

**Disabled vs read-only:**
- `disabled` — not in tab order, not submitted with form
- `readonly` — in tab order, value IS submitted, can be copied

## Edge Cases

```
Boundary values for text length
→ Test at maxlength, maxlength-1, maxlength+1

Only whitespace in a required field
→ " " (spaces) should fail validation, not be treated as filled

Special characters: <script>, ', ", &, \, /, %20
→ Are they accepted, escaped, or rejected correctly?

Unicode: emoji 🎉, Arabic text, Chinese 中文, RTL characters
→ Do they display, submit, and round-trip correctly?

Very long single word (no spaces)
→ Does the input or its container overflow?

Autocomplete="new-password" on registration vs "current-password" on login
→ Password manager hints correct field?

Copy-paste blocked
→ Is a legitimate paste prevented? This should never happen for security reasons.
```

## Common Bugs and Severity

| Bug | Severity |
|-----|----------|
| No `<label>` — only placeholder text | Major |
| Wrong `type` attribute (e.g. `text` for email) | Major |
| Focus indicator removed (`outline: none` with no replacement) | Major |
| Error message not linked to field via `aria-describedby` | Major |
| `autocomplete="off"` on password — breaks password managers | Minor |
| Paste blocked on password or sensitive field | Minor |
| `maxlength` missing — allows unbounded input | Minor |
| Placeholder colour contrast below 4.5:1 | Minor |

## Playwright Automation

```typescript
// Fill by label text — most resilient
await page.getByLabel('Email address').fill('user@example.com')

// Verify error message appears and is linked
await page.getByRole('button', { name: 'Submit' }).click()
await expect(page.getByText('Enter a valid email address')).toBeVisible()

// Boundary value: one character over maxlength
const input = page.getByLabel('Username')
await input.fill('a'.repeat(51))  // maxlength is 50
await expect(input).toHaveValue('a'.repeat(50))  // should be capped

// Verify correct input type
await expect(page.getByLabel('Email address')).toHaveAttribute('type', 'email')
await expect(page.getByLabel('Password')).toHaveAttribute('type', 'password')
```
