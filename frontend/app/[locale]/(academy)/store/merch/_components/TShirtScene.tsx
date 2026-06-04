'use client'

import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, Text3D, Center, Float } from '@react-three/drei'

function TShirtText() {
  return (
    <Float speed={1.4} rotationIntensity={0.2} floatIntensity={0.4}>
      <Suspense fallback={null}>
        <Center>
          <Text3D
            font="/fonts/serif-bold.typeface.json"
            size={0.36}
            height={0.18}
            curveSegments={12}
            bevelEnabled
            bevelThickness={0.02}
            bevelSize={0.02}
            bevelSegments={4}
          >
            T-SHIRT
            <meshStandardMaterial color="#fde047" metalness={0.1} roughness={0.4} />
          </Text3D>
        </Center>
      </Suspense>
    </Float>
  )
}

export function TShirtScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 40 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.5} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#8899ff" />
      <pointLight position={[0, 0, 4]} intensity={0.5} color="#fde047" />

      <TShirtText />

      <OrbitControls enableZoom={false} enablePan={false} />
    </Canvas>
  )
}
