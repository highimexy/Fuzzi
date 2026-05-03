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
    position: { x: 355, y: -150 },
    data: { label: '|Start|' },
  },

  // LEARN THE BASICS
  {
    id: 'n1',
    type: 'main',
    position: { x: 300, y: 0 },
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
  { id: 'n1b1', type: 'sub', position: { x: 0, y: -30 }, data: { label: 'What is QA?' } },
  { id: 'n1b2', type: 'sub', position: { x: 0, y: 20 }, data: { label: 'QA Mindset' } },
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
  { id: 'n2', type: 'main', position: { x: 319, y: 380 }, data: { label: 'SDLC Delivery' } },

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
  { id: 'n3', type: 'main', position: { x: 310.5, y: 550 }, data: { label: 'Methodologies' } },
  { id: 'n3a1', type: 'sub', position: { x: 540, y: 610 }, data: { label: 'BDD' } },
  { id: 'n3a2', type: 'sub', position: { x: 540, y: 655 }, data: { label: 'RCA' } },
  { id: 'n3b1', type: 'sub', position: { x: 250, y: 610 }, data: { label: 'TDD' } },
  { id: 'n3b2', type: 'sub', position: { x: 250, y: 655 }, data: { label: 'ATDD' } },

  //MANUAL TESTING
  { id: 'n4', type: 'main', position: { x: 306, y: 780 }, data: { label: 'Manual Testing' } },
  {
    id: 'n4a',
    type: 'sub',
    position: { x: -50, y: 700 },
    data: { label: 'Test Cases & Scenarios' },
  },
  { id: 'n4b', type: 'sub', position: { x: -50, y: 750 }, data: { label: 'Compatibility' } },
  {
    id: 'n4c',
    type: 'sub',
    position: { x: -50, y: 800 },
    data: { label: 'Verification & Validation' },
  },
  { id: 'n4d', type: 'sub', position: { x: -50, y: 850 }, data: { label: 'Test Planning' } },

  // AUTOMATED TESTING
  { id: 'n5', type: 'main', position: { x: 287, y: 950 }, data: { label: 'Automated Testing' } },
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
  { id: 'n6', type: 'main', position: { x: 305, y: 1150 }, data: { label: 'Non-Functional' } },

  // ACCESSIBILITY
  {
    id: 'n7',
    type: 'list',
    position: { x: 342, y: 1250 },
    data: { label: 'Accessibility', items: ['Wave', 'Axe', 'Chrome DevTools'] },
  },

  // LOAD & PERFORMANCE
  {
    id: 'n8',
    type: 'list',
    position: { x: -100, y: 1500 },
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
    position: { x: 700, y: 1850 },
    data: { label: 'Testing Data Management' },
  },
  {
    id: 'n11a',
    type: 'sub',
    position: { x: 850, y: 1900 },
    data: { label: 'Delphix' },
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
