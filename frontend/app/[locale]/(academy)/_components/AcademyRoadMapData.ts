export type Resource = {
  type: 'article' | 'video' | 'feed' | 'prompt'
  title: string
  url?: string
  payload?: string
}

export type TopicSection = {
  heading: string
  text: string
}

export type TopicContent = {
  sections: TopicSection[]
  resources: Resource[]
}

export const generatePrompt = (
  topic: string
) => `Act as a Senior QA Architect with 15 years of experience. I want you to give me a deep dive into "${topic}".
Please structure your response with:
1. A clear, real-world analogy to explain the concept.
2. The core business value (Why do we care?).
3. 2-3 real-world examples or use cases in a modern tech stack.
4. Common pitfalls, anti-patterns, and how to avoid them.
5. How this concept fits into a modern CI/CD DevOps pipeline.`

export const ROADMAP_DATA: Record<string, TopicContent> = {
  // =========================================
  // LEVEL 1: BASICS
  // =========================================
  'Learn the Basics': {
    sections: [
      {
        heading: 'The Foundation',
        text: 'Before diving into complex automation frameworks, a solid understanding of software testing fundamentals is crucial. This includes knowing why we test, how the web works, and basic testing terminology. Skipping the basics leads to flaky tests and poor architectural decisions later on.',
      },
    ],
    resources: [
      { type: 'article', title: 'ISTQB Foundation Level Syllabus', url: 'https://www.istqb.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Software Testing Fundamentals',
        payload: generatePrompt('Software Testing Fundamentals & Core Principles'),
      },
    ],
  },
  'What is QA?': {
    sections: [
      {
        heading: 'What is Quality',
        text: 'Quality is extremely hard to define, and it is simply stated: “Fit for use or purpose.” It is all about meeting the needs and expectations of customers concerning the functionality, design, reliability, durability, & price of the product.',
      },
      {
        heading: 'Quality Assurance in Software Testing',
        text: 'Quality Assurance is defined as a procedure to ensure the quality of software products or services provided to the customers. QA focuses on improving the software development process and making it efficient and effective.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Quality Assurance',
        url: 'https://en.wikipedia.org/wiki/Quality_assurance',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: QA vs QC',
        payload: generatePrompt(
          'Difference between Quality Assurance, Quality Control, and Testing'
        ),
      },
    ],
  },
  'QA Mindset': {
    sections: [
      {
        heading: 'Thinking Like a Tester',
        text: 'A good tester is curious, analytical, and assumes the software has bugs until proven otherwise. It’s about asking "What if?" and thinking about edge cases, destructive scenarios, and user frustrations, not just the happy path.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Ministry of Testing: The QA Mindset',
        url: 'https://www.ministryoftesting.com/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: The QA Mindset',
        payload: generatePrompt('The mindset and psychology of a world-class QA Engineer'),
      },
    ],
  },
  'Test Oracles': {
    sections: [
      {
        heading: 'How do we know it passed?',
        text: 'A test oracle is a mechanism or principle used to determine whether a test has passed or failed. It can be a specification document, an existing system, heuristics, or even human intuition.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Oracle',
        url: 'https://en.wikipedia.org/wiki/Test_oracle',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Oracles',
        payload: generatePrompt('Test Oracles and Heuristics in Software Testing'),
      },
    ],
  },
  'Test Prioritization': {
    sections: [
      {
        heading: 'Testing the right things first',
        text: 'You cannot test everything. Test prioritization involves ranking tests based on risk, business impact, user volume, and frequency of use to ensure critical paths are verified early and often.',
      },
    ],
    resources: [
      { type: 'article', title: 'ISTQB: Risk-Based Testing', url: 'https://www.istqb.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Risk-Based Testing',
        payload: generatePrompt('Risk-Based Testing and Test Prioritization Strategies'),
      },
    ],
  },
  'Testing Approaches': {
    sections: [
      {
        heading: 'High-Level Strategies',
        text: 'Testing approaches dictate how testing is carried out. The decision between Black Box, White Box, or Grey Box testing depends on the access to code, required skill sets, and the specific goal of the test phase.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Software Testing Approaches',
        url: 'https://en.wikipedia.org/wiki/Software_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Testing Approaches',
        payload: generatePrompt('Strategic approaches to Software Testing'),
      },
    ],
  },
  'White Box Testing': {
    sections: [
      {
        heading: 'Clear Box Testing',
        text: 'Testing the internal structure or workings of an application. It requires programming skills and understanding of the code. Usually performed by developers (e.g., Unit Testing, Code Coverage analysis).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: White-box testing',
        url: 'https://en.wikipedia.org/wiki/White-box_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: White Box Testing',
        payload: generatePrompt('White Box Testing techniques and code coverage metrics'),
      },
    ],
  },
  'Black Box Testing': {
    sections: [
      {
        heading: 'Behavioral Testing',
        text: 'Testing the functionality of an application without peering into its internal structures. The tester focuses solely on inputs and outputs, acting exactly as a real user would.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Black-box testing',
        url: 'https://en.wikipedia.org/wiki/Black-box_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Black Box Testing',
        payload: generatePrompt(
          'Black Box Testing techniques (Boundary Value, Equivalence Partitioning)'
        ),
      },
    ],
  },
  'Grey Box Testing': {
    sections: [
      {
        heading: 'The Middle Ground',
        text: 'A combination of White Box and Black Box Testing. The tester has partial knowledge of the internal workings (e.g., database structure, API specs) and uses it to design better, highly targeted test cases.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Gray-box testing',
        url: 'https://en.wikipedia.org/wiki/Gray-box_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Grey Box Testing',
        payload: generatePrompt('Grey Box Testing in modern microservices architectures'),
      },
    ],
  },
  'Manage your Testing': {
    sections: [
      {
        heading: 'Keeping Chaos at Bay',
        text: 'Without proper management, testing becomes chaotic. Managing tests involves writing clear cases, tracking execution history, linking defects to requirements, and generating metrics for stakeholders.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Management',
        url: 'https://en.wikipedia.org/wiki/Test_management',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Management',
        payload: generatePrompt('Modern Test Management and Quality Metrics tracking'),
      },
    ],
  },
  Atlassian: {
    sections: [
      {
        heading: 'Jira Ecosystem',
        text: 'A leading suite of tools for issue tracking and agile project management. Often extended with plugins like Zephyr or Xray for comprehensive test case management.',
      },
    ],
    resources: [
      { type: 'article', title: 'Jira Official Docs', url: 'https://confluence.atlassian.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: QA in Jira',
        payload: generatePrompt('Optimizing Jira workflows for QA and Test Management'),
      },
    ],
  },
  Assembla: {
    sections: [
      {
        heading: 'Project Management',
        text: 'A platform offering version control (Git, SVN) integrated with task management and ticketing, used by enterprise teams for tracking software delivery.',
      },
    ],
    resources: [
      { type: 'article', title: 'Assembla Documentation', url: 'https://articles.assembla.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Assembla in DevOps',
        payload: generatePrompt('Using Assembla for version control and issue tracking in QA'),
      },
    ],
  },
  YouTrack: {
    sections: [
      {
        heading: 'JetBrains Issue Tracker',
        text: 'An agile project management and issue tracking tool created by JetBrains. Highly customizable and very popular among developer-centric teams.',
      },
    ],
    resources: [
      { type: 'article', title: 'YouTrack Docs', url: 'https://www.jetbrains.com/help/youtrack/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: YouTrack for QA',
        payload: generatePrompt('Configuring YouTrack for Agile QA workflows'),
      },
    ],
  },
  Trello: {
    sections: [
      {
        heading: 'Kanban Boards',
        text: 'A highly visual, card-based project management tool. Great for simple task tracking and lightweight workflows, but lacks native, robust test case management features.',
      },
    ],
    resources: [
      { type: 'article', title: 'Trello Guides', url: 'https://trello.com/guide' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Trello for Testing',
        payload: generatePrompt(
          'Managing lightweight QA testing cycles using Trello Kanban boards'
        ),
      },
    ],
  },
  qTest: {
    sections: [
      {
        heading: 'Enterprise Test Management',
        text: 'A robust test management platform designed for Agile and DevOps teams, offering deep integration with Jira and a wide array of automation tools.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Tricentis qTest Docs',
        url: 'https://documentation.tricentis.com/qtest/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: qTest Integration',
        payload: generatePrompt('Integrating Tricentis qTest into an Agile DevOps lifecycle'),
      },
    ],
  },
  TestRail: {
    sections: [
      {
        heading: 'Comprehensive Test Management',
        text: 'One of the most popular web-based test case management tools. It offers excellent reporting, metrics, and a powerful API for integrating automated test results.',
      },
    ],
    resources: [
      { type: 'article', title: 'TestRail Docs', url: 'https://support.testrail.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: TestRail API',
        payload: generatePrompt('Automating test result reporting into TestRail using its API'),
      },
    ],
  },
  TestLink: {
    sections: [
      {
        heading: 'Open Source',
        text: 'A widely used open-source test management tool. It handles test plans, cases, and execution. While powerful, its UI is often considered dated compared to SaaS alternatives.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'TestLink GitHub',
        url: 'https://github.com/TestLinkOpenSourceTRMS',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: TestLink Usage',
        payload: generatePrompt('Managing legacy open-source test cases with TestLink'),
      },
    ],
  },
  Zephyr: {
    sections: [
      {
        heading: 'Jira Native Testing',
        text: 'A test management solution that integrates directly into Jira, allowing teams to manage tests, executions, and bugs within a single, familiar interface.',
      },
    ],
    resources: [
      { type: 'article', title: 'Zephyr Docs', url: 'https://support.smartbear.com/zephyr/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Zephyr Scale',
        payload: generatePrompt('Best practices for using Zephyr Scale inside Jira for QA'),
      },
    ],
  },

  // =========================================
  // METHODOLOGIES & MANUAL TESTING
  // =========================================
  'Testing Techniques': {
    sections: [
      {
        heading: 'Designing Better Tests',
        text: 'Test techniques are standard methods for designing test cases. Good techniques reduce the total number of tests needed while maximizing the probability of finding defects.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Software test design',
        url: 'https://en.wikipedia.org/wiki/Software_testing#Testing_techniques',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Design Techniques',
        payload: generatePrompt(
          'Software Test Design Techniques (Equivalence, Boundary, Pairwise)'
        ),
      },
    ],
  },
  'Test Management': {
    sections: [
      {
        heading: 'Orchestrating Quality',
        text: 'The practice of organizing and controlling the testing process. It includes planning, monitoring, and controlling testing activities, as well as managing environments and data.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Management',
        url: 'https://en.wikipedia.org/wiki/Test_management',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Orchestrating QA',
        payload: generatePrompt('Test Management and Quality Metrics tracking for large teams'),
      },
    ],
  },
  'Functional Testing': {
    sections: [
      {
        heading: 'Does it work?',
        text: 'Testing to ensure the software application functions according to the provided requirements. It involves providing appropriate input, verifying output, and comparing actual results with expected results.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Functional Testing',
        url: 'https://en.wikipedia.org/wiki/Functional_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Functional Testing',
        payload: generatePrompt('Functional Testing strategies in modern web development'),
      },
    ],
  },
  'SDLC Delivery': {
    sections: [
      {
        heading: 'Software Development Life Cycle',
        text: 'The Software Development Life Cycle (SDLC) is a process followed for a software project, within a software organization. It consists of a detailed plan describing how to develop, maintain, replace and alter or enhance specific software.',
      },
      {
        heading: 'The Importance of Structure',
        text: 'Without a structured SDLC, teams face scope creep, missed deadlines, and severe quality issues. The life cycle defines a methodology for improving the quality of software and the overall development process.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: SDLC',
        url: 'https://en.wikipedia.org/wiki/Systems_development_life_cycle',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Master SDLC',
        payload: generatePrompt('Software Development Life Cycle in a modern QA context'),
      },
    ],
  },
  Waterfall: {
    sections: [
      {
        heading: 'Sequential Design Process',
        text: 'A linear, sequential approach to software development. Testing happens entirely at the end of the cycle. It is rigid, making it difficult to adapt to changes discovered late in the process.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Waterfall Model',
        url: 'https://en.wikipedia.org/wiki/Waterfall_model',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Waterfall flaws',
        payload: generatePrompt('The Waterfall methodology and why it fails in modern DevOps'),
      },
    ],
  },
  'V Model': {
    sections: [
      {
        heading: 'Verification and Validation',
        text: 'An extension of the Waterfall model where testing is planned in parallel with a corresponding phase of development. For every dev phase, there is a distinct testing phase.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: V-Model',
        url: 'https://en.wikipedia.org/wiki/V-Model_(software_development)',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: V-Model testing',
        payload: generatePrompt('The V-Model in software engineering and its impact on QA'),
      },
    ],
  },
  Spiral: {
    sections: [
      {
        heading: 'Risk-Driven Approach',
        text: 'Combines the iterative nature of prototyping with the systematic aspects of Waterfall. It is highly focused on risk analysis and is mostly used for large, complex projects.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Spiral Model',
        url: 'https://en.wikipedia.org/wiki/Spiral_model',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Spiral Model',
        payload: generatePrompt(
          'Risk-driven Spiral methodology in enterprise software development'
        ),
      },
    ],
  },
  Kanban: {
    sections: [
      {
        heading: 'Visual Workflow',
        text: 'An agile framework focused on visualizing work, limiting work-in-progress (WIP), and maximizing efficiency. It ensures a continuous flow of tasks without time-boxed iterations.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Kanban',
        url: 'https://en.wikipedia.org/wiki/Kanban_(development)',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Kanban in QA',
        payload: generatePrompt('Using Kanban methodology for QA and Testing teams'),
      },
    ],
  },
  Scrum: {
    sections: [
      {
        heading: 'Iterative Agile Framework',
        text: 'The agile model refers to a software development approach based on iterative development. Agile methods break tasks into smaller iterations (Sprints) that do not directly involve long-term planning.',
      },
      {
        heading: 'Agile Value',
        text: 'The Agile software development methodology is one of the simplest and most effective processes to turn a vision for a business need into software solutions, emphasizing daily collaboration and adaptability.',
      },
    ],
    resources: [
      { type: 'article', title: 'Scrum Guide', url: 'https://scrumguides.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Agile & Scrum for QA',
        payload: generatePrompt('Agile and Scrum methodologies from a QA perspective'),
      },
    ],
  },
  XP: {
    sections: [
      {
        heading: 'Extreme Programming',
        text: 'An agile methodology intended to improve software quality and responsiveness to changing customer requirements. Emphasizes pair programming, extensive code review, and Test-Driven Development.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Extreme Programming',
        url: 'https://en.wikipedia.org/wiki/Extreme_programming',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: XP in QA',
        payload: generatePrompt('Extreme Programming (XP) and its impact on Software Quality'),
      },
    ],
  },
  SAFe: {
    sections: [
      {
        heading: 'Scaled Agile Framework',
        text: 'A set of organization and workflow patterns intended to guide enterprises in scaling lean and agile practices across dozens of teams and hundreds of developers.',
      },
    ],
    resources: [
      { type: 'article', title: 'SAFe Framework', url: 'https://www.scaledagileframework.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: SAFe for QA Leaders',
        payload: generatePrompt('Scaled Agile Framework (SAFe) for QA Architects and Leaders'),
      },
    ],
  },
  Methodologies: {
    sections: [
      {
        heading: 'Development Workflows',
        text: 'Specific practices and frameworks that dictate how code is written and verified. Selecting the right methodology dictates how early QA is involved in the pipeline.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Software development process',
        url: 'https://en.wikipedia.org/wiki/Software_development_process',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Shift-Left Testing',
        payload: generatePrompt('Shift-Left Testing and embedding QA into modern methodologies'),
      },
    ],
  },
  TDD: {
    sections: [
      {
        heading: 'Test-Driven Development',
        text: 'A process relying on a short cycle: write a failing test, write the minimum code to pass it, then refactor (Red-Green-Refactor). It ensures high code coverage and modular design.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: TDD',
        url: 'https://en.wikipedia.org/wiki/Test-driven_development',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: TDD Explained',
        payload: generatePrompt(
          'Test-Driven Development (TDD) principles and common anti-patterns'
        ),
      },
    ],
  },
  ATDD: {
    sections: [
      {
        heading: 'Acceptance Test-Driven Development',
        text: 'A collaborative methodology where the business, development, and QA teams jointly write acceptance tests before any code is written, ensuring a shared understanding of the feature.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: ATDD',
        url: 'https://en.wikipedia.org/wiki/Acceptance_test-driven_development',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: ATDD',
        payload: generatePrompt(
          'Acceptance Test-Driven Development (ATDD) bridging business and tech'
        ),
      },
    ],
  },
  BDD: {
    sections: [
      {
        heading: 'Behavior-Driven Development',
        text: 'An extension of TDD using natural language constructs (Given/When/Then, via Gherkin) to express system behavior. It bridges the gap between technical and non-technical stakeholders.',
      },
    ],
    resources: [
      { type: 'article', title: 'Cucumber: BDD', url: 'https://cucumber.io/docs/bdd/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Master BDD',
        payload: generatePrompt(
          'Behavior-Driven Development (BDD) and Gherkin Syntax best practices'
        ),
      },
    ],
  },
  RCA: {
    sections: [
      {
        heading: 'Root Cause Analysis',
        text: 'A systematic method for identifying the underlying causes of defects. Instead of just patching a bug, RCA asks "Why did this happen?" to prevent future occurrences (e.g., The 5 Whys technique).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Root Cause Analysis',
        url: 'https://en.wikipedia.org/wiki/Root_cause_analysis',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: RCA Techniques',
        payload: generatePrompt(
          'Root Cause Analysis (RCA) techniques for escaped defects in production'
        ),
      },
    ],
  },
  'Manual Testing': {
    sections: [
      {
        heading: 'Human-Driven Verification',
        text: 'The process of manually exploring software to find defects. It requires intuition, domain knowledge, and empathy for the end user—things automation scripts cannot replicate.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Manual Testing',
        url: 'https://en.wikipedia.org/wiki/Manual_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: The Value of Manual QA',
        payload: generatePrompt('Why Manual Testing is still critical in a highly automated world'),
      },
    ],
  },
  'Test Cases & Scenarios': {
    sections: [
      {
        heading: 'Documentation Structure',
        text: 'A Test Scenario is a high-level functionality to test. A Test Case is the detailed sequence of steps, data, and expected results required to validate that scenario.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Guru99: Test Cases',
        url: 'https://www.guru99.com/test-case.html',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Writing Perfect Test Cases',
        payload: generatePrompt(
          'How to write highly effective, maintainable Test Cases and Scenarios'
        ),
      },
    ],
  },
  Compatibility: {
    sections: [
      {
        heading: 'Cross-Environment Checks',
        text: 'Ensuring the software works consistently across different browsers (Chrome, Safari, Firefox), operating systems (Windows, macOS), and devices (Mobile, Tablet).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Cross Browser Testing',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing/Cross_browser_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Cross-Browser Strategy',
        payload: generatePrompt('Cross-Browser and Cross-Device testing strategies'),
      },
    ],
  },
  'Verification & Validation': {
    sections: [
      {
        heading: 'Building the right thing',
        text: 'Verification checks if the software conforms to its specifications ("Are we building the product right?"). Validation ensures it meets the actual needs of the user ("Are we building the right product?").',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: V&V',
        url: 'https://en.wikipedia.org/wiki/Verification_and_validation',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: V&V in Software',
        payload: generatePrompt(
          'Difference between Verification and Validation in Software Testing'
        ),
      },
    ],
  },
  'Test Planning': {
    sections: [
      {
        heading: 'Strategy & Scope',
        text: 'The creation of a comprehensive document detailing the scope, approach, resource allocation, and timeline of testing activities. It serves as the blueprint for the entire QA phase.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Plan',
        url: 'https://en.wikipedia.org/wiki/Test_plan',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Creating a Test Plan',
        payload: generatePrompt(
          'How to create a comprehensive Master Test Plan for a large project'
        ),
      },
    ],
  },

  // =========================================
  // FUNCTIONAL / NON-FUNCTIONAL TYPES
  // =========================================
  'Load & Performance': {
    sections: [
      {
        heading: 'Performance Engineering',
        text: 'Performance Testing evaluates a system’s behavior under extreme conditions. The main intent is to monitor and improve KPIs such as response time, throughput, memory, and CPU utilization.',
      },
      {
        heading: 'The Three Objectives',
        text: 'There are three objectives of Performance testing: Speed, Scalability, and Stability. Load Testing evaluates the app under normal workloads. Stress testing pushes beyond normal limits to find the breaking point.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Performance Testing',
        url: 'https://en.wikipedia.org/wiki/Software_performance_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Performance Testing',
        payload: generatePrompt('Load, Stress, and Performance Testing methodologies'),
      },
    ],
  },
  UAT: {
    sections: [
      {
        heading: 'User Acceptance Testing',
        text: 'User Acceptance Testing (UAT) is performed by the end user or client to verify/accept the software system before moving it to the production environment.',
      },
      {
        heading: 'Final Validation',
        text: 'UAT is done in the final phase of testing. Its main purpose is to validate end-to-end business flow against real-world scenarios. It does not focus on cosmetic errors or deep technical edge cases.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Acceptance Testing',
        url: 'https://en.wikipedia.org/wiki/Acceptance_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Mastering UAT',
        payload: generatePrompt(
          'User Acceptance Testing (UAT) best practices and business sign-off'
        ),
      },
    ],
  },
  'Load Testing': {
    sections: [
      {
        heading: 'Expected Traffic',
        text: 'A subset of performance testing that evaluates system behavior under anticipated peak loads (e.g., Black Friday traffic). It verifies if the architecture can handle the expected concurrency.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Load Testing',
        url: 'https://en.wikipedia.org/wiki/Load_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Load Testing Strategy',
        payload: generatePrompt('Load testing strategies and CI/CD execution'),
      },
    ],
  },
  'Performance Testing': {
    sections: [
      {
        heading: 'Speed and Responsiveness',
        text: 'Broad category covering how fast a system responds under various workloads. Crucial for user retention, SEO, and minimizing server costs.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Web Performance',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Performance',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Frontend Performance',
        payload: generatePrompt('Web Core Vitals and Frontend Performance Testing'),
      },
    ],
  },
  'Stress Testing': {
    sections: [
      {
        heading: 'Breaking Point',
        text: 'Testing the system by overwhelming it with requests beyond its design limits. The goal is to observe how it fails (does it corrupt data?) and how gracefully it recovers.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Stress Testing',
        url: 'https://en.wikipedia.org/wiki/Stress_testing_(software)',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Stress & Spike Testing',
        payload: generatePrompt('Stress, Spike, and Endurance Testing methodologies'),
      },
    ],
  },
  'Security Testing': {
    sections: [
      {
        heading: 'Vulnerability Checks',
        text: 'Testing intended to reveal flaws in security mechanisms, protecting data and resources from malicious intruders (e.g., testing for Injection, XSS, CSRF).',
      },
    ],
    resources: [
      { type: 'article', title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: QA Security Basics',
        payload: generatePrompt('Web Application Security Testing for QA Engineers'),
      },
    ],
  },
  'Accessibility Testing': {
    sections: [
      {
        heading: 'A11y (Accessibility)',
        text: 'Ensuring the software is fully usable by people with disabilities (vision, motor, auditory). Involves testing contrast, keyboard navigation, and screen reader compatibility.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'W3C Web Accessibility Initiative',
        url: 'https://www.w3.org/WAI/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Accessibility Testing',
        payload: generatePrompt('Web Accessibility (a11y) Testing compliance and automated tools'),
      },
    ],
  },
  'Exploratory Testing': {
    sections: [
      {
        heading: 'Unscripted Discovery',
        text: 'Simultaneous learning, test design, and execution. The tester relies on experience and intuition to explore the application and find complex bugs that automated scripts miss.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Exploratory Testing',
        url: 'https://en.wikipedia.org/wiki/Exploratory_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Exploratory Testing',
        payload: generatePrompt('Session-Based Exploratory Testing techniques and charters'),
      },
    ],
  },
  'Sanity Testing': {
    sections: [
      {
        heading: 'Quick Health Check',
        text: 'A fast, unscripted check of a specific module after a minor code change to ensure the bug is fixed and core functionality remains intact. It is a narrow, deep subset of regression.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Sanity Testing',
        url: 'https://en.wikipedia.org/wiki/Sanity_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Sanity vs Smoke',
        payload: generatePrompt('The exact differences and use cases for Sanity vs Smoke Testing'),
      },
    ],
  },
  'Regression Testing': {
    sections: [
      {
        heading: 'Did we break anything?',
        text: 'Re-running functional and non-functional tests to ensure that newly developed code hasn’t adversely affected existing features. Prime candidate for heavy automation.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Regression Testing',
        url: 'https://en.wikipedia.org/wiki/Regression_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Regression Strategy',
        payload: generatePrompt('Regression Testing optimization, suite selection, and automation'),
      },
    ],
  },
  'Smoke Testing': {
    sections: [
      {
        heading: 'Build Verification Test',
        text: 'A shallow, broad suite of tests run immediately after a build. If smoke tests fail, the build is instantly rejected, preventing wasted time on deeper testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Smoke Testing',
        url: 'https://en.wikipedia.org/wiki/Smoke_testing_(software)',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Smoke Testing',
        payload: generatePrompt('Implementing an automated Smoke Testing pipeline gate'),
      },
    ],
  },
  'Unit Testing': {
    sections: [
      {
        heading: 'Testing Isolated Code',
        text: 'Testing individual functions or methods in isolation. Written by developers. High unit test coverage is the foundation of a stable test pyramid.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Unit Testing',
        url: 'https://en.wikipedia.org/wiki/Unit_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: The Test Pyramid',
        payload: generatePrompt(
          'The Test Automation Pyramid and why Unit Testing is its foundation'
        ),
      },
    ],
  },
  'Integration Testing': {
    sections: [
      {
        heading: 'Connecting the Pieces',
        text: 'Testing how different modules, services, or APIs communicate with each other. It catches interface mismatches and data flow issues.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Integration Testing',
        url: 'https://en.wikipedia.org/wiki/Integration_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Integration Testing',
        payload: generatePrompt('Integration and Contract Testing in Microservices architectures'),
      },
    ],
  },
  Mocking: {
    sections: [
      {
        heading: 'Simulating Dependencies',
        text: 'Using simulated objects (mocks, stubs, spies) that mimic the behavior of real dependencies (like a database or 3rd party API) to isolate tests and make them faster and deterministic.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: "Martin Fowler: Mocks Aren't Stubs",
        url: 'https://martinfowler.com/articles/mocksArentStubs.html',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Mocks & Stubs',
        payload: generatePrompt('Mocking, Stubbing, and API Virtualization in Automated Testing'),
      },
    ],
  },

  // =========================================
  // LEVEL 4: AUTOMATED TESTING
  // =========================================
  'Automated Testing': {
    sections: [
      {
        heading: 'Code Testing Code',
        text: 'Using scripts and specialized tools to execute predefined tests automatically. Highly effective for repetitive tasks, regression suites, and CI/CD integration. It frees humans to do exploratory testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Automation',
        url: 'https://en.wikipedia.org/wiki/Test_automation',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Automation Strategy',
        payload: generatePrompt(
          'Building a scalable Test Automation Strategy and ROI evaluation from scratch'
        ),
      },
    ],
  },
  'Frontend Automation': {
    sections: [
      {
        heading: 'End-to-End UI Testing',
        text: 'Automating interactions with the graphical user interface. Tools like Playwright or Cypress simulate a real user clicking buttons and filling forms in an actual browser.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Cross Browser Testing',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/Tools_and_testing',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: E2E Automation',
        payload: generatePrompt(
          'Best practices for stable, low-maintenance Frontend E2E Test Automation'
        ),
      },
    ],
  },
  'Basic Introduction': {
    sections: [
      {
        heading: 'Web Fundamentals',
        text: 'You cannot automate what you do not understand. A firm grasp of HTML architecture, CSS Selectors, and DOM manipulation via JavaScript is mandatory for any modern QA automation engineer.',
      },
    ],
    resources: [
      { type: 'article', title: 'MDN Web Docs', url: 'https://developer.mozilla.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Web Testing Basics',
        payload: generatePrompt(
          'Essential HTML, CSS, and JS concepts every QA Automation Engineer must know'
        ),
      },
    ],
  },
  'Browser / Dev Tools': {
    sections: [
      {
        heading: "The Tester's Toolkit",
        text: 'Chrome DevTools provides everything needed to inspect DOM elements, throttle network speed, modify local storage, and trace API requests.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Chrome DevTools',
        url: 'https://developer.chrome.com/docs/devtools/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Master DevTools',
        payload: generatePrompt(
          'Advanced Chrome DevTools features for Software Testing and Debugging'
        ),
      },
    ],
  },
  'HTML, CSS, JavaScript': {
    sections: [
      {
        heading: 'The Web Triad',
        text: 'HTML provides structure, CSS provides styling, and JS provides interactivity. Mastery of CSS Selectors is crucial for locating elements reliably in automation scripts.',
      },
    ],
    resources: [
      { type: 'article', title: 'W3Schools: Web Development', url: 'https://www.w3schools.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Web Locators Masterclass',
        payload: generatePrompt('Advanced CSS and XPath locators for UI Test Automation'),
      },
    ],
  },
  Ajax: {
    sections: [
      {
        heading: 'Asynchronous Requests',
        text: 'AJAX allows web pages to be updated asynchronously by exchanging data with a server behind the scenes. This is the primary cause of "flakiness" in UI automation (tests executing before data arrives).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Ajax',
        url: 'https://developer.mozilla.org/en-US/docs/Web/Guide/AJAX',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Handling Async UI',
        payload: generatePrompt(
          'Handling Async operations, AJAX requests, and flakiness in UI Automation'
        ),
      },
    ],
  },
  Caching: {
    sections: [
      {
        heading: 'Browser Storage',
        text: 'Understanding how browsers store data (Local Storage, Session Storage, Cookies) is vital for manipulating user state (e.g., injecting a login token to skip the UI login step).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Client-side storage',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Caching in Tests',
        payload: generatePrompt(
          'Manipulating Cookies and Local Storage to speed up E2E automated tests'
        ),
      },
    ],
  },
  'SWAs, PWAs, JAMStack': {
    sections: [
      {
        heading: 'Modern Architectures',
        text: 'Testing strategies must adapt to the architecture. Single Page Applications (SPAs) rarely reload the page, requiring robust DOM-mutation waiting strategies.',
      },
    ],
    resources: [
      { type: 'article', title: 'Jamstack Ecosystem', url: 'https://jamstack.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Testing SPA/PWAs',
        payload: generatePrompt(
          'Testing Single Page Applications (SPA) and Progressive Web Apps (PWA)'
        ),
      },
    ],
  },
  'CSR vs SSR': {
    sections: [
      {
        heading: 'Rendering Strategies',
        text: 'Client-Side Rendering (React, Vue) builds the HTML in the browser. Server-Side Rendering (Next.js) delivers pre-built HTML. SSR is generally faster to load but requires different testing timing strategies.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Next.js Rendering',
        url: 'https://nextjs.org/docs/app/building-your-application/rendering',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: CSR vs SSR Testing',
        payload: generatePrompt('The differences between testing CSR vs SSR applications'),
      },
    ],
  },
  'Responsive vs Adaptive': {
    sections: [
      {
        heading: 'Mobile Web Testing',
        text: 'Responsive design fluidly scales via CSS media queries. Automation must verify layout integrity at various viewport dimensions (desktop, tablet, mobile).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'MDN: Responsive Design',
        url: 'https://developer.mozilla.org/en-US/docs/Learn/CSS/CSS_layout/Responsive_Design',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Visual Regression',
        payload: generatePrompt('Visual Regression Testing and Responsive Web Design automation'),
      },
    ],
  },
  'Automation Frameworks': {
    sections: [
      {
        heading: 'The Engines',
        text: 'Libraries that provide APIs to drive browser behavior programmatically. The market has shifted from WebDriver-based tools to faster, CDP-based tools like Playwright and Cypress.',
      },
    ],
    resources: [
      { type: 'article', title: 'State of JS: Testing', url: 'https://stateofjs.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Choosing a Framework',
        payload: generatePrompt('Comparing Cypress, Playwright, and Selenium for modern web apps'),
      },
    ],
  },
  'Webdriver.io': {
    sections: [
      {
        heading: 'Customizable JS Framework',
        text: 'A next-gen browser and mobile automation test framework for Node.js. It wraps the WebDriver protocol and supports modern features via the DevTools protocol.',
      },
    ],
    resources: [
      { type: 'article', title: 'WebdriverIO', url: 'https://webdriver.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: WebdriverIO Architecture',
        payload: generatePrompt('Building scalable test suites using Webdriver.io'),
      },
    ],
  },
  Playwright: {
    sections: [
      {
        heading: 'The Modern Standard',
        text: 'Backed by Microsoft, Playwright enables reliable E2E testing. It features automatic waiting, native network interception, and execution across multiple browser contexts (tabs) concurrently.',
      },
    ],
    resources: [
      { type: 'article', title: 'Playwright Official Docs', url: 'https://playwright.dev/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Master Playwright',
        payload: generatePrompt('Advanced Playwright Architecture and Network Interception'),
      },
    ],
  },
  Jasmine: {
    sections: [
      {
        heading: 'BDD Test Runner',
        text: 'A behavior-driven development framework for testing JavaScript code. Often used as the assertion library and runner underneath other tools.',
      },
    ],
    resources: [
      { type: 'article', title: 'Jasmine Docs', url: 'https://jasmine.github.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Jasmine BDD',
        payload: generatePrompt('Writing clean tests with Jasmine and BDD assertions'),
      },
    ],
  },
  'QA Wolf': {
    sections: [
      {
        heading: 'Managed QA',
        text: 'A platform/service that writes, runs, and maintains E2E tests for you, typically leveraging Playwright under the hood.',
      },
    ],
    resources: [
      { type: 'article', title: 'QA Wolf Website', url: 'https://www.qawolf.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: QA as a Service',
        payload: generatePrompt('The pros and cons of using QA as a Service (QAaaS) platforms'),
      },
    ],
  },
  Robot: {
    sections: [
      {
        heading: 'Keyword-Driven Testing',
        text: 'A generic open-source automation framework. It uses a tabular, keyword-driven syntax that is highly readable for non-programmers, implemented primarily in Python.',
      },
    ],
    resources: [
      { type: 'article', title: 'Robot Framework', url: 'https://robotframework.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Robot Framework',
        payload: generatePrompt('Keyword-driven testing with the Robot Framework'),
      },
    ],
  },
  Selenium: {
    sections: [
      {
        heading: 'The Legacy Giant',
        text: 'The industry standard for decades. It uses the WebDriver protocol to send HTTP commands to browser drivers. Supports multiple languages (Java, Python, C#), though it is slower than modern alternatives.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Selenium WebDriver Docs',
        url: 'https://www.selenium.dev/documentation/webdriver/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Selenium Architecture',
        payload: generatePrompt('Selenium WebDriver architecture and grid execution'),
      },
    ],
  },
  'Browser Addons': {
    sections: [
      {
        heading: 'Record & Playback',
        text: 'Browser extensions that record user interactions and generate scripts. Great for quick tasks or beginners, but notoriously fragile for maintaining large test suites.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Chrome Web Store Extensions',
        url: 'https://chrome.google.com/webstore',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Record & Playback flaws',
        payload: generatePrompt('The limitations of Record & Playback tools in Test Automation'),
      },
    ],
  },
  'Selenium IDE': {
    sections: [
      {
        heading: 'Classic Recorder',
        text: 'An integrated development environment for Selenium scripts implemented as a browser extension. Allows recording, editing, and exporting tests to code.',
      },
    ],
    resources: [
      { type: 'article', title: 'Selenium IDE', url: 'https://www.selenium.dev/selenium-ide/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Selenium IDE',
        payload: generatePrompt('Quick prototyping with Selenium IDE'),
      },
    ],
  },
  BugBug: {
    sections: [
      {
        heading: 'Low-Code Tool',
        text: 'A modern, lightweight alternative to Selenium IDE focused on making test recording simple and resilient without writing code.',
      },
    ],
    resources: [
      { type: 'article', title: 'BugBug Website', url: 'https://bugbug.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Low-Code QA',
        payload: generatePrompt('The rise of Low-Code and No-Code test automation tools'),
      },
    ],
  },
  'Ghost Inspector': {
    sections: [
      {
        heading: 'Cloud Recording',
        text: 'An automated UI testing tool that allows you to record tests in the browser and run them on a schedule from the cloud.',
      },
    ],
    resources: [
      { type: 'article', title: 'Ghost Inspector Docs', url: 'https://ghostinspector.com/docs/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Ghost Inspector',
        payload: generatePrompt('Cloud-based UI monitoring and synthetic testing'),
      },
    ],
  },
  'Backend Automation': {
    sections: [
      {
        heading: 'API Level Testing',
        text: 'Testing the backend application logic directly by sending requests to REST/GraphQL APIs and validating the JSON/XML responses. It is drastically faster and less flaky than UI testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Postman API Learning Center',
        url: 'https://learning.postman.com/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: API Testing Strategy',
        payload: generatePrompt(
          'API Testing strategies, Contract Testing, and Automation pipelines'
        ),
      },
    ],
  },
  'Karate Framework': {
    sections: [
      {
        heading: 'Unified BDD Framework',
        text: 'An open-source tool combining API test-automation, mocks, and performance-testing into a single framework using a custom Gherkin-like syntax. No Java knowledge required.',
      },
    ],
    resources: [
      { type: 'article', title: 'Karate DSL GitHub', url: 'https://github.com/karatelabs/karate' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Karate DSL',
        payload: generatePrompt('Automating APIs with the Karate Framework'),
      },
    ],
  },
  Cypress: {
    sections: [
      {
        heading: 'Developer-First Tooling',
        text: 'Executes directly inside the browser. While famous for UI testing, its `cy.request()` makes it incredibly powerful for writing combined API + UI tests.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Cypress API Testing Docs',
        url: 'https://docs.cypress.io/guides/end-to-end-testing/testing-your-api',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Cypress API + UI',
        payload: generatePrompt('Hybrid testing: Using Cypress for both API and UI automation'),
      },
    ],
  },
  SoapUI: {
    sections: [
      {
        heading: 'Enterprise Service Testing',
        text: 'A robust application for testing Service-Oriented Architectures (SOA), particularly legacy SOAP web services, though it supports REST as well.',
      },
    ],
    resources: [
      { type: 'article', title: 'SoapUI Official', url: 'https://www.soapui.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: SOAP vs REST QA',
        payload: generatePrompt('Testing legacy SOAP web services vs modern REST APIs'),
      },
    ],
  },
  'Postman / Newman': {
    sections: [
      {
        heading: 'The API Swiss Army Knife',
        text: 'Postman is the most popular GUI for exploring APIs. Newman is its CLI companion, allowing you to run Postman collections automatically in CI/CD pipelines.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Postman / Newman Docs',
        url: 'https://learning.postman.com/docs/collections/using-newman-cli/command-line-integration-with-newman/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Postman CI/CD',
        payload: generatePrompt('Automating Postman collections in CI/CD using Newman'),
      },
    ],
  },
  'REST Assured': {
    sections: [
      {
        heading: 'Java API Mastery',
        text: 'A Java DSL designed to simplify the testing of REST services. It integrates perfectly with JUnit/TestNG and provides a highly readable Given/When/Then syntax in Java.',
      },
    ],
    resources: [
      { type: 'article', title: 'REST Assured Guide', url: 'https://rest-assured.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: REST Assured',
        payload: generatePrompt('Building a robust Java API testing framework with REST Assured'),
      },
    ],
  },
  'Mobile Automation': {
    sections: [
      {
        heading: 'Testing the Small Screen',
        text: 'Automating native iOS and Android applications. Requires interacting with mobile-specific elements and dealing with device emulators, simulators, or real device clouds.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Appium Intro',
        url: 'https://appium.io/docs/en/about-appium/intro/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Mobile Test Automation',
        payload: generatePrompt('Mobile App Test Automation (Appium vs Native frameworks)'),
      },
    ],
  },
  Espresso: {
    sections: [
      {
        heading: 'Android Native',
        text: 'Google’s native UI testing framework for Android. It synchronizes test actions with the UI threads automatically, making it extremely fast and reliable.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Android Espresso Docs',
        url: 'https://developer.android.com/training/testing/espresso',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Espresso Testing',
        payload: generatePrompt('Native Android automation with Google Espresso'),
      },
    ],
  },
  Detox: {
    sections: [
      {
        heading: 'Gray Box E2E',
        text: 'A gray box end-to-end testing and automation framework for mobile apps (especially React Native). It monitors app state to heavily reduce flakiness.',
      },
    ],
    resources: [
      { type: 'article', title: 'Detox Documentation', url: 'https://wix.github.io/Detox/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: React Native Detox',
        payload: generatePrompt('Testing React Native applications with Detox'),
      },
    ],
  },
  Appium: {
    sections: [
      {
        heading: 'Cross-Platform Standard',
        text: 'An open-source tool driving iOS and Android apps using the WebDriver protocol. You can write tests in any language, making it the "Selenium for Mobile".',
      },
    ],
    resources: [
      { type: 'article', title: 'Appium Official Docs', url: 'https://appium.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Appium Architecture',
        payload: generatePrompt('Appium architecture and cross-platform mobile automation'),
      },
    ],
  },
  'Swift Testing': {
    sections: [
      {
        heading: 'iOS Native',
        text: 'Apple’s modern testing frameworks (XCTest/Swift Testing) for writing reliable unit, integration, and UI tests directly in Xcode using Swift.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Apple XCTest',
        url: 'https://developer.apple.com/documentation/xctest',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: XCTest Automation',
        payload: generatePrompt('Native iOS UI automation using Swift and XCTest'),
      },
    ],
  },

  // =========================================
  // LEVEL 5: NON-FUNCTIONAL
  // =========================================
  'Non-Functional': {
    sections: [
      {
        heading: 'Testing the "How"',
        text: "Focuses on aspects not related to specific business behaviors. It tests the system's readiness regarding performance, security, usability, reliability, and accessibility.",
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Non-functional requirement',
        url: 'https://en.wikipedia.org/wiki/Non-functional_requirement',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: NFRs in QA',
        payload: generatePrompt('Non-Functional Requirements (NFRs) and how to test them'),
      },
    ],
  },
  Accessibility: {
    sections: [
      {
        heading: 'Inclusive Design (a11y)',
        text: 'Ensuring web applications are fully accessible to individuals with disabilities. Automated tools can catch ~30% of issues (like missing alt tags); the rest requires manual screen reader testing.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'W3C Web Accessibility Initiative',
        url: 'https://www.w3.org/WAI/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Web Accessibility',
        payload: generatePrompt('Web Accessibility standards (WCAG) and automation'),
      },
    ],
  },
  Wave: {
    sections: [
      {
        heading: 'Visual Feedback',
        text: 'A suite of evaluation tools that helps authors make their web content more accessible. It injects icons directly into the page to highlight a11y violations.',
      },
    ],
    resources: [
      { type: 'article', title: 'WAVE', url: 'https://wave.webaim.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Using Wave Tool',
        payload: generatePrompt('Evaluating web accessibility using the WAVE tool'),
      },
    ],
  },
  Axe: {
    sections: [
      {
        heading: 'The Automation Standard',
        text: 'An accessibility testing engine by Deque. It can be easily integrated into Cypress, Playwright, or Selenium scripts to fail builds on a11y violations.',
      },
    ],
    resources: [
      { type: 'article', title: 'Axe-core', url: 'https://github.com/dequelabs/axe-core' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Axe Automation',
        payload: generatePrompt('Automating accessibility testing with Axe-core'),
      },
    ],
  },
  'Chrome DevTools': {
    sections: [
      {
        heading: 'Lighthouse Audits',
        text: 'DevTools includes a built-in Lighthouse panel that can run comprehensive audits for accessibility, performance, and SEO directly in the browser.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Lighthouse',
        url: 'https://developer.chrome.com/docs/lighthouse/overview/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: DevTools Audits',
        payload: generatePrompt('Running and understanding Chrome DevTools Lighthouse audits'),
      },
    ],
  },
  Lighthouse: {
    sections: [
      {
        heading: 'Google’s Audit Tool',
        text: 'An open-source, automated tool for improving web page quality. It can be run from Chrome DevTools, from the command line, or as a Node module.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Lighthouse GitHub',
        url: 'https://github.com/GoogleChrome/lighthouse',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Lighthouse CI',
        payload: generatePrompt('Integrating Google Lighthouse into a CI/CD pipeline'),
      },
    ],
  },
  Locust: {
    sections: [
      {
        heading: 'Python Load Generator',
        text: 'An easy to use, scalable performance testing tool. You define user behavior with standard Python code, making it highly flexible.',
      },
    ],
    resources: [
      { type: 'article', title: 'Locust', url: 'https://locust.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Locust Load Testing',
        payload: generatePrompt('Load testing with Locust and Python'),
      },
    ],
  },
  WebPageTest: {
    sections: [
      {
        heading: 'Frontend Profiling',
        text: 'A tool used to measure the perceived performance of web pages, providing detailed metrics like Time to First Byte, Core Web Vitals, and deep waterfall charts.',
      },
    ],
    resources: [
      { type: 'article', title: 'WebPageTest', url: 'https://www.webpagetest.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Core Web Vitals',
        payload: generatePrompt('Measuring Core Web Vitals using WebPageTest'),
      },
    ],
  },
  Gatling: {
    sections: [
      {
        heading: 'High Performance Injection',
        text: 'A highly capable load testing tool designed for ease of use and high performance, utilizing an asynchronous architecture and a Scala-based DSL.',
      },
    ],
    resources: [
      { type: 'article', title: 'Gatling', url: 'https://gatling.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Gatling Load',
        payload: generatePrompt('Writing performance scripts with Gatling'),
      },
    ],
  },
  k6: {
    sections: [
      {
        heading: 'Developer-Centric Load',
        text: 'An open-source load testing tool built by Grafana. You write test scripts in JavaScript, but the underlying execution engine is built in Go for extreme performance.',
      },
    ],
    resources: [
      { type: 'article', title: 'k6', url: 'https://k6.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: k6 Performance',
        payload: generatePrompt('Modern load testing using Grafana k6 and JavaScript'),
      },
    ],
  },
  Artillery: {
    sections: [
      {
        heading: 'Cloud-Native Performance',
        text: 'A modern load testing toolkit. Great for testing backend APIs using simple YAML configurations or custom JavaScript logic.',
      },
    ],
    resources: [
      { type: 'article', title: 'Artillery', url: 'https://www.artillery.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Artillery IO',
        payload: generatePrompt('Cloud-native performance testing with Artillery'),
      },
    ],
  },
  Vegeta: {
    sections: [
      {
        heading: 'HTTP Drilling',
        text: 'A versatile, CLI-based HTTP load testing tool built in Go. It is designed to drill HTTP services with a constant request rate to find limits.',
      },
    ],
    resources: [
      { type: 'article', title: 'Vegeta', url: 'https://github.com/tsenart/vegeta' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Vegeta CLI',
        payload: generatePrompt('HTTP load testing and rate limiting with Vegeta'),
      },
    ],
  },
  JMeter: {
    sections: [
      {
        heading: 'The Enterprise Standard',
        text: 'A mature, Java-based application designed to load test functional behavior and measure performance. It has a steep learning curve and a dated UI but is incredibly powerful.',
      },
    ],
    resources: [
      { type: 'article', title: 'Apache JMeter', url: 'https://jmeter.apache.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: JMeter Masterclass',
        payload: generatePrompt('Advanced performance testing with Apache JMeter'),
      },
    ],
  },
  'Security Testing': {
    sections: [
      {
        heading: 'Protecting the System',
        text: 'Testing intended to reveal flaws in security mechanisms. QA engineers should understand basic attack vectors to ensure data is protected from unauthorized access.',
      },
    ],
    resources: [
      { type: 'article', title: 'OWASP Foundation', url: 'https://owasp.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Web Security for QA',
        payload: generatePrompt('Web Security Testing basics and OWASP Top 10 for QA Engineers'),
      },
    ],
  },
  'Authentication / Authorization': {
    sections: [
      {
        heading: 'Identity and Access',
        text: 'Authentication verifies WHO the user is (Login). Authorization verifies WHAT the user is allowed to do (Role-Based Access Control). Both must be rigorously tested.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'OWASP Auth Cheat Sheet',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Auth Testing',
        payload: generatePrompt(
          'Testing Authentication and RBAC (Role-Based Access Control) systems'
        ),
      },
    ],
  },
  'Secrets Management': {
    sections: [
      {
        heading: 'Hiding Credentials',
        text: 'Ensuring API keys, passwords, and tokens are never hardcoded in the test repository. They must be injected securely via environment variables or secret managers (like AWS Secrets Manager).',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'OWASP Secrets Management',
        url: 'https://cheatsheetseries.owasp.org/cheatsheets/Secrets_Management_Cheat_Sheet.html',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Secrets in CI/CD',
        payload: generatePrompt(
          'Managing secrets and environment variables in test automation pipelines'
        ),
      },
    ],
  },
  'Vulnerability Scanning': {
    sections: [
      {
        heading: 'Automated Security',
        text: 'Integrating tools into the CI/CD pipeline (like Snyk or SonarQube) that automatically scan code and dependencies for known vulnerabilities (CVEs).',
      },
    ],
    resources: [
      { type: 'article', title: 'Snyk', url: 'https://snyk.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: SAST & DAST',
        payload: generatePrompt('SAST vs DAST and integrating vulnerability scanning in DevOps'),
      },
    ],
  },
  'OWASP 10': {
    sections: [
      {
        heading: 'The Threat Landscape',
        text: 'The Open Worldwide Application Security Project Top 10 represents a broad consensus on the most critical security risks to web applications (e.g., SQL Injection, Broken Access Control).',
      },
    ],
    resources: [
      { type: 'article', title: 'OWASP Top 10', url: 'https://owasp.org/www-project-top-ten/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: OWASP Top 10',
        payload: generatePrompt('The OWASP Top 10 security risks and how to test for them'),
      },
    ],
  },
  'Attack Vectors': {
    sections: [
      {
        heading: 'Pathways to Breach',
        text: 'Understanding the methods hackers use (Cross-Site Scripting, CSRF) helps QA design negative test cases that block malicious inputs.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Attack Vector',
        url: 'https://en.wikipedia.org/wiki/Attack_vector',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Attack Vectors',
        payload: generatePrompt('Common attack vectors like XSS, CSRF, and SQLi'),
      },
    ],
  },
  'Email Testing': {
    sections: [
      {
        heading: 'Verifying Communications',
        text: 'Testing automated transactional emails (user registration, password resets). This includes verifying delivery, content parsing, and layout rendering across different email clients.',
      },
    ],
    resources: [
      { type: 'article', title: 'Mailtrap', url: 'https://mailtrap.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Email Automation',
        payload: generatePrompt('Automating the testing of transactional emails and SMTP services'),
      },
    ],
  },
  Mailinator: {
    sections: [
      {
        heading: 'Disposable Inboxes',
        text: 'A public email system that generates instant, disposable inboxes. Ideal for automated testing of signup flows without managing real email accounts.',
      },
    ],
    resources: [
      { type: 'article', title: 'Mailinator', url: 'https://www.mailinator.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Mailinator API',
        payload: generatePrompt('Using Mailinator and disposable inboxes for QA automation'),
      },
    ],
  },
  GmailTester: {
    sections: [
      {
        heading: 'API-Based Validation',
        text: 'Libraries that authenticate with the Gmail API via OAuth, allowing automated tests to programmatically search, read, and extract links from real Gmail inboxes.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Gmail-Tester',
        url: 'https://github.com/levinunnink/gmail-tester',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Gmail API Testing',
        payload: generatePrompt('Automating email verification using the official Gmail API'),
      },
    ],
  },
  'Testing Data Management': {
    sections: [
      {
        heading: 'Fuel for Automation',
        text: 'The strategy of creating, maintaining, and masking test data. Tests should ideally create their own isolated data or use a pristine database state to prevent flaky tests.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Test Data',
        url: 'https://en.wikipedia.org/wiki/Test_data',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Data Management',
        payload: generatePrompt('Test Data Management (TDM) strategies for automated testing'),
      },
    ],
  },
  Delphix: {
    sections: [
      {
        heading: 'Data Virtualization',
        text: 'An enterprise tool providing fast, compliant data provisioning. It allows teams to instantly spin up lightweight clones of production databases with masked sensitive data.',
      },
    ],
    resources: [
      { type: 'article', title: 'Delphix', url: 'https://www.delphix.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Database Virtualization',
        payload: generatePrompt('Data Virtualization and Database cloning for QA environments'),
      },
    ],
  },
  Reporting: {
    sections: [
      {
        heading: 'Visibility is Key',
        text: 'Test automation is useless if nobody looks at the results. Good reporting provides actionable insights, historical flakiness trends, and clear stack traces for fast debugging.',
      },
    ],
    resources: [
      { type: 'article', title: 'Allure Framework', url: 'https://qameta.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Test Reporting',
        payload: generatePrompt('Building effective QA Automation Dashboards and Reports'),
      },
    ],
  },
  Allure: {
    sections: [
      {
        heading: 'Visual Brilliance',
        text: 'A highly flexible, multi-language test report tool that generates beautiful, interactive web reports showing exactly what passed, failed, or broke, including screenshots and logs.',
      },
    ],
    resources: [
      { type: 'article', title: 'Allure Report', url: 'https://allurereport.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Allure Setup',
        payload: generatePrompt('Integrating Allure Reporting into UI automation frameworks'),
      },
    ],
  },
  jUnit: {
    sections: [
      {
        heading: 'The Universal Format',
        text: 'While JUnit is a Java framework, its XML output format has become the universal standard. Almost every CI/CD tool (Jenkins, GitLab) parses JUnit XML to display test metrics.',
      },
    ],
    resources: [
      { type: 'article', title: 'JUnit 5', url: 'https://junit.org/junit5/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: JUnit XML',
        payload: generatePrompt(
          'Understanding and generating JUnit XML reports for CI/CD pipelines'
        ),
      },
    ],
  },
  'Monitoring & Logs': {
    sections: [
      {
        heading: 'Production Observability',
        text: "QA doesn't stop at release. Monitoring tools provide visibility into production health. QA uses logs to trace the root cause of complex bugs reported by users.",
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Observability',
        url: 'https://en.wikipedia.org/wiki/Observability_(software)',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Observability in QA',
        payload: generatePrompt('Observability, Logging, and Monitoring for QA Engineers'),
      },
    ],
  },
  'New Relic': {
    sections: [
      {
        heading: 'Application Performance Monitoring',
        text: 'An APM tool providing deep insights into backend health, slow database queries, and server performance bottlenecks.',
      },
    ],
    resources: [
      { type: 'article', title: 'New Relic', url: 'https://newrelic.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: New Relic APM',
        payload: generatePrompt('Using New Relic APM to trace production bugs'),
      },
    ],
  },
  Runscope: {
    sections: [
      {
        heading: 'API Monitoring',
        text: 'A tool for continuous testing and monitoring of APIs, ensuring they return expected data and meet performance SLAs globally.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'BlazeMeter API Monitoring',
        url: 'https://www.blazemeter.com/api-monitoring',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: API Monitoring',
        payload: generatePrompt('Synthetic API Monitoring in production environments'),
      },
    ],
  },
  Kibana: {
    sections: [
      {
        heading: 'Log Visualization',
        text: 'Part of the Elastic Stack. A powerful UI that lets you search and visualize massive amounts of application logs to trace errors.',
      },
    ],
    resources: [
      { type: 'article', title: 'Elastic Kibana', url: 'https://www.elastic.co/kibana/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: ELK Stack',
        payload: generatePrompt(
          'Using the ELK Stack (Elasticsearch, Logstash, Kibana) for QA log analysis'
        ),
      },
    ],
  },
  Datadog: {
    sections: [
      {
        heading: 'Cloud Observability',
        text: 'A SaaS platform providing monitoring of servers, databases, tools, and services. Widely used for building real-time alerting dashboards.',
      },
    ],
    resources: [
      { type: 'article', title: 'Datadog', url: 'https://www.datadoghq.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Datadog Alerting',
        payload: generatePrompt('Setting up synthetic tests and alerting in Datadog'),
      },
    ],
  },
  'Pager Duty': {
    sections: [
      {
        heading: 'Incident Response',
        text: 'An incident management platform that alerts on-call engineers (via phone, SMS, Slack) when critical monitoring thresholds or production tests fail.',
      },
    ],
    resources: [
      { type: 'article', title: 'PagerDuty', url: 'https://www.pagerduty.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Incident Management',
        payload: generatePrompt('Incident Response processes and PagerDuty routing'),
      },
    ],
  },
  Grafana: {
    sections: [
      {
        heading: 'Metrics Dashboards',
        text: 'An open-source interactive visualization web application. Often used to graph time-series data from performance tests (like k6) or system metrics (Prometheus).',
      },
    ],
    resources: [
      { type: 'article', title: 'Grafana', url: 'https://grafana.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Grafana Dashboards',
        payload: generatePrompt(
          'Visualizing performance test metrics using Grafana and Prometheus'
        ),
      },
    ],
  },
  Sentry: {
    sections: [
      {
        heading: 'Error Tracking',
        text: 'A developer-first error tracking platform. It captures unhandled frontend and backend exceptions, providing exact stack traces and user context to developers.',
      },
    ],
    resources: [
      { type: 'article', title: 'Sentry', url: 'https://sentry.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Error Tracking',
        payload: generatePrompt('Frontend error tracking and sourcemaps with Sentry'),
      },
    ],
  },

  // =========================================
  // LEVEL 6: INFRASTRUCTURE & CI/CD
  // =========================================
  'Version Control': {
    sections: [
      {
        heading: 'Managing Code',
        text: 'Test automation is software development. Automation scripts must be version-controlled to track changes, collaborate via Pull Requests, and trigger CI pipelines.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Version Control',
        url: 'https://en.wikipedia.org/wiki/Version_control',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Version Control',
        payload: generatePrompt('Version Control branching strategies for QA teams'),
      },
    ],
  },
  Git: {
    sections: [
      {
        heading: 'The Standard',
        text: 'A distributed version control system. Understanding branching, merging, rebasing, and resolving conflicts is a mandatory skill for modern SDETs.',
      },
    ],
    resources: [
      { type: 'article', title: 'Git Docs', url: 'https://git-scm.com/doc' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Git Mastery',
        payload: generatePrompt('Advanced Git workflows (Rebase, Cherry-pick) for SDETs'),
      },
    ],
  },
  'Repo Hosting': {
    sections: [
      {
        heading: 'Cloud Collaboration',
        text: 'Platforms that host Git repositories online, providing interfaces for code review, issue tracking, and integrated CI/CD runners.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Comparing Workflows',
        url: 'https://www.atlassian.com/git/tutorials/comparing-workflows',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Repo Management',
        payload: generatePrompt('Code Review and Pull Request best practices in QA automation'),
      },
    ],
  },
  GitHub: {
    sections: [
      {
        heading: 'The Hub',
        text: 'Owned by Microsoft, the largest code hosting platform in the world. GitHub Actions has revolutionized how CI/CD pipelines are built directly alongside the code.',
      },
    ],
    resources: [
      { type: 'article', title: 'GitHub Docs', url: 'https://docs.github.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: GitHub Actions',
        payload: generatePrompt('Building CI/CD pipelines with GitHub Actions for QA automation'),
      },
    ],
  },
  GitLab: {
    sections: [
      {
        heading: 'All-in-One DevOps',
        text: 'A comprehensive platform offering Git hosting alongside an incredibly powerful, built-in CI/CD engine managed via a simple `.gitlab-ci.yml` file.',
      },
    ],
    resources: [
      { type: 'article', title: 'GitLab Docs', url: 'https://docs.gitlab.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: GitLab CI',
        payload: generatePrompt('Configuring GitLab CI/CD pipelines for E2E testing'),
      },
    ],
  },
  Bitbucket: {
    sections: [
      {
        heading: 'Atlassian Git',
        text: 'A Git hosting service that offers seamless integration with Jira software, making traceability from code commit to Jira ticket very easy.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Bitbucket Docs',
        url: 'https://support.atlassian.com/bitbucket-cloud/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Bitbucket Pipelines',
        payload: generatePrompt('Bitbucket Pipelines configuration and Jira integration'),
      },
    ],
  },
  'CI/CD': {
    sections: [
      {
        heading: 'Continuous Integration & Deployment',
        text: 'The practice of frequently integrating code changes into a shared repository, followed by automated builds and deployments.',
      },
      {
        heading: 'QA as the Gatekeeper',
        text: 'Automated tests are the gatekeepers of CI/CD. If the tests fail, the pipeline stops, preventing bugs from reaching production.',
      },
    ],
    resources: [
      { type: 'article', title: 'Wikipedia: CI/CD', url: 'https://en.wikipedia.org/wiki/CI/CD' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: CI/CD Pipelines',
        payload: generatePrompt('Designing robust CI/CD pipelines with automated testing gates'),
      },
    ],
  },
  Jenkins: {
    sections: [
      {
        heading: 'The Open Source Giant',
        text: 'A highly customizable, plugin-driven automation server. While powerful, it requires significant maintenance and infrastructure management compared to modern SaaS CI tools.',
      },
    ],
    resources: [
      { type: 'article', title: 'Jenkins Docs', url: 'https://www.jenkins.io/doc/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Jenkins Pipelines',
        payload: generatePrompt('Writing Jenkinsfiles and managing Jenkins automation nodes'),
      },
    ],
  },
  'GitLab CI': {
    sections: [
      {
        heading: 'Integrated Pipelines',
        text: 'Built directly into GitLab, it uses a YAML file to define pipeline stages. Highly favored by enterprises for its tight integration with the repository.',
      },
    ],
    resources: [
      { type: 'article', title: 'GitLab CI/CD Docs', url: 'https://docs.gitlab.com/ee/ci/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: GitLab Runners',
        payload: generatePrompt('Managing GitLab Runners and parallel test execution'),
      },
    ],
  },
  'Circle CI': {
    sections: [
      {
        heading: 'Cloud-Native Speed',
        text: 'A popular hosted CI/CD platform known for speed and extensive Docker support, allowing fast, isolated test execution environments.',
      },
    ],
    resources: [
      { type: 'article', title: 'CircleCI Docs', url: 'https://circleci.com/docs/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: CircleCI Orbs',
        payload: generatePrompt('Optimizing CircleCI pipelines using Orbs and Docker'),
      },
    ],
  },
  Drone: {
    sections: [
      {
        heading: 'Container-Native CI',
        text: 'A Continuous Delivery system built entirely on container technology. Every pipeline step is executed inside an isolated Docker container.',
      },
    ],
    resources: [
      { type: 'article', title: 'Drone CI Docs', url: 'https://docs.drone.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Container CI',
        payload: generatePrompt('Container-native CI/CD using Drone CI and Docker'),
      },
    ],
  },
  Bamboo: {
    sections: [
      {
        heading: 'Atlassian Pipeline',
        text: 'A continuous integration and deployment server developed by Atlassian. Connects flawlessly with Jira and Bitbucket for a unified workflow.',
      },
    ],
    resources: [
      { type: 'article', title: 'Bamboo Docs', url: 'https://confluence.atlassian.com/bamboo' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Bamboo CI',
        payload: generatePrompt('Atlassian Bamboo CI/CD configuration and best practices'),
      },
    ],
  },
  'Travis CI': {
    sections: [
      {
        heading: 'The Pioneer',
        text: 'One of the first cloud-hosted CI services, highly popular in the open-source community for its simple YAML configuration.',
      },
    ],
    resources: [
      { type: 'article', title: 'Travis CI Docs', url: 'https://docs.travis-ci.com/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Travis CI',
        payload: generatePrompt('Configuring Travis CI for open source testing projects'),
      },
    ],
  },
  TeamCity: {
    sections: [
      {
        heading: 'JetBrains Excellence',
        text: 'A commercial CI server known for intelligent "out-of-the-box" features, fantastic build history tracking, and deep integration with IntelliJ IDEs.',
      },
    ],
    resources: [
      { type: 'article', title: 'TeamCity Docs', url: 'https://www.jetbrains.com/teamcity/learn/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: TeamCity Pipelines',
        payload: generatePrompt('TeamCity configuration and Kotlin DSL for pipelines'),
      },
    ],
  },
  'Azure DevOps Services': {
    sections: [
      {
        heading: 'Microsoft Ecosystem',
        text: 'A suite of DevOps tools offering Git hosting, Kanban boards, and Azure Pipelines for building and deploying software to the cloud.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Azure DevOps Docs',
        url: 'https://learn.microsoft.com/en-us/azure/devops/',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Azure Pipelines',
        payload: generatePrompt('Configuring Azure Pipelines YAML for QA Automation'),
      },
    ],
  },

  // =========================================
  // LEVEL 7: HEADLESS & BROWSER TECH
  // =========================================
  'Headless Testing': {
    sections: [
      {
        heading: 'Invisible Execution',
        text: 'Running browser automation without a graphical UI. Headless browsers consume a fraction of the RAM and CPU, executing scripts much faster. This is how tests are run in CI/CD pipelines.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Wikipedia: Headless Browser',
        url: 'https://en.wikipedia.org/wiki/Headless_browser',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Headless Browsers',
        payload: generatePrompt('Headless Browser automation architecture and debugging'),
      },
    ],
  },
  Puppeteer: {
    sections: [
      {
        heading: 'Chrome Automation',
        text: 'A Node library maintained by Chrome DevTools. It provides a high-level API to control Chromium over the DevTools Protocol. Often used for scraping and PDF generation.',
      },
    ],
    resources: [
      { type: 'article', title: 'Puppeteer Docs', url: 'https://pptr.dev/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Puppeteer Web Scraping',
        payload: generatePrompt('Using Puppeteer for browser automation and web scraping'),
      },
    ],
  },
  'Zombie.js': {
    sections: [
      {
        heading: 'Insanely Fast, Limited Scope',
        text: 'A lightweight framework that simulates a browser environment entirely in Node.js (no real browser engine). Incredibly fast, but struggles with modern, complex React/Vue SPAs.',
      },
    ],
    resources: [
      { type: 'article', title: 'Zombie.js Docs', url: 'http://zombie.js.org/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Zombie.js',
        payload: generatePrompt('Simulating browser environments in Node.js with Zombie.js'),
      },
    ],
  },
  Playwright: {
    // Playwright w tej sekcji też! (jeśli kliknie z "Headless Testing")
    sections: [
      {
        heading: 'Native DevTools Protocol',
        text: 'Playwright communicates with browsers natively without the WebDriver middleman, making headless execution incredibly fast and stable.',
      },
    ],
    resources: [
      { type: 'article', title: 'Playwright CLI', url: 'https://playwright.dev/docs/test-cli' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Playwright Headless',
        payload: generatePrompt('Executing and debugging Playwright tests in headless mode'),
      },
    ],
  },
  Cypress: {
    // Dodany dla spójności listnode
    sections: [
      {
        heading: 'Electron / Headless',
        text: 'Cypress runs tests headlessly during CI execution (usually via Electron or Headless Chrome), recording video and taking screenshots on failure automatically.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Cypress Command Line',
        url: 'https://docs.cypress.io/guides/guides/command-line',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Cypress CI',
        payload: generatePrompt('Running Cypress headlessly in Docker containers for CI'),
      },
    ],
  },
  'Headless Chrome': {
    sections: [
      {
        heading: 'Native Headless',
        text: 'Running the actual Chrome browser binary with the `--headless` flag. It renders pages exactly like real Chrome, making legacy tools like PhantomJS obsolete.',
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Headless Chrome Docs',
        url: 'https://developer.chrome.com/docs/chromium/new-headless',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Chrome CLI Options',
        payload: generatePrompt('Optimizing Headless Chrome with CLI flags for CI environments'),
      },
    ],
  },
  'Headless Fox': {
    sections: [
      {
        heading: 'Firefox Automation',
        text: "Mozilla's implementation allowing Firefox to run without a GUI, heavily utilized by Playwright and Selenium to ensure cross-browser test coverage in CI.",
      },
    ],
    resources: [
      {
        type: 'article',
        title: 'Headless Firefox',
        url: 'https://developer.mozilla.org/en-US/docs/Mozilla/Firefox/Headless_mode',
      },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: Cross-Browser CI',
        payload: generatePrompt(
          'Configuring Headless Firefox for cross-browser automation pipelines'
        ),
      },
    ],
  },
  'HTML Unit': {
    sections: [
      {
        heading: 'Java GUI-Less Browser',
        text: 'A pure Java headless browser implementation. It models HTML documents and provides an API to invoke pages. Extremely fast for Java stacks, but lacks a real JavaScript rendering engine.',
      },
    ],
    resources: [
      { type: 'article', title: 'HtmlUnit Docs', url: 'https://htmlunit.sourceforge.io/' },
      {
        type: 'prompt',
        title: 'Copy LLM Prompt: HtmlUnit',
        payload: generatePrompt('Using HtmlUnit for blazing fast UI testing in Java'),
      },
    ],
  },
}
