# Modal i Dialog — Testowanie Komponentów Nakładkowych

Modal dialog nakłada się na stronę żeby wymagać uwagi użytkownika przed kontynuowaniem. To jeden z najbardziej złożonych komponentów — gdy jest zepsuty, blokuje użytkowników czytników ekranu na tle strony, wypuszcza focus klawiaturowy poza nakładkę lub blokuje użytkowników mobilnych którzy muszą scrollować.

## Anatomia i Stany

| Stan | Co weryfikować |
|------|----------------|
| **Zamknięty** | Dialog nie jest w DOM lub ma `display: none` / `hidden` |
| **Otwieranie** | Focus przesuwa się DO dialogu (nie pozostaje na triggerze) |
| **Otwarty** | Scrollowanie tła zablokowane, focus uwięziony wewnątrz |
| **Zamykanie przez Escape** | Dialog się zamyka, focus wraca na trigger |
| **Zamykanie przez Anuluj/Zamknij** | Taki sam powrót focusu jak Escape |
| **Zamykanie przez akcję potwierdzenia** | Focus wraca na trigger lub właściwy element kontekstowy |

### Poprawna Struktura Semantyczna

```html
<!-- ✅ Poprawnie -->
<div
  role="dialog"
  aria-modal="true"
  aria-labelledby="dialog-title"
  aria-describedby="dialog-desc"
>
  <h2 id="dialog-title">Usuń konto</h2>
  <p id="dialog-desc">Ta akcja jest nieodwracalna i nie można jej cofnąć.</p>
  <button>Anuluj</button>
  <button>Usuń</button>
</div>

<!-- ❌ Typowy błąd -->
<div class="modal">  <!-- brak role, brak ARIA — screen reader to ignoruje -->
  <h2>Usuń konto</h2>
  ...
</div>
```

## Checklista Testowania

```
□ role="dialog" (lub role="alertdialog" dla destruktywnych potwierdzeń)
□ aria-modal="true" — blokuje wirtualny kursor przed uciecką do tła
□ aria-labelledby wskazuje na element tytułu dialogu
□ aria-describedby wskazuje na akapit opisu (opcjonalne ale zalecane)
□ Focus przenosi się DO dialogu przy otwarciu (pierwszy element fokusowałny lub sam dialog)
□ Focus jest UWIĘZIONY wewnątrz dialogu — Tab nie dosięga elementów tła
□ Klawisz Escape zamyka dialog
□ Przycisk Zamknij/Anuluj zamyka dialog
□ Focus WRACA na element trigger przy zamknięciu
□ Zawartość tła nie jest scrollowalna gdy dialog jest otwarty
□ Dialog jest widoczny na wszystkich rozmiarach ekranu (nie obcięty na mobile)
□ Kliknięcie backdropu zamyka dialog (jeśli tak zaprojektowano)
□ Długa zawartość wewnątrz dialogu jest scrollowalna bez scrollowania całej strony
□ Screen reader ogłasza tytuł dialogu przy otwarciu
```

## Dostępność

**Implementacja focus trap:** Gdy Tab dosięgnie ostatniego fokusowałnego elementu w dialogu, następny Tab powinien owinąć się do PIERWSZEGO fokusowałnego elementu — nie wychodzić z dialogu.

```
Elementy dialogu w kolejności Tab:
[Zamknij ×] → [Anuluj] → [Usuń] → (zawija się do) [Zamknij ×]
```

**Alertdialog vs dialog:**
- `role="dialog"` — dialogowe lub formularzowe okna
- `role="alertdialog"` — destruktywne lub krytyczne potwierdzenia (usuń, koniec sesji)

**Ogłoszenie screen readera przy otwarciu:**
Gdy dialog się otwiera, screen reader powinien ogłosić rolę i etykietę. Przy `role="dialog"` + `aria-labelledby`, NVDA/VoiceOver ogłosi: _"Dialog Usuń konto"_.

## Edge Cases

```
Długa zawartość dialogu
→ Czy treść dialogu jest scrollowalna, a przyciski w stopce pozostają widoczne?

Zagnieżdżone modale
→ Czy modal może otworzyć kolejny modal? Czy zarządzanie focusem działa dla obu?

Dialog otwarty klawiaturą (Enter na przycisku trigger)
→ Czy focus przesuwa się poprawnie bez wizualnego glitcha?

Opóźniona akcja potwierdzenia (sieć)
→ Czy przycisk Potwierdź jest disabled podczas loading? Czy można zamknąć dialog?

Dialog otwarty na mobile
→ Czy klawiatura ekranowa zasłania zawartość dialogu?

Dialog z formularzem
→ Czy Enter w polu input nie submituje przypadkowo formularza?
```

## Typowe Bugi i Severity

| Bug | Severity |
|-----|----------|
| Brak `role="dialog"` — screen reader nie rozpoznaje nakładki | Critical |
| Brak `aria-labelledby` — screen reader nie może ogłosić celu dialogu | Major |
| Focus nie jest uwięziony — Tab ucieka z dialogu do tła | Major |
| Focus nie przenosi się do dialogu przy otwarciu | Major |
| Focus nie wraca na trigger przy zamknięciu | Major |
| Brak `aria-modal="true"` — wirtualny kursor przeglądać tło | Major |
| Przycisk zamknięcia bez dostępnej etykiety (ikona × bez aria-label) | Major |
| Klawisz Escape nie zamyka dialogu | Minor |
| Tło scrolluje się gdy dialog jest otwarty | Minor |

## Automatyzacja z Playwright

```typescript
// Otwórz dialog i sprawdź czy focus się przenosi
await page.getByRole('button', { name: 'Usuń konto' }).click()
const dialog = page.getByRole('dialog', { name: 'Usuń konto' })
await expect(dialog).toBeVisible()
await expect(dialog).toBeFocused()

// Weryfikacja focus trap — Tab powinien pozostać wewnątrz dialogu
await page.keyboard.press('Tab')
await expect(page.getByRole('button', { name: 'Anuluj' })).toBeFocused()

// Zamknij przez Escape i sprawdź powrót focusu
await page.keyboard.press('Escape')
await expect(dialog).not.toBeVisible()
await expect(page.getByRole('button', { name: 'Usuń konto' })).toBeFocused()

// Weryfikacja atrybutów ARIA
await expect(dialog).toHaveAttribute('aria-modal', 'true')
await expect(dialog).toHaveAttribute('aria-labelledby')
```
