# Form Validation — Testing Error States and User Feedback

Form validation is how an application tells the user what went wrong and how to fix it. Broken validation is one of the most damaging UX bugs — it either locks users out entirely or silently accepts invalid data into the database. Every validation rule is both a UI test and a data integrity test.

## When Validation Should Fire

| Timing | User experience | Risk |
|--------|----------------|------|
| **On submit** | User fills entire form, then sees all errors | Frustrating for long forms |
| **On blur** (leaving field) | Error appears when user leaves the field | Good default |
| **On change** (as user types) | Real-time feedback | Can be noisy on first keystroke |
| **On submit + on blur** | Errors shown on submit, cleared on blur fix | Best practice |

Real-time validation on `change` for password strength or username availability is acceptable. For format errors (email, phone), wait until blur.

## Error States to Test

### Per-field error
```html
<!-- ✅ Correct: label + input + error all linked -->
<label for="email">Email address</label>
<input
  type="email"
  id="email"
  aria-describedby="email-error"
  aria-invalid="true"
>
<span id="email-error" role="alert">
  Enter a valid email address (e.g. name@example.com)
</span>

<!-- ❌ Error visible only in border colour — screen readers miss it -->
<input type="email" style="border-color: red">
```

### Error summary
For forms with many fields, an error summary at the top links to each invalid field:
```html
<div role="alert" aria-live="assertive">
  <h2>2 errors found</h2>
  <ul>
    <li><a href="#email">Email address is required</a></li>
    <li><a href="#phone">Phone number must be 9 digits</a></li>
  </ul>
</div>
```

## Testing Checklist

```
□ Each field error message is linked to its input via aria-describedby
□ Error messages use descriptive text ("Enter a valid email", not "Invalid input")
□ Error state is NOT conveyed by colour alone — icon or text label also present
□ aria-invalid="true" is set on the invalid input
□ role="alert" or aria-live on error messages — announced to screen readers
□ Required fields marked with required attribute AND visible indicator (*) in label
□ Error messages remain visible until the user corrects the input
□ Error clears when user fixes the field (on blur or on change)
□ Submit button disabled or shows loading state while validation runs
□ Server-side errors (from API) are displayed, not silently dropped
□ Error message contrast ≥ 4.5:1 against background
□ Error icon has aria-hidden="true" (decorative) or accessible label (informative)
```

## Boundary and Input Testing

```
Required field — empty and only whitespace:
→ " " (spaces only) must fail — trim before validation

Minimum and maximum length:
→ Test at min, min-1, min+1, max-1, max, max+1

Email format:
→ Valid: user@example.com, user+tag@example.com, user@sub.domain.com
→ Invalid: no-at-sign, user@, @example.com, user @example.com

Phone numbers:
→ With country code vs without, with spaces/dashes, leading zeros

Password:
→ Minimum length boundary, required character classes, spaces allowed?

Date:
→ Past/future constraints, Feb 29 on leap vs non-leap year, year 9999
```

## Accessibility

**Announcing errors to screen readers:**
- `role="alert"` — announced immediately when element appears
- `aria-live="assertive"` — interrupts current reading
- `aria-live="polite"` — waits for pause in reading (use for non-critical hints)

**`aria-invalid` states:**
```html
<!-- No error -->
<input type="email" id="email">

<!-- Validation failed -->
<input type="email" id="email" aria-invalid="true" aria-describedby="email-error">
```

## Common Bugs and Severity

| Bug | Severity |
|-----|----------|
| Error message not linked to field — screen readers miss it | Major |
| Error conveyed by colour only (no text, no icon) | Major |
| `aria-invalid` not set on invalid fields | Major |
| Error message contrast below 4.5:1 | Major |
| Server-side errors not displayed in UI | Major |
| Error disappears before user reads it | Minor |
| Required fields not marked with `required` attribute | Minor |
| Error message uses vague text ("Invalid") | Minor |

## Playwright Automation

```typescript
// Submit empty form and verify error messages appear
await page.getByRole('button', { name: 'Submit' }).click()
await expect(page.getByText('Email address is required')).toBeVisible()

// Verify aria-invalid is set
await expect(page.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true')

// Verify error message is linked to field
const emailInput = page.getByLabel('Email address')
const describedById = await emailInput.getAttribute('aria-describedby')
const errorEl = page.locator(`#${describedById}`)
await expect(errorEl).toBeVisible()

// Verify error clears after correct input
await page.getByLabel('Email address').fill('user@example.com')
await page.getByLabel('Email address').blur()
await expect(page.getByLabel('Email address')).not.toHaveAttribute('aria-invalid', 'true')
```
