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
  <div className="min-w-48 rounded-lg border border-purple-800 bg-zinc-900 p-3">
    <UniversalHandles />
    <div className="mb-2 border-b font-serif tracking-wide text-yellow-500">{data.label}</div>
    <ul className="flex flex-col gap-2 text-center">
      {data.items?.map((item: string, index: number) => (
        <li key={index} className="border font-bold">
          {item}
        </li>
      ))}
    </ul>
  </div>
)

// ==========================================
// 3. Component Registration
// ==========================================
const nodeTypes = {
  main: MainNode,
  sub: SubNode,
  list: ListNode,
}

// ==========================================
// 4. Structure (Nodes)
// ==========================================
const initialNodes = [
  // POZIOM 1
  {
    id: 'n1',
    type: 'main',
    position: { x: 300, y: 0 },
    data: { label: 'Learn the Basics', sub: 'Krok 1' },
  },
  //PRAWO
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
    position: { x: 835, y: 85 },
    data: { label: 'Manage your Testing', items: ['qTest', 'TestRail', 'TestLink', 'Zephyr'] },
  },
  //LEWO
  { id: 'n1b1', type: 'sub', position: { x: 0, y: -30 }, data: { label: 'What is QA?' } },
  { id: 'n1b2', type: 'sub', position: { x: 0, y: 20 }, data: { label: 'QA Mindset' } },
  { id: 'n1b3', type: 'sub', position: { x: 0, y: 70 }, data: { label: 'Testing Approaches' } },
  { id: 'n1b3a', type: 'sub', position: { x: 0, y: 150 }, data: { label: 'White Box Testing' } },
  { id: 'n1b3b', type: 'sub', position: { x: 0, y: 195 }, data: { label: 'Grey Box Testing' } },
  { id: 'n1b3c', type: 'sub', position: { x: 0, y: 240 }, data: { label: 'Black Box Testing' } },

  // POZIOMY 2-6
  { id: 'n2', type: 'main', position: { x: 285, y: 150 }, data: { label: 'SDLC Delivery' } },
  { id: 'n3', type: 'main', position: { x: 278, y: 300 }, data: { label: 'Methodologies' } },
  { id: 'n4', type: 'main', position: { x: 305, y: 450 }, data: { label: 'Manual Testing' } },
  { id: 'n5', type: 'main', position: { x: 302, y: 600 }, data: { label: 'Test Automation' } },
  { id: 'n6', type: 'main', position: { x: 300, y: 750 }, data: { label: 'Non-Functional' } },
]

// ==========================================
// 5. Connections (Edges)
// ==========================================
const initialEdges = [
  // Z N1 W DÓŁ
  { id: 'e1-2', source: 'n1', sourceHandle: 'bottom-s', target: 'n2', targetHandle: 'top-t' },

  // Z N1 W PRAWO
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
  // Z N1 W LEWO
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
  //Z N1B3 NA DOL
  {
    id: 'n1b3-n1b3a',
    source: 'n1b3',
    sourceHandle: 'bottom-s',
    target: 'n1b3a',
    targetHandle: 'top-t',
    animated: true,
  },

  // PIONOWY GŁÓWNY NURT
  { id: 'e2-3', source: 'n2', sourceHandle: 'bottom-s', target: 'n3', targetHandle: 'top-t' },
  { id: 'e3-4', source: 'n3', sourceHandle: 'bottom-s', target: 'n4', targetHandle: 'top-t' },
  { id: 'e4-5', source: 'n4', sourceHandle: 'bottom-s', target: 'n5', targetHandle: 'top-t' },
  { id: 'e5-6', source: 'n5', sourceHandle: 'bottom-s', target: 'n6', targetHandle: 'top-t' },
]

// ==========================================
// 6. Main Roadmap Component
// ==========================================
export function RoadmapGraph() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  // Usunąłem onConnect, bo i tak blokujemy możliwość łączenia przez użytkownika

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
        // Blokada interakcji:
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable={false}
      >
        <Controls className="fill-zinc-300" />
        <Background variant={BackgroundVariant.Lines} gap={30} size={1} color="#0a0a0a" />
      </ReactFlow>
    </div>
  )
}
