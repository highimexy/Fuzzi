export interface ExploreArticle {
  slug: string
  title: string
  label: string
  category: string
  category_pl: string
  tagline: string
  tagline_pl: string
  sections: { heading: string; body: string }[]
  sections_pl: { heading: string; body: string }[]
  proTips: string[]
  proTips_pl: string[]
  externalLinks?: { label: string; url: string }[]
}

export const EXPLORE_ARTICLES: ExploreArticle[] = [
  {
    slug: 'perfect-pixel',
    title: 'PerfectPixel',
    label: '01',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A browser extension that overlays a semi-transparent design mockup directly onto a live webpage so you can compare pixel by pixel.',
    tagline_pl: 'Rozszerzenie do przeglądarki nakładające półprzezroczysty projekt graficzny na żywą stronę, umożliwiające porównanie implementacji piksel po pikselu.',
    sections: [
      {
        heading: 'What is it?',
        body: 'PerfectPixel is a Chrome and Firefox extension developed by WellDoneCode. It lets you upload any image (Figma export, Zeplin screenshot, design comp) and display it as a translucent overlay on top of your running webpage. You control the opacity, position, and scale of the overlay to align it with your implementation.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'Visual testing is one of the hardest things to automate reliably. PerfectPixel gives you an instant, manual way to catch pixel-level deviations — wrong padding, incorrect font sizes, off-by-one margins — without writing a single line of test code. It is especially useful when developers claim "it looks fine to me" and you need a concrete, visual diff to include in a bug report.',
      },
      {
        heading: 'How to get started',
        body: 'Install the extension from the Chrome Web Store or Firefox Add-ons. Open your target page, click the PerfectPixel icon, upload the design file, and use the opacity slider to blend the overlay with the live page. Move the overlay with arrow keys for fine-grained alignment. Take a screenshot of the discrepancy for your bug report.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'PerfectPixel to rozszerzenie do Chrome i Firefox tworzone przez WellDoneCode. Pozwala załadować dowolny obraz (eksport z Figmy, zrzut z Zeplina, kompozycja projektu) i wyświetlić go jako półprzezroczystą nakładkę na działającą stronę. Kontrolujesz przezroczystość, pozycję i skalę nakładki, aby dopasować ją do implementacji.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Testowanie wizualne jest jedną z najtrudniejszych do automatyzacji czynności. PerfectPixel daje natychmiastowy, manualny sposób na wykrywanie odchyleń na poziomie piksela — błędny padding, nieprawidłowe rozmiary czcionek, odstępy o jeden piksel za dużo — bez pisania ani jednej linii kodu testów. Jest szczególnie przydatny, gdy developer twierdzi „wygląda dobrze" i potrzebujesz konkretnego wizualnego porównania do raportu błędu.',
      },
      {
        heading: 'Jak zacząć',
        body: 'Zainstaluj rozszerzenie z Chrome Web Store lub Firefox Add-ons. Otwórz docelową stronę, kliknij ikonę PerfectPixel, wgraj plik projektu i użyj suwaka przezroczystości do nałożenia go na stronę. Przesuwaj nakładkę strzałkami klawiatury dla precyzyjnego ustawienia. Zrób zrzut ekranu rozbieżności do raportu błędu.',
      },
    ],
    proTips: [
      'Always set the browser zoom to 100% before using PerfectPixel — any zoom level other than 100% will introduce scaling artifacts that make the comparison meaningless.',
      'Use the lock icon in the extension panel to pin the overlay position while scrolling, so you can check how repeating elements (cards, list items) compare to the design.',
      'When filing a bug, attach both the design file and a screenshot with PerfectPixel overlay at 50% opacity — this gives the developer an immediate visual of the gap.',
    ],
    proTips_pl: [
      'Zawsze ustaw powiększenie przeglądarki na 100% przed użyciem PerfectPixel — inne ustawienie wprowadza artefakty skalowania, które fałszują porównanie.',
      'Użyj ikony kłódki w panelu rozszerzenia, aby zablokować pozycję nakładki podczas przewijania — pozwala sprawdzić, czy powtarzające się elementy (karty, pozycje listy) odpowiadają projektowi.',
      'Zgłaszając błąd, dołącz zarówno plik projektu, jak i zrzut ekranu z nakładką PerfectPixel przy 50% przezroczystości — developer od razu widzi różnicę.',
    ],
    externalLinks: [
      { label: 'PerfectPixel on Chrome Web Store', url: 'https://chromewebstore.google.com/detail/perfectpixel-by-welldonec/dkaagdgjmgdmbnecmcefdhjekcoceebi' },
      { label: 'Official site', url: 'https://www.welldonecode.com/perfectpixel/' },
    ],
  },
  {
    slug: 'greenshot-flameshot',
    title: 'Greenshot / Flameshot',
    label: '02',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'Lightweight screenshot tools with built-in annotation, blurring, and instant sharing — purpose-built for fast, professional bug reporting.',
    tagline_pl: 'Lekkie narzędzia do zrzutów ekranu z wbudowanymi adnotacjami, rozmywaniem i natychmiastowym udostępnianiem — stworzone do szybkich, profesjonalnych raportów błędów.',
    sections: [
      {
        heading: 'What are they?',
        body: 'Greenshot (Windows) and Flameshot (Linux/Mac/Windows) are open-source screenshot utilities that go far beyond the system print-screen key. Both let you capture a selected region, a window, or the full screen, and immediately annotate the result with arrows, rectangles, text, and blur tools before saving or uploading.',
      },
      {
        heading: 'Why QA Engineers use them',
        body: 'A raw screenshot with no context forces the developer to guess what you mean. Annotated screenshots with a red arrow pointing to the broken element and a blur on sensitive data cut the back-and-forth in half. Both tools also support direct upload to Imgur, JIRA, or a clipboard paste, which speeds up the bug reporting workflow considerably.',
      },
      {
        heading: 'Greenshot vs Flameshot',
        body: 'Greenshot is Windows-only and has a slightly more polished annotation editor with an obfuscate (pixelate) tool that is great for blurring PII in bug reports. Flameshot is cross-platform, supports Wayland on Linux, and has a pin-to-screen mode that keeps the screenshot floating on top of other windows while you write the report.',
      },
    ],
    sections_pl: [
      {
        heading: 'Czym są?',
        body: 'Greenshot (Windows) i Flameshot (Linux/Mac/Windows) to narzędzia open-source do zrzutów ekranu, które znacznie wykraczają poza systemowy klawisz print-screen. Oba pozwalają przechwycić zaznaczony obszar, okno lub cały ekran, a następnie natychmiast opisać wynik strzałkami, prostokątami, tekstem i narzędziem rozmycia przed zapisem lub wgraniem.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Czysty zrzut ekranu bez kontekstu zmusza developera do zgadywania. Opisane zrzuty z czerwoną strzałką wskazującą uszkodzony element i rozmyciem wrażliwych danych zmniejszają liczbę rund wyjaśnień o połowę. Oba narzędzia obsługują też bezpośrednie wgrywanie do Imgur, JIRA lub schowka, co przyspiesza tworzenie raportów błędów.',
      },
      {
        heading: 'Greenshot vs Flameshot',
        body: 'Greenshot działa tylko na Windows i ma nieco dopracowanszy edytor adnotacji z narzędziem obfuscate (pikselizacja) świetnym do rozmywania danych osobowych. Flameshot jest wieloplatformowy, obsługuje Wayland na Linuksie i ma tryb przypinania do ekranu, który pozwala utrzymać zrzut nad innymi oknami podczas pisania raportu.',
      },
    ],
    proTips: [
      'Configure Greenshot to save files automatically to a timestamped folder — after a day of testing you will have a complete visual log without any manual effort.',
      'Use the blur/obfuscate tool on any user data (email addresses, phone numbers, financial figures) before attaching screenshots to tickets, even in internal tools.',
      'In Flameshot, use the pin feature to float a screenshot on top of your JIRA tab so you can reference it while typing the description without switching windows.',
    ],
    proTips_pl: [
      'Skonfiguruj Greenshot do automatycznego zapisywania plików do folderu z sygnaturą czasową — po dniu testów masz kompletny log wizualny bez żadnego ręcznego wysiłku.',
      'Użyj narzędzia rozmycia na wszelkich danych użytkownika (adresy email, numery telefonów, dane finansowe) przed dołączeniem zrzutów do ticketów, nawet w narzędziach wewnętrznych.',
      'W Flameshot użyj funkcji przypinania, aby pływający zrzut był widoczny ponad zakładką JIRA podczas pisania opisu — nie musisz przełączać okien.',
    ],
    externalLinks: [
      { label: 'Greenshot', url: 'https://getgreenshot.org/' },
      { label: 'Flameshot', url: 'https://flameshot.org/' },
    ],
  },
  {
    slug: 'loom-obs-studio',
    title: 'Loom / OBS Studio',
    label: '03',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'Screen recording tools that let you capture bugs in motion — with your voice narration — so developers can reproduce issues without reading a wall of text.',
    tagline_pl: 'Narzędzia do nagrywania ekranu, które pozwalają uchwycić błędy w ruchu z narracją głosową — developer odtworzy problem bez czytania ściany tekstu.',
    sections: [
      {
        heading: 'What are they?',
        body: 'Loom is a cloud-based screen recorder that instantly uploads your recording and gives you a shareable link. OBS Studio is a powerful, open-source local recording and streaming application used by professionals. Both capture your screen, webcam, and microphone simultaneously.',
      },
      {
        heading: 'Why QA Engineers use them',
        body: 'Some bugs are nearly impossible to describe in text — race conditions, animation glitches, intermittent failures, or complex multi-step reproduction paths. A 30-second video narrated with "I click here, then wait 2 seconds, then scroll — and here you can see the button disappears" is worth a thousand words and five follow-up messages. Loom links also embed in JIRA, Linear, and Notion.',
      },
      {
        heading: 'When to use Loom vs OBS',
        body: 'Use Loom for quick asynchronous bug reports — it handles upload, hosting, and sharing automatically. Use OBS when you need high-quality local recordings (no upload limit, full 4K, custom bitrate), for regression test video archives, or when working with sensitive data that should not be sent to a third-party cloud service.',
      },
    ],
    sections_pl: [
      {
        heading: 'Czym są?',
        body: 'Loom to chmurowy rejestrator ekranu, który natychmiast przesyła nagranie i generuje link do udostępnienia. OBS Studio to potężna, open-source\'owa aplikacja do lokalnego nagrywania używana przez profesjonalistów. Oba przechwytują ekran, kamerkę i mikrofon jednocześnie.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Niektóre błędy są prawie niemożliwe do opisania tekstem — race conditions, glitche animacji, sporadyczne awarie czy złożone ścieżki reprodukcji. 30-sekundowe wideo z narracją „klikam tutaj, czekam 2 sekundy, przewijam — i tutaj widać, że przycisk znika" jest warte tysiąca słów i pięciu wiadomości follow-up. Linki z Loom osadzają się też w JIRA, Linear i Notion.',
      },
      {
        heading: 'Kiedy używać Loom vs OBS',
        body: 'Używaj Loom do szybkich asynchronicznych raportów błędów — automatycznie obsługuje wgrywanie, hosting i udostępnianie. Używaj OBS gdy potrzebujesz nagrań lokalnych wysokiej jakości (bez limitu wgrywania, 4K, własny bitrate), do archiwów wideo testów regresji lub przy pracy z wrażliwymi danymi, które nie powinny trafiać do zewnętrznej chmury.',
      },
    ],
    proTips: [
      'Start every recording by narrating the preconditions out loud: "I am on staging, logged in as admin, cart has two items" — this cuts out the first three developer questions.',
      'In Loom, use the draw tool during recording to circle or highlight the broken area in real time so the viewer knows exactly where to look.',
      'Keep OBS configured with a hotkey to start/stop recording so you can capture intermittent bugs the moment they appear without losing time opening the app.',
    ],
    proTips_pl: [
      'Każde nagranie rozpoczynaj od wypowiedzenia warunków wstępnych na głos: „Jestem na stagingu, zalogowany jako admin, koszyk ma dwa produkty" — eliminuje to pierwsze trzy pytania developera.',
      'W Loom używaj narzędzia rysowania podczas nagrywania, aby zakreślić uszkodzony obszar w czasie rzeczywistym — widz od razu wie, gdzie patrzeć.',
      'Skonfiguruj OBS z klawiszem skrótu do start/stop nagrywania, aby przechwycić sporadyczne błędy natychmiast po ich wystąpieniu bez straty czasu.',
    ],
    externalLinks: [
      { label: 'Loom', url: 'https://www.loom.com/' },
      { label: 'OBS Studio', url: 'https://obsproject.com/' },
    ],
  },
  {
    slug: 'handbrake',
    title: 'Handbrake',
    label: '04',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A free, open-source video transcoder that compresses your screen recordings so they fit within JIRA, GitHub, and Slack file size limits.',
    tagline_pl: 'Darmowy transkoder wideo open-source, który kompresuje nagrania ekranu tak, by mieściły się w limitach rozmiaru pliku JIRA, GitHub i Slack.',
    sections: [
      {
        heading: 'What is it?',
        body: 'HandBrake is a cross-platform video transcoding tool. It converts video files from one format to another and lets you control codec (H.264, H.265), resolution, frame rate, and bitrate. The result is dramatically smaller files with minimal visible quality loss.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'OBS and Loom produce large raw recordings. GitHub has a 10MB attachment limit. JIRA has configurable but often tight limits. A 2-minute 1080p screen recording from OBS can easily be 200MB. HandBrake can reduce it to under 5MB while keeping the content perfectly legible for a developer reviewing it.',
      },
      {
        heading: 'How to use it',
        body: 'Open your recording in HandBrake, select the "Web > Gmail Large 3 Minutes 720p30" preset as a starting point, reduce the resolution to 720p if it was 1080p, and set the RF (quality) slider to around 28–32. Encode and compare the output. For most screen recordings, RF 30 at 720p is indistinguishable from the original at 10% of the file size.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'HandBrake to wieloplatformowe narzędzie do transkodowania wideo. Konwertuje pliki wideo z jednego formatu na drugi i pozwala kontrolować kodek (H.264, H.265), rozdzielczość, liczbę klatek i bitrate. Efektem są dramatycznie mniejsze pliki z minimalną zauważalną utratą jakości.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'OBS i Loom produkują duże surowe nagrania. GitHub ma limit załącznika 10MB. JIRA ma konfigurowalne, ale często ciasne limity. 2-minutowe nagranie 1080p z OBS może ważyć 200MB. HandBrake może je zmniejszyć do poniżej 5MB, zachowując treść doskonale czytelną dla developera.',
      },
      {
        heading: 'Jak go używać',
        body: 'Otwórz nagranie w HandBrake, wybierz preset „Web > Gmail Large 3 Minutes 720p30" jako punkt startowy, zmniejsz rozdzielczość do 720p i ustaw suwak RF (jakość) na około 28–32. Zakoduj i porównaj wynik. Dla większości nagrań ekranu RF 30 przy 720p jest nie do odróżnienia od oryginału przy 10% rozmiaru pliku.',
      },
    ],
    proTips: [
      'Save a custom preset in HandBrake named "Bug Report" with your preferred settings so you do not have to configure it each time — one click and encode.',
      'For recordings that will be embedded in documentation or wikis, use H.265 (HEVC) for even smaller files, but check that your ticket system supports it before switching.',
      'If you only need a short clip of a longer recording, use the "Range" option in HandBrake to encode just the relevant seconds instead of the full file.',
    ],
    proTips_pl: [
      'Zapisz niestandardowy preset w HandBrake o nazwie „Bug Report" z preferowanymi ustawieniami — nie musisz konfigurować go za każdym razem, jedno kliknięcie i kodowanie.',
      'Do nagrań osadzanych w dokumentacji używaj H.265 (HEVC) dla jeszcze mniejszych plików, ale sprawdź wcześniej czy Twój system ticketów go obsługuje.',
      'Jeśli potrzebujesz tylko krótkiego klipu z dłuższego nagrania, użyj opcji „Range" w HandBrake, aby zakodować tylko odpowiednie sekundy zamiast całego pliku.',
    ],
    externalLinks: [
      { label: 'HandBrake', url: 'https://handbrake.fr/' },
    ],
  },
  {
    slug: 'expo-go-testflight',
    title: 'Expo Go / TestFlight',
    label: '05',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'The standard distribution channels for testing mobile apps on real physical devices before they reach production.',
    tagline_pl: 'Standardowe kanały dystrybucji do testowania aplikacji mobilnych na prawdziwych urządzeniach fizycznych przed wdrożeniem na produkcję.',
    sections: [
      {
        heading: 'What are they?',
        body: 'Expo Go is a free app for iOS and Android that lets developers share React Native and Expo apps via a QR code — no App Store or Play Store submission required. TestFlight is Apple\'s official beta testing platform, integrated into App Store Connect, for distributing iOS and macOS builds to internal and external testers.',
      },
      {
        heading: 'Why QA Engineers use them',
        body: 'Simulators and emulators miss real-world issues: actual GPS behaviour, camera access, push notification permissions, touch pressure sensitivity, network switching between WiFi and LTE, and device-specific rendering differences. Testing on a real device through Expo Go or TestFlight catches these issues before users do.',
      },
      {
        heading: 'Android equivalent to TestFlight',
        body: 'For Android, the equivalent is Google Play\'s Internal Testing track. You distribute APKs to specific Google accounts, and testers install them through the Play Store. For builds outside the Play Store, you install APKs directly via adb or by sending the file — though this requires enabling "unknown sources" on the device.',
      },
    ],
    sections_pl: [
      {
        heading: 'Czym są?',
        body: 'Expo Go to darmowa aplikacja na iOS i Android, która pozwala developerom udostępniać aplikacje React Native i Expo przez kod QR — bez przesyłania do App Store czy Play Store. TestFlight to oficjalna platforma beta testów Apple\'a do dystrybucji buildów iOS i macOS do wewnętrznych i zewnętrznych testerów.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Symulatory i emulatory pomijają rzeczywiste problemy: prawdziwe zachowanie GPS, dostęp do kamery, uprawnienia powiadomień push, czułość nacisku dotykowego, przełączanie między WiFi a LTE i różnice renderowania zależne od urządzenia. Testowanie na prawdziwym urządzeniu przez Expo Go lub TestFlight wyłapuje te problemy przed użytkownikami.',
      },
      {
        heading: 'Androidowy odpowiednik TestFlight',
        body: 'Dla Androida odpowiednikiem jest ścieżka Internal Testing w Google Play. Dystrybuujesz APK do konkretnych kont Google, a testerzy instalują je przez Play Store. Poza Play Store instalujesz APK bezpośrednio przez adb lub wysyłając plik — wymaga to włączenia „nieznanych źródeł" na urządzeniu.',
      },
    ],
    proTips: [
      'Always test on at least one older device (e.g., iPhone 12 or Android 9) — new features often break on older hardware due to performance, OS API differences, or lower screen resolution.',
      'In TestFlight, write clear "What to Test" notes for each build so testers know what changed and where to focus — this dramatically improves the quality of feedback you get back.',
      'Use Expo Go\'s shake gesture to open the developer menu and access performance stats and element inspector directly on device — no dev tools needed.',
    ],
    proTips_pl: [
      'Zawsze testuj przynajmniej na jednym starszym urządzeniu (np. iPhone 12 lub Android 9) — nowe funkcje często psują się na starszym sprzęcie przez różnice API systemu lub niższą rozdzielczość.',
      'W TestFlight pisz jasne notatki „Co testować" dla każdego buildu — to znacząco poprawia jakość opinii, które otrzymujesz od testerów.',
      'Użyj gestu potrząśnięcia w Expo Go, aby otworzyć menu developera i uzyskać dostęp do statystyk wydajności bezpośrednio na urządzeniu — bez potrzeby narzędzi dev.',
    ],
    externalLinks: [
      { label: 'Expo Go', url: 'https://expo.dev/go' },
      { label: 'TestFlight', url: 'https://developer.apple.com/testflight/' },
    ],
  },
  {
    slug: 'responsively-app',
    title: 'Responsively App',
    label: '06',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A developer browser that renders your web app across multiple screen sizes simultaneously, making responsive design testing dramatically faster.',
    tagline_pl: 'Przeglądarka deweloperska renderująca aplikację jednocześnie w wielu rozmiarach ekranów — testowanie responsywnego designu w jednym widoku.',
    sections: [
      {
        heading: 'What is it?',
        body: 'Responsively App is a free, open-source modified browser built specifically for responsive web development and testing. It shows your page in multiple device viewports at the same time — mobile, tablet, and desktop — all scrolling and interacting in sync. Clicks and scroll events are mirrored across all panes.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'Testing a UI change across five breakpoints manually means opening browser dev tools, resizing, checking, resizing again — five times per change. Responsively shows all five simultaneously. It also shows device names and exact pixel dimensions next to each viewport, which makes bug reports precise.',
      },
      {
        heading: 'How to get started',
        body: 'Download Responsively from the official site, open it, and navigate to your local dev server (e.g., localhost:3000). The app comes preloaded with common device presets. You can add custom resolutions, rearrange panels, and mirror interactions. The built-in screenshot button captures all viewports at once and saves them as individual files.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'Responsively App to darmowa, open-source\'owa przeglądarka zmodyfikowana specjalnie do testowania responsywnych stron. Wyświetla stronę w wielu widokach urządzeń jednocześnie — mobilnym, tabletowym i desktopowym — wszystkie scrollując się i reagując synchronicznie.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Ręczne testowanie zmiany UI na pięciu breakpointach oznacza otwieranie DevTools, zmianę rozmiaru, sprawdzenie, ponowna zmiana — pięć razy na zmianę. Responsively pokazuje wszystkie pięć jednocześnie. Pokazuje też nazwy urządzeń i dokładne wymiary pikselowe, co sprawia, że raporty błędów są precyzyjne.',
      },
      {
        heading: 'Jak zacząć',
        body: 'Pobierz Responsively z oficjalnej strony i przejdź do lokalnego serwera dev (np. localhost:3000). Aplikacja jest wstępnie załadowana ze wspólnymi presetami urządzeń. Możesz dodawać niestandardowe rozdzielczości i przestawiać panele. Wbudowany przycisk zrzutu ekranu przechwytuje wszystkie widoki naraz i zapisuje je jako osobne pliki.',
      },
    ],
    proTips: [
      'Add your project\'s most common screen sizes as custom devices rather than relying on generic presets — your analytics data tells you exactly what resolutions your real users have.',
      'Use the "Focus" mode on a single pane when you need to interact with complex UI (modals, dropdowns) — synchronized interaction across 6 panes can make these tricky to work with.',
      'The "Inspect" tab mirrors Chrome DevTools and works across all panes — use it to confirm that breakpoint CSS is actually applied correctly, not just visually assumed.',
    ],
    proTips_pl: [
      'Dodaj najczęstsze rozmiary ekranów w Twoim projekcie jako niestandardowe urządzenia — dane analityczne mówią dokładnie, jakie rozdzielczości mają Twoi prawdziwi użytkownicy.',
      'Używaj trybu „Focus" na pojedynczym panelu gdy musisz wchodzić w interakcję ze złożonym UI (modale, dropdowny) — zsynchronizowana interakcja na 6 panelach może to utrudniać.',
      'Zakładka „Inspect" odzwierciedla Chrome DevTools i działa we wszystkich panelach — używaj jej, aby potwierdzić, że CSS breakpointów jest faktycznie poprawnie zastosowany.',
    ],
    externalLinks: [
      { label: 'Responsively App', url: 'https://responsively.app/' },
    ],
  },
  {
    slug: 'browserstack',
    title: 'BrowserStack',
    label: '07',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A cloud platform that gives you instant access to thousands of real browsers and devices for cross-browser and cross-device testing without owning the hardware.',
    tagline_pl: 'Platforma chmurowa z natychmiastowym dostępem do tysięcy prawdziwych przeglądarek i urządzeń do testów cross-browser i cross-device bez posiadania sprzętu.',
    sections: [
      {
        heading: 'What is it?',
        body: 'BrowserStack provides remote access to real mobile devices (iOS and Android) and browsers (Chrome, Firefox, Safari, Edge) running on actual hardware in their data centres. You connect through your browser and interact with a live device stream. It also offers Automate for running Selenium/Playwright/Cypress test suites in parallel across multiple browser/OS combinations.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'It is impossible to own every iPhone model and Android device your users might have. BrowserStack solves the device coverage problem without a hardware budget. It is especially valuable for testing Safari on iOS (which cannot be emulated on non-Apple hardware) and for catching browser-specific CSS rendering bugs in older Safari versions common in enterprise environments.',
      },
      {
        heading: 'Live vs Automate',
        body: 'BrowserStack Live is the manual, click-to-use interface — you open a browser session on a chosen device, navigate to your URL, and test. BrowserStack Automate integrates with your test framework and runs automated test suites in parallel. As a QA engineer you will likely use both: Live for exploratory testing and Automate for regression runs in CI.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'BrowserStack zapewnia zdalny dostęp do prawdziwych urządzeń mobilnych (iOS i Android) i przeglądarek (Chrome, Firefox, Safari, Edge) działających na rzeczywistym sprzęcie w centrach danych. Łączysz się przez przeglądarkę i interagujesz z żywym strumieniem urządzenia. Oferuje też Automate do równoległego uruchamiania zestawów testów Selenium/Playwright/Cypress.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Niemożliwe jest posiadanie każdego modelu iPhone\'a i urządzenia Android, które mogą mieć Twoi użytkownicy. BrowserStack rozwiązuje problem pokrycia urządzeń bez budżetu na sprzęt. Jest szczególnie cenny do testowania Safari na iOS (którego nie można emulować bez sprzętu Apple) i wykrywania błędów renderowania CSS specyficznych dla starszych wersji Safari.',
      },
      {
        heading: 'Live vs Automate',
        body: 'BrowserStack Live to interfejs manualny — otwierasz sesję przeglądarki na wybranym urządzeniu i testujesz. BrowserStack Automate integruje się z Twoim frameworkiem testów i uruchamia zestawy równolegle. Jako inżynier QA będziesz prawdopodobnie używać obu: Live do testów eksploracyjnych, Automate do przebiegów regresji w CI.',
      },
    ],
    proTips: [
      'Use the "Local Testing" tunnel feature to test builds running on localhost or internal staging environments — this is essential for testing pre-release builds that are not publicly accessible.',
      'BrowserStack keeps session logs, network logs, and video recordings automatically — always save the session link before closing so you have evidence when filing a cross-browser bug.',
      'Filter the device list by the browsers and OS versions your analytics show are most common among your users, not by "latest" — many enterprise users are 2-3 versions behind.',
    ],
    proTips_pl: [
      'Użyj funkcji tunelu „Local Testing", aby testować buildy działające na localhost lub wewnętrznych środowiskach stagingowych — niezbędne do testowania buildów pre-release niedostępnych publicznie.',
      'BrowserStack automatycznie zachowuje logi sesji, logi sieciowe i nagrania wideo — zawsze zapisuj link sesji przed zamknięciem, aby mieć dowód przy zgłaszaniu błędu cross-browser.',
      'Filtruj listę urządzeń według przeglądarek i wersji OS najczęstszych wśród Twoich użytkowników według analytics, nie według „najnowszych" — wielu użytkowników korporacyjnych jest 2-3 wersje w tyle.',
    ],
    externalLinks: [
      { label: 'BrowserStack', url: 'https://www.browserstack.com/' },
    ],
  },
  {
    slug: 'fonts-ninja',
    title: 'Fonts Ninja',
    label: '08',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A browser extension that instantly identifies every font used on any webpage, along with its size, weight, and line height.',
    tagline_pl: 'Rozszerzenie do przeglądarki, które natychmiast identyfikuje każdą czcionkę użytą na dowolnej stronie wraz z rozmiarem, wagą i interliniowaniem.',
    sections: [
      {
        heading: 'What is it?',
        body: 'Fonts Ninja is a browser extension for Chrome, Firefox, and Safari. You click the extension icon, then hover over any text on the page. It shows you the font family, size, weight, line height, letter spacing, and colour of the element under your cursor. It can also cross-reference with Google Fonts and Adobe Fonts.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'Typography bugs are common and often subtle. A developer uses the wrong font weight, a font-family falls back to the system font because the webfont failed to load, or the line-height is inconsistent across breakpoints. Fonts Ninja surfaces these instantly without opening DevTools and navigating the computed styles panel.',
      },
      {
        heading: 'Beyond identification',
        body: 'When you identify a font, Fonts Ninja lets you bookmark it, test it in a text editor within the extension, and find where to purchase or download it. The most useful QA feature is the side-by-side comparison — you can pin two elements and compare their typography properties directly to catch inconsistencies across the page.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'Fonts Ninja to rozszerzenie do Chrome, Firefox i Safari. Klikasz ikonę rozszerzenia i najeżdżasz na dowolny tekst na stronie. Wyświetla rodzinę czcionki, rozmiar, wagę, interlinie, odstęp między literami i kolor elementu pod kursorem. Może też odwoływać się do Google Fonts i Adobe Fonts.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Błędy typograficzne są powszechne i często subtelne. Developer używa złej wagi czcionki, font-family spada na czcionkę systemową bo webfont nie załadował się poprawnie, lub interlinia jest niespójna między breakpointami. Fonts Ninja ujawnia to natychmiast bez otwierania DevTools.',
      },
      {
        heading: 'Poza identyfikacją',
        body: 'Po zidentyfikowaniu czcionki Fonts Ninja pozwala ją zakładkować, przetestować w edytorze tekstu w rozszerzeniu i znaleźć, gdzie ją kupić lub pobrać. Do celów QA najbardziej użyteczna jest funkcja porównywania obok siebie — możesz przypiąć dwa elementy i porównać ich właściwości typograficzne bezpośrednio.',
      },
    ],
    proTips: [
      'When a font "looks wrong" but you are not sure why, use Fonts Ninja to check if the actual rendered font matches the CSS font-family — a missing webfont will silently fall back to Arial or the system font.',
      'Check typography on hover and focus states too — developers sometimes forget to reset font properties in pseudo-class styles, causing text to appear bold or in a different typeface on interaction.',
      'Use Fonts Ninja alongside the design file to verify font token usage — if the design specifies "Heading/H1" as 600 weight and 32px, Fonts Ninja confirms whether the implementation matches.',
    ],
    proTips_pl: [
      'Gdy czcionka „wygląda źle" ale nie wiesz dlaczego, użyj Fonts Ninja, aby sprawdzić czy renderowana czcionka odpowiada CSS font-family — brakujący webfont cicho spada na Arial lub czcionkę systemową.',
      'Sprawdzaj typografię też w stanach hover i focus — developerzy czasem zapominają o resetowaniu właściwości czcionek w pseudo-klasach, powodując inny krój przy interakcji.',
      'Używaj Fonts Ninja obok pliku projektu, aby zweryfikować użycie tokenów typograficznych — jeśli projekt określa „H1" jako wagę 600 i 32px, Fonts Ninja potwierdza czy implementacja to spełnia.',
    ],
    externalLinks: [
      { label: 'Fonts Ninja', url: 'https://www.fonts.ninja/' },
    ],
  },
  {
    slug: 'window-resizer',
    title: 'Window Resizer',
    label: '09',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A browser extension that resizes your entire browser window to a preset or custom resolution with a single click, eliminating manual DevTools resizing.',
    tagline_pl: 'Rozszerzenie do przeglądarki zmieniające rozmiar okna do presetowej rozdzielczości jednym kliknięciem — koniec z ręcznym przeciąganiem w DevTools.',
    sections: [
      {
        heading: 'What is it?',
        body: 'Window Resizer is a Chrome extension that lets you define a list of resolution presets and switch between them instantly. Unlike the DevTools device toolbar which only emulates viewport size, Window Resizer changes the actual browser window dimensions — which also affects JavaScript values like window.innerWidth and some CSS media queries that behave differently between emulated and real viewport sizes.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'Emulated viewports in DevTools are good for development but can miss edge cases that only manifest at real window sizes. Certain JavaScript libraries detect viewport changes via window.resize events that behave differently in emulated vs real contexts. Window Resizer gives you confidence that what you see matches what a user on that resolution actually sees.',
      },
      {
        heading: 'Setting up your presets',
        body: 'Open the extension settings and create presets for the breakpoints in your project\'s CSS (e.g., 375, 768, 1024, 1280, 1440, 1920). Also add the specific resolutions from your analytics top-five list. Assign keyboard shortcuts to your most used sizes for instant switching during a testing session.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'Window Resizer to rozszerzenie Chrome, które pozwala zdefiniować listę presetów rozdzielczości i przełączać się między nimi natychmiastowo. W przeciwieństwie do paska urządzeń DevTools, który emuluje tylko rozmiar widoku, Window Resizer zmienia rzeczywiste wymiary okna przeglądarki — co wpływa też na wartości window.innerWidth i niektóre media query.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Emulowane widoki w DevTools są dobre do developmentu, ale mogą pomijać przypadki brzegowe, które manifestują się tylko przy prawdziwych rozmiarach okna. Niektóre biblioteki JavaScript wykrywają zmiany widoku przez zdarzenia window.resize, które zachowują się inaczej w kontekście emulowanym vs rzeczywistym.',
      },
      {
        heading: 'Konfiguracja presetów',
        body: 'Otwórz ustawienia rozszerzenia i utwórz presety dla breakpointów w CSS Twojego projektu (np. 375, 768, 1024, 1280, 1440, 1920). Dodaj też konkretne rozdzielczości z listy top-5 Twoich analytics. Przypisz skróty klawiaturowe do najczęściej używanych rozmiarów dla natychmiastowego przełączania podczas sesji testowej.',
      },
    ],
    proTips: [
      'Test at exactly one pixel above and below your CSS breakpoints (e.g., 767px and 768px) — this is where layout bugs most commonly hide because both media queries are simultaneously at their boundary condition.',
      'Combine Window Resizer with your browser\'s "responsive design mode" for precise testing: use Window Resizer to set the real window size, then use DevTools to inspect element details.',
      'Document the exact resolution you used in your bug report — "looks broken on mobile" is vague, but "layout collapses at 375×812 (iPhone 14)" gives the developer an immediately reproducible environment.',
    ],
    proTips_pl: [
      'Testuj dokładnie jeden piksel powyżej i poniżej swoich breakpointów CSS (np. 767px i 768px) — tutaj najczęściej ukrywają się błędy layoutu, bo oba media query są jednocześnie na granicy.',
      'Połącz Window Resizer z trybem „responsive design mode" przeglądarki — użyj Window Resizer do ustawienia prawdziwego rozmiaru okna, następnie DevTools do inspekcji szczegółów.',
      'Dokumentuj dokładną rozdzielczość użytą w raporcie błędu — „wygląda źle na mobile" jest niejasne, ale „layout psuje się przy 375×812 (iPhone 14)" daje developerowi natychmiast odtwarzalne środowisko.',
    ],
    externalLinks: [
      { label: 'Window Resizer on Chrome Web Store', url: 'https://chromewebstore.google.com/detail/window-resizer/kkelicaakdanhinjdeammmilcgefonfh' },
    ],
  },
  {
    slug: 'wappalyzer',
    title: 'Wappalyzer',
    label: '10',
    category: 'Useful Tools',
    category_pl: 'Przydatne narzędzia',
    tagline: 'A browser extension that detects the technologies, frameworks, CMS, analytics tools, and infrastructure behind any website.',
    tagline_pl: 'Rozszerzenie do przeglądarki wykrywające technologie, frameworki, CMS, narzędzia analityczne i infrastrukturę stojące za dowolną stroną.',
    sections: [
      {
        heading: 'What is it?',
        body: 'Wappalyzer is a technology profiler available as a browser extension and API. It analyses HTTP headers, script tags, HTML patterns, and cookies to identify which frameworks, CMS, CDN, analytics platforms, payment processors, and other technologies a website uses. It categorises findings into a clean, readable list.',
      },
      {
        heading: 'Why QA Engineers use it',
        body: 'Understanding the tech stack helps you test smarter. If Wappalyzer shows a site uses React with client-side rendering, you know to wait for hydration before testing initial load states. If it detects a specific CDN or caching layer, that explains why your hard refresh does not always show the latest content.',
      },
      {
        heading: 'Practical uses in QA',
        body: 'Wappalyzer is also useful during security-adjacent testing. Knowing the exact version of a framework or CMS lets you cross-reference with known CVEs. If the site runs an outdated jQuery version with known vulnerabilities, that is a finding worth escalating. It also helps during test planning — knowing the analytics stack guides you to test event tracking more thoroughly.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co to jest?',
        body: 'Wappalyzer to profiler technologiczny dostępny jako rozszerzenie do przeglądarki i API. Analizuje nagłówki HTTP, tagi script, wzorce HTML i ciasteczka, aby zidentyfikować jakich frameworków, CMS, CDN, platform analitycznych i innych technologii używa strona.',
      },
      {
        heading: 'Dlaczego QA to używa',
        body: 'Rozumienie stosu technologicznego pomaga testować mądrzej. Jeśli Wappalyzer pokazuje, że strona używa React z renderowaniem po stronie klienta, wiesz, że powinieneś poczekać na hydration przed testowaniem stanów początkowego ładowania. Jeśli wykryje warstwę cachowania, wyjaśnia to dlaczego hard refresh nie zawsze pokazuje najnowszą zawartość.',
      },
      {
        heading: 'Praktyczne zastosowania w QA',
        body: 'Wappalyzer jest też przydatny podczas testowania ze świadomością bezpieczeństwa. Znajomość dokładnej wersji frameworka lub CMS pozwala skrzyżować referencje ze znанymi CVE. Pomaga też podczas planowania testów — znajomość stosu analitycznego (GA4, Mixpanel, Segment) nakierowuje na dokładniejsze testowanie śledzenia zdarzeń.',
      },
    ],
    proTips: [
      'Reload the page with the extension icon open to ensure Wappalyzer captures all technologies — some are only detected on the initial page load response headers.',
      'Use the technology history view to check if a tech stack has changed between releases — a sudden change in JS framework or CDN provider can introduce regressions worth investigating.',
      'Cross-reference detected library versions with the National Vulnerability Database (NVD) during security-focused testing to quickly identify outdated or vulnerable dependencies.',
    ],
    proTips_pl: [
      'Przeładuj stronę z otwartą ikoną rozszerzenia, aby Wappalyzer przechwycił wszystkie technologie — niektóre są wykrywane tylko z nagłówków odpowiedzi przy pierwszym ładowaniu.',
      'Użyj widoku historii technologii, aby sprawdzić czy stos technologiczny zmienił się między wydaniami — nagła zmiana frameworka JS lub dostawcy CDN może wprowadzić regresje warte zbadania.',
      'Skrzyżuj wykryte wersje bibliotek z National Vulnerability Database (NVD) podczas testów zorientowanych na bezpieczeństwo, aby szybko zidentyfikować przestarzałe zależności.',
    ],
    externalLinks: [
      { label: 'Wappalyzer', url: 'https://www.wappalyzer.com/' },
    ],
  },

  // ─────────────── INTERVIEWS & GROWTH ───────────────
  {
    slug: 'mastering-body-language',
    title: 'Mastering Body Language',
    label: '01',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'Non-verbal cues account for more than half of first impressions — learn how to make yours work for you before you say a word.',
    tagline_pl: 'Sygnały niewerbalne odpowiadają za ponad połowę pierwszego wrażenia — naucz się, jak sprawić, by pracowały na Twoją korzyść jeszcze zanim odezwiesz się słowem.',
    sections: [
      {
        heading: 'Why it matters',
        body: 'Research consistently shows that interviewers form an opinion within the first 30 seconds of meeting a candidate — well before any technical question is answered. Posture, eye contact, handshake, and facial expressions all signal confidence and credibility. A technically brilliant candidate who looks disengaged or nervous will lose to a slightly less experienced candidate who appears calm and present.',
      },
      {
        heading: 'Key principles',
        body: 'Sit upright with your back touching the chair — it prevents slouching as the interview progresses and makes you appear more authoritative. Maintain natural eye contact: look at the interviewer when listening, look slightly away when thinking, and return eye contact when delivering your answer. Mirror the interviewer\'s energy level subtly. Keep your hands visible and use occasional open-palm gestures to reinforce key points.',
      },
      {
        heading: 'Common mistakes',
        body: 'The most common mistake is unconscious self-touching — rubbing your neck, touching your face, playing with a pen. These gestures signal anxiety and distraction. Another frequent mistake is the "freeze" — going completely still and expressionless while listening, which reads as disengagement. Nod occasionally, raise your eyebrows to show you are following along, and take brief notes to demonstrate active engagement.',
      },
    ],
    sections_pl: [
      {
        heading: 'Dlaczego to ważne',
        body: 'Badania konsekwentnie pokazują, że rekruterzy wyrabiają sobie opinię w ciągu pierwszych 30 sekund spotkania z kandydatem — na długo przed jakimkolwiek pytaniem technicznym. Postawa, kontakt wzrokowy i mimika twarzy sygnalizują pewność siebie i wiarygodność. Technicznie błyskotliwy kandydat, który sprawia wrażenie niezaangażowanego, przegra z mniej doświadczonym, który sprawia wrażenie spokojnego i obecnego.',
      },
      {
        heading: 'Kluczowe zasady',
        body: 'Siedź prosto z plecami dotykającymi oparcia — zapobiega to garbeniu się w trakcie rozmowy. Utrzymuj naturalny kontakt wzrokowy: patrz na rekrutera słuchając, spójrz lekko w bok myśląc, wróć do kontaktu wzrokowego odpowiadając. Subtelnie odzwierciedlaj poziom energii rekrutera. Trzymaj ręce widoczne i używaj okazjonalnych gestów otwartej dłoni do podkreślania kluczowych punktów.',
      },
      {
        heading: 'Częste błędy',
        body: 'Najczęstszym błędem jest nieświadome dotykanie siebie — pocieranie szyi, dotykanie twarzy, bawienie się długopisem. Te gesty sygnalizują niepokój. Innym błędem jest całkowite zastygniecie i brak wyrazu twarzy podczas słuchania, co jest odczytywane jako brak zaangażowania. Kiwaj głową, unoś brwi i rób krótkie notatki, aby demonstrować aktywne uczestnictwo.',
      },
    ],
    proTips: [
      'Record yourself in a mock interview on video and watch it back with the sound off — you will immediately see body language habits you never noticed, like looking down too often or crossing your arms.',
      'Before walking into the interview room, spend two minutes in a private space with an expansive posture (arms open, standing tall) — this reduces cortisol levels measurably.',
      'During remote video interviews, position your camera at eye level and look into the lens when delivering key points — this creates the perception of direct eye contact for the interviewer.',
    ],
    proTips_pl: [
      'Nagraj się podczas próbnej rozmowy i obejrzyj bez dźwięku — natychmiast zobaczysz nawyki mowy ciała, których nigdy nie zauważyłeś, jak zbyt częste patrzenie w dół lub skrzyżowane ramiona.',
      'Przed wejściem do sali rekrutacyjnej spędź dwie minuty w otwartej postawie (ramiona rozłożone, stojąc prosto) — to wymiernie obniża poziom kortyzolu.',
      'Podczas zdalnych rozmów wideo ustaw kamerę na poziomie oczu i patrz w obiektyw przy kluczowych stwierdzeniach — tworzy to wrażenie bezpośredniego kontaktu wzrokowego dla rekrutera.',
    ],
  },
  {
    slug: 'dress-code-for-tech',
    title: 'Dress Code for Tech',
    label: '02',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'Looking the part in a tech interview means landing in the sweet spot between "too casual" and "overdressed for a startup."',
    tagline_pl: 'Odpowiedni ubiór na rozmowę w tech oznacza trafienie między „zbyt casualowo" a „zbyt formalnie jak na startup" — a ten punkt jest bardziej precyzyjny niż myślisz.',
    sections: [
      {
        heading: 'The tech industry spectrum',
        body: 'Tech company cultures vary enormously. A Series A startup may have a "no dress code" ethos where showing up in a suit signals you do not understand the culture. A fintech or enterprise software company may expect business casual as a baseline. Research the specific company before your interview — look at their social media, LinkedIn photos from their office, and Glassdoor interview reviews to gauge the expected register.',
      },
      {
        heading: 'The safe default',
        body: 'When in doubt, smart casual is almost always appropriate in tech. For most QA roles this means clean, well-fitted clothes without graphics, logos, or slogans. A plain collared shirt or blouse, well-fitting trousers or dark jeans (no rips), and clean shoes. Avoid anything that requires physical adjustment during the interview — a shirt that rides up or shoes that cause discomfort will divide your attention.',
      },
      {
        heading: 'Remote interviews',
        body: 'For video calls, the same principles apply from the waist up. Pay particular attention to what appears in frame — a solid, neutral-coloured top photographs well on video. Ensure your background is clean or use a simple virtual background. Good lighting (facing a window or a ring light) elevates the quality of your appearance more than any specific clothing choice.',
      },
    ],
    sections_pl: [
      {
        heading: 'Spektrum branży tech',
        body: 'Kultury firm technologicznych znacznie się różnią. Startup na etapie Series A może mieć podejście „brak dress code", gdzie pojawienie się w garniturze sygnalizuje, że nie rozumiesz kultury. Firma fintech lub twórca oprogramowania dla przedsiębiorstw może oczekiwać business casual. Zbadaj konkretną firmę — sprawdź media społecznościowe, zdjęcia z LinkedIn z biura i recenzje rozmów na Glassdoor.',
      },
      {
        heading: 'Bezpieczne domyślne',
        body: 'W razie wątpliwości smart casual jest prawie zawsze odpowiednie w tech. Dla większości ról QA oznacza to czyste, dobrze dopasowane ubrania bez grafik, logotypów czy haseł. Prosta koszula polo lub bluzka, dobrze dopasowane spodnie lub ciemne dżinsy (bez dziur) i czyste buty. Unikaj wszystkiego, co wymaga fizycznych poprawek podczas rozmowy.',
      },
      {
        heading: 'Rozmowy zdalne',
        body: 'Dla rozmów wideo te same zasady obowiązują od pasa w górę. Zwróć uwagę na to, co pojawia się w kadrze — jednolity, neutralny kolor góry wygląda dobrze na wideo. Zadbaj o czyste tło lub proste wirtualne. Dobre oświetlenie (naprzeciwko okna lub pierścień świetlny) podnosi jakość Twojego wyglądu bardziej niż jakikolwiek konkretny wybór ubrania.',
      },
    ],
    proTips: [
      'Wear your interview outfit to a coffee meeting or a normal workday at least once before the interview — you want it to feel like a second skin, not a costume.',
      'Avoid anything new on the day — new shoes that blister, a belt with a stiff buckle. Novelty creates friction at the worst moment.',
      'When in doubt about formality level, go one notch up rather than one notch down — you can always remove a blazer, you cannot add one you left at home.',
    ],
    proTips_pl: [
      'Ubierz swój strój rozmowowy na spotkanie przy kawie lub normalny dzień pracy przynajmniej raz przed rozmową — chcesz, żeby czuł się jak druga skóra, a nie kostium.',
      'Unikaj czegokolwiek nowego w dniu rozmowy — nowych butów, które obtarłyby, paska ze sztywną klamrą. Nowość tworzy tarcie w najgorszym momencie.',
      'W razie wątpliwości co do poziomu formalności idź o jeden stopień wyżej — możesz zawsze zdjąć marynarkę, nie możesz dodać tej, którą zostawiłeś w domu.',
    ],
  },
  {
    slug: 'answering-why-you',
    title: 'Answering "Why You?"',
    label: '03',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'The "Why should we hire you?" question is not asking you to list your CV — it is asking you to make a specific argument about the unique value you bring to this team.',
    tagline_pl: 'Pytanie „Dlaczego my?" nie prosi Cię o wymienienie CV — prosi o konkretny argument dotyczący unikalnej wartości, którą wnosisz do tego zespołu.',
    sections: [
      {
        heading: 'What the interviewer is really asking',
        body: 'When an interviewer asks "Why you?", they are trying to answer three questions: Can you do this job? Will you fit this team? Do you actually want this specific role, or are you just applying everywhere? Your answer needs to address all three. The worst answers are generic ("I am a hard worker, I learn fast") — they could apply to any candidate for any role.',
      },
      {
        heading: 'Building your answer',
        body: 'Start by identifying two or three things that are genuinely distinctive about you for this specific role. For a QA Engineer position, this might be: direct experience testing the same type of product, a specific skill they mentioned (e.g., Playwright, accessibility testing), or a perspective they need. Then connect each point to a concrete example. "I am detail-oriented" is forgettable. "I found a critical data loss bug in a checkout flow that had passed four previous test cycles" is memorable.',
      },
      {
        heading: 'Delivery',
        body: 'Keep the answer to 90–120 seconds. End with a forward-looking statement that ties your strengths to their specific context: "Based on what I have read about your product and the challenges you described today, I think these skills directly address what you need." This demonstrates you listened, you researched, and you are solving their problem — not just selling yourself.',
      },
    ],
    sections_pl: [
      {
        heading: 'O co naprawdę pyta rekruter',
        body: 'Gdy rekruter pyta „Dlaczego Ty?", stara się odpowiedzieć na trzy pytania: Czy możesz wykonywać tę pracę? Czy pasujesz do tego zespołu? Czy faktycznie chcesz tej konkretnej roli? Twoja odpowiedź musi dotyczyć wszystkich trzech. Najgorsze odpowiedzi są generyczne („Jestem pracowity, szybko się uczę") — mogą pasować do każdego kandydata na każdą rolę.',
      },
      {
        heading: 'Budowanie odpowiedzi',
        body: 'Zacznij od zidentyfikowania dwóch lub trzech rzeczy wyróżniających Cię dla tej konkretnej roli. Na stanowisku inżyniera QA może to być: bezpośrednie doświadczenie w testowaniu tego samego rodzaju produktu, konkretna umiejętność wymieniona w opisie (np. Playwright, testowanie dostępności), lub perspektywa, której potrzebują. Następnie połącz każdy punkt z konkretnym przykładem. „Jestem zorientowany na szczegóły" jest zapominalne. „Znalazłem krytyczny błąd utraty danych, który przeszedł cztery poprzednie cykle testów" jest niezapomniane.',
      },
      {
        heading: 'Sposób wypowiedzi',
        body: 'Trzymaj odpowiedź w granicach 90–120 sekund. Zakończ zdaniem skierowanym ku przyszłości: „Na podstawie tego, co czytałem o Waszym produkcie i wyzwaniach opisanych dzisiaj, myślę, że te umiejętności bezpośrednio odpowiadają na to, czego potrzebujecie." To pokazuje, że słuchałeś, przeprowadziłeś research i rozwiązujesz ich problem.',
      },
    ],
    proTips: [
      'Prepare three versions of your answer: one for a technical interviewer (emphasise tools and hard skills), one for a HR screener (emphasise culture fit), and one for a future manager (emphasise how you make their team\'s life easier).',
      'Avoid superlatives: "I am the best at..." sounds overconfident and creates an implicit promise you cannot verify. Specificity beats hyperbole every time.',
      'Research the company\'s recent news or engineering blog posts and reference them in your answer — it signals genuine interest and differentiates you from candidates who gave the same answer to ten different companies.',
    ],
    proTips_pl: [
      'Przygotuj trzy wersje odpowiedzi: dla technicznego rekrutera (podkreśl narzędzia i umiejętności twarde), dla HR screener (podkreśl dopasowanie kulturowe) i dla przyszłego menedżera (podkreśl jak ułatwiasz życie ich zespołu).',
      'Unikaj superlatywów: „Jestem najlepszy w..." brzmi nazbyt pewnie siebie i tworzy obietnicę, której nie możesz zweryfikować. Konkretność zawsze bije hiperbole.',
      'Zbadaj ostatnie wiadomości firmy lub blog inżynierski i odnieś się do nich w odpowiedzi — sygnalizuje autentyczne zainteresowanie i wyróżnia Cię spośród kandydatów aplikujących wszędzie.',
    ],
  },
  {
    slug: 'salary-negotiation',
    title: 'Salary Negotiation',
    label: '04',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'Negotiating your salary is expected, not rude — and a single conversation can be worth tens of thousands of dollars over the course of a career.',
    tagline_pl: 'Negocjowanie wynagrodzenia jest oczekiwane, nie niegrzeczne — i jedna rozmowa może przez lata kariery przełożyć się na dziesiątki tysięcy złotych.',
    sections: [
      {
        heading: 'Why most people leave money on the table',
        body: 'The majority of candidates accept the first offer without negotiating, either because they fear rejection, feel it is impolite, or do not know their market value. Employers routinely make offers 10–20% below their maximum budget, expecting negotiation. Accepting the first offer signals that you either do not know your worth or are not comfortable advocating for yourself.',
      },
      {
        heading: 'The mechanics',
        body: 'Before negotiating, research the market rate: use Glassdoor, Levels.fyi, LinkedIn Salary, and direct conversations with peers. Anchor high but within a believable range. When you receive an offer, do not accept or reject immediately. Say "Thank you, I am very excited. Can I have 24–48 hours to review the full offer?" Then respond with a specific counter: "Based on my research and experience, I was expecting something closer to X. Is there flexibility?"',
      },
      {
        heading: 'Beyond base salary',
        body: 'Total compensation includes base salary, annual bonus, equity, signing bonus, remote work allowance, learning and development budget, extra vacation days, and health benefits. If the company cannot move on base salary, these levers are often more flexible. A monthly remote work stipend and an annual training budget are worth negotiating if base is fixed.',
      },
    ],
    sections_pl: [
      {
        heading: 'Dlaczego większość ludzi zostawia pieniądze na stole',
        body: 'Większość kandydatów akceptuje pierwszą ofertę bez negocjacji — boją się odmowy, uważają że to niestosowne, lub nie znają swojej wartości rynkowej. Pracodawcy rutynowo składają oferty 10–20% poniżej maksymalnego budżetu, oczekując negocjacji. Akceptacja pierwszej oferty sygnalizuje, że albo nie znasz swojej wartości, albo nie czujesz się komfortowo jej broniąc.',
      },
      {
        heading: 'Mechanika negocjacji',
        body: 'Przed negocjacją zbadaj stawki rynkowe: używaj Glassdoor, Levels.fyi, LinkedIn Salary i rozmów z rówieśnikami. Zakotwicz wysoko, ale w wiarygodnym zakresie. Gdy otrzymasz ofertę, nie akceptuj natychmiast. Powiedz „Dziękuję, jestem bardzo podekscytowany. Czy mogę mieć 24–48 godzin na zapoznanie się?" Następnie odpowiedz konkretną kontrofertą: „Na podstawie moich badań oczekiwałem czegoś bliżej X. Czy jest możliwość elastyczności?"',
      },
      {
        heading: 'Poza wynagrodzeniem podstawowym',
        body: 'Całkowite wynagrodzenie obejmuje podstawę, bonus roczny, equity, bonus na podpisanie umowy, dodatek do pracy zdalnej, budżet na naukę i rozwój, dodatkowe dni urlopu i benefity zdrowotne. Jeśli firma nie może ruszyć wynagrodzenia podstawowego, te dźwignie są często bardziej elastyczne.',
      },
    ],
    proTips: [
      'Never give a specific number first — whoever anchors first loses negotiating room. If asked for your expectation before an offer, say "I am open to discussing once I understand the full scope of the role and benefits package."',
      'Get all offers in writing, including any verbal agreements about flexible work or remote policy — verbal promises do not survive manager changes.',
      'Negotiate in a single email thread rather than phone calls when possible — it gives you time to think, creates a written record, and removes the pressure of real-time responses.',
    ],
    proTips_pl: [
      'Nigdy nie podawaj konkretnej liczby jako pierwsza strona — kto pierwszy zakotwicza, traci przestrzeń do negocjacji. Jeśli zapytają o oczekiwania, powiedz „Jestem otwarty na dyskusję po zapoznaniu się z pełnym zakresem roli i pakietem benefitów."',
      'Uzyskaj wszystkie oferty na piśmie, w tym ustalenia dotyczące pracy zdalnej czy harmonogramów przeglądu wyników — ustne obietnice nie przeżywają zmian menedżerów.',
      'Negocjuj w jednym wątku email zamiast telefonicznie gdy to możliwe — daje Ci czas do myślenia, tworzy pisemny zapis i usuwa presję odpowiedzi w czasie rzeczywistym.',
    ],
  },
  {
    slug: 'stress-management',
    title: 'Stress Management',
    label: '05',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'Interview anxiety is a signal your brain misinterprets as danger — learn to reroute it into focused energy instead of fighting it.',
    tagline_pl: 'Lęk przed rozmową to sygnał, który mózg błędnie interpretuje jako zagrożenie — naucz się przekierowywać go w skupioną energię zamiast z nim walczyć.',
    sections: [
      {
        heading: 'Understanding interview anxiety',
        body: 'Interview stress is physiologically identical to excitement — elevated heart rate, heightened awareness, adrenaline. The difference is the story you tell yourself about the sensation. Reframing "I am nervous" as "I am excited and ready" is a documented technique (called cognitive reappraisal) that measurably improves performance under pressure. The goal is not to eliminate the response but to direct it productively.',
      },
      {
        heading: 'Preparation as the primary tool',
        body: 'The most effective stress management technique for interviews is over-preparation. The more familiar the material feels, the less uncertain you are, and the less your nervous system perceives threat. Practise answering common questions out loud, not just in your head. Run through technical exercises in the same environment as the interview.',
      },
      {
        heading: 'In-the-moment techniques',
        body: 'If you feel overwhelmed during an interview, use the 4-7-8 breathing technique: inhale for 4 counts, hold for 7, exhale for 8. A single cycle lowers heart rate. If you do not know an answer, say "That is a great question, let me think through it for a moment" — thinking visibly often impresses interviewers more than a fast answer. Silence is not a failure state.',
      },
    ],
    sections_pl: [
      {
        heading: 'Rozumienie lęku rozmowowego',
        body: 'Stres rozmowy kwalifikacyjnej jest fizjologicznie identyczny z podnieceniem — podwyższone tętno, zwiększona czujność, adrenalina. Różnicą jest historia, którą opowiadasz sobie o tym odczuciu. Przeformułowanie „jestem zdenerwowany" na „jestem podekscytowany i gotowy" to udokumentowana technika (reappraisal kognitywny), która wymiernie poprawia wyniki pod presją.',
      },
      {
        heading: 'Przygotowanie jako główne narzędzie',
        body: 'Najskuteczniejszą techniką zarządzania stresem rozmowowym jest nadmierne przygotowanie. Im bardziej znajomy wydaje się materiał, tym mniej Twój układ nerwowy postrzega zagrożenie. Ćwicz odpowiadanie na typowe pytania na głos, nie tylko w myślach. Przejdź przez ćwiczenia techniczne w tym samym środowisku co rozmowa.',
      },
      {
        heading: 'Techniki w trakcie rozmowy',
        body: 'Jeśli czujesz się przytłoczony, użyj techniki oddychania 4-7-8: wdech przez 4 liczenia, wstrzymanie przez 7, wydech przez 8. Jeden cykl obniża tętno. Jeśli nie znasz odpowiedzi, powiedz „To świetne pytanie, chwila na przemyślenie" — widoczne myślenie na głos często bardziej imponuje rekruterom niż szybka odpowiedź.',
      },
    ],
    proTips: [
      'The day before: do a full mock interview, prepare your outfit, look up the exact address or meeting link, and sleep at a consistent time. Logistics anxiety on the day multiplies interview stress.',
      'Build a 30-minute buffer before the interview into your calendar — arriving rushed or logging in frantic negates any preparation you did.',
      'After a difficult interview, write a brief debrief: what questions threw you, what answers landed well, and one specific thing to prepare better next time. This converts anxiety into a learning loop.',
    ],
    proTips_pl: [
      'Dzień przed: przeprowadź pełną próbną rozmowę, przygotuj strój, sprawdź dokładny adres lub link do spotkania i idź spać o stałej porze. Logistyczny niepokój w dniu rozmowy mnoży stres.',
      'Wbuduj 30-minutowy bufor przed rozmową w swój kalendarz — przyjście spieszając się neguje całe przygotowanie, które robiłeś.',
      'Po trudnej rozmowie napisz krótkie podsumowanie: jakie pytania Cię zaskoczyły, jakie odpowiedzi wypadły dobrze i jedną konkretną rzecz do lepszego przygotowania następnym razem.',
    ],
  },
  {
    slug: 'mock-interview-simulator',
    title: 'Mock Interview Simulator',
    label: '06',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'The single most effective preparation technique is deliberate practice under realistic conditions — not re-reading notes.',
    tagline_pl: 'Jedyną i najskuteczniejszą techniką przygotowania jest celowe ćwiczenie w realistycznych warunkach — nie ponowne czytanie notatek.',
    sections: [
      {
        heading: 'Why mock interviews work',
        body: 'Reading about answering interview questions and actually answering them out loud are completely different cognitive tasks. Reading feels comfortable because it is passive — you recognise the answer. Speaking requires retrieval and articulation, which is what the interview actually tests. Mock interviews force you into the uncomfortable zone of real performance, which is exactly where the learning happens.',
      },
      {
        heading: 'How to run a good mock interview',
        body: 'Find a partner — a friend, a colleague, or an interviewing platform. Give them a list of common questions for your target role and ask them to pick randomly, so you cannot anticipate order. Record the session. Do not stop when you stumble — continue to the end of each answer as you would in a real interview. Afterwards, watch the recording together and identify specific improvements.',
      },
      {
        heading: 'Platforms and tools',
        body: 'Pramp offers free peer-to-peer mock technical interviews. Interviewing.io offers anonymous mock interviews with real engineers. For QA-specific practice, use the lesson modules in Fuzzi — the interview task type provides structured scenarios with evaluation criteria. You can also use AI tools to roleplay as an interviewer and provide structured feedback, though peer practice with a human is irreplaceable.',
      },
    ],
    sections_pl: [
      {
        heading: 'Dlaczego próbne rozmowy działają',
        body: 'Czytanie o odpowiadaniu na pytania rozmowowe i faktyczne odpowiadanie na nie na głos to zupełnie różne zadania poznawcze. Czytanie jest pasywne — rozpoznajesz odpowiedź. Mówienie wymaga przywołania i artykułowania, co jest tym, co rozmowa faktycznie testuje. Próbne rozmowy zmuszają Cię w niekomfortową strefę prawdziwej wydajności — dokładnie tam, gdzie następuje nauka.',
      },
      {
        heading: 'Jak przeprowadzić dobrą próbną rozmowę',
        body: 'Znajdź partnera — przyjaciela, kolegę lub platformę do rozmów. Daj mu listę typowych pytań i poproś o losowy wybór, aby nie móc przewidzieć kolejności. Nagraj sesję. Nie przerywaj gdy się potkniesz — kontynuuj do końca każdej odpowiedzi. Potem obejrzyj nagranie i zidentyfikuj konkretne usprawnienia: słowa wypełniacze, zbyt długie odpowiedzi, pytania bez konkretnego przykładu.',
      },
      {
        heading: 'Platformy i narzędzia',
        body: 'Pramp oferuje bezpłatne peer-to-peer próbne wywiady techniczne. Interviewing.io oferuje anonimowe próbne rozmowy z prawdziwymi inżynierami. Do ćwiczeń specyficznych dla QA używaj modułów lekcji w Fuzzi — typ zadania interview zapewnia ustrukturyzowane scenariusze z kryteriami oceny.',
      },
    ],
    proTips: [
      'Do at least five full mock interviews before your first real one for a role you care about — the first two will be rough, and you want the rough ones to be practice, not live.',
      'Specifically request negative feedback from your mock interviewer: "What was the weakest part of my answer?" People naturally soften feedback unless you explicitly ask for the hard truth.',
      'Simulate the exact conditions: sit at a desk, use the same setup as the real interview, wear your interview outfit. Psychological fidelity to the real event reduces the novelty factor that causes anxiety.',
    ],
    proTips_pl: [
      'Przeprowadź co najmniej pięć pełnych próbnych rozmów przed pierwszą prawdziwą — pierwsze dwie będą trudne i chcesz, żeby te trudne były ćwiczeniem, nie prawdziwą rekrutacją.',
      'Wyraźnie proś o negatywną informację zwrotną: „Co było najsłabszą częścią mojej odpowiedzi?" Ludzie naturalnie łagodzą feedback, chyba że wyraźnie poprosisz o trudną prawdę.',
      'Zasymuluj dokładne warunki: siedź przy biurku, użyj tego samego setupu, załóż strój rozmowowy. Psychologiczna wierność prawdziwemu wydarzeniu zmniejsza czynnik nowości, który powoduje lęk.',
    ],
  },
  {
    slug: 'the-star-method',
    title: 'The STAR Method',
    label: '07',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'A four-part framework for structuring behavioural interview answers that gives interviewers exactly what they need to evaluate you clearly and consistently.',
    tagline_pl: 'Czteroczęściowy framework do strukturyzowania odpowiedzi na pytania behawioralne, który daje rekruterom dokładnie to, czego potrzebują do Twojej oceny.',
    sections: [
      {
        heading: 'What is STAR?',
        body: 'STAR stands for Situation, Task, Action, Result. Situation: briefly set the scene with the relevant context. Task: describe your specific responsibility or the challenge you personally faced. Action: explain in detail what you did, step by step, focusing on your personal contribution rather than the team\'s. Result: quantify the outcome wherever possible — what improved, by how much, what was prevented.',
      },
      {
        heading: 'Why interviewers rely on it',
        body: 'Behavioural questions are based on the principle that past behaviour predicts future behaviour. Interviewers are assessing: did you take ownership, did you communicate effectively, did you handle ambiguity, did you show impact? A STAR answer makes it easy for the interviewer to tick these boxes and advocate for you internally. A vague story makes evaluation difficult, which works against you even when your experience is strong.',
      },
      {
        heading: 'Common failure modes',
        body: 'The most frequent mistake is spending too long on the Situation and Task and rushing through the Action — which is the most important part. Another failure mode is ending without a Result, leaving the story unresolved. The third is using "we" throughout: interviewers cannot assess your individual contribution. Reframe to "I proposed", "I built", "I led" while acknowledging the team\'s role.',
      },
    ],
    sections_pl: [
      {
        heading: 'Czym jest STAR?',
        body: 'STAR to skrót od Situation (Sytuacja), Task (Zadanie), Action (Działanie), Result (Wynik). Sytuacja: krótko opisz scenę z kontekstem. Zadanie: opisz swoją konkretną odpowiedzialność. Działanie: wyjaśnij szczegółowo co zrobiłeś, koncentrując się na Twoim osobistym wkładzie. Wynik: skwantyfikuj efekt gdzie to możliwe — co się poprawiło, o ile, czemu zapobiegłeś.',
      },
      {
        heading: 'Dlaczego rekruterzy na tym polegają',
        body: 'Pytania behawioralne opierają się na zasadzie, że przeszłe zachowanie przewiduje przyszłe. Rekruterzy oceniają: czy wziąłeś odpowiedzialność, czy komunikowałeś się skutecznie, czy radziłeś sobie z niejednoznacznością, czy pokazałeś wpływ? Odpowiedź STAR ułatwia rekruterowi odhaczenie tych pól i wewnętrzne wnioskowanie za Ciebie.',
      },
      {
        heading: 'Częste tryby awarii',
        body: 'Najczęstszy błąd to spędzanie zbyt wiele czasu na Sytuacji i Zadaniu, a pośpieszanie przez Działanie — które jest najważniejszą częścią. Inny tryb awarii to zakończenie bez Wyniku. Trzecim jest używanie „my" przez cały czas — rekruterzy nie mogą ocenić Twojego indywidualnego wkładu. Przeformułuj na „Zaproponowałem", „Zbudowałem", „Poprowadziłem".',
      },
    ],
    proTips: [
      'Prepare 8–10 core STAR stories from your career that can be adapted to different questions. A story about navigating a disagreement with a developer can answer "conflict resolution", "stakeholder communication", "persuasion", and "quality advocacy" questions.',
      'When asked a question, pause for 5 seconds before answering — not to recall facts, but to mentally select the best story. The story you choose matters more than how fluently you tell it.',
      'Quantify results even when they feel approximate: "reduced regression test time from 4 hours to 45 minutes," "caught 3 critical bugs before the release." Approximate numbers are always better than no numbers.',
    ],
    proTips_pl: [
      'Przygotuj 8–10 głównych historii STAR ze swojej kariery, które można adaptować do różnych pytań. Historia o nieporozumieniu z developerem może odpowiadać na pytania o konflikt, komunikację, perswazję i obronę jakości.',
      'Gdy zostaniesz zapytany, zatrzymaj się na 5 sekund przed odpowiedzią — nie żeby przypomnieć fakty, ale żeby mentalnie wybrać najlepszą historię. Historia, którą wybierasz, ma większe znaczenie niż jak płynnie ją opowiadasz.',
      'Kwantyfikuj wyniki nawet gdy czują się przybliżone: „Skróciłem czas testu regresji z 4 godzin do 45 minut", „Wykryłem 3 krytyczne błędy przed wydaniem." Przybliżone liczby są zawsze lepsze niż brak liczb.',
    ],
  },
  {
    slug: 'live-coding-survival',
    title: 'Live Coding Survival',
    label: '08',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'Live coding tasks are less about getting the right answer and more about demonstrating how you think — and that is a skill you can explicitly practise.',
    tagline_pl: 'Zadania z kodowaniem na żywo dotyczą mniej uzyskania właściwej odpowiedzi, a bardziej demonstrowania jak myślisz — i to jest umiejętność, którą można jawnie ćwiczyć.',
    sections: [
      {
        heading: 'What interviewers are actually evaluating',
        body: 'During a live coding task, interviewers evaluate: how you break down an unfamiliar problem, whether you ask clarifying questions before writing code, how you communicate your reasoning, how you handle getting stuck, and whether you can test your own code. Getting the "correct" answer is often secondary to demonstrating a structured, communicative problem-solving process.',
      },
      {
        heading: 'The think-out-loud protocol',
        body: 'Never code in silence. Narrate everything: "I am starting by reading the requirements. I notice the input could be empty, so I will handle that edge case first. I am going to write a simple loop here — I know there is likely a more efficient approach but I will start with the readable version and optimise if time allows." This gives the interviewer insight into your thinking even when the code is incomplete.',
      },
      {
        heading: 'When you get stuck',
        body: 'Getting stuck is expected — it is how you respond that matters. First, say "I am thinking through this" rather than going silent. Second, ask clarifying questions: "Am I correct that the input is always a sorted array?" Third, step back and describe what you would do even if you cannot implement it. Starting with pseudocode is completely acceptable. An incomplete but structured solution demonstrates more than staring at the screen.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co rekruterzy faktycznie oceniają',
        body: 'Podczas zadania z kodowaniem na żywo rekruterzy oceniają: jak rozkładasz nieznany problem, czy zadajesz pytania wyjaśniające przed pisaniem kodu, jak komunikujesz swoje rozumowanie, jak radzisz sobie ze zatkaniem i czy możesz testować własny kod. Uzyskanie „właściwej" odpowiedzi jest często drugorzędne wobec demonstrowania ustrukturyzowanego procesu.',
      },
      {
        heading: 'Protokół myślenia na głos',
        body: 'Nigdy nie koduj w ciszy. Narruj wszystko: „Zaczynam od czytania wymagań. Zauważam że wejście może być puste, więc najpierw obsłużę ten przypadek brzegowy. Piszę prostą pętlę — wiem że istnieje bardziej wydajne podejście, ale zacznę od czytelnej wersji i zoptymalizuję jeśli starczy czasu." To daje rekruterowi wgląd w Twoje myślenie nawet gdy kod jest niekompletny.',
      },
      {
        heading: 'Gdy utkniesz',
        body: 'Utykanie jest oczekiwane — ważne jest jak reagujesz. Powiedz „Myślę przez to" zamiast milczeć. Zadaj pytania wyjaśniające. Cofnij się i opisz co byś zrobił nawet jeśli nie możesz zaimplementować. Zaczynanie od pseudokodu jest całkowicie akceptowalne. Niekompletne, ale ustrukturyzowane rozwiązanie demonstruje więcej niż gapienie się w ekran.',
      },
    ],
    proTips: [
      'For QA-specific coding tasks (writing test cases in code, writing API tests, scripting automation), practice the exact type of code you will be asked to write — not algorithmic puzzles from LeetCode unless the role specifically requires them.',
      'Before the session, ask what language or framework you can use — interviewers almost always let you choose. Pick the one where you are most fluent, not the one that looks most impressive.',
      'After finishing a working solution, always offer: "I would add input validation here, and I would write a test for the edge case where the array is empty." This demonstrates QA instincts without being asked.',
    ],
    proTips_pl: [
      'Do zadań kodowania specyficznych dla QA (pisanie przypadków testowych w kodzie, testy API, skryptowanie automatyzacji) ćwicz dokładnie ten typ kodu, który będziesz pisać — nie algorytmiczne łamigłówki z LeetCode, chyba że rola tego konkretnie wymaga.',
      'Przed sesją zapytaj jakie języki lub frameworki możesz używać — rekruterzy prawie zawsze pozwalają Ci wybrać. Wybierz ten, w którym jesteś najbardziej płynny.',
      'Po skończeniu działającego rozwiązania zawsze zaoferuj: „Dodałbym tu walidację wejścia i napisał test dla przypadku brzegowego gdy tablica jest pusta." To demonstruje instynkt QA bez pytania.',
    ],
  },
  {
    slug: 'portfolio-presentation',
    title: 'Portfolio Presentation',
    label: '09',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'A QA portfolio is not a list of tools you have used — it is evidence of how you think, communicate, and prevent bugs from reaching users.',
    tagline_pl: 'Portfolio QA to nie lista narzędzi, których używałeś — to dowód na to, jak myślisz, komunikujesz się i zapobiegasz dotarciu błędów do użytkowników.',
    sections: [
      {
        heading: 'What belongs in a QA portfolio',
        body: 'A strong QA portfolio includes: sample test plans or test strategies (with context about the product and what risks you were mitigating), examples of bug reports (well-written, with reproduction steps, environment, expected vs actual, severity justification), test case collections showing coverage strategy, and — for technical QA roles — automation code samples with clear structure and comments explaining your decisions.',
      },
      {
        heading: 'How to present it',
        body: 'During an interview, do not just share a screen and scroll through files. Tell the story: "This is a test plan I wrote for a payments flow. The key risk I was trying to address was concurrent transaction handling. Here is how I structured the test suite around that risk, and here is the critical bug I found using this approach." The context around the artefact is what makes it compelling.',
      },
      {
        heading: 'Building it from scratch',
        body: 'If you are early in your career and lack professional examples, create them. Find an open-source product or a popular web app, and write a test plan for one feature. File a real bug report for a real bug you find. Write automation scripts for a publicly available test environment. Document your thought process. These self-initiated examples demonstrate initiative and the ability to work independently.',
      },
    ],
    sections_pl: [
      {
        heading: 'Co należy do portfolio QA',
        body: 'Silne portfolio QA obejmuje: przykładowe plany testów lub strategie testów (z kontekstem o produkcie i ryzykach, które mitigowałeś), przykłady raportów błędów (dobrze napisane, ze krokami reprodukcji, środowiskiem, oczekiwanym vs rzeczywistym), kolekcje przypadków testowych pokazujące strategię pokrycia i — dla ról technicznych — przykłady kodu automatyzacji z przejrzystą strukturą.',
      },
      {
        heading: 'Jak je prezentować',
        body: 'Podczas rozmowy nie udostępniaj tylko ekranu i nie przewijaj plików. Opowiedz historię: „To jest plan testów, który napisałem dla przepływu płatności. Kluczowym ryzykiem, które chciałem zaadresować, była obsługa jednoczesnych transakcji. Oto jak ustrukturyzowałem zestaw testów wokół tego ryzyka." Kontekst wokół artefaktu jest tym, co sprawia że jest przekonujący.',
      },
      {
        heading: 'Budowanie od zera',
        body: 'Jeśli jesteś na początku kariery i brak Ci profesjonalnych przykładów, stwórz je. Znajdź produkt open-source lub popularną aplikację webową i napisz plan testów dla jednej funkcji. Zgłoś prawdziwy błąd do publicznego trackera. Napisz skrypty automatyzacji dla publicznie dostępnego środowiska testowego. Dokumentuj swój proces myślowy.',
      },
    ],
    proTips: [
      'Before the interview, prepare a 3-minute verbal walkthrough of your strongest portfolio piece — practise it out loud until it flows naturally. Interviewers often ask "walk me through an example of your work."',
      'Anonymise any client or company-specific information in your examples — replace real product names and user data with placeholders before sharing. Demonstrating discretion is part of the professional signal.',
      'Host your portfolio in a way that is immediately accessible: a GitHub repo, a Notion page, or a simple PDF. Sending "I will email it to you" during the interview creates friction and looks unorganised.',
    ],
    proTips_pl: [
      'Przed rozmową przygotuj 3-minutowe ustne omówienie swojego najsilniejszego elementu portfolio — ćwicz na głos aż będzie płynąć naturalnie. Rekruterzy często pytają „Proszę omówić przykład swojej pracy."',
      'Zanonimizuj wszelkie informacje specyficzne dla klienta lub firmy — zastąp prawdziwe nazwy produktów i dane użytkownika placeholderami przed udostępnieniem. Demonstrowanie dyskrecji jest częścią profesjonalnego sygnału.',
      'Hostuj portfolio w sposób natychmiast dostępny: repozytorium GitHub, strona Notion lub prosty PDF. Powiedzenie „Wyślę Ci emailem" podczas rozmowy wygląda na niezorganizowane.',
    ],
  },
  {
    slug: 'questions-for-them',
    title: 'Questions for Them',
    label: '10',
    category: 'Interviews & Growth',
    category_pl: 'Wywiady i rozwój',
    tagline: 'The questions you ask at the end of an interview reveal as much about you as your answers — and the right ones can turn a borderline decision in your favour.',
    tagline_pl: 'Pytania, które zadajesz na końcu rozmowy, ujawniają o Tobie tyle samo co Twoje odpowiedzi — i odpowiednie mogą przeważyć graniczną decyzję na Twoją korzyść.',
    sections: [
      {
        heading: 'Why your questions matter',
        body: 'When the interviewer asks "Do you have any questions for us?", saying "No, I think you covered everything" is a missed opportunity. Strong candidates use this time to demonstrate genuine curiosity, signal that they have done their research, assess whether this is actually the right role for them, and leave the interviewer with a positive final impression.',
      },
      {
        heading: 'Questions that work',
        body: 'For a QA role, strong questions include: "How is quality ownership distributed across the team — do developers write tests or is that primarily the QA team\'s responsibility?" "What does a typical release cycle look like, and where does QA sit in that process?" "What is the biggest quality challenge the team is facing right now?" "What does the onboarding process look like for QA engineers?"',
      },
      {
        heading: 'Questions to avoid',
        body: 'Avoid questions where the answer is on the company website — this signals you did not prepare. Avoid questions that are exclusively about what the company will do for you in the first interview. Avoid yes/no questions that close down dialogue. Finally, avoid questions that implicitly criticise the company before you have the full picture.',
      },
    ],
    sections_pl: [
      {
        heading: 'Dlaczego Twoje pytania mają znaczenie',
        body: 'Gdy rekruter pyta „Czy masz do nas pytania?", powiedzenie „Nie, myślę że wszystko zostało omówione" to zmarnowana okazja. Mocni kandydaci używają tego czasu, aby zademonstrować autentyczną ciekawość, zasygnalizować research, ocenić czy to faktycznie jest właściwa rola i pozostawić rekruterowi pozytywne ostatnie wrażenie.',
      },
      {
        heading: 'Pytania, które działają',
        body: 'Dla roli QA mocne pytania to: „Jak w Waszym zespole rozkłada się odpowiedzialność za jakość — czy developerzy piszą testy czy to głównie odpowiedzialność QA?" „Jak wygląda typowy cykl wydania i gdzie w tym procesie siedzi QA?" „Jakie jest największe wyzwanie jakościowe, z którym zmaga się teraz zespół?" „Jak wygląda onboarding dla inżynierów QA?"',
      },
      {
        heading: 'Pytania do unikania',
        body: 'Unikaj pytań, na które odpowiedź jest na stronie firmy — sygnalizuje to brak przygotowania. Unikaj pytań dotyczących wyłącznie tego, co firma zrobi dla Ciebie na pierwszej rozmowie. Unikaj pytań zamkniętych (tak/nie), które zamykają dialog. Unikaj też pytań, które niejawnie krytykują firmę zanim masz pełny obraz.',
      },
    ],
    proTips: [
      'Prepare 6–8 questions and expect to use 3–4 — some will naturally be answered during the interview. Having extras means you are not left with nothing when your first two questions are pre-empted.',
      'Take notes during the interview and reference them in your questions: "You mentioned earlier that the team is moving toward shift-left testing — how far along is that transition?" This demonstrates you were listening and engaged throughout.',
      'End with a forward-looking question: "What would success look like for this role in the first 90 days?" — this positions you as already thinking about how to contribute.',
    ],
    proTips_pl: [
      'Przygotuj 6–8 pytań i spodziewaj się użycia 3–4 — niektóre naturalnie zostaną odpowiedziane podczas rozmowy. Posiadanie zapasowych oznacza, że nie zostajesz z niczym gdy pierwsze pytania zostaną uprzedzone.',
      'Rób notatki podczas rozmowy i odwołuj się do nich: „Wspomniałeś wcześniej, że zespół przechodzi na shift-left testing — jak daleko zaawansowana jest ta transformacja?" — demonstruje że słuchałeś przez cały czas.',
      'Zakończ pytaniem skierowanym ku przyszłości: „Jak wyglądałby sukces dla tej roli w ciągu pierwszych 90 dni?" — pozycjonuje Cię jako już myślącego o tym, jak wnosić wkład.',
    ],
  },
]
