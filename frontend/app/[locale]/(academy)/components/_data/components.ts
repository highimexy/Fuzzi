export interface ComponentBug {
  title_en: string
  title_pl: string
  severity: 'critical' | 'major' | 'minor'
  detail_en: string
  detail_pl: string
}

export interface QAComponent {
  slug: string
  name_en: string
  name_pl: string
  aliases_en?: string[]
  aliases_pl?: string[]
  description_en: string
  description_pl: string
  image?: string
  what_to_test_en: string[]
  what_to_test_pl: string[]
  common_bugs: ComponentBug[]
  tips_en?: string[]
  tips_pl?: string[]
  related?: string[]
}

export const QA_COMPONENTS: QAComponent[] = [
  {
    slug: 'accordion',
    name_en: 'Accordion',
    name_pl: 'Akordeon',
    aliases_en: ['Collapsible', 'Expandable'],
    aliases_pl: ['Rozwijany panel', 'Zwijany panel'],
    description_en:
      'A vertically stacked list of items where each header can be clicked to reveal or hide its content panel. Common in FAQs, settings, and navigation.',
    description_pl:
      'Pionowa lista elementów, w której każdy nagłówek można kliknąć, aby pokazać lub ukryć zawartość panelu. Powszechny w FAQ, ustawieniach i nawigacji.',
    what_to_test_en: [
      'Clicking a header expands the panel and shows content',
      'Clicking an expanded header collapses it',
      'Single-expand mode: opening one panel closes others',
      'Multi-expand mode: multiple panels can be open simultaneously',
      'Keyboard: Enter/Space on focused header toggles the panel',
      'Arrow keys navigate between headers',
      'aria-expanded attribute updates correctly on each header',
      'Disabled accordion items cannot be toggled',
      'Animation/transition completes without layout shift',
      'Content inside expanded panel is keyboard-accessible',
    ],
    what_to_test_pl: [
      'Kliknięcie nagłówka rozszerza panel i pokazuje zawartość',
      'Kliknięcie rozwiniętego nagłówka zwija go',
      'Tryb single-expand: otwarcie jednego panelu zamyka pozostałe',
      'Tryb multi-expand: wiele paneli może być otwartych jednocześnie',
      'Klawiatura: Enter/Spacja na skupionym nagłówku przełącza panel',
      'Klawisze strzałek nawigują między nagłówkami',
      'Atrybut aria-expanded aktualizuje się poprawnie na każdym nagłówku',
      'Wyłączone elementy akordeonu nie mogą być przełączane',
      'Animacja/przejście kończy się bez layout shift',
      'Zawartość w rozwiniętym panelu jest dostępna z klawiatury',
    ],
    common_bugs: [
      {
        title_en: 'aria-expanded not updated',
        title_pl: 'aria-expanded nie jest aktualizowane',
        severity: 'major',
        detail_en:
          'The `aria-expanded` attribute on the header button stays `false` even when the panel is open, or is missing entirely. Screen readers announce the wrong state. Check with DevTools → Accessibility tab after toggling.',
        detail_pl:
          'Atrybut `aria-expanded` na przycisku nagłówka pozostaje `false` nawet gdy panel jest otwarty, lub w ogóle brakuje go. Czytniki ekranu ogłaszają błędny stan. Sprawdź w DevTools → Accessibility po przełączeniu.',
      },
      {
        title_en: 'Content not hidden from assistive tech when collapsed',
        title_pl: 'Zawartość nie jest ukryta przed technologiami asystującymi po zwinięciu',
        severity: 'major',
        detail_en:
          'Content is visually hidden with `height: 0` or `display: none` visually, but remains in the accessibility tree. Screen readers read collapsed content. The panel element should have `hidden` attribute or `aria-hidden="true"` when collapsed.',
        detail_pl:
          'Zawartość jest ukryta wizualnie przez `height: 0` lub `display: none`, ale pozostaje w drzewie dostępności. Czytniki ekranu odczytują zawartość zwiniętą. Element panelu powinien mieć atrybut `hidden` lub `aria-hidden="true"` po zwinięciu.',
      },
      {
        title_en: 'Layout shift during animation',
        title_pl: 'Layout shift podczas animacji',
        severity: 'minor',
        detail_en:
          'Content below the accordion jumps during the expand/collapse animation because the panel uses absolute positioning or transitions height from 0 to auto without proper CSS handling. Test by scrolling down after expanding.',
        detail_pl:
          'Zawartość poniżej akordeonu skacze podczas animacji rozwijania/zwijania, bo panel używa pozycjonowania absolutnego lub przejścia wysokości z 0 do auto bez właściwej obsługi CSS. Testuj przez scrollowanie po rozwinięciu.',
      },
      {
        title_en: 'Single-expand mode allows all panels to be closed',
        title_pl: 'Tryb single-expand pozwala zamknąć wszystkie panele',
        severity: 'minor',
        detail_en:
          'In single-expand mode where at least one panel should always be open, clicking the currently open panel closes it, leaving all panels collapsed. The UX requirement of "at least one open" is violated.',
        detail_pl:
          'W trybie single-expand, gdzie co najmniej jeden panel powinien być zawsze otwarty, kliknięcie aktualnie otwartego panelu zamyka go, pozostawiając wszystkie panele zwinięte. Wymóg UX "co najmniej jeden otwarty" jest naruszony.',
      },
    ],
    tips_en: [
      'Test keyboard navigation with Tab + Enter — headers must be reachable without a mouse.',
      'In single-expand mode, verify both: opening a new panel closes the old one, AND the only open panel cannot be closed by clicking it again.',
      'Check CLS (Cumulative Layout Shift) in DevTools Performance — accordion animations are a common CLS source.',
    ],
    tips_pl: [
      'Testuj nawigację klawiaturą z Tab + Enter — nagłówki muszą być osiągalne bez myszy.',
      'W trybie single-expand sprawdź oba: otwarcie nowego panelu zamyka stary, ORAZ jedynego otwartego panelu nie można zamknąć ponownym kliknięciem.',
      'Sprawdź CLS (Cumulative Layout Shift) w DevTools Performance — animacje akordeonu to częste źródło CLS.',
    ],
    related: ['tabs', 'modal'],
  },
  {
    slug: 'autocomplete',
    name_en: 'Autocomplete / Combobox',
    name_pl: 'Autouzupełnianie / Combobox',
    aliases_en: ['Typeahead', 'Search with suggestions', 'Combobox'],
    aliases_pl: ['Typeahead', 'Wyszukiwanie z podpowiedziami'],
    description_en:
      'An input field that shows a dropdown of suggestions as the user types. Can be a free-text field with suggestions (combobox) or constrained to the listed options.',
    description_pl:
      'Pole tekstowe pokazujące listę rozwijanych podpowiedzi podczas pisania. Może być polem swobodnego tekstu z sugestiami (combobox) lub ograniczonym do wylistowanych opcji.',
    what_to_test_en: [
      'Typing triggers suggestion dropdown with relevant results',
      'Minimum character threshold before suggestions appear (e.g., 2+ chars)',
      'Selecting a suggestion fills the input correctly',
      'Keyboard: Arrow keys navigate suggestions, Enter selects, Escape closes',
      'No results state: shows "No results found" message instead of empty dropdown',
      'Debounce: fast typing does not fire a request on every keystroke',
      'Loading state visible while fetching suggestions',
      'Pasting text triggers suggestions the same as typing',
      'Long suggestion text does not overflow the dropdown',
      'ARIA: listbox role, aria-expanded on input, aria-activedescendant updates on arrow navigation',
    ],
    what_to_test_pl: [
      'Pisanie wyzwala rozwijany dropdown z odpowiednimi wynikami',
      'Minimalny próg znaków przed pojawieniem się podpowiedzi (np. 2+ znaki)',
      'Wybór podpowiedzi poprawnie wypełnia pole tekstowe',
      'Klawiatura: klawisze strzałek nawigują po podpowiedziach, Enter wybiera, Escape zamyka',
      'Stan "brak wyników": pokazuje komunikat "Brak wyników" zamiast pustego dropdown',
      'Debounce: szybkie pisanie nie wysyła żądania przy każdym naciśnięciu klawisza',
      'Stan ładowania widoczny podczas pobierania podpowiedzi',
      'Wklejenie tekstu wyzwala podpowiedzi tak samo jak pisanie',
      'Długi tekst podpowiedzi nie wychodzi poza dropdown',
      'ARIA: rola listbox, aria-expanded na inpucie, aria-activedescendant aktualizuje się przy nawigacji',
    ],
    common_bugs: [
      {
        title_en: 'No debounce — API call on every keystroke',
        title_pl: 'Brak debounce — wywołanie API przy każdym klawiszu',
        severity: 'major',
        detail_en:
          'Every keystroke fires a separate API request. Typing "react" sends 5 requests: r, re, rea, reac, react. This hammers the server and creates race conditions where an earlier slow response overwrites a later fast one. Check Network tab in DevTools.',
        detail_pl:
          'Każde naciśnięcie klawisza wywołuje osobne żądanie API. Wpisanie "react" wysyła 5 żądań: r, re, rea, reac, react. Obciąża serwer i powoduje race conditions, gdzie wcześniejsza wolna odpowiedź nadpisuje późniejszą szybką. Sprawdź zakładkę Network w DevTools.',
      },
      {
        title_en: 'Stale suggestions after clearing input',
        title_pl: 'Przestarzałe podpowiedzi po wyczyszczeniu pola',
        severity: 'minor',
        detail_en:
          'After the user clears the input (Ctrl+A → Delete), the previous suggestions remain visible. The dropdown should close and suggestions should reset when the input is empty.',
        detail_pl:
          'Po wyczyszczeniu pola przez użytkownika (Ctrl+A → Delete) poprzednie podpowiedzi pozostają widoczne. Dropdown powinien się zamknąć, a podpowiedzi zresetować gdy pole jest puste.',
      },
      {
        title_en: 'Race condition: wrong suggestions shown',
        title_pl: 'Race condition: pokazują się złe podpowiedzi',
        severity: 'major',
        detail_en:
          'The user types quickly. An earlier slow request for "re" returns after a faster request for "react", overwriting the correct suggestions with outdated ones. Requests must be cancelled/aborted when a newer one is fired (AbortController).',
        detail_pl:
          'Użytkownik pisze szybko. Wcześniejsze wolne żądanie dla "re" wraca po szybszym żądaniu dla "react", nadpisując poprawne podpowiedzi przestarzałymi. Żądania muszą być anulowane (AbortController) gdy nowe zostanie wysłane.',
      },
      {
        title_en: 'Suggestions not dismissed on Escape',
        title_pl: 'Podpowiedzi nie zamykają się po naciśnięciu Escape',
        severity: 'major',
        detail_en:
          'Pressing Escape does not close the suggestion dropdown. The user is trapped using the mouse. Escape must close the dropdown and return focus to the input.',
        detail_pl:
          'Naciśnięcie Escape nie zamyka dropdownu z podpowiedziami. Użytkownik jest zmuszony do użycia myszy. Escape musi zamknąć dropdown i zwrócić focus na pole tekstowe.',
      },
    ],
    tips_en: [
      'Test with slow network throttling (3G in DevTools) to expose debounce and loading state issues.',
      'Screen reader test: with NVDA/VoiceOver, navigate to suggestions using arrow keys and verify each one is announced.',
      'Check what happens when the network is offline — graceful degradation vs JS error.',
    ],
    tips_pl: [
      'Testuj z wolną siecią (3G w DevTools), żeby ujawnić problemy z debounce i stanem ładowania.',
      'Test z czytnikiem ekranu: za pomocą NVDA/VoiceOver przejdź do podpowiedzi strzałkami i zweryfikuj czy każda jest ogłaszana.',
      'Sprawdź co się dzieje gdy sieć jest offline — graceful degradation czy błąd JS.',
    ],
    related: ['dropdown', 'form-input'],
  },
  {
    slug: 'carousel',
    name_en: 'Carousel / Slider',
    name_pl: 'Karuzela / Slider',
    aliases_en: ['Image slider', 'Content slider', 'Slideshow'],
    aliases_pl: ['Slider obrazów', 'Pokaz slajdów'],
    description_en:
      'A component that displays multiple items in a rotating fashion, one at a time or in groups. Common for hero banners, product galleries, and testimonials.',
    description_pl:
      'Komponent wyświetlający wiele elementów rotacyjnie, jeden na raz lub w grupach. Powszechny w banerach hero, galeriach produktów i recenzjach.',
    what_to_test_en: [
      'Next/Prev buttons advance and retreat slides correctly',
      'Auto-play rotates slides at expected interval',
      'Pausing: hover or focus pauses auto-play (WCAG 2.2.2)',
      'Dot/thumbnail indicators update to reflect current slide',
      'Clicking an indicator navigates to the corresponding slide',
      'Keyboard: arrow keys navigate, Enter/Space activates interactive content in slide',
      'Loop behavior: last slide → Next shows first slide (and vice versa)',
      'Touch/swipe gestures work on mobile',
      'Slides contain images: alt text is present and meaningful',
      'aria-live region announces slide changes for screen readers',
    ],
    what_to_test_pl: [
      'Przyciski Następny/Poprzedni poprawnie przechodzą do kolejnych/poprzednich slajdów',
      'Auto-play rotuje slajdy w oczekiwanym interwale',
      'Pauza: hover lub focus zatrzymuje auto-play (WCAG 2.2.2)',
      'Wskaźniki (kropki/miniaturki) aktualizują się by pokazać aktualny slajd',
      'Kliknięcie wskaźnika nawiguje do odpowiedniego slajdu',
      'Klawiatura: klawisze strzałek nawigują, Enter/Spacja aktywuje interaktywną zawartość slajdu',
      'Zachowanie pętli: ostatni slajd → Następny pokazuje pierwszy slajd (i odwrotnie)',
      'Gesty dotykowe/przesunięcie działają na urządzeniach mobilnych',
      'Slajdy zawierające obrazy: tekst alt jest obecny i znaczący',
      'Region aria-live ogłasza zmiany slajdów dla czytników ekranu',
    ],
    common_bugs: [
      {
        title_en: 'Auto-play does not pause on focus or hover',
        title_pl: 'Auto-play nie zatrzymuje się po hover lub focus',
        severity: 'major',
        detail_en:
          'WCAG 2.2.2 requires moving content that auto-updates to be pausable. If the carousel auto-rotates while the user is reading or navigating with keyboard, it distracts and confuses. Test: tab into the carousel, verify rotation stops.',
        detail_pl:
          'WCAG 2.2.2 wymaga, żeby poruszająca się zawartość aktualizowana automatycznie mogła być zatrzymana. Jeśli karuzela rotuje gdy użytkownik czyta lub nawiguje klawiaturą, dezorientuje go. Test: tab do karuzeli, sprawdź czy rotacja się zatrzymuje.',
      },
      {
        title_en: 'Slide images missing alt text',
        title_pl: 'Brak tekstu alt na obrazach slajdów',
        severity: 'major',
        detail_en:
          'Promotional or product images in the carousel have empty or missing `alt` attributes. Screen readers skip them entirely or read the file name. Every image with informational content must have descriptive alt text.',
        detail_pl:
          'Obrazy promocyjne lub produktowe w karuzeli mają pusty lub brakujący atrybut `alt`. Czytniki ekranu całkowicie je pomijają lub odczytują nazwę pliku. Każdy obraz z treścią informacyjną musi mieć opisowy tekst alt.',
      },
      {
        title_en: 'Touch swipe triggers scroll instead of slide change',
        title_pl: 'Gest przesunięcia wywołuje scroll zamiast zmiany slajdu',
        severity: 'major',
        detail_en:
          'On mobile, swiping horizontally on the carousel scrolls the page instead of changing slides. The `touch-action: pan-y` CSS property should be set on the carousel track to allow vertical scrolling but handle horizontal swipes.',
        detail_pl:
          'Na urządzeniach mobilnych, przesunięcie poziome na karuzeli przewija stronę zamiast zmieniać slajd. Właściwość CSS `touch-action: pan-y` powinna być ustawiona na torze karuzeli, aby umożliwić pionowy scroll, ale obsługiwać poziome przesunięcia.',
      },
      {
        title_en: 'CLS on initial load',
        title_pl: 'CLS przy pierwszym załadowaniu',
        severity: 'minor',
        detail_en:
          'The carousel has no defined height before images load, causing the layout to jump when the first image appears. Set explicit `aspect-ratio` or `min-height` on the carousel container.',
        detail_pl:
          'Karuzela nie ma zdefiniowanej wysokości przed załadowaniem obrazów, powodując skok layoutu gdy pojawia się pierwszy obraz. Ustaw explicit `aspect-ratio` lub `min-height` na kontenerze karuzeli.',
      },
    ],
    tips_en: [
      'Test auto-play pause with both hover AND keyboard focus — two separate scenarios.',
      'On iOS Safari, swipe gestures behave differently — always test on a real device, not just Chrome DevTools.',
      'If the carousel contains links or buttons, verify they receive focus in keyboard order, not just arrow key navigation.',
    ],
    tips_pl: [
      'Testuj pauzę auto-play zarówno przy hover JAK I focus klawiaturą — dwa oddzielne scenariusze.',
      'Na iOS Safari gesty przesunięcia zachowują się inaczej — zawsze testuj na prawdziwym urządzeniu, nie tylko w Chrome DevTools.',
      'Jeśli karuzela zawiera linki lub przyciski, sprawdź czy otrzymują focus w kolejności tabulacji, nie tylko nawigacji strzałkami.',
    ],
    related: ['modal', 'pagination'],
  },
  {
    slug: 'date-picker',
    name_en: 'Date Picker',
    name_pl: 'Wybieracz daty',
    aliases_en: ['Calendar widget', 'Date input', 'Date selector'],
    aliases_pl: ['Kalendarz', 'Wybór daty', 'Selektor daty'],
    description_en:
      'An interactive calendar or date input that allows users to select a date, date range, or date+time. One of the most complex UI components to test correctly.',
    description_pl:
      'Interaktywny kalendarz lub pole daty pozwalające użytkownikom wybrać datę, zakres dat lub datę+godzinę. Jeden z najbardziej złożonych komponentów UI do poprawnego przetestowania.',
    what_to_test_en: [
      'Typing a date directly into the input field works correctly',
      'Opening the calendar popup: keyboard trigger (Enter/Space/F4) works',
      'Navigating months with Prev/Next buttons',
      'Selecting a date closes the popup and fills the input',
      'Min/max date constraints: past dates greyed out when min=today',
      'Date range: start date must be before or equal to end date',
      'Locale: date format matches the app locale (DD/MM/YYYY vs MM/DD/YYYY)',
      'Keyboard: arrow keys navigate days, Page Up/Down navigate months',
      'February 29 in leap years and non-leap years',
      'Clearing the field removes the selected date',
      'Timezone: selected date is not shifted by 1 day due to UTC/local mismatch',
    ],
    what_to_test_pl: [
      'Wpisanie daty bezpośrednio w pole tekstowe działa poprawnie',
      'Otwarcie popupu kalendarza: trigger klawiaturą (Enter/Spacja/F4) działa',
      'Nawigacja między miesiącami przyciskami Poprzedni/Następny',
      'Wybór daty zamyka popup i wypełnia pole',
      'Ograniczenia min/max daty: daty przeszłe wyszarzone gdy min=dziś',
      'Zakres dat: data początkowa musi być przed lub równa dacie końcowej',
      'Locale: format daty odpowiada locale aplikacji (DD/MM/YYYY vs MM/DD/YYYY)',
      'Klawiatura: klawisze strzałek nawigują po dniach, Page Up/Down po miesiącach',
      '29 luty w latach przestępnych i nieprzestępnych',
      'Wyczyszczenie pola usuwa wybraną datę',
      'Strefa czasowa: wybrana data nie jest przesunięta o 1 dzień przez mismatch UTC/localny',
    ],
    common_bugs: [
      {
        title_en: 'Off-by-one day from UTC/timezone mismatch',
        title_pl: 'Przesunięcie o 1 dzień przez mismatch UTC/strefa czasowa',
        severity: 'critical',
        detail_en:
          'User picks 2024-12-25. The backend receives 2024-12-24T23:00:00Z (UTC). The date is stored as December 24. This happens when the date is sent as a UTC ISO string without accounting for the local timezone offset. Test in a GMT+1/+2 timezone with a date near midnight UTC.',
        detail_pl:
          'Użytkownik wybiera 2024-12-25. Backend otrzymuje 2024-12-24T23:00:00Z (UTC). Data jest zapisana jako 24 grudnia. Dzieje się tak gdy data jest wysyłana jako UTC ISO string bez uwzględnienia przesunięcia lokalnej strefy czasowej. Testuj w strefie GMT+1/+2 z datą bliską północy UTC.',
      },
      {
        title_en: 'Direct text input not validated',
        title_pl: 'Bezpośrednie wpisanie tekstu nie jest walidowane',
        severity: 'major',
        detail_en:
          'The calendar popup works correctly, but the user can type "99/99/9999" directly into the input field and the invalid date passes validation. Always test the text input path separately from the calendar picker path.',
        detail_pl:
          'Popup kalendarza działa poprawnie, ale użytkownik może wpisać "99/99/9999" bezpośrednio w pole tekstowe i nieprawidłowa data przechodzi walidację. Zawsze testuj ścieżkę wpisywania tekstu oddzielnie od ścieżki wyboru kalendarza.',
      },
      {
        title_en: 'Disabled dates still selectable via text input',
        title_pl: 'Wyłączone daty nadal można wybrać przez pole tekstowe',
        severity: 'major',
        detail_en:
          'The calendar greys out past dates (min=today), but typing yesterday\'s date directly in the text input bypasses the restriction and submits successfully. Validation must happen on the model/value, not only in the calendar UI.',
        detail_pl:
          'Kalendarz wyszarowuje daty przeszłe (min=dziś), ale wpisanie wczorajszej daty bezpośrednio w pole tekstowe omija ograniczenie i przechodzi walidację. Walidacja musi działać na modelu/wartości, nie tylko w UI kalendarza.',
      },
      {
        title_en: 'Feb 29 crashes in non-leap year',
        title_pl: 'Błąd przy 29 lutym w roku nieprzestępnym',
        severity: 'critical',
        detail_en:
          'User selects Feb 29, 2024 (leap year). The app saves the date. The following year (2025, non-leap), the component tries to render the saved date and crashes or shifts it to March 1. Always test year-boundary scenarios for date persistence.',
        detail_pl:
          'Użytkownik wybiera 29 lutego 2024 (rok przestępny). Aplikacja zapisuje datę. W następnym roku (2025, nieprzestępny) komponent próbuje wyrenderować zapisaną datę i crashuje lub przesuwa na 1 marca. Zawsze testuj scenariusze granicy roku dla utrwalania dat.',
      },
    ],
    tips_en: [
      'The UTC/timezone bug is extremely common — always test by changing your OS timezone to UTC+2 and selecting a date.',
      'Test February 28/29 around leap year boundaries: Jan 31 → March 1 navigation should skip non-existent days, not crash.',
      'For date ranges, test: same start and end date (valid?), end before start (error?), and clearing one date from a filled range.',
    ],
    tips_pl: [
      'Bug UTC/timezone jest wyjątkowo powszechny — zawsze testuj zmieniając strefę czasową systemu na UTC+2 i wybierając datę.',
      'Testuj 28/29 lutego przy granicach roku przestępnego: nawigacja Jan 31 → Mar 1 powinna pomijać nieistniejące dni, nie crashować.',
      'Dla zakresów dat testuj: ta sama data początku i końca (poprawna?), koniec przed początkiem (błąd?), wyczyszczenie jednej daty z wypełnionego zakresu.',
    ],
    related: ['form-input', 'modal'],
  },
  {
    slug: 'dropdown',
    name_en: 'Dropdown / Select',
    name_pl: 'Dropdown / Select',
    aliases_en: ['Select box', 'Single select', 'Multi-select', 'Listbox'],
    aliases_pl: ['Lista rozwijana', 'Wybór jednokrotny', 'Wybór wielokrotny'],
    description_en:
      'A control that presents a list of options in a collapsed panel that expands on interaction. Can be a native `<select>` or a custom-built component with richer UI.',
    description_pl:
      'Kontrolka prezentująca listę opcji w zwiniętym panelu rozwijającym się po interakcji. Może być natywnym `<select>` lub komponentem customowym z bogatszym UI.',
    what_to_test_en: [
      'Clicking the trigger opens the dropdown list',
      'Selecting an option closes the dropdown and updates the displayed value',
      'Pressing Escape closes the dropdown without selecting',
      'Keyboard: Enter/Space opens the dropdown; arrow keys navigate options; Enter selects',
      'Focus returns to the trigger after selection or dismissal',
      'Long option lists are scrollable without breaking the layout',
      'Disabled options are skipped in keyboard navigation and cannot be selected',
      'Multi-select: multiple options selectable; previously selected options retain state',
      'Search/filter within dropdown narrows the list in real time',
      'Dropdown stays within viewport when near screen edges',
      'Initial value is pre-selected when provided',
    ],
    what_to_test_pl: [
      'Kliknięcie triggera otwiera listę dropdown',
      'Wybranie opcji zamyka dropdown i aktualizuje wyświetlaną wartość',
      'Naciśnięcie Escape zamyka dropdown bez wybrania',
      'Klawiatura: Enter/Spacja otwiera dropdown; klawisze strzałek nawigują; Enter wybiera',
      'Focus wraca do triggera po wyborze lub zamknięciu',
      'Długie listy opcji są przewijalne bez psowania layoutu',
      'Wyłączone opcje są pomijane w nawigacji klawiszem i nie można ich wybrać',
      'Multi-select: można wybrać wiele opcji; wcześniej wybrane zachowują stan',
      'Wyszukiwanie/filtrowanie wewnątrz dropdown zawęża listę w czasie rzeczywistym',
      'Dropdown pozostaje w granicach viewport gdy jest blisko krawędzi ekranu',
      'Wartość początkowa jest wstępnie wybrana gdy jest podana',
    ],
    common_bugs: [
      {
        title_en: 'Dropdown clipped by overflow: hidden parent',
        title_pl: 'Dropdown przycięty przez rodzica z overflow: hidden',
        severity: 'major',
        detail_en:
          'The dropdown list is cut off because a parent container has `overflow: hidden` or `overflow: auto`. The dropdown renders inside the scroll container instead of the viewport. Fix: use a portal (render the list in document.body) or set `overflow: visible` on the parent.',
        detail_pl:
          'Lista dropdown jest przycinana przez kontener rodzica z `overflow: hidden` lub `overflow: auto`. Dropdown renderuje się wewnątrz kontenera scroll zamiast w viewport. Poprawka: użyj portalu (renderuj listę w document.body) lub ustaw `overflow: visible` na rodzicu.',
      },
      {
        title_en: 'Focus not returned to trigger after close',
        title_pl: 'Focus nie wraca do triggera po zamknięciu',
        severity: 'major',
        detail_en:
          'After selecting an option or pressing Escape, focus jumps to the top of the page or disappears entirely. Keyboard users lose their place. Focus must return to the trigger element after the dropdown closes.',
        detail_pl:
          'Po wybraniu opcji lub naciśnięciu Escape, focus skacze na górę strony lub całkowicie znika. Użytkownicy klawiatury tracą swoje miejsce. Focus musi wrócić do elementu triggera po zamknięciu dropdown.',
      },
      {
        title_en: 'Custom dropdown not associated with form label',
        title_pl: 'Customowy dropdown nie jest powiązany z etykietą formularza',
        severity: 'major',
        detail_en:
          'A native `<select>` has an implicit label association. A custom dropdown button often loses this. The trigger should have `aria-labelledby` pointing to the label, and the listbox should have `aria-label` or `aria-labelledby`. Test with a screen reader: the label should be announced when the trigger receives focus.',
        detail_pl:
          'Natywny `<select>` ma domyślne powiązanie z etykietą. Customowy przycisk dropdown często je traci. Trigger powinien mieć `aria-labelledby` wskazujący na etykietę, a listbox powinien mieć `aria-label` lub `aria-labelledby`. Testuj z czytnikiem ekranu: etykieta powinna być ogłoszona gdy trigger otrzymuje focus.',
      },
    ],
    tips_en: [
      'Always test dropdowns inside modals and inside overflow: hidden containers — two of the most common clip scenarios.',
      'For multi-select, test: selecting all options, deselecting all, and the "select all" toggle if present.',
    ],
    tips_pl: [
      'Zawsze testuj dropdown wewnątrz modali i wewnątrz kontenerów z overflow: hidden — dwa z najczęstszych scenariuszy przycinania.',
      'Dla multi-select testuj: wybór wszystkich opcji, odznaczenie wszystkich, oraz przycisk "zaznacz wszystko" jeśli jest.',
    ],
    related: ['autocomplete', 'form-input'],
  },
  {
    slug: 'form-input',
    name_en: 'Form / Input',
    name_pl: 'Formularz / Pole tekstowe',
    aliases_en: ['Text field', 'Text input', 'Input field'],
    aliases_pl: ['Pole tekstowe', 'Input'],
    description_en:
      'A text input field, textarea, or form element for collecting user data. Includes validation, error states, labels, and helper text.',
    description_pl:
      'Pole tekstowe, textarea lub element formularza do zbierania danych użytkownika. Obejmuje walidację, stany błędów, etykiety i tekst pomocniczy.',
    what_to_test_en: [
      'Label is visually associated with the input and linked via `for`/`id`',
      'Placeholder text does not replace the label (placeholder is supplemental only)',
      'Required field: empty submission shows error, error disappears on valid input',
      'Character limit: counter shows remaining characters; input blocked or warned at limit',
      'Copy-paste: pasting text longer than the limit is handled gracefully',
      'Autocomplete attribute set correctly (e.g., `autocomplete="email"` for email fields)',
      'Password field: show/hide toggle works; field type toggles between `password` and `text`',
      'Error state: visible error message, field styled in error color, `aria-describedby` links message',
      'Special characters: < > & " \' in text fields do not break the display or cause XSS',
      'Numbers-only input: non-numeric characters rejected or ignored',
    ],
    what_to_test_pl: [
      'Etykieta jest wizualnie powiązana z polem i połączona przez `for`/`id`',
      'Tekst placeholder nie zastępuje etykiety (placeholder jest tylko uzupełnieniem)',
      'Pole wymagane: puste przesłanie pokazuje błąd, błąd znika przy poprawnym wpisaniu',
      'Limit znaków: licznik pokazuje pozostałe znaki; wpisywanie blokowane lub ostrzeżenie przy limicie',
      'Kopiuj-wklej: wklejenie tekstu dłuższego niż limit jest obsługiwane gracefully',
      'Atrybut autocomplete ustawiony poprawnie (np. `autocomplete="email"` dla pól email)',
      'Pole hasła: przełącznik pokaż/ukryj działa; typ pola przełącza się między `password` a `text`',
      'Stan błędu: widoczny komunikat błędu, pole ostylowane kolorem błędu, `aria-describedby` łączy komunikat',
      'Znaki specjalne: < > & " \' w polach tekstowych nie psują wyświetlania ani nie powodują XSS',
      'Pole tylko liczbowe: znaki nienumeryczne odrzucone lub ignorowane',
    ],
    common_bugs: [
      {
        title_en: 'Placeholder used as label — label disappears on typing',
        title_pl: 'Placeholder używany jako etykieta — etykieta znika przy pisaniu',
        severity: 'major',
        detail_en:
          'There is no visible `<label>` — only placeholder text. When the user starts typing, the label disappears, making it impossible to remember what the field is for. This is an accessibility failure and a UX failure. Every input must have a persistent label.',
        detail_pl:
          'Brak widocznego `<label>` — tylko tekst placeholder. Gdy użytkownik zaczyna pisać, etykieta znika, uniemożliwiając zapamiętanie do czego służy pole. To błąd dostępności i UX. Każdy input musi mieć trwałą etykietę.',
      },
      {
        title_en: 'Error message not linked to input with aria-describedby',
        title_pl: 'Komunikat błędu nie jest powiązany z inputem przez aria-describedby',
        severity: 'major',
        detail_en:
          'The error message appears visually below the field, but the `<input>` does not have `aria-describedby` pointing to the error element. Screen readers do not read the error when the field is focused. The input must have `aria-describedby="error-id"` and the error element must have `id="error-id"`.',
        detail_pl:
          'Komunikat błędu pojawia się wizualnie poniżej pola, ale `<input>` nie ma `aria-describedby` wskazującego na element błędu. Czytniki ekranu nie odczytują błędu gdy pole jest skupione. Input musi mieć `aria-describedby="error-id"`, a element błędu musi mieć `id="error-id"`.',
      },
      {
        title_en: 'Copy-paste bypasses maxlength validation',
        title_pl: 'Kopiuj-wklej omija walidację maxlength',
        severity: 'minor',
        detail_en:
          'Typing is limited to 100 characters. But pasting 200 characters succeeds because the `maxlength` HTML attribute is not set, and only JavaScript validation exists (which fires on `input` event but not `paste`). Always test paste separately from typing.',
        detail_pl:
          'Pisanie jest ograniczone do 100 znaków. Ale wklejenie 200 znaków udaje się, bo atrybut HTML `maxlength` nie jest ustawiony, a tylko walidacja JavaScript istnieje (która odpala się na zdarzeniu `input`, ale nie `paste`). Zawsze testuj wklejanie oddzielnie od pisania.',
      },
    ],
    tips_en: [
      'Inspect the DOM: every `<input>` should have a matching `<label for="...">` or `aria-label`. This is easy to check and frequently wrong.',
      'For password fields: verify that the copied value does not appear in the browser\'s autofill suggestions.',
      'Test form submission via Enter key — many keyboard users never click the submit button.',
    ],
    tips_pl: [
      'Sprawdź DOM: każdy `<input>` powinien mieć pasujący `<label for="...">` lub `aria-label`. To łatwe do sprawdzenia i często błędne.',
      'Dla pól hasła: sprawdź czy skopiowana wartość nie pojawia się w podpowiedziach autofill przeglądarki.',
      'Testuj wysyłanie formularza klawiszem Enter — wielu użytkowników klawiatury nigdy nie klika przycisku submit.',
    ],
    related: ['dropdown', 'autocomplete', 'date-picker'],
  },
  {
    slug: 'infinite-scroll',
    name_en: 'Infinite Scroll',
    name_pl: 'Nieskończony scroll',
    aliases_en: ['Endless scroll', 'Virtual scroll', 'Load more on scroll'],
    aliases_pl: ['Ładowanie przy scrollu'],
    description_en:
      'A pattern that automatically loads more content as the user scrolls toward the bottom of a list. Replaces or supplements traditional pagination.',
    description_pl:
      'Wzorzec automatycznie ładujący więcej treści gdy użytkownik scrolluje w kierunku dołu listy. Zastępuje lub uzupełnia tradycyjną paginację.',
    what_to_test_en: [
      'More content loads automatically when scrolling near the bottom',
      'Loading indicator appears while fetching next batch',
      'End-of-list message shown when no more content exists',
      'New items append below existing ones (not replacing them)',
      'Browser back button returns to correct scroll position',
      'URL or state preserves the loaded page count so refreshing does not reset to 0',
      'Network error while loading more: retry mechanism or error message',
      'Deep link or share: jumping directly to item #150 loads correctly',
      'Keyboard: Tab key can reach newly loaded items',
      'Screen reader: new items announced or focus managed after load',
    ],
    what_to_test_pl: [
      'Więcej treści ładuje się automatycznie podczas scrollowania w pobliżu dołu',
      'Wskaźnik ładowania pojawia się podczas pobierania następnej partii',
      'Komunikat końca listy jest pokazany gdy nie ma więcej treści',
      'Nowe elementy są dołączane poniżej istniejących (nie zastępują ich)',
      'Przycisk Back przeglądarki wraca do prawidłowej pozycji scroll',
      'URL lub stan zachowuje liczbę załadowanych stron, żeby odświeżenie nie resetowało do 0',
      'Błąd sieci podczas ładowania więcej: mechanizm retry lub komunikat błędu',
      'Deep link lub udostępnienie: przejście bezpośrednio do elementu #150 ładuje poprawnie',
      'Klawiatura: klawisz Tab może dotrzeć do nowo załadowanych elementów',
      'Czytnik ekranu: nowe elementy są ogłaszane lub focus jest zarządzany po załadowaniu',
    ],
    common_bugs: [
      {
        title_en: 'Back button resets scroll to top and loses loaded content',
        title_pl: 'Przycisk Back resetuje scroll do góry i traci załadowaną treść',
        severity: 'major',
        detail_en:
          'The user scrolls down 500 items, clicks on item #350, reads it, then presses Back. They land at the top of the list, with only the first 20 items loaded. All progress is lost. This is the most common infinite scroll UX failure. Scroll position and loaded state must be preserved in browser history.',
        detail_pl:
          'Użytkownik scrolluje 500 elementów, klika na element #350, czyta go, potem naciska Back. Ląduje na górze listy tylko z pierwszymi 20 elementami. Cały postęp jest utracony. To najczęstszy błąd UX nieskończonego scrolla. Pozycja scroll i załadowany stan muszą być zachowane w historii przeglądarki.',
      },
      {
        title_en: 'Duplicate items on page boundary',
        title_pl: 'Duplikaty na granicy strony',
        severity: 'major',
        detail_en:
          'The API returns pages of 20 items. Between page 1 and page 2 fetches, a new item is inserted at the top. The item that was last on page 1 is now first on page 2 — it appears twice. This is a cursor/keyset pagination issue. Test by adding a new item to the top of the list while scrolling.',
        detail_pl:
          'API zwraca strony po 20 elementów. Między pobieraniem strony 1 i 2, nowy element jest wstawiany na górę. Element który był ostatni na stronie 1, jest teraz pierwszy na stronie 2 — pojawia się dwukrotnie. To problem paginacji kursor/keyset. Testuj dodając nowy element na górę listy podczas scrollowania.',
      },
      {
        title_en: 'Loading triggered multiple times simultaneously',
        title_pl: 'Ładowanie wyzwalane wielokrotnie jednocześnie',
        severity: 'major',
        detail_en:
          'The intersection observer fires multiple times rapidly. The app sends 3-4 simultaneous requests for the same "next page" because the loading flag is not set synchronously before the requests go out. Check Network tab for duplicate requests.',
        detail_pl:
          'Intersection observer odpala wielokrotnie w krótkim czasie. Aplikacja wysyła 3-4 jednoczesne żądania dla tej samej "następnej strony", bo flaga ładowania nie jest ustawiana synchronicznie przed wysłaniem żądań. Sprawdź zakładkę Network pod kątem zduplikowanych żądań.',
      },
    ],
    tips_en: [
      'Test the back button scenario extensively — it is the most commonly broken scenario and often completely ignored during development.',
      'Use Network throttling (slow 3G) in DevTools to test loading states and error scenarios that are invisible on fast connections.',
      'Consider whether infinite scroll is the right pattern for your use case — search results and data tables usually need pagination for shareability.',
    ],
    tips_pl: [
      'Testuj scenariusz przycisku Back intensywnie — to najczęściej psujący się scenariusz, często całkowicie ignorowany podczas developmentu.',
      'Używaj throttlingu sieci (wolne 3G) w DevTools do testowania stanów ładowania i błędów niewidocznych na szybkich połączeniach.',
      'Zastanów się czy nieskończony scroll jest właściwym wzorcem — wyniki wyszukiwania i tabele danych zazwyczaj potrzebują paginacji dla możliwości udostępniania.',
    ],
    related: ['pagination'],
  },
  {
    slug: 'modal',
    name_en: 'Modal / Dialog',
    name_pl: 'Modal / Dialog',
    aliases_en: ['Dialog', 'Popup', 'Lightbox', 'Overlay'],
    aliases_pl: ['Okno dialogowe', 'Popup', 'Nakładka'],
    description_en:
      'A window that appears on top of the main content, requiring user interaction before returning to the page. Used for confirmations, forms, alerts, and detail views.',
    description_pl:
      'Okno pojawiające się nad główną treścią, wymagające interakcji użytkownika przed powrotem do strony. Używane do potwierdzeń, formularzy, alertów i widoków szczegółów.',
    what_to_test_en: [
      'Modal opens on trigger (button click, link, etc.)',
      'Focus moves into the modal immediately on open — specifically to first focusable element or modal title',
      'Tab key cycles only within the modal (focus trap)',
      'Pressing Escape closes the modal',
      'Clicking the overlay/backdrop closes the modal (when allowed)',
      'Focus returns to the triggering element when modal closes',
      'Page scroll is locked while modal is open',
      'Screen reader: role="dialog", aria-modal="true", aria-labelledby pointing to modal title',
      'Modal does not open on top of another modal without correct z-index/stacking',
      'Close button is visible and reachable without scrolling',
      'Long modal content is scrollable within the modal, not the whole page',
    ],
    what_to_test_pl: [
      'Modal otwiera się po wyzwoleniu (kliknięcie przycisku, link, etc.)',
      'Focus przenosi się do modala natychmiast po otwarciu — do pierwszego focusowalnego elementu lub tytułu modala',
      'Klawisz Tab cykli tylko wewnątrz modala (focus trap)',
      'Naciśnięcie Escape zamyka modal',
      'Kliknięcie nakładki/tła zamyka modal (gdy dozwolone)',
      'Focus wraca do elementu wyzwalającego po zamknięciu modala',
      'Scroll strony jest zablokowany gdy modal jest otwarty',
      'Czytnik ekranu: role="dialog", aria-modal="true", aria-labelledby wskazujący na tytuł modala',
      'Modal nie otwiera się na szczycie innego modala bez poprawnego z-index/stackingu',
      'Przycisk zamknięcia jest widoczny i osiągalny bez scrollowania',
      'Długa treść modala jest przewijalna wewnątrz modala, nie całej strony',
    ],
    common_bugs: [
      {
        title_en: 'No focus trap — Tab exits the modal',
        title_pl: 'Brak focus trap — Tab wychodzi poza modal',
        severity: 'critical',
        detail_en:
          'Pressing Tab repeatedly reaches elements behind the modal. Keyboard users can interact with the greyed-out background content while the modal is open. This breaks the modal contract. Every modal must implement a focus trap: Tab should cycle only within the dialog\'s focusable elements.',
        detail_pl:
          'Wielokrotne naciśnięcie Tab dociera do elementów za modalem. Użytkownicy klawiatury mogą wchodzić w interakcję z wyszarzoną treścią tła gdy modal jest otwarty. To narusza kontrakt modala. Każdy modal musi implementować focus trap: Tab powinien cyklować tylko wewnątrz focusowalnych elementów dialogu.',
      },
      {
        title_en: 'Focus does not return to trigger on close',
        title_pl: 'Focus nie wraca do triggera po zamknięciu',
        severity: 'major',
        detail_en:
          'After closing the modal (via Escape or close button), focus jumps to the top of the page or disappears. The user loses their position. Focus must return to the element that opened the modal (the trigger button).',
        detail_pl:
          'Po zamknięciu modala (przez Escape lub przycisk zamknięcia), focus skacze na górę strony lub znika. Użytkownik traci swoją pozycję. Focus musi wrócić do elementu który otworzył modal (przycisku triggera).',
      },
      {
        title_en: 'Scroll lock not applied — background scrolls while modal is open',
        title_pl: 'Brak blokady scroll — tło scrolluje gdy modal jest otwarty',
        severity: 'major',
        detail_en:
          'While the modal is open, scrolling the mouse wheel or pressing arrow keys scrolls the background page. This creates disorienting context shifts. Add `overflow: hidden` to `<body>` when the modal is open and restore it on close. Test on mobile too — iOS requires `-webkit-overflow-scrolling: touch` handling.',
        detail_pl:
          'Gdy modal jest otwarty, scrollowanie kółkiem myszy lub klawiszami strzałek scrolluje stronę tła. Tworzy to dezorientujące przesunięcia kontekstu. Dodaj `overflow: hidden` do `<body>` gdy modal jest otwarty i przywróć go po zamknięciu. Testuj też na mobile — iOS wymaga obsługi `-webkit-overflow-scrolling: touch`.',
      },
      {
        title_en: 'Double-open: opening modal from inside modal stacks without z-index',
        title_pl: 'Podwójne otwarcie: otwarcie modala z modala bez poprawnego z-index',
        severity: 'minor',
        detail_en:
          'A button inside a modal opens a second modal (confirmation dialog). The second modal appears behind the first because the z-index is not increased. Or the second modal opens but the first modal\'s focus trap still captures Tab, preventing navigation in the second modal.',
        detail_pl:
          'Przycisk wewnątrz modala otwiera drugi modal (dialog potwierdzenia). Drugi modal pojawia się za pierwszym bo z-index nie jest zwiększony. Lub drugi modal otwiera się, ale focus trap pierwszego modala nadal przechwytuje Tab, uniemożliwiając nawigację w drugim modalu.',
      },
    ],
    tips_en: [
      'The focus trap + focus return combo is the #1 modal accessibility failure. Always test both with keyboard only (no mouse).',
      'Test with screen reader: open NVDA/VoiceOver, open the modal, and verify only modal content is announced (background is inert).',
      'On mobile, test that the virtual keyboard does not push the modal off-screen when an input inside the modal is focused.',
    ],
    tips_pl: [
      'Kombinacja focus trap + zwrot focusa to #1 błąd dostępności modala. Zawsze testuj oba tylko klawiaturą (bez myszy).',
      'Testuj z czytnikiem ekranu: otwórz NVDA/VoiceOver, otwórz modal i sprawdź czy tylko treść modala jest ogłaszana (tło jest inaktywne).',
      'Na mobile testuj czy klawiatura wirtualna nie wypycha modala poza ekran gdy input wewnątrz modala jest skupiony.',
    ],
    related: ['dropdown', 'tooltip', 'accordion'],
  },
  {
    slug: 'pagination',
    name_en: 'Pagination',
    name_pl: 'Paginacja',
    aliases_en: ['Page navigation', 'Pager'],
    aliases_pl: ['Nawigacja stron', 'Numeracja stron'],
    description_en:
      'A navigation component that splits content into discrete pages, allowing users to navigate forward, backward, or to a specific page number.',
    description_pl:
      'Komponent nawigacyjny dzielący treść na osobne strony, pozwalający użytkownikom nawigować do przodu, tyłu lub do konkretnego numeru strony.',
    what_to_test_en: [
      'Next and Previous buttons navigate to correct pages',
      'Clicking a page number navigates to that page',
      'Current page is visually highlighted and marked aria-current="page"',
      'First page: Previous button is disabled or hidden',
      'Last page: Next button is disabled or hidden',
      'Page count updates correctly when filters change the total results',
      'URL updates to reflect current page (e.g., ?page=3)',
      'Navigating with browser Back/Forward uses URL-based page state',
      'Ellipsis (...) shown for large page counts does not lose pages',
      'Keyboard: all page buttons and nav buttons are Tab-reachable and activatable with Enter',
    ],
    what_to_test_pl: [
      'Przyciski Następna i Poprzednia stronę nawigują do poprawnych stron',
      'Kliknięcie numeru strony nawiguje do tej strony',
      'Aktualna strona jest wizualnie podświetlona i oznaczona aria-current="page"',
      'Pierwsza strona: przycisk Poprzednia jest wyłączony lub ukryty',
      'Ostatnia strona: przycisk Następna jest wyłączony lub ukryty',
      'Liczba stron aktualizuje się poprawnie gdy filtry zmieniają łączną liczbę wyników',
      'URL aktualizuje się odzwierciedlając aktualną stronę (np. ?page=3)',
      'Nawigacja przyciskami Back/Forward przeglądarki używa stanu strony z URL',
      'Wielokropek (...) pokazany przy dużej liczbie stron nie traci stron',
      'Klawiatura: wszystkie przyciski stron i nawigacji są osiągalne z Tab i aktywowalne Enterem',
    ],
    common_bugs: [
      {
        title_en: 'Page count not updated after filtering',
        title_pl: 'Liczba stron nie aktualizuje się po filtrowaniu',
        severity: 'major',
        detail_en:
          'User is on page 5 of 10. They apply a filter that reduces results to 2 pages. The pagination still shows 10 pages, and pages 3-10 return no results or errors. Total count and page count must be recalculated on every filter change.',
        detail_pl:
          'Użytkownik jest na stronie 5 z 10. Stosuje filtr zmniejszający wyniki do 2 stron. Paginacja nadal pokazuje 10 stron, a strony 3-10 zwracają brak wyników lub błędy. Łączna liczba i liczba stron muszą być przeliczane przy każdej zmianie filtru.',
      },
      {
        title_en: 'Page state lost on browser back',
        title_pl: 'Stan strony tracony po powrocie przeglądarki',
        severity: 'major',
        detail_en:
          'User is on page 4, clicks an item, reads it, presses Back — lands on page 1 instead of page 4. The page parameter must be in the URL (e.g., `?page=4`) for the browser history to restore it correctly.',
        detail_pl:
          'Użytkownik jest na stronie 4, klika element, czyta go, naciska Back — ląduje na stronie 1 zamiast strony 4. Parametr strony musi być w URL (np. `?page=4`), żeby historia przeglądarki mogła go poprawnie przywrócić.',
      },
      {
        title_en: 'aria-current not set on current page button',
        title_pl: 'aria-current nie ustawione na przycisku aktualnej strony',
        severity: 'minor',
        detail_en:
          'The current page is visually styled differently but lacks `aria-current="page"`. Screen reader users cannot tell which page they\'re on. The active page button must have `aria-current="page"`.',
        detail_pl:
          'Aktualna strona jest ostylowana inaczej wizualnie, ale brakuje jej `aria-current="page"`. Użytkownicy czytników ekranu nie mogą stwierdzić na której stronie się znajdują. Aktywny przycisk strony musi mieć `aria-current="page"`.',
      },
    ],
    tips_en: [
      'Always put the page number in the URL — it\'s a two-line change that fixes browser back/forward, bookmarking, and sharing.',
      'Test with a page number that exceeds the total (e.g., manually type ?page=999) — should redirect to last page or show 404.',
    ],
    tips_pl: [
      'Zawsze wstawiaj numer strony do URL — to dwuliniowa zmiana naprawiająca back/forward przeglądarki, zakładki i udostępnianie.',
      'Testuj z numerem strony przekraczającym łączną liczbę (np. ręcznie wpisz ?page=999) — powinno przekierować do ostatniej strony lub pokazać 404.',
    ],
    related: ['infinite-scroll'],
  },
  {
    slug: 'tabs',
    name_en: 'Tabs',
    name_pl: 'Zakładki',
    aliases_en: ['Tab bar', 'Tab panel', 'Tabbed navigation'],
    aliases_pl: ['Pasek zakładek', 'Panel z zakładkami'],
    description_en:
      'A component that organizes content into multiple panels, only one visible at a time, controlled by a row of tab labels. Used for settings, dashboards, and profile pages.',
    description_pl:
      'Komponent organizujący treść w wiele paneli, widoczny tylko jeden na raz, kontrolowany przez rząd etykiet zakładek. Używany w ustawieniach, dashboardach i profilach.',
    what_to_test_en: [
      'Clicking a tab activates it and shows the corresponding panel',
      'Only one tab is active at a time',
      'Active tab is visually distinct; inactive tabs remain accessible',
      'Keyboard: Arrow keys (left/right) navigate between tabs (ARIA tabs pattern)',
      'Enter or Space activates the focused tab',
      'Tab key moves focus to the active panel content, not the next tab',
      'aria-selected="true" on active tab, "false" on others',
      'aria-controls on each tab links to the corresponding panel id',
      'Hidden panels have aria-hidden="true" or are removed from the DOM',
      'URL updates (or hash) so the active tab is bookmarkable/shareable',
      'Active tab preserved on page refresh if URL-based',
    ],
    what_to_test_pl: [
      'Kliknięcie zakładki aktywuje ją i pokazuje odpowiadający panel',
      'Tylko jedna zakładka jest aktywna na raz',
      'Aktywna zakładka jest wizualnie wyróżniona; nieaktywne zakładki pozostają dostępne',
      'Klawiatura: Klawisze strzałek (lewo/prawo) nawigują między zakładkami (wzorzec ARIA tabs)',
      'Enter lub Spacja aktywuje skupioną zakładkę',
      'Klawisz Tab przenosi focus do zawartości aktywnego panelu, nie do następnej zakładki',
      'aria-selected="true" na aktywnej zakładce, "false" na pozostałych',
      'aria-controls na każdej zakładce łączy do id odpowiadającego panelu',
      'Ukryte panele mają aria-hidden="true" lub są usunięte z DOM',
      'URL aktualizuje się (lub hash), żeby aktywna zakładka była bookmarkowalna/udostępnialna',
      'Aktywna zakładka zachowana po odświeżeniu strony jeśli oparty na URL',
    ],
    common_bugs: [
      {
        title_en: 'Arrow key navigation not implemented — Tab key jumps between tabs',
        title_pl: 'Brak nawigacji klawiszami strzałek — Tab skacze między zakładkami',
        severity: 'major',
        detail_en:
          'Per the ARIA tabs pattern, Tab should move focus to the panel content (not the next tab), and arrow keys should navigate between tab labels. When a developer implements tabs with Tab key navigation, users must tab through all tabs before reaching the panel content.',
        detail_pl:
          'Zgodnie ze wzorcem ARIA tabs, Tab powinien przenosić focus do zawartości panelu (nie do następnej zakładki), a klawisze strzałek powinny nawigować między etykietami zakładek. Gdy developer implementuje zakładki z nawigacją klawiszem Tab, użytkownicy muszą przejść przez wszystkie zakładki zanim dotrą do zawartości panelu.',
      },
      {
        title_en: 'Inactive panel content accessible via keyboard',
        title_pl: 'Zawartość nieaktywnego panelu dostępna z klawiatury',
        severity: 'major',
        detail_en:
          'The inactive panels are hidden with CSS (`display: none` equivalent) but their links and inputs are still in the tab order. Pressing Tab can reach elements in hidden panels, causing confusion for keyboard users. Hidden panels must be `display: none` or have `inert` attribute.',
        detail_pl:
          'Nieaktywne panele są ukryte przez CSS (odpowiednik `display: none`), ale ich linki i inputy nadal są w kolejności tabulacji. Naciśnięcie Tab może dotrzeć do elementów w ukrytych panelach, powodując zamieszanie dla użytkowników klawiatury. Ukryte panele muszą mieć `display: none` lub atrybut `inert`.',
      },
      {
        title_en: 'Active tab not preserved on page refresh',
        title_pl: 'Aktywna zakładka nie jest zachowana po odświeżeniu strony',
        severity: 'minor',
        detail_en:
          'User switches to the "Settings" tab, fills in a form, and accidentally refreshes. They land on the default tab and their context is lost. Active tab should be reflected in the URL hash (#settings) or query param (?tab=settings).',
        detail_pl:
          'Użytkownik przełącza na zakładkę "Ustawienia", wypełnia formularz i przypadkowo odświeża. Ląduje na domyślnej zakładce i traci kontekst. Aktywna zakładka powinna być odzwierciedlona w hash URL (#settings) lub parametrze zapytania (?tab=settings).',
      },
    ],
    tips_en: [
      'The ARIA tabs pattern is well-defined but complex — test keyboard navigation carefully: Arrow navigates tabs, Tab enters panel, Shift+Tab returns to the active tab.',
      'If tabs contain form fields, test that unsaved data in an inactive tab is not silently discarded when switching.',
    ],
    tips_pl: [
      'Wzorzec ARIA tabs jest dobrze zdefiniowany ale złożony — testuj nawigację klawiaturą uważnie: Strzałki nawigują zakładki, Tab wchodzi do panelu, Shift+Tab wraca do aktywnej zakładki.',
      'Jeśli zakładki zawierają pola formularza, testuj czy niezapisane dane w nieaktywnej zakładce nie są po cichu usuwane przy przełączaniu.',
    ],
    related: ['accordion', 'modal'],
  },
  {
    slug: 'toast',
    name_en: 'Toast / Notification',
    name_pl: 'Toast / Powiadomienie',
    aliases_en: ['Snackbar', 'Alert', 'Banner notification', 'Flash message'],
    aliases_pl: ['Powiadomienie', 'Komunikat flash', 'Alert'],
    description_en:
      'A small, temporary notification that appears on the screen to inform the user of an action result, event, or warning. Auto-dismisses after a timeout.',
    description_pl:
      'Małe, tymczasowe powiadomienie pojawiające się na ekranie informujące użytkownika o wyniku akcji, zdarzeniu lub ostrzeżeniu. Automatycznie znika po czasie.',
    what_to_test_en: [
      'Toast appears after triggering the relevant action',
      'Correct message displayed for success, error, warning, info variants',
      'Auto-dismiss after correct timeout (e.g., 3s for success, 5s for error)',
      'Manual dismiss: X button closes the toast immediately',
      'Multiple toasts stack correctly — do not overlap or push each other off-screen',
      'Toast pauses auto-dismiss on hover (user is reading the message)',
      'ARIA: role="status" for non-urgent, role="alert" for critical messages',
      'Toast does not appear outside viewport on small screens',
      'Error toast: important enough to require manual dismissal (no auto-dismiss)',
      'Action button in toast (e.g., "Undo") is clickable and keyboard-reachable',
    ],
    what_to_test_pl: [
      'Toast pojawia się po wyzwoleniu odpowiedniej akcji',
      'Poprawna wiadomość wyświetlana dla wariantów sukces, błąd, ostrzeżenie, info',
      'Automatyczne znikanie po poprawnym czasie (np. 3s dla sukcesu, 5s dla błędu)',
      'Ręczne zamknięcie: przycisk X natychmiast zamyka toast',
      'Wiele toastów układa się poprawnie — nie nakładają się ani nie wypadają poza ekran',
      'Toast pauzuje automatyczne znikanie po hover (użytkownik czyta wiadomość)',
      'ARIA: role="status" dla nieurgentnych, role="alert" dla krytycznych wiadomości',
      'Toast nie pojawia się poza viewport na małych ekranach',
      'Toast błędu: wystarczająco ważny żeby wymagać ręcznego zamknięcia (bez auto-dismiss)',
      'Przycisk akcji w toast (np. "Cofnij") jest klikalny i osiągalny z klawiatury',
    ],
    common_bugs: [
      {
        title_en: 'Error toasts auto-dismiss too quickly',
        title_pl: 'Toasty błędów znikają automatycznie za szybko',
        severity: 'major',
        detail_en:
          'An error message ("Payment failed") disappears after 3 seconds. The user may not read it in time, especially if they are distracted. Error and warning toasts should either not auto-dismiss or have a longer timeout (8-10s minimum). Success messages can auto-dismiss quickly.',
        detail_pl:
          'Komunikat błędu ("Płatność nie powiodła się") znika po 3 sekundach. Użytkownik może nie zdążyć go przeczytać, szczególnie jeśli jest rozproszony. Toasty błędów i ostrzeżeń nie powinny znikać automatycznie lub powinny mieć dłuższy czas (minimum 8-10s). Komunikaty sukcesu mogą znikać szybko.',
      },
      {
        title_en: 'Toast not announced by screen readers',
        title_pl: 'Toast nie jest ogłaszany przez czytniki ekranu',
        severity: 'major',
        detail_en:
          'The toast appears visually but screen reader users do not hear it. The toast container must use `role="status"` (polite) or `role="alert"` (assertive) for critical messages. An empty live region must exist in the DOM on page load, with content injected dynamically to trigger the announcement.',
        detail_pl:
          'Toast pojawia się wizualnie, ale użytkownicy czytników ekranu go nie słyszą. Kontener toastu musi używać `role="status"` (grzeczne) lub `role="alert"` (asertywne) dla krytycznych wiadomości. Pusty live region musi istnieć w DOM przy załadowaniu strony, z treścią wstrzykaną dynamicznie, żeby wyzwolić ogłoszenie.',
      },
      {
        title_en: 'Multiple toasts overlap or are hidden off-screen',
        title_pl: 'Wiele toastów nakłada się lub jest ukrytych poza ekranem',
        severity: 'minor',
        detail_en:
          'When multiple actions trigger toasts rapidly (e.g., 5 items saved in quick succession), they stack off-screen or overlap each other. The toast queue should stack vertically within the visible area and either limit count (show last 3) or scroll within a container.',
        detail_pl:
          'Gdy wiele akcji wyzwala toasty szybko (np. 5 elementów zapisanych po kolei), układają się poza ekranem lub nakładają na siebie. Kolejka toastów powinna układać się pionowo w widocznym obszarze i albo ograniczać liczbę (pokazuj ostatnie 3) albo scrollować wewnątrz kontenera.',
      },
    ],
    tips_en: [
      'Test the "Undo" action in toast by triggering it just before auto-dismiss — the action must work even if invoked at T-100ms before disappearance.',
      'Check what happens when a toast is triggered on a page that then navigates away — is the toast shown on the new page?',
    ],
    tips_pl: [
      'Testuj akcję "Cofnij" w toast wyzwalając ją tuż przed auto-dismiss — akcja musi działać nawet jeśli wywołana na T-100ms przed zniknięciem.',
      'Sprawdź co się dzieje gdy toast jest wyzwalany na stronie która następnie nawiguje do innej — czy toast jest pokazany na nowej stronie?',
    ],
    related: ['modal'],
  },
  {
    slug: 'tooltip',
    name_en: 'Tooltip',
    name_pl: 'Tooltip',
    aliases_en: ['Hint', 'Popover', 'Info bubble'],
    aliases_pl: ['Podpowiedź', 'Dymek informacyjny'],
    description_en:
      'A small overlay that appears near a UI element to provide contextual information. Triggered on hover or focus, dismissed on mouse-out or blur.',
    description_pl:
      'Mała nakładka pojawiająca się przy elemencie UI dostarczająca kontekstowych informacji. Wyzwalana przy hover lub focus, zamykana przy mouse-out lub blur.',
    what_to_test_en: [
      'Tooltip appears on hover of the trigger element',
      'Tooltip appears on keyboard focus of the trigger element',
      'Tooltip disappears on mouse-out and on Escape key',
      'Tooltip disappears on blur (focus leaving the trigger)',
      'Tooltip positioned within viewport — does not clip near edges',
      'Tooltip content announced by screen reader via aria-describedby',
      'Long tooltip text wraps correctly and does not overflow',
      'Interactive content inside tooltip (if any) is keyboard-reachable',
      'Tooltip delay: appears after short delay (not instantly on every mouse movement)',
      'Does not obstruct other interactive elements when visible',
    ],
    what_to_test_pl: [
      'Tooltip pojawia się przy hover elementu triggera',
      'Tooltip pojawia się przy focus klawiaturą na elemencie triggera',
      'Tooltip znika przy mouse-out i klawiszu Escape',
      'Tooltip znika przy blur (focus wychodzi z triggera)',
      'Tooltip pozycjonuje się w granicach viewport — nie przycina się przy krawędziach',
      'Treść tooltipa jest ogłaszana przez czytnik ekranu przez aria-describedby',
      'Długi tekst tooltipa zalega poprawnie i nie wychodzi poza granicę',
      'Interaktywna zawartość wewnątrz tooltipa (jeśli jest) jest osiągalna z klawiatury',
      'Opóźnienie tooltipa: pojawia się po krótkim opóźnieniu (nie natychmiast przy każdym ruchu myszy)',
      'Nie zasłania innych interaktywnych elementów gdy jest widoczny',
    ],
    common_bugs: [
      {
        title_en: 'Tooltip not shown on keyboard focus',
        title_pl: 'Tooltip nie pojawia się przy focus klawiaturą',
        severity: 'major',
        detail_en:
          'The tooltip is triggered by the CSS `:hover` pseudo-class only. Keyboard users who tab to the element never see the tooltip. The tooltip must also trigger on `:focus` or via JavaScript `focus` event. Test: tab to the trigger, tooltip should appear.',
        detail_pl:
          'Tooltip jest wyzwalany tylko przez pseudo-klasę CSS `:hover`. Użytkownicy klawiatury, którzy tabują do elementu, nigdy nie widzą tooltipa. Tooltip musi być też wyzwalany przy `:focus` lub przez zdarzenie JavaScript `focus`. Test: tab do triggera, tooltip powinien się pojawić.',
      },
      {
        title_en: 'Tooltip content not in aria-describedby',
        title_pl: 'Treść tooltipa nie jest w aria-describedby',
        severity: 'major',
        detail_en:
          'The tooltip text is visible on screen, but the trigger element does not have `aria-describedby` pointing to the tooltip. Screen readers do not announce the tooltip text when the trigger is focused. The trigger must have `aria-describedby="tooltip-id"` and the tooltip must have `id="tooltip-id"` and `role="tooltip"`.',
        detail_pl:
          'Tekst tooltipa jest widoczny na ekranie, ale element triggera nie ma `aria-describedby` wskazującego na tooltip. Czytniki ekranu nie ogłaszają tekstu tooltipa gdy trigger jest skupiony. Trigger musi mieć `aria-describedby="tooltip-id"`, a tooltip musi mieć `id="tooltip-id"` i `role="tooltip"`.',
      },
      {
        title_en: 'Tooltip clipped at viewport edge',
        title_pl: 'Tooltip przycięty na krawędzi viewport',
        severity: 'minor',
        detail_en:
          'A tooltip triggered by an element near the right edge of the screen renders partially off-screen. The tooltip positioning logic must check the available space and flip the tooltip to the opposite side (right → left, bottom → top) when it would clip.',
        detail_pl:
          'Tooltip wyzwalany przez element blisko prawej krawędzi ekranu renderuje się częściowo poza ekranem. Logika pozycjonowania tooltipa musi sprawdzać dostępną przestrzeń i odwracać tooltip na przeciwną stronę (prawo → lewo, dół → góra) gdy zostałby przycięty.',
      },
    ],
    tips_en: [
      'If the tooltip contains important information (not just supplemental), it should be always visible or accessible without hover — hover-only content fails on touch devices.',
      'Touch devices have no hover state. Tooltips on touch-only elements are invisible on mobile. Consider using popovers with explicit trigger for mobile.',
    ],
    tips_pl: [
      'Jeśli tooltip zawiera ważne informacje (nie tylko uzupełniające), powinien być zawsze widoczny lub dostępny bez hover — treść tylko hover nie działa na urządzeniach dotykowych.',
      'Urządzenia dotykowe nie mają stanu hover. Tooltips na elementach tylko dotykowych są niewidoczne na mobile. Rozważ popovers z explicit trigger dla mobile.',
    ],
    related: ['modal', 'dropdown'],
  },
  {
    slug: 'checkbox-radio',
    name_en: 'Checkbox / Radio Button',
    name_pl: 'Checkbox / Radio Button',
    aliases_en: ['Toggle', 'Multi-select toggle', 'Option button'],
    aliases_pl: ['Pole wyboru', 'Przycisk opcji'],
    description_en:
      'Binary input controls: checkboxes allow multiple selections from a group; radio buttons allow exactly one selection from a group. Deceptively simple — frequently broken in custom implementations.',
    description_pl:
      'Binarne kontrolki wejścia: checkboxy pozwalają na wielokrotny wybór z grupy; radio buttons pozwalają na dokładnie jeden wybór z grupy. Pozornie proste — często psują się w customowych implementacjach.',
    what_to_test_en: [
      'Clicking the label toggles the checkbox / selects the radio',
      'Clicking directly on the input also works (both hitbox sources)',
      'Keyboard: Space toggles checkbox; arrow keys navigate radio group',
      'Indeterminate state (checkbox): visually distinct from checked and unchecked',
      'Radio group: only one can be selected at a time',
      'Deselecting a radio button is not possible (by design), unless there is a "clear" option',
      'Form submission: checked values are included in the submitted data',
      'Pre-selected state: correct items checked on load',
      'Disabled state: cannot be changed; visually greyed out; not submitted',
      'aria-checked reflects actual state; role="checkbox" or role="radio" set correctly',
    ],
    what_to_test_pl: [
      'Kliknięcie etykiety przełącza checkbox / wybiera radio',
      'Kliknięcie bezpośrednio na input też działa (oba źródła hitbox)',
      'Klawiatura: Spacja przełącza checkbox; klawisze strzałek nawigują grupę radio',
      'Stan indeterminate (checkbox): wizualnie odróżnialny od zaznaczonego i odznaczonego',
      'Grupa radio: tylko jeden może być wybrany na raz',
      'Odznaczenie radio button jest niemożliwe (z projektu), chyba że jest opcja "wyczyść"',
      'Wysyłanie formularza: zaznaczone wartości są uwzględnione w przesłanych danych',
      'Stan wstępnie zaznaczony: poprawne elementy zaznaczone przy załadowaniu',
      'Stan wyłączony: nie można zmieniać; wizualnie wyszarzony; nie przesyłany',
      'aria-checked odzwierciedla rzeczywisty stan; role="checkbox" lub role="radio" ustawione poprawnie',
    ],
    common_bugs: [
      {
        title_en: 'Clicking label does not toggle the checkbox',
        title_pl: 'Kliknięcie etykiety nie przełącza checkboxa',
        severity: 'major',
        detail_en:
          'The visual checkbox/radio uses a custom `<div>` or `<span>` with JavaScript, but the `<label>` is not programmatically associated via `for`/`id`. Clicking the label text does nothing. Either use a real `<input>` with associated `<label>`, or add click handlers on the label element.',
        detail_pl:
          'Wizualny checkbox/radio używa customowego `<div>` lub `<span>` z JavaScript, ale `<label>` nie jest programowo powiązany przez `for`/`id`. Kliknięcie tekstu etykiety nie robi nic. Albo użyj prawdziwego `<input>` z powiązanym `<label>`, albo dodaj handlery kliknięcia na element etykiety.',
      },
      {
        title_en: 'Custom checkbox missing from form submission',
        title_pl: 'Customowy checkbox brakuje w danych wysyłanych z formularza',
        severity: 'critical',
        detail_en:
          'A custom checkbox implemented with a styled `<div>` and JavaScript state updates the visual state but is not backed by a real `<input type="checkbox">`. When the form is submitted, the checkbox value is absent. Always back custom checkboxes with hidden native inputs.',
        detail_pl:
          'Customowy checkbox zaimplementowany przez stylowany `<div>` i JavaScript aktualizuje wizualny stan, ale nie jest wspierany przez prawdziwy `<input type="checkbox">`. Gdy formularz jest wysyłany, wartość checkboxa jest nieobecna. Zawsze wspieraj customowe checkboxy ukrytymi natywnymi inputami.',
      },
      {
        title_en: 'All radio buttons can be deselected',
        title_pl: 'Wszystkie przyciski radio można odznaczyć',
        severity: 'major',
        detail_en:
          'Clicking a selected radio button deselects it, leaving no option selected. This breaks the radio group contract: exactly one must be selected at all times (unless the group is optional and has a "None" option). If "None" is valid, add an explicit "None" radio button instead of deselecting.',
        detail_pl:
          'Kliknięcie wybranego przycisku radio odznacza go, nie pozostawiając żadnej wybranej opcji. To narusza kontrakt grupy radio: dokładnie jeden musi być wybrany przez cały czas (chyba że grupa jest opcjonalna i ma opcję "Żadne"). Jeśli "Żadne" jest prawidłowe, dodaj explicit przycisk radio "Żadne" zamiast odznaczania.',
      },
    ],
    tips_en: [
      'The label click area is critical — a large label associated with a small input gives users a bigger click target, especially on mobile.',
      'For custom checkbox groups, verify the submitted form data in Network tab, not just the visual state.',
    ],
    tips_pl: [
      'Obszar kliknięcia etykiety jest kluczowy — duża etykieta powiązana z małym inputem daje użytkownikom większy cel kliknięcia, szczególnie na mobile.',
      'Dla grup customowych checkboxów, sprawdź przesłane dane formularza w zakładce Network, nie tylko wizualny stan.',
    ],
    related: ['form-input', 'dropdown'],
  },
  {
    slug: 'file-upload',
    name_en: 'File Upload',
    name_pl: 'Przesyłanie pliku',
    aliases_en: ['File picker', 'File input', 'Dropzone', 'Drag and drop upload'],
    aliases_pl: ['Wybieracz pliku', 'Strefa przeciągnij i upuść'],
    description_en:
      'A control for selecting and uploading files, either through a file browser dialog or drag-and-drop. Can be single or multi-file, with format and size restrictions.',
    description_pl:
      'Kontrolka do wyboru i przesyłania plików przez okno dialogowe przeglądarki plików lub przeciągnij i upuść. Może być jednorazowe lub wieloplikowe, z ograniczeniami formatu i rozmiaru.',
    what_to_test_en: [
      'Clicking the upload area opens the file browser',
      'Selecting a valid file triggers upload or shows preview',
      'Drag and drop: dragging a file onto the dropzone uploads or previews it',
      'File format restriction: invalid format shows error, not silent failure',
      'File size limit: file exceeding the limit shows error with size information',
      'Multiple files: selecting 5 when max is 3 shows error or takes only 3',
      'Progress indicator shows upload progress for large files',
      'Cancel upload: in-progress upload can be cancelled',
      'Network error during upload: retry mechanism or clear error message',
      'Uploaded file accessible: download link or preview renders correctly after upload',
      'Accessible: keyboard can trigger file dialog; error states announced by screen reader',
    ],
    what_to_test_pl: [
      'Kliknięcie obszaru przesyłania otwiera przeglądarkę plików',
      'Wybranie prawidłowego pliku wyzwala przesyłanie lub pokazuje podgląd',
      'Przeciągnij i upuść: przeciągnięcie pliku na strefę dropzone przesyła lub pokazuje podgląd',
      'Ograniczenie formatu pliku: nieprawidłowy format pokazuje błąd, nie cichy failure',
      'Limit rozmiaru pliku: plik przekraczający limit pokazuje błąd z informacją o rozmiarze',
      'Wiele plików: wybór 5 gdy max to 3 pokazuje błąd lub bierze tylko 3',
      'Wskaźnik postępu pokazuje postęp przesyłania dużych plików',
      'Anulowanie przesyłania: przesyłanie w toku można anulować',
      'Błąd sieci podczas przesyłania: mechanizm retry lub wyraźny komunikat błędu',
      'Przesłany plik dostępny: link do pobrania lub podgląd renderuje się poprawnie po przesłaniu',
      'Dostępność: klawiatura może wyzwolić dialog pliku; stany błędów ogłaszane przez czytnik ekranu',
    ],
    common_bugs: [
      {
        title_en: 'File type validated only on extension, not MIME type',
        title_pl: 'Typ pliku walidowany tylko po rozszerzeniu, nie MIME type',
        severity: 'major',
        detail_en:
          'Renaming `malware.exe` to `document.pdf` bypasses the client-side validation because only the filename extension is checked. MIME type (`file.type`) must also be validated on the client. The server must perform its own format validation independently.',
        detail_pl:
          'Zmiana nazwy `malware.exe` na `document.pdf` omija walidację po stronie klienta, bo sprawdzane jest tylko rozszerzenie nazwy pliku. Typ MIME (`file.type`) musi być też walidowany po stronie klienta. Serwer musi wykonywać własną walidację formatu niezależnie.',
      },
      {
        title_en: 'No progress feedback for large file uploads',
        title_pl: 'Brak informacji o postępie dla dużych plików',
        severity: 'major',
        detail_en:
          'Uploading a 50MB file shows no progress. The user sees nothing for 30 seconds and either waits, retries, or abandons. Large uploads must show progress (percentage or progress bar) and estimated time. Test with a file close to the maximum allowed size.',
        detail_pl:
          'Przesyłanie 50MB pliku nie pokazuje postępu. Użytkownik nie widzi nic przez 30 sekund i albo czeka, próbuje ponownie, lub porzuca. Duże przesyłania muszą pokazywać postęp (procent lub pasek) i szacowany czas. Testuj plikiem bliskim maksymalnemu dozwolonemu rozmiarowi.',
      },
      {
        title_en: 'Duplicate upload on double-click of submit',
        title_pl: 'Duplikat przesyłania przy podwójnym kliknięciu submit',
        severity: 'major',
        detail_en:
          'Double-clicking the upload button or submit sends the file twice. The upload button must be disabled after the first click and re-enabled only after upload completes or fails.',
        detail_pl:
          'Dwukrotne kliknięcie przycisku przesyłania lub submit wysyła plik dwa razy. Przycisk przesyłania musi być wyłączony po pierwszym kliknięciu i ponownie włączony dopiero po zakończeniu lub niepowodzeniu przesyłania.',
      },
    ],
    tips_en: [
      'Always test with a file exactly at the size limit, one byte under, and one byte over.',
      'Test drag-and-drop with both single files and multiple files in one drag gesture.',
      'On mobile, test that the file picker opens the appropriate source (camera vs gallery vs files app).',
    ],
    tips_pl: [
      'Zawsze testuj plikiem dokładnie na limicie rozmiaru, jeden bajt poniżej i jeden bajt powyżej.',
      'Testuj przeciągnij i upuść zarówno z pojedynczymi plikami jak i wieloma plikami w jednym geście.',
      'Na mobile testuj czy piker pliku otwiera odpowiednie źródło (aparat vs galeria vs aplikacja pliki).',
    ],
    related: ['form-input', 'modal'],
  },
]
