import React, { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import type { ThreeElements } from "@react-three/fiber";
import { Sphere, Box, Torus, Float, Text, Stars } from "@react-three/drei";
import * as THREE from "three";

declare global {
  namespace JSX {
    interface IntrinsicElements extends ThreeElements {}
  }
}

/* ---------------- THEME DETECTION ---------------- */
const isLightTheme = () =>
  typeof document !== "undefined" &&
  document.body.classList.contains("light");

/* ---------------- GOVERNANCE CUBE ---------------- */
function GovernanceCube({
  position,
  delay = 0,
}: {
  position: [number, number, number];
  delay?: number;
}) {
  const ref = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const light = isLightTheme();
    return new THREE.MeshStandardMaterial({
      color: light ? "#c7d2fe" : "#1e3a8a",
      emissive: light ? "#e0e7ff" : "#0b1220",
      emissiveIntensity: 0.25,
      roughness: 0.4,
      metalness: 0.6,
      wireframe: true,
      transparent: true,
      opacity: 0.65,
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const t = clock.elapsedTime + delay;
    ref.current.rotation.x = Math.sin(t * 0.4) * 0.15;
    ref.current.rotation.y = Math.cos(t * 0.3) * 0.15;
    ref.current.position.y = position[1] + Math.sin(t * 0.5) * 0.12;
  });

  return (
    <Float speed={0.8} rotationIntensity={0.3} floatIntensity={0.3}>
      <Box ref={ref} args={[0.9, 0.9, 0.9]} position={position} material={material} />
    </Float>
  );
}

/* ---------------- CHAIN LINK ---------------- */
function GovernanceLink({
  position,
  rotation,
}: {
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const ref = useRef<THREE.Mesh>(null);

  const material = useMemo(() => {
    const light = isLightTheme();
    return new THREE.MeshStandardMaterial({
      color: light ? "#94a3b8" : "#334155",
      metalness: 0.9,
      roughness: 0.3,
      emissive: light ? "#e2e8f0" : "#020617",
      emissiveIntensity: 0.1,
    });
  }, []);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.z = Math.sin(clock.elapsedTime * 0.6) * 0.08;
  });

  return (
    <Torus
      ref={ref}
      args={[0.32, 0.09, 12, 24]}
      position={position}
      rotation={rotation}
      material={material}
    />
  );
}

/* ---------------- DAO SYMBOL ---------------- */
function DaoSymbol({
  symbol,
  position,
}: {
  symbol: string;
  position: [number, number, number];
}) {
  const ref = useRef<any>(null);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.rotation.y = Math.sin(clock.elapsedTime * 0.4) * 0.15;
    ref.current.position.y =
      position[1] + Math.sin(clock.elapsedTime * 0.6 + position[0]) * 0.2;
  });

  return (
    <Float speed={0.6} rotationIntensity={0.2} floatIntensity={0.25}>
      <Text
        ref={ref}
        position={position}
        fontSize={0.45}
        color={isLightTheme() ? "#1e293b" : "#93c5fd"}
        anchorX="center"
        anchorY="middle"
      >
        {symbol}
      </Text>
    </Float>
  );
}

/* ---------------- MAIN SCENE ---------------- */
function GovernanceScene() {
  const cubes = useMemo(
    () =>
      Array.from({ length: 8 }).map(() => [
        (Math.random() - 0.5) * 18,
        (Math.random() - 0.5) * 10,
        (Math.random() - 0.5) * 10,
      ]) as [number, number, number][],
    []
  );

  const links = useMemo(
    () =>
      Array.from({ length: 10 }).map(() => ({
        position: [
          (Math.random() - 0.5) * 16,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
        ] as [number, number, number],
        rotation: [0, 0, Math.random() * Math.PI * 2] as [
          number,
          number,
          number
        ],
      })),
    []
  );

  const coreMaterial = useMemo(() => {
    const light = isLightTheme();
    return new THREE.MeshStandardMaterial({
      color: light ? "#bfdbfe" : "#1e40af",
      emissive: light ? "#dbeafe" : "#020617",
      emissiveIntensity: 0.35,
      roughness: 0.25,
      metalness: 0.6,
      transparent: true,
      opacity: 0.7,
    });
  }, []);

  return (
    <>
      {/* Lighting */}
      {/* @ts-ignore */}
      <ambientLight intensity={0.25} />
      {/* @ts-ignore */}
      <directionalLight position={[8, 10, 6]} intensity={0.5} />
      {/* @ts-ignore */}
      <pointLight position={[-6, -4, -6]} intensity={0.3} />

      {/* Stars (subtle) */}
      <Stars
        radius={120}
        depth={60}
        count={600}
        factor={3}
        saturation={0}
        fade
        speed={0.5}
      />

      {/* Governance Core */}
      <Sphere args={[1.1, 32, 32]} material={coreMaterial} />

      {/* Cubes */}
      {cubes.map((p, i) => (
        <GovernanceCube key={i} position={p} delay={i * 0.4} />
      ))}

      {/* Links */}
      {links.map((l, i) => (
        <GovernanceLink
          key={i}
          position={l.position}
          rotation={l.rotation}
        />
      ))}

      {/* DAO Symbols */}
      <DaoSymbol symbol="Ξ" position={[-7, 3, -6]} />
      <DaoSymbol symbol="₿" position={[7, -2, -5]} />
      <DaoSymbol symbol="DAO" position={[0, 4, -8]} />
      <DaoSymbol symbol="⛓" position={[-5, -4, 4]} />
    </>
  );
}

/* ---------------- EXPORT ---------------- */
export default function Blockchain3DScene() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none">
      <Canvas
        camera={{ position: [0, 0, 16], fov: 55 }}
        gl={{ antialias: true, alpha: true }}
      >
        <GovernanceScene />
      </Canvas>
    </div>
  );
}
