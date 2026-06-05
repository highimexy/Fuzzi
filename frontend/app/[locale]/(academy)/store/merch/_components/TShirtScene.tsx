'use client'

import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls, useGLTF, Float, Center } from '@react-three/drei'

function TShirtModel({ scale }: { scale: number }) {
  const { scene } = useGLTF('/models/tshirt.glb')
  return (
    <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.3}>
      <Center>
        <primitive object={scene} scale={scale} />
      </Center>
    </Float>
  )
}

useGLTF.preload('/models/tshirt.glb')

export function TShirtScene() {
  const [scale, setScale] = useState(0.55)

  useEffect(() => {
    const update = () => setScale(window.innerWidth < 768 ? 1.1 : 1.4)
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 7], fov: 40 }}
      style={{ background: 'transparent' }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={0.6} />
      <directionalLight position={[4, 5, 3]} intensity={1.3} />
      <directionalLight position={[-3, -2, 2]} intensity={0.4} color="#8899ff" />
      <pointLight position={[0, 2, 3]} intensity={0.5} color="#fde047" />

      <Suspense fallback={null}>
        <TShirtModel scale={scale} />
      </Suspense>

      <OrbitControls
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
      />
    </Canvas>
  )
}
