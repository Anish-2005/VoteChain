import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import type { ThreeElements } from '@react-three/fiber';
import { Sphere, Box, Torus, Float, Text, Stars } from '@react-three/drei';
import * as THREE from 'three';

// Ensure TypeScript recognizes @react-three/fiber intrinsic elements
declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

// Animated Blockchain Cube
function BlockchainCube({ position, delay = 0 }: { position: [number, number, number]; delay?: number }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const boxMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#00ffff",
    emissive: "#001122",
    emissiveIntensity: 0.2,
    transparent: true,
    opacity: 0.8,
    wireframe: true
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime + delay) * 0.3;
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime + delay) * 0.2;
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + delay) * 0.1;
    }
  });

  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
      <Box ref={meshRef} position={position} args={[0.8, 0.8, 0.8]} material={boxMaterial} />
    </Float>
  );
}

// Animated Chain Links
function ChainLink({ position, rotation }: { position: [number, number, number]; rotation: [number, number, number] }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const torusMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#ff6b35",
    emissive: "#331100",
    emissiveIntensity: 0.1,
    metalness: 0.8,
    roughness: 0.2
  }), []);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.1;
    }
  });

  return (
    <Torus ref={meshRef} position={position} rotation={rotation} args={[0.3, 0.1, 8, 16]} material={torusMaterial} />
  );
}

// Floating Crypto Symbols
function CryptoSymbol({ symbol, position }: { symbol: string; position: [number, number, number] }) {
  const textRef = useRef<any>(null);

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.2;
      textRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.3;
    }
  });

  return (
    <Float speed={1} rotationIntensity={0.2} floatIntensity={0.3}>
      <Text
        ref={textRef}
        position={position}
        fontSize={0.5}
        color="#00ff88"
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </Float>
  );
}

// Main 3D Scene
function BlockchainScene() {
  const cubes = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let i = 0; i < 8; i++) {
      positions.push([
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10
      ]);
    }
    return positions;
  }, []);

  const chainLinks = useMemo(() => {
    const links: { position: [number, number, number]; rotation: [number, number, number] }[] = [];
    for (let i = 0; i < 12; i++) {
      links.push({
        position: [
          (Math.random() - 0.5) * 15,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ],
        rotation: [0, 0, Math.random() * Math.PI * 2]
      });
    }
    return links;
  }, []);

  const sphereMaterial = useMemo(() => new THREE.MeshStandardMaterial({
    color: "#0066ff",
    emissive: "#001133",
    emissiveIntensity: 0.3,
    transparent: true,
    opacity: 0.7
  }), []);

  return (
    <>
      {/* Lighting */}
      {/* @ts-ignore */}
      <ambientLight intensity={0.3} />
      {/* @ts-ignore */}
      <pointLight position={[10, 10, 10]} intensity={0.5} color="#00ffff" />
      {/* @ts-ignore */}
      <pointLight position={[-10, -10, -10]} intensity={0.3} color="#ff6b35" />
      {/* @ts-ignore */}
      <spotLight
        position={[0, 20, 0]}
        angle={0.3}
        penumbra={1}
        intensity={0.5}
        color="#ffffff"
        castShadow
      />

      {/* Background Stars */}
      <Stars radius={100} depth={50} count={1000} factor={4} saturation={0} fade speed={1} />

      {/* Central Blockchain Network */}
      <Sphere position={[0, 0, 0]} args={[1, 32, 32]} material={sphereMaterial} />

      {/* Blockchain Cubes */}
      {cubes.map((position, index) => (
        <BlockchainCube key={index} position={position} delay={index * 0.5} />
      ))}

      {/* Chain Links */}
      {chainLinks.map((link, index) => (
        <ChainLink key={`chain-${index}`} position={link.position} rotation={link.rotation} />
      ))}

      {/* Crypto Symbols */}
      <CryptoSymbol symbol="Ξ" position={[-8, 3, -5]} />
      <CryptoSymbol symbol="₿" position={[8, -2, -3]} />
      <CryptoSymbol symbol="🔗" position={[0, 5, -8]} />
      <CryptoSymbol symbol="⛓️" position={[-6, -4, 4]} />
    </>
  );
}

// Main Component
export default function Blockchain3DScene() {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 15], fov: 60 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <BlockchainScene />
      </Canvas>
    </div>
  );
}