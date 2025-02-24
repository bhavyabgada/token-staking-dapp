import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Cylinder, MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

export default function TokenModel() {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y = Math.sin(state.clock.elapsedTime) * 0.1;
    }
  });

  return (
    <Cylinder
      ref={meshRef}
      args={[1, 1, 0.2, 32]}
      position={[0, 0, 0]}
      scale={[0.8, 0.8, 0.8]}
    >
      <MeshDistortMaterial
        color="#00f3ff"
        speed={2}
        distort={0.3}
        radius={1}
      />
    </Cylinder>
  );
} 