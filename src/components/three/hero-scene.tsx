import { Suspense, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Icosahedron, MeshDistortMaterial, Environment, Stars } from '@react-three/drei';
import * as THREE from 'three';

function Crystal({ position, color, scale = 1, speed = 1 }: { position: [number, number, number]; color: string; scale?: number; speed?: number }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((state) => {
    if (!ref.current) return;
    ref.current.rotation.x = state.clock.elapsedTime * 0.2 * speed;
    ref.current.rotation.y = state.clock.elapsedTime * 0.3 * speed;
  });
  return (
    <Float speed={1.5} rotationIntensity={0.6} floatIntensity={1.2}>
      <Icosahedron ref={ref} args={[1, 0]} position={position} scale={scale}>
        <MeshDistortMaterial
          color={color}
          emissive={color}
          emissiveIntensity={0.4}
          roughness={0.15}
          metalness={0.85}
          distort={0.35}
          speed={1.5}
        />
      </Icosahedron>
    </Float>
  );
}

function Particles() {
  const ref = useRef<THREE.Points>(null);
  const positions = useMemo(() => {
    const arr = new Float32Array(400 * 3);
    for (let i = 0; i < 400; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 1] = (Math.random() - 0.5) * 30;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30;
    }
    return arr;
  }, []);
  useFrame((state) => {
    if (ref.current) ref.current.rotation.y = state.clock.elapsedTime * 0.03;
  });
  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} count={positions.length / 3} />
      </bufferGeometry>
      <pointsMaterial size={0.04} color="#a5f3fc" transparent opacity={0.7} sizeAttenuation />
    </points>
  );
}

export function HeroScene() {
  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 50 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, alpha: true }}
      className="!absolute inset-0"
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.4} />
        <pointLight position={[10, 10, 10]} intensity={1.2} color="#c4b5fd" />
        <pointLight position={[-10, -5, -5]} intensity={1} color="#67e8f9" />
        <pointLight position={[0, -10, 5]} intensity={0.6} color="#f0abfc" />

        <Stars radius={50} depth={50} count={1500} factor={3} fade speed={1} />
        <Particles />

        <Crystal position={[-3.5, 1, 0]} color="#818cf8" scale={1.2} speed={0.8} />
        <Crystal position={[3.5, -0.5, -1]} color="#67e8f9" scale={1.4} speed={1} />
        <Crystal position={[0, 2.2, -2]} color="#c4b5fd" scale={0.9} speed={1.2} />
        <Crystal position={[2, 2, 1.5]} color="#a5f3fc" scale={0.6} speed={1.4} />
        <Crystal position={[-2.5, -1.8, 1]} color="#a78bfa" scale={0.8} speed={0.9} />

        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}