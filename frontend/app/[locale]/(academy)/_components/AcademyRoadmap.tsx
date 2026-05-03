'use client'

import {
  ReactFlow,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react'

import '@xyflow/react/dist/style.css'

// ==========================================
// 1. Ports
// ==========================================
const UniversalHandles = () => (
  <>
    <Handle id="top-t" type="target" position={Position.Top} className="bg-zinc-500!" />
    <Handle id="top-s" type="source" position={Position.Top} className="bg-zinc-500!" />
    <Handle id="bottom-t" type="target" position={Position.Bottom} className="bg-zinc-500!" />
    <Handle id="bottom-s" type="source" position={Position.Bottom} className="bg-zinc-500!" />
    <Handle id="left-t" type="target" position={Position.Left} className="bg-zinc-500!" />
    <Handle id="left-s" type="source" position={Position.Left} className="bg-zinc-500!" />
    <Handle id="right-t" type="target" position={Position.Right} className="bg-zinc-500!" />
    <Handle id="right-s" type="source" position={Position.Right} className="bg-zinc-500!" />
  </>
)

// ==========================================
// 2. Nodes Styles
// ==========================================
const MainNode = ({ data }: { data: any }) => (
  <div className="min-w-48 border-2 border-yellow-500 bg-zinc-950 px-6 py-4 text-center">
    <UniversalHandles />
    <div className="font-serif tracking-widest uppercase">{data.label}</div>
  </div>
)

const SubNode = ({ data }: { data: any }) => (
  <div className="min-w-32 rounded-lg border px-4 py-2 text-center">
    <UniversalHandles />
    <div className="font-serif tracking-wide text-yellow-500">{data.label}</div>
  </div>
)

const ListNode = ({ data }: { data: any }) => (
  <div className="flex min-w-48 flex-col rounded-lg border border-purple-800 bg-zinc-900 p-3">
    <UniversalHandles />
    <div className="mb-2 flex justify-center border-b font-serif tracking-wide text-yellow-500">
      {data.label}
    </div>
    <ul className="flex flex-col gap-2 text-center">
      {data.items?.map((item: string, index: number) => (
        <li key={index} className="border font-bold">
          {item}
        </li>
      ))}
    </ul>
  </div>
)

const StartNode = ({ data }: { data: any }) => (
  <div className="text-center">
    <UniversalHandles />
    <div className="font-serif text-4xl tracking-wide text-yellow-500">{data.label}</div>
  </div>
)

// ==========================================
// 3. Component Registration
// ==========================================
const nodeTypes = {
  main: MainNode,
  sub: SubNode,
  list: ListNode,
  start: StartNode,
}

// ==========================================
// 4. Structure (Nodes)
// ==========================================
const initialNodes = [
  //START
  {
    id: 'n0',
    type: 'start',
    position: { x: 350, y: -150 },
    data: { label: '|Start|' },
  },

  // LEARN THE BASICS
  {
    id: 'n1',
    type: 'main',
    position: { x: 295, y: 0 },
    data: { label: 'Learn the Basics' },
  },
  //LEFT
  { id: 'n1a1', type: 'sub', position: { x: 650, y: -15 }, data: { label: 'Test Oracles' } },
  { id: 'n1a2', type: 'sub', position: { x: 650, y: 35 }, data: { label: 'Test Prioritization' } },
  {
    id: 'n1a3',
    type: 'list',
    position: { x: 650, y: 85 },
    data: { label: 'Testing Approaches', items: ['Attlasian', 'Assembla', 'Youtrack', 'Trello'] },
  },
  {
    id: 'n1a4',
    type: 'list',
    position: { x: 834, y: 85 },
    data: { label: 'Manage your Testing', items: ['qTest', 'TestRail', 'TestLink', 'Zephyr'] },
  },
  //RIGHT
  { id: 'n1b1', type: 'sub', position: { x: 55, y: -30 }, data: { label: 'What is QA?' } },
  { id: 'n1b2', type: 'sub', position: { x: 62, y: 20 }, data: { label: 'QA Mindset' } },
  { id: 'n1b3', type: 'sub', position: { x: 0, y: 70 }, data: { label: 'Testing Approaches' } },
  { id: 'n1b3a', type: 'sub', position: { x: 5, y: 150 }, data: { label: 'White Box Testing' } },
  { id: 'n1b3b', type: 'sub', position: { x: 5, y: 195 }, data: { label: 'Grey Box Testing' } },
  { id: 'n1b3c', type: 'sub', position: { x: 5, y: 240 }, data: { label: 'Black Box Testing' } },

  // TESTING TECHNIQUES
  { id: 'ntt', type: 'main', position: { x: 650, y: 310 }, data: { label: 'Testing Techniques' } },

  {
    id: 'ntt1',
    type: 'list',
    position: { x: 650, y: 400 },
    data: {
      label: 'Test Management',
      items: [
        'Load Testing',
        'Performance Testing',
        'Stress Testing',
        'Security Testing',
        'Accessibility Testing',
      ],
    },
  },

  {
    id: 'ntt2',
    type: 'list',
    position: { x: 850, y: 400 },
    data: {
      label: 'Functional Testing',
      items: [
        'UAT',
        'Exploratory Testing',
        'Sanity Testing',
        'Regression Testing',
        'Smoke Testing',
        'Unit Testing',
        'Integration Testing',
        'Mocking',
      ],
    },
  },

  // SDLC Delivery
  { id: 'n2', type: 'main', position: { x: 314, y: 380 }, data: { label: 'SDLC Delivery' } },

  { id: 'n2a1', type: 'sub', position: { x: 230, y: 315 }, data: { label: 'Waterfall' } },
  { id: 'n2a2', type: 'sub', position: { x: 230, y: 270 }, data: { label: 'V Model' } },
  { id: 'n2a3', type: 'sub', position: { x: 230, y: 225 }, data: { label: 'Spiral' } },

  {
    id: 'n2b',
    type: 'list',
    position: { x: 0, y: 420 },
    data: {
      label: 'Functional Testing',
      items: ['Kanban', 'Scrum', 'XP', 'SAFe'],
    },
  },

  // METHODOLOGIES
  { id: 'n3', type: 'main', position: { x: 305.5, y: 550 }, data: { label: 'Methodologies' } },
  { id: 'n3a1', type: 'sub', position: { x: 540, y: 610 }, data: { label: 'BDD' } },
  { id: 'n3a2', type: 'sub', position: { x: 540, y: 655 }, data: { label: 'RCA' } },
  { id: 'n3b1', type: 'sub', position: { x: 250, y: 610 }, data: { label: 'TDD' } },
  { id: 'n3b2', type: 'sub', position: { x: 250, y: 655 }, data: { label: 'ATDD' } },

  //MANUAL TESTING
  { id: 'n4', type: 'main', position: { x: 301, y: 780 }, data: { label: 'Manual Testing' } },
  {
    id: 'n4a',
    type: 'sub',
    position: { x: -50, y: 700 },
    data: { label: 'Test Cases & Scenarios' },
  },
  { id: 'n4b', type: 'sub', position: { x: 25, y: 750 }, data: { label: 'Compatibility' } },
  {
    id: 'n4c',
    type: 'sub',
    position: { x: -62, y: 800 },
    data: { label: 'Verification & Validation' },
  },
  { id: 'n4d', type: 'sub', position: { x: 25, y: 850 }, data: { label: 'Test Planning' } },

  // AUTOMATED TESTING
  { id: 'n5', type: 'main', position: { x: 282, y: 950 }, data: { label: 'Automated Testing' } },
  { id: 'n5a', type: 'sub', position: { x: 657, y: 943 }, data: { label: 'Frontend Automation' } },

  {
    id: 'n5a1',
    type: 'list',
    position: { x: 650, y: 1050 },
    data: {
      label: 'Basic Introduction',
      items: [
        'Browser / Dev Tools',
        'HTML, CSS, JavaScript',
        'Ajax',
        'Caching',
        'SWAs, PWAs, JAMStack',
        'CSR vs SSR',
        'Responsive vs Adaptive',
      ],
    },
  },
  {
    id: 'n5a2',
    type: 'list',
    position: { x: 870, y: 1050 },
    data: {
      label: 'Automation Frameworks',
      items: ['Webdriver.io', 'Playwright', 'Jasmine', 'QA Wolf', 'Robot', 'Selenium'],
    },
  },
  {
    id: 'n5a3',
    type: 'list',
    position: { x: 1097, y: 1050 },
    data: {
      label: 'Browser Addons',
      items: ['Selenium IDE', 'BugBug', 'Ghost Inspector'],
    },
  },
  {
    id: 'n5b',
    type: 'list',
    position: { x: 10, y: 1050 },
    data: {
      label: 'Backend Automation',
      items: [
        'Karateframework',
        'Cypress',
        'Playwright',
        'Soap UI',
        'Postman / Newman',
        'REST Assured',
      ],
    },
  },
  {
    id: 'n5c',
    type: 'list',
    position: { x: -175, y: 1050 },
    data: {
      label: 'Mobile Automation',
      items: ['Espresso', 'Detox', 'Appium', 'SwiftTesting'],
    },
  },

  // NON FUNCTIONAL
  { id: 'n6', type: 'main', position: { x: 300, y: 1150 }, data: { label: 'Non-Functional' } },

  // ACCESSIBILITY
  {
    id: 'n7',
    type: 'list',
    position: { x: 337.5, y: 1250 },
    data: { label: 'Accessibility', items: ['Wave', 'Axe', 'Chrome DevTools'] },
  },

  // LOAD & PERFORMANCE
  {
    id: 'n8',
    type: 'list',
    position: { x: -95, y: 1500 },
    data: {
      label: 'Load & Performance',
      items: [
        'Lighthouse',
        'Locust',
        'Webpagetest',
        ' Gatling',
        ' K6',
        'Artillery',
        'Vegeta',
        'JMeter',
      ],
    },
  },

  // SECURITY TESTING
  {
    id: 'n9',
    type: 'list',
    position: { x: 292, y: 1551 },
    data: {
      label: 'Security Testing',
      items: [
        'Authentication / Authorization',
        'Secrets Management',
        'Vulnerability Scanning',
        'OWASP 10',
        'Attack Vectors',
      ],
    },
  },

  // EMAIL TESTING
  {
    id: 'n10',
    type: 'main',
    position: { x: 700, y: 1647.5 },
    data: { label: 'Email Testing' },
  },
  {
    id: 'n10a1',
    type: 'sub',
    position: { x: 900, y: 1750 },
    data: { label: 'Mailinator' },
  },
  {
    id: 'n10a2',
    type: 'sub',
    position: { x: 900, y: 1795 },
    data: { label: 'GmailTester' },
  },

  // TESTING DATA MANAGEMENT
  {
    id: 'n11',
    type: 'main',
    position: { x: 630, y: 1880 },
    data: { label: 'Testing Data Management' },
  },
  {
    id: 'n11a',
    type: 'sub',
    position: { x: 630, y: 1780 },
    data: { label: 'Delphix' },
  },

  // REPORTING
  {
    id: 'n12',
    type: 'main',
    position: { x: 722, y: 2100 },
    data: { label: 'Reporting' },
  },
  {
    id: 'n12a',
    type: 'sub',
    position: { x: 1000, y: 2040 },
    data: { label: 'TestRail' },
  },
  {
    id: 'n12b',
    type: 'sub',
    position: { x: 1000, y: 2093 },
    data: { label: 'Allure' },
  },
  {
    id: 'n12c',
    type: 'sub',
    position: { x: 1000, y: 2146 },
    data: { label: 'jUnit' },
  },

  // MONITORING & LOGS
  {
    id: 'n13',
    type: 'main',
    position: { x: 291, y: 2100 },
    data: { label: 'Monitoring & Logs' },
  },
  {
    id: 'n13a',
    type: 'sub',
    position: { x: 0, y: 1943 },
    data: { label: 'New Relic' },
  },
  {
    id: 'n13b',
    type: 'sub',
    position: { x: 4, y: 1993 },
    data: { label: 'Runscope' },
  },
  {
    id: 'n13c',
    type: 'sub',
    position: { x: 22, y: 2043 },
    data: { label: 'Kibana' },
  },
  {
    id: 'n13d',
    type: 'sub',
    position: { x: 15, y: 2093 },
    data: { label: 'Datadog' },
  },
  {
    id: 'n13e',
    type: 'sub',
    position: { x: -8, y: 2143 },
    data: { label: 'Pager Duty' },
  },
  {
    id: 'n13f',
    type: 'sub',
    position: { x: 13, y: 2193 },
    data: { label: 'Grafana' },
  },
  {
    id: 'n13g',
    type: 'sub',
    position: { x: 26, y: 2243 },
    data: { label: 'Sentry' },
  },

  // VERSION CONTROL
  {
    id: 'n14',
    type: 'main',
    position: { x: 301, y: 2300 },
    data: { label: 'Version Control' },
  },
  {
    id: 'n14a',
    type: 'sub',
    position: { x: 650, y: 2293 },
    data: { label: 'Git' },
  },

  // REPO HOSTING SERVICES
  {
    id: 'n15',
    type: 'main',
    position: { x: 321, y: 2450 },
    data: { label: 'Repo Hosting' },
  },
  {
    id: 'n15a',
    type: 'sub',
    position: { x: 100, y: 2393 },
    data: { label: 'GitHub' },
  },
  {
    id: 'n15b',
    type: 'sub',
    position: { x: 104, y: 2443 },
    data: { label: 'GitLab' },
  },
  {
    id: 'n15c',
    type: 'sub',
    position: { x: 83, y: 2493 },
    data: { label: 'Bitbucket' },
  },

  // CI/CD
  {
    id: 'n16',
    type: 'main',
    position: { x: 650, y: 2650 },
    data: { label: 'CI/CD' },
  },
  {
    id: 'n16a1',
    type: 'sub',
    position: { x: 770, y: 2450 },
    data: { label: 'Jenkins' },
  },
  {
    id: 'n16a2',
    type: 'sub',
    position: { x: 763, y: 2500 },
    data: { label: 'GitLab CI' },
  },
  {
    id: 'n16a3',
    type: 'sub',
    position: { x: 766, y: 2550 },
    data: { label: 'Circle CI' },
  },
  {
    id: 'n16b1',
    type: 'sub',
    position: { x: 913, y: 2450 },
    data: { label: 'Drone' },
  },
  {
    id: 'n16b2',
    type: 'sub',
    position: { x: 904, y: 2500 },
    data: { label: 'Bamboo' },
  },
  {
    id: 'n16b3',
    type: 'sub',
    position: { x: 900, y: 2550 },
    data: { label: 'Travis CI' },
  },
  {
    id: 'n16c1',
    type: 'sub',
    position: { x: 1090, y: 2500 },
    data: { label: 'TeamCity' },
  },
  {
    id: 'n16c2',
    type: 'sub',
    position: { x: 1035, y: 2550 },
    data: { label: 'Azure DevOps Services' },
  },

  // HEADLESS TESTING
  {
    id: 'n17',
    type: 'main',
    position: { x: 300, y: 2800 },
    data: { label: 'Headless Testing' },
  },
  {
    id: 'n17a1',
    type: 'sub',
    position: { x: -18, y: 2643 },
    data: { label: 'Puppeteer' },
  },
  {
    id: 'n17a2',
    type: 'sub',
    position: { x: 100, y: 2643 },
    data: { label: 'Zombie.js' },
  },
  {
    id: 'n17b1',
    type: 'sub',
    position: { x: -13, y: 2693 },
    data: { label: 'Playwright' },
  },
  {
    id: 'n17b2',
    type: 'sub',
    position: { x: 113, y: 2693 },
    data: { label: 'Cypress' },
  },
  {
    id: 'n17c',
    type: 'sub',
    position: { x: 38, y: 2743 },
    data: { label: 'Headless Chrome' },
  },
  {
    id: 'n17d',
    type: 'sub',
    position: { x: 73, y: 2793 },
    data: { label: 'Headless Fox' },
  },
  {
    id: 'n17e',
    type: 'sub',
    position: { x: 85, y: 2843 },
    data: { label: 'HTML Unit' },
  },

  // END
  {
    id: 'end',
    type: 'start',
    position: { x: 371.5, y: 2900 },
    data: { label: '|End|' },
  },
]

// ==========================================
// 5. Connections (Edges)
// ==========================================
const initialEdges = [
  // MAIN CONNECTIONS
  { id: 'e0-1', source: 'n0', sourceHandle: 'bottom-s', target: 'n1', targetHandle: 'top-t' },
  { id: 'e1-2', source: 'n1', sourceHandle: 'bottom-s', target: 'n2', targetHandle: 'top-t' },
  { id: 'e2-3', source: 'n2', sourceHandle: 'bottom-s', target: 'n3', targetHandle: 'top-t' },
  { id: 'e3-4', source: 'n3', sourceHandle: 'bottom-s', target: 'n4', targetHandle: 'top-t' },
  { id: 'e4-5', source: 'n4', sourceHandle: 'bottom-s', target: 'n5', targetHandle: 'top-t' },
  { id: 'e5-6', source: 'n5', sourceHandle: 'bottom-s', target: 'n6', targetHandle: 'top-t' },
  { id: 'e6-7', source: 'n6', sourceHandle: 'bottom-s', target: 'n7', targetHandle: 'top-t' },
  { id: 'e7-8', source: 'n7', sourceHandle: 'bottom-s', target: 'n8', targetHandle: 'top-t' },
  { id: 'e8-9', source: 'n8', sourceHandle: 'right-s', target: 'n9', targetHandle: 'left-t' },
  { id: 'e9-10', source: 'n9', sourceHandle: 'right-s', target: 'n10', targetHandle: 'left-t' },
  { id: 'e10-11', source: 'n10', sourceHandle: 'bottom-s', target: 'n11', targetHandle: 'top-t' },
  { id: 'e11-12', source: 'n11', sourceHandle: 'bottom-s', target: 'n12', targetHandle: 'top-t' },
  { id: 'e12-13', source: 'n12', sourceHandle: 'left-s', target: 'n13', targetHandle: 'right-t' },
  { id: 'e13-14', source: 'n13', sourceHandle: 'bottom-s', target: 'n14', targetHandle: 'top-t' },
  { id: 'e14-15', source: 'n14', sourceHandle: 'bottom-s', target: 'n15', targetHandle: 'top-t' },
  { id: 'e15-16', source: 'n15', sourceHandle: 'bottom-s', target: 'n16', targetHandle: 'top-t' },
  { id: 'e16-17', source: 'n16', sourceHandle: 'bottom-s', target: 'n17', targetHandle: 'top-t' },
  { id: 'e17-end', source: 'n17', sourceHandle: 'bottom-s', target: 'end', targetHandle: 'top-t' },

  // Z LEAR THE BASICS W PRAWO
  {
    id: 'e1-1a1',
    source: 'n1',
    sourceHandle: 'right-s',
    target: 'n1a1',
    targetHandle: 'left-t',
    animated: true,
  },
  {
    id: 'e1-1a2',
    source: 'n1',
    sourceHandle: 'right-s',
    target: 'n1a2',
    targetHandle: 'left-t',
    animated: true,
  },
  {
    id: 'e1-1a3',
    source: 'n1',
    sourceHandle: 'right-s',
    target: 'n1a3',
    targetHandle: 'left-t',
    animated: true,
  },
  // Z LEAR THE BASICS W LEWO
  {
    id: 'e1-1b1',
    source: 'n1',
    sourceHandle: 'left-s',
    target: 'n1b1',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'e1-1b2',
    source: 'n1',
    sourceHandle: 'left-s',
    target: 'n1b2',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'e1-1b3',
    source: 'n1',
    sourceHandle: 'left-s',
    target: 'n1b3',
    targetHandle: 'right-t',
    animated: true,
  },
  //Z TESTING APPROACHES NA DOL
  {
    id: 'n1b3-n1b3a',
    source: 'n1b3',
    sourceHandle: 'bottom-s',
    target: 'n1b3a',
    targetHandle: 'top-t',
    animated: true,
  },

  // Z TESTING TECHNIQUES NA DOL
  {
    id: 'ntt-ntt1',
    source: 'ntt',
    sourceHandle: 'bottom-s',
    target: 'ntt1',
    targetHandle: 'top-t',
    animated: true,
  },
  {
    id: 'ntt-ntt2',
    source: 'ntt',
    sourceHandle: 'bottom-s',
    target: 'ntt2',
    targetHandle: 'top-t',
    animated: true,
  },
  // Z SDLC DELIVERY NA LEWO
  {
    id: 'n2-n2a1',
    source: 'n2',
    sourceHandle: 'left-s',
    target: 'n2a1',
    targetHandle: 'bottom-t',
    animated: true,
  },
  {
    id: 'n2-n2b',
    source: 'n2',
    sourceHandle: 'left-s',
    target: 'n2b',
    targetHandle: 'top-t',
    animated: true,
  },
  // Z METHODOLOGIES
  {
    id: 'n3-n3a1',
    source: 'n3',
    sourceHandle: 'right-s',
    target: 'n3a1',
    targetHandle: 'top-t',
    animated: true,
  },
  {
    id: 'n3-n3b1',
    source: 'n3',
    sourceHandle: 'left-s',
    target: 'n3b1',
    targetHandle: 'top-t',
    animated: true,
  },
  // MANUAL TESTING
  {
    id: 'n4-n4a',
    source: 'n4',
    sourceHandle: 'left-s',
    target: 'n4a',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n4-n4b',
    source: 'n4',
    sourceHandle: 'left-s',
    target: 'n4b',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n4-n4c',
    source: 'n4',
    sourceHandle: 'left-s',
    target: 'n4c',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n4-n4d',
    source: 'n4',
    sourceHandle: 'left-s',
    target: 'n4d',
    targetHandle: 'right-t',
    animated: true,
  },
  // AUTOMATED TESTING
  {
    id: 'n5-n5a',
    source: 'n5',
    sourceHandle: 'right-s',
    target: 'n5a',
    targetHandle: 'left-t',
    animated: true,
  },
  {
    id: 'n5a-n5a1',
    source: 'n5a',
    sourceHandle: 'bottom-s',
    target: 'n5a1',
    targetHandle: 'top-t',
    animated: true,
  },
  {
    id: 'n5-n5b',
    source: 'n5',
    sourceHandle: 'left-s',
    target: 'n5b',
    targetHandle: 'top-t',
    animated: true,
  },
  {
    id: 'n5-n5c',
    source: 'n5',
    sourceHandle: 'left-s',
    target: 'n5c',
    targetHandle: 'top-t',
    animated: true,
  },
  // EMAIL TESTING
  {
    id: 'n10-n10a1',
    source: 'n10',
    sourceHandle: 'right-s',
    target: 'n10a1',
    targetHandle: 'top-t',
    animated: true,
  },

  // TESTING DATA MANAGEMENT
  {
    id: 'n11-n11a',
    source: 'n11',
    sourceHandle: 'left-s',
    target: 'n11a',
    targetHandle: 'bottom-t',
    animated: true,
  },

  // REPORTING
  {
    id: 'n12-n12a',
    source: 'n12',
    sourceHandle: 'right-s',
    target: 'n12a',
    targetHandle: 'left-t',
    animated: true,
  },
  {
    id: 'n12-n12b',
    source: 'n12',
    sourceHandle: 'right-s',
    target: 'n12b',
    targetHandle: 'left-t',
    animated: true,
  },
  {
    id: 'n12-n12c',
    source: 'n12',
    sourceHandle: 'right-s',
    target: 'n12c',
    targetHandle: 'left-t',
    animated: true,
  },

  // MONITORING LOGS
  {
    id: 'n13-n12a',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13a',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12b',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13b',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12c',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13c',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12d',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13d',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12e',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13e',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12f',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13f',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n13-n12g',
    source: 'n13',
    sourceHandle: 'left-s',
    target: 'n13g',
    targetHandle: 'right-t',
    animated: true,
  },

  // VERSION CONTROL
  {
    id: 'n14-n14a',
    source: 'n14',
    sourceHandle: 'right-s',
    target: 'n14a',
    targetHandle: 'left-t',
    animated: true,
  },

  // REPO HOSTING
  {
    id: 'n15-n15a',
    source: 'n15',
    sourceHandle: 'left-s',
    target: 'n15a',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n15-n15b',
    source: 'n15',
    sourceHandle: 'left-s',
    target: 'n15b',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n15-n15c',
    source: 'n15',
    sourceHandle: 'left-s',
    target: 'n15c',
    targetHandle: 'right-t',
    animated: true,
  },

  // CI/CD
  {
    id: 'n16-n16a3',
    source: 'n16',
    sourceHandle: 'right-s',
    target: 'n16a3',
    targetHandle: 'bottom-t',
    animated: true,
  },
  {
    id: 'n16-n16b3',
    source: 'n16',
    sourceHandle: 'right-s',
    target: 'n16b3',
    targetHandle: 'bottom-t',
    animated: true,
  },
  {
    id: 'n16-n16c2',
    source: 'n16',
    sourceHandle: 'right-s',
    target: 'n16c2',
    targetHandle: 'bottom-t',
    animated: true,
  },

  // HEADLESS TESTING

  {
    id: 'n17-n17a2',
    source: 'n17',
    sourceHandle: 'left-s',
    target: 'n17a2',
    targetHandle: 'right-t',
    animated: true,
  },

  {
    id: 'n17-n17b2',
    source: 'n17',
    sourceHandle: 'left-s',
    target: 'n17b2',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n17-n17c',
    source: 'n17',
    sourceHandle: 'left-s',
    target: 'n17c',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n17-n17d',
    source: 'n17',
    sourceHandle: 'left-s',
    target: 'n17d',
    targetHandle: 'right-t',
    animated: true,
  },
  {
    id: 'n17-n17e',
    source: 'n17',
    sourceHandle: 'left-s',
    target: 'n17e',
    targetHandle: 'right-t',
    animated: true,
  },
]

// ==========================================
// 6. Main Roadmap Component
// ==========================================

export function RoadmapGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  return (
    <div className="border-foreground/10 h-full w-full overflow-hidden border bg-zinc-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        colorMode="dark"
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Controls className="fill-zinc-300" />
        <Background variant={BackgroundVariant.Lines} gap={30} size={1} color="#0a0a0a" />
      </ReactFlow>
    </div>
  )
}
