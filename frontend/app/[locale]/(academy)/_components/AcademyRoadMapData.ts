export type Resource = {
  type: 'article' | 'video' | 'feed'
  title: string
  url: string
}

export type TopicSection = {
  heading: string
  text: string
}

export type TopicContent = {
  sections: TopicSection[]
  resources: Resource[]
}

export const ROADMAP_DATA: Record<string, TopicContent> = {
  // =========================================
  // LEVEL 1: BASICS
  // =========================================
  'Learn the Basics': {
    sections: [
      {
        heading: 'The Foundation',
        text: 'Solid understanding of software testing fundamentals is crucial.',
      },
    ],
    resources: [
      { type: 'article', title: 'ISTQB Foundation Level', url: 'https://www.istqb.org/' },
    ],
  },
  'What is QA?': {
    sections: [
      {
        heading: 'Quality Assurance',
        text: 'Focuses on improving the software development process and making it efficient.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Quality Assurance',
        url: 'https://en.wikipedia.org/wiki/Quality_assurance',
      },
    ],
  },
  'QA Mindset': {
    sections: [
      {
        heading: 'Thinking Like a Tester',
        text: 'Curiosity, analytical thinking, and anticipating edge cases.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Ministry of Testing: QA Mindset',
        url: 'https://www.ministryoftesting.com/',
      },
    ],
  },
  'Test Oracles': {
    sections: [
      {
        heading: 'Pass or Fail?',
        text: 'A mechanism to determine whether a test has passed or failed.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Oracle',
        url: 'https://en.wikipedia.org/wiki/Test_oracle',
      },
    ],
  },
  'Test Prioritization': {
    sections: [
      { heading: 'Risk-based approach', text: 'Ranking tests based on risk and business impact.' },
    ],
    resources: [
      { type: 'article', title: 'ISTQB: Risk-Based Testing', url: 'https://www.istqb.org/' },
    ],
  },
  'Testing Approaches': {
    sections: [
      {
        heading: 'High-Level Strategies',
        text: 'Deciding between Black, White, or Grey Box testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Software Testing',
        url: 'https://en.wikipedia.org/wiki/Software_testing',
      },
    ],
  },
  'Manage your Testing': {
    sections: [
      {
        heading: 'Test Management',
        text: 'Tools and processes to organize test cases, runs, and results.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Management',
        url: 'https://en.wikipedia.org/wiki/Test_management',
      },
    ],
  },
  'White Box Testing': {
    sections: [
      {
        heading: 'Clear Box Testing',
        text: 'Testing internal structures or workings of an application.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: White-box testing',
        url: 'https://en.wikipedia.org/wiki/White-box_testing',
      },
    ],
  },
  'Black Box Testing': {
    sections: [
      {
        heading: 'Behavioral Testing',
        text: 'Focusing solely on inputs and outputs without knowing internal code.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Black-box testing',
        url: 'https://en.wikipedia.org/wiki/Black-box_testing',
      },
    ],
  },
  'Grey Box Testing': {
    sections: [
      {
        heading: 'The Middle Ground',
        text: 'Testing with partial knowledge of the internal workings.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Gray-box testing',
        url: 'https://en.wikipedia.org/wiki/Gray-box_testing',
      },
    ],
  },
  Attlasian: {
    sections: [{ heading: 'Jira Ecosystem', text: 'Suite of tools for issue tracking.' }],
    resources: [
      {
        type: 'article',
        title: 'Jira Official Docs',
        url: 'https://confluence.atlassian.com/alldoc/atlassian-documentation-32243719.html',
      },
    ],
  },
  Assembla: {
    sections: [
      { heading: 'Project Management', text: 'Version control integrated with task management.' },
    ],
    resources: [
      { type: 'article', title: 'Assembla Official Site', url: 'https://www.assembla.com/' },
    ],
  },
  Youtrack: {
    sections: [
      {
        heading: 'JetBrains Issue Tracker',
        text: 'Agile project management and issue tracking tool.',
      },
    ],
    resources: [
      { type: 'article', title: 'YouTrack Docs', url: 'https://www.jetbrains.com/help/youtrack/' },
    ],
  },
  Trello: {
    sections: [{ heading: 'Kanban Boards', text: 'Visual, card-based project management tool.' }],
    resources: [{ type: 'article', title: 'Trello Guides', url: 'https://trello.com/guide' }],
  },
  qTest: {
    sections: [
      { heading: 'Enterprise Test Management', text: 'Robust test management platform for Agile.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Tricentis qTest Docs',
        url: 'https://documentation.tricentis.com/qtest/',
      },
    ],
  },
  TestRail: {
    sections: [{ heading: 'Test Case Management', text: 'Web-based test case management tool.' }],
    resources: [{ type: 'article', title: 'TestRail Docs', url: 'https://support.testrail.com/' }],
  },
  TestLink: {
    sections: [{ heading: 'Open Source', text: 'Widely used open-source test management tool.' }],
    resources: [
      {
        type: 'article',
        title: 'TestLink GitHub',
        url: 'https://github.com/TestLinkOpenSourceTRMS',
      },
    ],
  },
  Zephyr: {
    sections: [
      {
        heading: 'Jira Native Testing',
        text: 'Test management solution integrated directly into Jira.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'SmartBear Zephyr Docs',
        url: 'https://support.smartbear.com/zephyr/',
      },
    ],
  },

  // =========================================
  // LEVEL 2 & 3: METHODOLOGIES & MANUAL
  // =========================================
  'Testing Techniques': {
    sections: [
      { heading: 'Designing Better Tests', text: 'Techniques to design effective test cases.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Design',
        url: 'https://en.wikipedia.org/wiki/Test_case',
      },
    ],
  },
  'Test Management': {
    sections: [
      { heading: 'Non-functional overview', text: 'Management of specialized testing types.' },
    ],
    resources: [{ type: 'article', title: 'ISTQB Test Management', url: 'https://www.istqb.org/' }],
  },
  'Functional Testing': {
    sections: [
      {
        heading: 'Validating Features',
        text: 'Verifying software against functional requirements.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Functional Testing',
        url: 'https://en.wikipedia.org/wiki/Functional_testing',
      },
    ],
  },
  'SDLC Delivery': {
    sections: [
      {
        heading: 'Software Development Life Cycle',
        text: 'Process used to design, develop, and test software.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: SDLC',
        url: 'https://en.wikipedia.org/wiki/Systems_development_life_cycle',
      },
    ],
  },
  Waterfall: {
    sections: [{ heading: 'Sequential Design', text: 'Linear approach to software development.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Waterfall Model',
        url: 'https://en.wikipedia.org/wiki/Waterfall_model',
      },
    ],
  },
  'V Model': {
    sections: [
      {
        heading: 'Verification and Validation',
        text: 'Extension of Waterfall with parallel testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: V-Model',
        url: 'https://en.wikipedia.org/wiki/V-Model_(software_development)',
      },
    ],
  },
  Spiral: {
    sections: [{ heading: 'Risk-Driven', text: 'Combines iterative prototyping with Waterfall.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Spiral Model',
        url: 'https://en.wikipedia.org/wiki/Spiral_model',
      },
    ],
  },
  Kanban: {
    sections: [
      { heading: 'Visual Workflow', text: 'Agile framework focused on visualizing work.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Kanban',
        url: 'https://en.wikipedia.org/wiki/Kanban_(development)',
      },
    ],
  },
  Scrum: {
    sections: [{ heading: 'Iterative Framework', text: 'Agile framework utilizing Sprints.' }],
    resources: [{ type: 'article', title: 'Scrum Guide', url: 'https://scrumguides.org/' }],
  },
  XP: {
    sections: [
      {
        heading: 'Extreme Programming',
        text: 'Emphasizes pair programming and frequent releases.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Extreme Programming',
        url: 'https://en.wikipedia.org/wiki/Extreme_programming',
      },
    ],
  },
  SAFe: {
    sections: [
      {
        heading: 'Scaled Agile Framework',
        text: 'Scaling agile practices across large enterprises.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'SAFe Official Site',
        url: 'https://www.scaledagileframework.com/',
      },
    ],
  },
  Methodologies: {
    sections: [
      {
        heading: 'Development Workflows',
        text: 'Practices dictating how code is written and verified.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Agile Software Development',
        url: 'https://en.wikipedia.org/wiki/Agile_software_development',
      },
    ],
  },
  TDD: {
    sections: [
      {
        heading: 'Test-Driven Development',
        text: 'Writing tests before the code (Red-Green-Refactor).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: TDD',
        url: 'https://en.wikipedia.org/wiki/Test-driven_development',
      },
    ],
  },
  ATDD: {
    sections: [
      {
        heading: 'Acceptance TDD',
        text: 'Writing acceptance tests collaboratively before development.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: ATDD',
        url: 'https://en.wikipedia.org/wiki/Acceptance_test-driven_development',
      },
    ],
  },
  BDD: {
    sections: [
      {
        heading: 'Behavior-Driven Development',
        text: 'Extension of TDD using natural language (Given/When/Then).',
      },
    ],
    resources: [{ type: 'article', title: 'Cucumber: BDD', url: 'https://cucumber.io/docs/bdd/' }],
  },
  RCA: {
    sections: [{ heading: 'Root Cause Analysis', text: 'Identifying root causes of faults.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Root Cause Analysis',
        url: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
      },
    ],
  },
  'Manual Testing': {
    sections: [{ heading: 'Human Verification', text: 'Manually testing software for defects.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Manual Testing',
        url: 'https://en.wikipedia.org/wiki/Manual_testing',
      },
    ],
  },
  'Test Cases & Scenarios': {
    sections: [{ heading: 'Documentation', text: 'High-level scenarios and detailed test steps.' }],
    resources: [
      {
        type: 'article',
        title: 'Guru99: Test Cases',
        url: 'https://www.guru99.com/test-case.html',
      },
    ],
  },
  Compatibility: {
    sections: [{ heading: 'Cross-Environment', text: 'Testing across browsers, OS, and devices.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: Cross Browser Testing',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing',
      },
    ],
  },
  'Verification & Validation': {
    sections: [
      {
        heading: 'Building the right thing',
        text: 'Checking against specs vs checking against user needs.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Verification and Validation',
        url: 'https://en.wikipedia.org/wiki/Verification_and_validation',
      },
    ],
  },
  'Test Planning': {
    sections: [
      { heading: 'Strategy', text: 'Documenting scope, approach, resources, and schedule.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Plan',
        url: 'https://en.wikipedia.org/wiki/Test_plan',
      },
    ],
  },

  // =========================================
  // FUNCTIONAL / NON-FUNCTIONAL TYPES
  // =========================================
  'Load Testing': {
    sections: [{ heading: 'Expected Traffic', text: 'Behavior under normal load conditions.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Load Testing',
        url: 'https://en.wikipedia.org/wiki/Load_testing',
      },
    ],
  },
  'Performance Testing': {
    sections: [{ heading: 'Speed', text: 'Determining responsiveness and stability.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Software Performance Testing',
        url: 'https://en.wikipedia.org/wiki/Software_performance_testing',
      },
    ],
  },
  'Stress Testing': {
    sections: [{ heading: 'Breaking Point', text: 'Testing beyond normal capacity.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Stress Testing',
        url: 'https://en.wikipedia.org/wiki/Stress_testing_(software)',
      },
    ],
  },
  'Security Testing': {
    sections: [{ heading: 'Vulnerabilities', text: 'Revealing flaws in security mechanisms.' }],
    resources: [{ type: 'article', title: 'OWASP Foundation', url: 'https://owasp.org/' }],
  },
  'Accessibility Testing': {
    sections: [{ heading: 'A11y', text: 'Ensuring usability for people with disabilities.' }],
    resources: [
      { type: 'article', title: 'W3C WAI', url: 'https://www.w3.org/WAI/test-evaluate/' },
    ],
  },
  UAT: {
    sections: [{ heading: 'User Acceptance', text: 'Final phase performed by end-users.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Acceptance Testing',
        url: 'https://en.wikipedia.org/wiki/Acceptance_testing',
      },
    ],
  },
  'Exploratory Testing': {
    sections: [{ heading: 'Unscripted', text: 'Simultaneous learning and test execution.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Exploratory Testing',
        url: 'https://en.wikipedia.org/wiki/Exploratory_testing',
      },
    ],
  },
  'Sanity Testing': {
    sections: [
      { heading: 'Quick Check', text: 'Subset of regression testing after minor changes.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Sanity Testing',
        url: 'https://en.wikipedia.org/wiki/Sanity_testing',
      },
    ],
  },
  'Regression Testing': {
    sections: [{ heading: 'Did we break it?', text: 'Ensuring previous features still work.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Regression Testing',
        url: 'https://en.wikipedia.org/wiki/Regression_testing',
      },
    ],
  },
  'Smoke Testing': {
    sections: [
      { heading: 'Build Verification', text: 'Preliminary checks of critical functions.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Smoke Testing',
        url: 'https://en.wikipedia.org/wiki/Smoke_testing_(software)',
      },
    ],
  },
  'Unit Testing': {
    sections: [{ heading: 'Component level', text: 'Testing individual units of code.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Unit Testing',
        url: 'https://en.wikipedia.org/wiki/Unit_testing',
      },
    ],
  },
  'Integration Testing': {
    sections: [{ heading: 'Connecting pieces', text: 'Testing interaction between modules.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Integration Testing',
        url: 'https://en.wikipedia.org/wiki/Integration_testing',
      },
    ],
  },
  Mocking: {
    sections: [{ heading: 'Simulating Dependencies', text: 'Using mocks/stubs to isolate tests.' }],
    resources: [
      {
        type: 'article',
        title: "Martin Fowler: Mocks Aren't Stubs",
        url: 'https://martinfowler.com/articles/mocksArentStubs.html',
      },
    ],
  },

  // =========================================
  // LEVEL 4: AUTOMATED TESTING
  // =========================================
  'Automated Testing': {
    sections: [
      { heading: 'Code Testing Code', text: 'Using scripts to execute predefined tests.' },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Automation',
        url: 'https://en.wikipedia.org/wiki/Test_automation',
      },
    ],
  },
  'Frontend Automation': {
    sections: [{ heading: 'UI Testing', text: 'Automating interactions with the browser.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: Cross Browser Testing',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing',
      },
    ],
  },
  'Basic Introduction': {
    sections: [{ heading: 'Web Fundamentals', text: 'HTML, CSS, JS, and browser basics.' }],
    resources: [{ type: 'article', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' }],
  },
  'Browser / Dev Tools': {
    sections: [{ heading: 'Inspector', text: 'Crucial for finding elements and debugging.' }],
    resources: [
      {
        type: 'article',
        title: 'Chrome DevTools Docs',
        url: 'https://developer.chrome.com/docs/devtools/',
      },
    ],
  },
  'HTML, CSS, JavaScript': {
    sections: [{ heading: 'The Triad', text: 'Building blocks of the web.' }],
    resources: [{ type: 'article', title: 'W3Schools', url: 'https://www.w3schools.com/' }],
  },
  Ajax: {
    sections: [{ heading: 'Async JS', text: 'Sending data asynchronously.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: Ajax',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX',
      },
    ],
  },
  Caching: {
    sections: [{ heading: 'Storage', text: 'Browser caching and local storage.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: HTTP Caching',
        url: 'https://developer.mozilla.org/en-US/docs/Web/HTTP/Caching',
      },
    ],
  },
  'SWAs, PWAs, JAMStack': {
    sections: [{ heading: 'Architectures', text: 'Modern app architectures.' }],
    resources: [{ type: 'article', title: 'Jamstack.org', url: 'https://jamstack.org/' }],
  },
  'CSR vs SSR': {
    sections: [{ heading: 'Rendering', text: 'Client vs Server Side Rendering.' }],
    resources: [
      {
        type: 'article',
        title: 'Next.js Rendering Docs',
        url: 'https://nextjs.org/docs/app/building-your-application/rendering',
      },
    ],
  },
  'Responsive vs Adaptive': {
    sections: [{ heading: 'Layouts', text: 'Fluid layouts vs static breakpoints.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: Responsive Design',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
      },
    ],
  },
  'Automation Frameworks': {
    sections: [{ heading: 'UI Test Runners', text: 'Libraries to drive the browser.' }],
    resources: [{ type: 'article', title: 'State of JS: Testing', url: 'https://stateofjs.com/' }],
  },
  'Webdriver.io': {
    sections: [{ heading: 'JS Framework', text: 'Browser and mobile automation for Node.' }],
    resources: [{ type: 'article', title: 'WebdriverIO Docs', url: 'https://webdriver.io/' }],
  },
  Playwright: {
    sections: [{ heading: 'Modern & Fast', text: 'Reliable E2E testing from Microsoft.' }],
    resources: [{ type: 'article', title: 'Playwright Docs', url: 'https://playwright.dev/' }],
  },
  Jasmine: {
    sections: [{ heading: 'BDD', text: 'Behavior-driven JS framework.' }],
    resources: [{ type: 'article', title: 'Jasmine Docs', url: 'https://jasmine.github.io/' }],
  },
  'QA Wolf': {
    sections: [{ heading: 'QA as a Service', text: 'Creates and maintains E2E tests.' }],
    resources: [{ type: 'article', title: 'QA Wolf Website', url: 'https://www.qawolf.com/' }],
  },
  Robot: {
    sections: [{ heading: 'Keyword-Driven', text: 'Tabular syntax automation framework.' }],
    resources: [
      { type: 'article', title: 'Robot Framework Docs', url: 'https://robotframework.org/' },
    ],
  },
  Selenium: {
    sections: [{ heading: 'Industry Standard', text: 'Automating web browsers via WebDriver.' }],
    resources: [
      { type: 'article', title: 'Selenium Docs', url: 'https://www.selenium.dev/documentation/' },
    ],
  },
  'Browser Addons': {
    sections: [{ heading: 'Extensions', text: 'Record and playback tools.' }],
    resources: [
      { type: 'article', title: 'Chrome Web Store', url: 'https://chrome.google.com/webstore' },
    ],
  },
  'Selenium IDE': {
    sections: [{ heading: 'Record/Playback', text: 'Browser extension for Selenium scripts.' }],
    resources: [
      {
        type: 'article',
        title: 'Selenium IDE Docs',
        url: 'https://www.selenium.dev/selenium-ide/',
      },
    ],
  },
  BugBug: {
    sections: [{ heading: 'Low-code', text: 'Modern alternative to Selenium IDE.' }],
    resources: [{ type: 'article', title: 'BugBug Website', url: 'https://bugbug.io/' }],
  },
  'Ghost Inspector': {
    sections: [{ heading: 'Cloud Testing', text: 'Automated UI monitoring tool.' }],
    resources: [
      { type: 'article', title: 'Ghost Inspector Docs', url: 'https://ghostinspector.com/docs/' },
    ],
  },
  'Backend Automation': {
    sections: [{ heading: 'API Testing', text: 'Testing APIs bypassing the UI.' }],
    resources: [
      {
        type: 'article',
        title: 'Postman API Learning Center',
        url: 'https://learning.postman.com/',
      },
    ],
  },
  Karateframework: {
    sections: [{ heading: 'Unified API Tests', text: 'API, mocks, and UI automation in BDD.' }],
    resources: [
      { type: 'article', title: 'Karate GitHub', url: 'https://github.com/karatelabs/karate' },
    ],
  },
  Cypress: {
    sections: [{ heading: 'Developer UI/API Testing', text: 'Runs directly in the browser.' }],
    resources: [{ type: 'article', title: 'Cypress Docs', url: 'https://docs.cypress.io/' }],
  },
  'Soap UI': {
    sections: [{ heading: 'Enterprise API', text: 'Testing SOAP and REST services.' }],
    resources: [{ type: 'article', title: 'SoapUI Docs', url: 'https://www.soapui.org/docs/' }],
  },
  'Postman / Newman': {
    sections: [{ heading: 'API Platform', text: 'API client and CLI runner.' }],
    resources: [
      { type: 'article', title: 'Newman GitHub', url: 'https://github.com/postmanlabs/newman' },
    ],
  },
  'REST Assured': {
    sections: [{ heading: 'Java API', text: 'Java DSL for testing REST services.' }],
    resources: [{ type: 'article', title: 'REST Assured Docs', url: 'https://rest-assured.io/' }],
  },
  'Mobile Automation': {
    sections: [{ heading: 'Native Apps', text: 'Testing iOS and Android apps.' }],
    resources: [
      {
        type: 'article',
        title: 'Appium Introduction',
        url: 'https://appium.io/docs/en/about-appium/intro/',
      },
    ],
  },
  Espresso: {
    sections: [{ heading: 'Android Native', text: 'UI testing framework by Google.' }],
    resources: [
      {
        type: 'article',
        title: 'Android Espresso Docs',
        url: 'https://developer.android.com/training/testing/espresso',
      },
    ],
  },
  Detox: {
    sections: [
      { heading: 'Gray Box Mobile', text: 'End-to-end framework for React Native/Mobile.' },
    ],
    resources: [{ type: 'article', title: 'Detox Docs', url: 'https://wix.github.io/Detox/' }],
  },
  Appium: {
    sections: [{ heading: 'Cross-Platform', text: 'Drives iOS/Android using WebDriver.' }],
    resources: [{ type: 'article', title: 'Appium Docs', url: 'https://appium.io/' }],
  },
  SwiftTesting: {
    sections: [{ heading: 'iOS Native', text: 'Apple’s frameworks for testing.' }],
    resources: [
      {
        type: 'article',
        title: 'Apple XCTest Docs',
        url: 'https://developer.apple.com/documentation/xctest',
      },
    ],
  },

  // =========================================
  // LEVEL 5: NON-FUNCTIONAL
  // =========================================
  'Non-Functional': {
    sections: [{ heading: 'Testing the How', text: 'Performance, security, usability.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Non-functional requirement',
        url: 'https://en.wikipedia.org/wiki/Non-functional_requirement',
      },
    ],
  },
  Accessibility: {
    sections: [{ heading: 'A11y Tools', text: 'Automated accessibility scanners.' }],
    resources: [{ type: 'article', title: 'W3C WAI', url: 'https://www.w3.org/WAI/' }],
  },
  Wave: {
    sections: [{ heading: 'A11y Evaluation', text: 'Helps evaluate web content accessibility.' }],
    resources: [{ type: 'article', title: 'WAVE Tool', url: 'https://wave.webaim.org/' }],
  },
  Axe: {
    sections: [{ heading: 'Axe Engine', text: 'Accessibility testing engine by Deque.' }],
    resources: [
      { type: 'article', title: 'Axe Core GitHub', url: 'https://github.com/dequelabs/axe-core' },
    ],
  },
  'Chrome DevTools': {
    sections: [{ heading: 'Lighthouse Audits', text: 'Built-in a11y checking in Chrome.' }],
    resources: [
      {
        type: 'article',
        title: 'Chrome DevTools Lighthouse',
        url: 'https://developer.chrome.com/docs/lighthouse/overview/',
      },
    ],
  },
  'Load & Performance': {
    sections: [{ heading: 'Stress & Load Tools', text: 'Generating traffic against services.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Load Testing',
        url: 'https://en.wikipedia.org/wiki/Load_testing',
      },
    ],
  },
  Lighthouse: {
    sections: [{ heading: 'Google Audit', text: 'Frontend performance and best practices.' }],
    resources: [
      {
        type: 'article',
        title: 'Lighthouse Docs',
        url: 'https://developer.chrome.com/docs/lighthouse/overview/',
      },
    ],
  },
  Locust: {
    sections: [{ heading: 'Python Load', text: 'Scalable performance testing tool in Python.' }],
    resources: [{ type: 'article', title: 'Locust Docs', url: 'https://locust.io/' }],
  },
  Webpagetest: {
    sections: [{ heading: 'Frontend Metrics', text: 'Detailed waterfall charts and core vitals.' }],
    resources: [{ type: 'article', title: 'WebPageTest', url: 'https://www.webpagetest.org/' }],
  },
  ' Gatling': {
    sections: [{ heading: 'Scala-based', text: 'High performance load testing.' }],
    resources: [{ type: 'article', title: 'Gatling Docs', url: 'https://gatling.io/docs/' }],
  },
  ' K6': {
    sections: [{ heading: 'Modern Load', text: 'JS scripts on a Go engine by Grafana.' }],
    resources: [{ type: 'article', title: 'K6 Docs', url: 'https://k6.io/docs/' }],
  },
  Artillery: {
    sections: [{ heading: 'Cloud-Native', text: 'YAML/JS-based load testing toolkit.' }],
    resources: [{ type: 'article', title: 'Artillery Docs', url: 'https://www.artillery.io/docs' }],
  },
  Vegeta: {
    sections: [{ heading: 'HTTP Drill', text: 'HTTP load testing tool.' }],
    resources: [
      { type: 'article', title: 'Vegeta GitHub', url: 'https://github.com/tsenart/vegeta' },
    ],
  },
  JMeter: {
    sections: [{ heading: 'Apache Legacy', text: 'Java application for load testing.' }],
    resources: [{ type: 'article', title: 'Apache JMeter', url: 'https://jmeter.apache.org/' }],
  },
  'Security Testing': {
    sections: [{ heading: 'Securing Apps', text: 'Tools and concepts for infosec in QA.' }],
    resources: [{ type: 'article', title: 'OWASP Foundation', url: 'https://owasp.org/' }],
  },
  'Authentication / Authorization': {
    sections: [{ heading: 'Identity', text: 'Proving identity vs checking permissions.' }],
    resources: [
      {
        type: 'article',
        title: 'OWASP Authentication Cheat Sheet',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
      },
    ],
  },
  'Secrets Management': {
    sections: [{ heading: 'Protecting Keys', text: 'Never hardcode passwords.' }],
    resources: [
      {
        type: 'article',
        title: 'OWASP Secrets Management',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
      },
    ],
  },
  'Vulnerability Scanning': {
    sections: [{ heading: 'Automated Checks', text: 'Scanning dependencies (SAST/DAST).' }],
    resources: [{ type: 'article', title: 'Snyk Open Source', url: 'https://snyk.io/' }],
  },
  'OWASP 10': {
    sections: [{ heading: 'Top 10 Risks', text: 'The most critical security risks to web apps.' }],
    resources: [
      { type: 'article', title: 'OWASP Top Ten', url: 'https://owasp.org/www-project-top-ten/' },
    ],
  },
  'Attack Vectors': {
    sections: [{ heading: 'Intrusion paths', text: 'XSS, CSRF, SQLi etc.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Attack Vector',
        url: 'https://en.wikipedia.org/wiki/Attack_vector',
      },
    ],
  },
  'Email Testing': {
    sections: [{ heading: 'Transactional Emails', text: 'Testing email delivery and content.' }],
    resources: [{ type: 'article', title: 'Mailtrap Email Testing', url: 'https://mailtrap.io/' }],
  },
  Mailinator: {
    sections: [{ heading: 'Disposable Inbox', text: 'Public email system for QA.' }],
    resources: [{ type: 'article', title: 'Mailinator Docs', url: 'https://www.mailinator.com/' }],
  },
  GmailTester: {
    sections: [{ heading: 'API Validation', text: 'Interacting with Gmail API for tests.' }],
    resources: [
      {
        type: 'article',
        title: 'Gmail-Tester GitHub',
        url: 'https://github.com/levinunnink/gmail-tester',
      },
    ],
  },
  'Testing Data Management': {
    sections: [{ heading: 'TDM Strategy', text: 'Creating and masking test data.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Data',
        url: 'https://en.wikipedia.org/wiki/Test_data',
      },
    ],
  },
  Delphix: {
    sections: [{ heading: 'Data Virtualization', text: 'Provisioning masked data for testing.' }],
    resources: [{ type: 'article', title: 'Delphix Docs', url: 'https://www.delphix.com/' }],
  },
  Reporting: {
    sections: [{ heading: 'Metrics', text: 'Generating insights from test runs.' }],
    resources: [{ type: 'article', title: 'Allure Framework', url: 'https://qameta.io/' }],
  },
  Allure: {
    sections: [{ heading: 'Visual Reports', text: 'Multi-language test report tool.' }],
    resources: [{ type: 'article', title: 'Allure Docs', url: 'https://allurereport.org/docs/' }],
  },
  jUnit: {
    sections: [{ heading: 'XML Format', text: 'Industry standard report format.' }],
    resources: [
      {
        type: 'article',
        title: 'JUnit 5 Docs',
        url: 'https://junit.org/junit5/docs/current/user-guide/',
      },
    ],
  },
  'Monitoring & Logs': {
    sections: [{ heading: 'Observability', text: 'Tracing bugs in production/staging.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Observability',
        url: 'https://en.wikipedia.org/wiki/Observability_(software)',
      },
    ],
  },
  'New Relic': {
    sections: [{ heading: 'APM', text: 'Application Performance Monitoring.' }],
    resources: [{ type: 'article', title: 'New Relic Docs', url: 'https://docs.newrelic.com/' }],
  },
  Runscope: {
    sections: [{ heading: 'API Monitoring', text: 'Continuous API testing.' }],
    resources: [
      {
        type: 'article',
        title: 'BlazeMeter (Runscope) Docs',
        url: 'https://guide.blazemeter.com/',
      },
    ],
  },
  Kibana: {
    sections: [{ heading: 'Log Viz', text: 'Visualizing Elasticsearch data.' }],
    resources: [
      {
        type: 'article',
        title: 'Elastic Kibana Docs',
        url: 'https://www.elastic.co/guide/en/kibana/current/index.html',
      },
    ],
  },
  Datadog: {
    sections: [{ heading: 'Cloud Monitoring', text: 'Observability service for cloud apps.' }],
    resources: [{ type: 'article', title: 'Datadog Docs', url: 'https://docs.datadoghq.com/' }],
  },
  'Pager Duty': {
    sections: [{ heading: 'Incident Response', text: 'Alerts and on-call scheduling.' }],
    resources: [
      { type: 'article', title: 'PagerDuty Docs', url: 'https://support.pagerduty.com/' },
    ],
  },
  Grafana: {
    sections: [{ heading: 'Dashboards', text: 'Analytics and interactive visualization.' }],
    resources: [{ type: 'article', title: 'Grafana Docs', url: 'https://grafana.com/docs/' }],
  },
  Sentry: {
    sections: [{ heading: 'Error Tracking', text: 'Capturing unhandled exceptions.' }],
    resources: [{ type: 'article', title: 'Sentry Docs', url: 'https://docs.sentry.io/' }],
  },

  // =========================================
  // LEVEL 6: INFRASTRUCTURE & CI/CD
  // =========================================
  'Version Control': {
    sections: [{ heading: 'VCS', text: 'Managing changes to computer programs.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Version Control',
        url: 'https://en.wikipedia.org/wiki/Version_control',
      },
    ],
  },
  Git: {
    sections: [{ heading: 'Distributed VCS', text: 'Industry standard version control.' }],
    resources: [{ type: 'article', title: 'Git Official Docs', url: 'https://git-scm.com/doc' }],
  },
  'Repo Hosting': {
    sections: [{ heading: 'Code Collaboration', text: 'Cloud-based Git hosting.' }],
    resources: [
      {
        type: 'article',
        title: 'GitHub vs GitLab vs Bitbucket',
        url: 'https://www.atlassian.com/git/tutorials/comparing-workflows',
      },
    ],
  },
  GitHub: {
    sections: [{ heading: 'Microsoft Owned', text: 'Largest code hosting platform.' }],
    resources: [{ type: 'article', title: 'GitHub Docs', url: 'https://docs.github.com/' }],
  },
  GitLab: {
    sections: [{ heading: 'DevOps Platform', text: 'Git-repository manager with built-in CI/CD.' }],
    resources: [{ type: 'article', title: 'GitLab Docs', url: 'https://docs.gitlab.com/' }],
  },
  Bitbucket: {
    sections: [{ heading: 'Atlassian Ecosystem', text: 'Git hosting integrated with Jira.' }],
    resources: [
      {
        type: 'article',
        title: 'Bitbucket Docs',
        url: 'https://support.atlassian.com/bitbucket-cloud/',
      },
    ],
  },
  'CI/CD': {
    sections: [{ heading: 'Pipelines', text: 'Continuous Integration / Continuous Deployment.' }],
    resources: [
      { type: 'article', title: 'Wikipedia: CI/CD', url: 'https://en.wikipedia.org/wiki/CI/CD' },
    ],
  },
  Jenkins: {
    sections: [{ heading: 'Open Source Server', text: 'Highly customizable automation server.' }],
    resources: [{ type: 'article', title: 'Jenkins Docs', url: 'https://www.jenkins.io/doc/' }],
  },
  'GitLab CI': {
    sections: [{ heading: 'Built-in Pipeline', text: 'Managed via .gitlab-ci.yml.' }],
    resources: [
      { type: 'article', title: 'GitLab CI/CD Docs', url: 'https://docs.gitlab.com/ee/ci/' },
    ],
  },
  'Circle CI': {
    sections: [{ heading: 'Cloud CI', text: 'Rapid release automation.' }],
    resources: [{ type: 'article', title: 'CircleCI Docs', url: 'https://circleci.com/docs/' }],
  },
  Drone: {
    sections: [{ heading: 'Container-Native', text: 'Docker-based Pipelines.' }],
    resources: [{ type: 'article', title: 'Drone CI Docs', url: 'https://docs.drone.io/' }],
  },
  Bamboo: {
    sections: [{ heading: 'Atlassian CI', text: 'CI/CD tied to Jira/Bitbucket.' }],
    resources: [
      { type: 'article', title: 'Bamboo Docs', url: 'https://confluence.atlassian.com/bamboo' },
    ],
  },
  'Travis CI': {
    sections: [{ heading: 'Hosted CI', text: 'Pioneer of cloud CI.' }],
    resources: [{ type: 'article', title: 'Travis CI Docs', url: 'https://docs.travis-ci.com/' }],
  },
  TeamCity: {
    sections: [{ heading: 'JetBrains CI/CD', text: 'Commercial CI server.' }],
    resources: [
      { type: 'article', title: 'TeamCity Docs', url: 'https://www.jetbrains.com/teamcity/learn/' },
    ],
  },
  'Azure DevOps Services': {
    sections: [{ heading: 'Microsoft DevOps', text: 'Full lifecycle management.' }],
    resources: [
      {
        type: 'article',
        title: 'Azure DevOps Docs',
        url: 'https://learn.microsoft.com/en-us/azure/devops/',
      },
    ],
  },

  // =========================================
  // LEVEL 7: HEADLESS & BROWSER TECH
  // =========================================
  'Headless Testing': {
    sections: [{ heading: 'Invisible Browsers', text: 'Running tests without a GUI for speed.' }],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Headless Browser',
        url: 'https://en.wikipedia.org/wiki/Headless_browser',
      },
    ],
  },
  Puppeteer: {
    sections: [{ heading: 'Chrome Node API', text: 'Controls Chrome over DevTools Protocol.' }],
    resources: [{ type: 'article', title: 'Puppeteer Docs', url: 'https://pptr.dev/' }],
  },
  'Zombie.js': {
    sections: [{ heading: 'Simulated Env', text: 'Testing client-side JS without a browser.' }],
    resources: [{ type: 'article', title: 'Zombie.js Docs', url: 'https://zombie.js.org/' }],
  },
  'Headless Chrome': {
    sections: [{ heading: 'Chrome via CLI', text: 'Running Chrome without a UI.' }],
    resources: [
      {
        type: 'article',
        title: 'Chrome DevTools Headless',
        url: 'https://developer.chrome.com/docs/chromium/new-headless',
      },
    ],
  },
  'Headless Fox': {
    sections: [{ heading: 'Firefox Headless', text: 'Mozilla implementation.' }],
    resources: [
      {
        type: 'article',
        title: 'MDN: Headless Firefox',
        url: 'https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode',
      },
    ],
  },
  'HTML Unit': {
    sections: [{ heading: 'Java GUI-Less', text: 'Models HTML documents for Java programs.' }],
    resources: [
      { type: 'article', title: 'HtmlUnit Docs', url: 'https://htmlunit.sourceforge.io/' },
    ],
  },
}
