import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";
THREE.ColorManagement.legacyMode = false

export default function Floor() {
  return (
    <RigidBody restitution={1} friction={.5}>
      <mesh rotation={[Math.PI / 2, 0, 0]} scale={25} position={[0, 0, 0]} receiveShadow>
        <planeGeometry />
        <meshStandardMaterial color="#faf0d9" side={THREE.DoubleSide} />
      </mesh>
    </RigidBody>
  );
}
