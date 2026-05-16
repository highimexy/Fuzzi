'use client'

import { useState, useEffect, useCallback } from 'react'
import { useTheme } from 'next-themes'
import { FiX } from 'react-icons/fi'
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
import { TopicSidebarContent } from './AcademyRoadMapSidebarContent'
import '@xyflow/react/dist/style.css'

// ==========================================
// 1. Ports
// ==========================================
const UniversalHandles = () => (
  <>
    <Handle
      id="top-t"
      type="target"
      position={Position.Top}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="top-s"
      type="source"
      position={Position.Top}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="bottom-t"
      type="target"
      position={Position.Bottom}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="bottom-s"
      type="source"
      position={Position.Bottom}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="left-t"
      type="target"
      position={Position.Left}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="left-s"
      type="source"
      position={Position.Left}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="right-t"
      type="target"
      position={Position.Right}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
    <Handle
      id="right-s"
      type="source"
      position={Position.Right}
      className="bg-foreground/30! dark:bg-foreground/20!"
    />
  </>
)

// ==========================================
// 2. Nodes Styles
// ==========================================
const MainNode = ({ data }: { data: any }) => (
  <div className="bg-background border-foreground/20 min-w-48 cursor-pointer border-2 px-6 py-4 text-center transition-colors hover:border-accent">
    <UniversalHandles />
    <div className="text-foreground font-serif tracking-widest uppercase transition-colors">
      {data.label}
    </div>
  </div>
)

const SubNode = ({ data }: { data: any }) => (
  <div className="border-foreground/20 bg-background min-w-32 cursor-pointer border px-4 py-2 text-center transition-colors hover:border-accent">
    <UniversalHandles />
    <div className="font-serif tracking-wide text-accent transition-colors">{data.label}</div>
  </div>
)

const ListNode = ({ data }: { data: any }) => (
  <div className="border-foreground/30 bg-background flex min-w-48 flex-col border p-3 transition-colors">
    <UniversalHandles />
    <div className="border-foreground/20 mb-2 flex cursor-pointer justify-center border-b font-serif tracking-wide text-accent transition-colors hover:text-accent">
      {data.label}
    </div>
    <ul className="flex flex-col gap-2 text-center">
      {data.items?.map((item: string, index: number) => (
        <li
          key={index}
          className="border-foreground/20 bg-background text-foreground cursor-pointer border font-bold transition-colors hover:border-accent"
        >
          {item}
        </li>
      ))}
    </ul>
  </div>
)

const StartNode = ({ data }: { data: any }) => (
  <div className="text-center">
    <UniversalHandles />
    <div className="font-serif text-4xl tracking-wide text-accent transition-colors">
      {data.label}
    </div>
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
  { id: 'n0', type: 'start', position: { x: 347, y: -150 }, data: { label: '|Start|' } },
  { id: 'n1', type: 'main', position: { x: 295, y: 0 }, data: { label: 'Learn the Basics' } },
  { id: 'n1a1', type: 'sub', position: { x: 650, y: -15 }, data: { label: 'Test Oracles' } },
  { id: 'n1a2', type: 'sub', position: { x: 650, y: 35 }, data: { label: 'Test Prioritization' } },
  {
    id: 'n1a3',
    type: 'list',
    position: { x: 650, y: 85 },
    data: { label: 'Testing Approaches', items: ['Atlassian', 'Assembla', 'YouTrack', 'Trello'] },
  },
  {
    id: 'n1a4',
    type: 'list',
    position: { x: 842, y: 85 },
    data: { label: 'Manage your Testing', items: ['qTest', 'TestRail', 'TestLink', 'Zephyr'] },
  },
  { id: 'n1b1', type: 'sub', position: { x: 59, y: -30 }, data: { label: 'What is QA?' } },
  { id: 'n1b2', type: 'sub', position: { x: 66, y: 20 }, data: { label: 'QA Mindset' } },
  { id: 'n1b3', type: 'sub', position: { x: 0, y: 70 }, data: { label: 'Testing Approaches' } },
  { id: 'n1b3a', type: 'sub', position: { x: 5, y: 150 }, data: { label: 'White Box Testing' } },
  { id: 'n1b3b', type: 'sub', position: { x: 11, y: 192 }, data: { label: 'Grey Box Testing' } },
  { id: 'n1b3c', type: 'sub', position: { x: 8, y: 234 }, data: { label: 'Black Box Testing' } },
  { id: 'ntt', type: 'main', position: { x: 650, y: 310 }, data: { label: 'Testing Techniques' } },
  {
    id: 'ntt1',
    type: 'list',
    position: { x: 650, y: 425 },
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
    position: { x: 850, y: 425 },
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
  { id: 'n2', type: 'main', position: { x: 314, y: 380 }, data: { label: 'SDLC Delivery' } },
  { id: 'n2a1', type: 'sub', position: { x: 227, y: 315 }, data: { label: 'Waterfall' } },
  { id: 'n2a2', type: 'sub', position: { x: 227, y: 273 }, data: { label: 'V Model' } },
  { id: 'n2a3', type: 'sub', position: { x: 227, y: 231 }, data: { label: 'Spiral' } },
  {
    id: 'n2b',
    type: 'list',
    position: { x: 0, y: 420 },
    data: { label: 'Functional Testing', items: ['Kanban', 'Scrum', 'XP', 'SAFe'] },
  },
  { id: 'n3', type: 'main', position: { x: 305.5, y: 550 }, data: { label: 'Methodologies' } },
  { id: 'n3a1', type: 'sub', position: { x: 495, y: 620 }, data: { label: 'BDD' } },
  { id: 'n3a2', type: 'sub', position: { x: 495, y: 662 }, data: { label: 'RCA' } },
  { id: 'n3b1', type: 'sub', position: { x: 215, y: 620 }, data: { label: 'TDD' } },
  { id: 'n3b2', type: 'sub', position: { x: 215, y: 662 }, data: { label: 'ATDD' } },
  { id: 'n4', type: 'main', position: { x: 301, y: 780 }, data: { label: 'Manual Testing' } },
  {
    id: 'n4a',
    type: 'sub',
    position: { x: -55, y: 700 },
    data: { label: 'Test Cases & Scenarios' },
  },
  { id: 'n4b', type: 'sub', position: { x: 24, y: 750 }, data: { label: 'Compatibility' } },
  {
    id: 'n4c',
    type: 'sub',
    position: { x: -71, y: 800 },
    data: { label: 'Verification & Validation' },
  },
  { id: 'n4d', type: 'sub', position: { x: 23, y: 850 }, data: { label: 'Test Planning' } },
  { id: 'n5', type: 'main', position: { x: 282, y: 950 }, data: { label: 'Automated Testing' } },
  { id: 'n5a', type: 'sub', position: { x: 653, y: 959 }, data: { label: 'Frontend Automation' } },
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
    position: { x: 1106, y: 1050 },
    data: { label: 'Browser Addons', items: ['Selenium IDE', 'BugBug', 'Ghost Inspector'] },
  },
  {
    id: 'n5b',
    type: 'list',
    position: { x: 22, y: 1050 },
    data: {
      label: 'Backend Automation',
      items: [
        'Karate Framework',
        'Cypress',
        'Playwright',
        'SoapUI',
        'Postman / Newman',
        'REST Assured',
      ],
    },
  },
  {
    id: 'n5c',
    type: 'list',
    position: { x: -175, y: 1050 },
    data: { label: 'Mobile Automation', items: ['Espresso', 'Detox', 'Appium', 'Swift Testing'] },
  },
  { id: 'n6', type: 'main', position: { x: 300, y: 1150 }, data: { label: 'Non-Functional' } },
  {
    id: 'n7',
    type: 'list',
    position: { x: 324.3, y: 1260 },
    data: { label: 'Accessibility', items: ['Wave', 'Axe', 'Chrome DevTools'] },
  },
  {
    id: 'n8',
    type: 'list',
    position: { x: -95, y: 1500 },
    data: {
      label: 'Load & Performance',
      items: [
        'Lighthouse',
        'Locust',
        'WebPageTest',
        'Gatling',
        'K6',
        'Artillery',
        'Vegeta',
        'JMeter',
      ],
    },
  },
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
  { id: 'n10', type: 'main', position: { x: 700, y: 1631.5 }, data: { label: 'Email Testing' } },
  { id: 'n10a1', type: 'sub', position: { x: 900, y: 1750 }, data: { label: 'Mailinator' } },
  { id: 'n10a2', type: 'sub', position: { x: 895, y: 1792 }, data: { label: 'GmailTester' } },
  {
    id: 'n11',
    type: 'main',
    position: { x: 630, y: 1880 },
    data: { label: 'Testing Data Management' },
  },
  { id: 'n11a', type: 'sub', position: { x: 630, y: 1780 }, data: { label: 'Delphix' } },
  { id: 'n12', type: 'main', position: { x: 711.5, y: 2100 }, data: { label: 'Reporting' } },
  { id: 'n12a', type: 'sub', position: { x: 1000, y: 2040 }, data: { label: 'TestRail' } },
  { id: 'n12b', type: 'sub', position: { x: 1000, y: 2093 }, data: { label: 'Allure' } },
  { id: 'n12c', type: 'sub', position: { x: 1000, y: 2146 }, data: { label: 'jUnit' } },
  { id: 'n13', type: 'main', position: { x: 291, y: 2100 }, data: { label: 'Monitoring & Logs' } },
  { id: 'n13a', type: 'sub', position: { x: -8, y: 1943 }, data: { label: 'New Relic' } },
  { id: 'n13b', type: 'sub', position: { x: -8, y: 1993 }, data: { label: 'Runscope' } },
  { id: 'n13c', type: 'sub', position: { x: -8, y: 2043 }, data: { label: 'Kibana' } },
  { id: 'n13d', type: 'sub', position: { x: -8, y: 2093 }, data: { label: 'Datadog' } },
  { id: 'n13e', type: 'sub', position: { x: -8, y: 2143 }, data: { label: 'Pager Duty' } },
  { id: 'n13f', type: 'sub', position: { x: -8, y: 2193 }, data: { label: 'Grafana' } },
  { id: 'n13g', type: 'sub', position: { x: -8, y: 2243 }, data: { label: 'Sentry' } },
  { id: 'n14', type: 'main', position: { x: 301, y: 2300 }, data: { label: 'Version Control' } },
  { id: 'n14a', type: 'sub', position: { x: 650, y: 2309 }, data: { label: 'Git' } },
  { id: 'n15', type: 'main', position: { x: 321, y: 2450 }, data: { label: 'Repo Hosting' } },
  { id: 'n15a', type: 'sub', position: { x: 83, y: 2393 }, data: { label: 'GitHub' } },
  { id: 'n15b', type: 'sub', position: { x: 83, y: 2443 }, data: { label: 'GitLab' } },
  { id: 'n15c', type: 'sub', position: { x: 83, y: 2493 }, data: { label: 'Bitbucket' } },
  { id: 'n16', type: 'main', position: { x: 650, y: 2650 }, data: { label: 'CI/CD' } },
  { id: 'n16a1', type: 'sub', position: { x: 766, y: 2450 }, data: { label: 'Jenkins' } },
  { id: 'n16a2', type: 'sub', position: { x: 766, y: 2500 }, data: { label: 'GitLab CI' } },
  { id: 'n16a3', type: 'sub', position: { x: 766, y: 2550 }, data: { label: 'Circle CI' } },
  { id: 'n16b1', type: 'sub', position: { x: 900, y: 2450 }, data: { label: 'Drone' } },
  { id: 'n16b2', type: 'sub', position: { x: 900, y: 2500 }, data: { label: 'Bamboo' } },
  { id: 'n16b3', type: 'sub', position: { x: 900, y: 2550 }, data: { label: 'Travis CI' } },
  { id: 'n16c1', type: 'sub', position: { x: 1086, y: 2507 }, data: { label: 'TeamCity' } },
  {
    id: 'n16c2',
    type: 'sub',
    position: { x: 1035, y: 2550 },
    data: { label: 'Azure DevOps Services' },
  },
  { id: 'n17', type: 'main', position: { x: 300, y: 2800 }, data: { label: 'Headless Testing' } },
  { id: 'n17a1', type: 'sub', position: { x: -42, y: 2643 }, data: { label: 'Puppeteer' } },
  { id: 'n17a2', type: 'sub', position: { x: 86, y: 2643 }, data: { label: 'Zombie.js' } },
  { id: 'n17b1', type: 'sub', position: { x: -42, y: 2693 }, data: { label: 'Playwright' } },
  { id: 'n17b2', type: 'sub', position: { x: 86, y: 2693 }, data: { label: 'Cypress' } },
  { id: 'n17c', type: 'sub', position: { x: 35, y: 2743 }, data: { label: 'Headless Chrome' } },
  { id: 'n17d', type: 'sub', position: { x: 73, y: 2793 }, data: { label: 'Headless Fox' } },
  { id: 'n17e', type: 'sub', position: { x: 84, y: 2843 }, data: { label: 'HTML Unit' } },
  { id: 'end', type: 'start', position: { x: 369.2, y: 2910 }, data: { label: '|End|' } },
]

// ==========================================
// 5. Connections (Edges)
// ==========================================
const initialEdges = [
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
  {
    id: 'n1b3-n1b3a',
    source: 'n1b3',
    sourceHandle: 'bottom-s',
    target: 'n1b3a',
    targetHandle: 'top-t',
    animated: true,
  },
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
  {
    id: 'n10-n10a1',
    source: 'n10',
    sourceHandle: 'right-s',
    target: 'n10a1',
    targetHandle: 'top-t',
    animated: true,
  },
  {
    id: 'n11-n11a',
    source: 'n11',
    sourceHandle: 'left-s',
    target: 'n11a',
    targetHandle: 'bottom-t',
    animated: true,
  },
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
  {
    id: 'n14-n14a',
    source: 'n14',
    sourceHandle: 'right-s',
    target: 'n14a',
    targetHandle: 'left-t',
    animated: true,
  },
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

  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  const [selectedTopic, setSelectedTopic] = useState<{ title: string; type: string } | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    const target = event.target as HTMLElement

    if (target.tagName.toLowerCase() === 'li') {
      setSelectedTopic({ title: target.innerText, type: 'Sub-topic' })
    } else if (node.type !== 'start') {
      setSelectedTopic({ title: node.data.label, type: 'Category' })
    }
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <div className="border-foreground/10 bg-background relative h-full w-full overflow-hidden border">
      {/* UKRYTY NAGŁÓWEK H1 DLA STRUKTURY DOKUMENTU */}
      <h1 className="sr-only">Interactive Learning Roadmap</h1>

      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={handleNodeClick}
        colorMode={isDark ? 'dark' : 'light'}
        fitView
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
        defaultEdgeOptions={{
          type: 'smoothstep',
          style: { strokeWidth: 2 },
        }}
      >
        <Controls className={isDark ? 'fill-zinc-300' : 'fill-zinc-700'} />
        <Background
          variant={BackgroundVariant.Lines}
          gap={30}
          size={1}
          color={isDark ? '#0a0a0a' : '#e5e5e5'}
        />
      </ReactFlow>

      {/* BOCZNY PANEL (MODAL / SIDEBAR) */}
      <div
        className={`bg-background border-foreground/10 absolute top-0 right-0 z-50 flex h-full w-full flex-col border-l transition-transform duration-300 ease-in-out lg:w-150 ${
          selectedTopic ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {selectedTopic && (
          <>
            <div className="border-foreground/10 flex flex-col border-b p-4">
              <div className="flex items-center justify-between">
                <span className="font-bold tracking-widest text-accent uppercase">
                  {selectedTopic.type}
                </span>
                <button
                  onClick={() => setSelectedTopic(null)}
                  className="text-foreground/50 hover:text-foreground p-2 transition-colors"
                >
                  <FiX className="text-2xl" />
                </button>
              </div>
              {/* ZMIENIONO H3 NA H2 Z ODPOWIEDNIĄ KLASĄ WIELKOŚCI */}
              <h2 className="mt-2 font-serif text-2xl font-bold md:text-3xl">
                {selectedTopic.title}
              </h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <TopicSidebarContent topicTitle={selectedTopic.title} />
            </div>
          </>
        )}
      </div>
    </div>
  )
}
