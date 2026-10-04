import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Physics, RigidBody } from "@react-three/rapier";

export const PoolCanvas = () => {
  return (
    <Canvas shadows camera={{ position: [0, 5, 8], fov: 45 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 10, 5]} intensity={1} castShadow />

      <Physics gravity={[0, -9.81, 0]}>
        {/* The Table */}
        <RigidBody type="fixed" friction={0.5} restitution={0.2}>
          <mesh receiveShadow position={[0, -0.5, 0]}>
            <boxGeometry args={[10, 1, 5]} />
            <meshStandardMaterial color="#0c5427" />
          </mesh>
        </RigidBody>

        {/* The Cue Ball */}
        <RigidBody
          colliders="ball"
          position={[0, 3, 0]}
          restitution={0.8}
          friction={0.2}
        >
          <mesh castShadow>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#ffffff" roughness={0.1} />
          </mesh>
        </RigidBody>
      </Physics>

      <OrbitControls makeDefault />
    </Canvas>
  );
};
