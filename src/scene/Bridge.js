import BridgeModel from "./BridgeModel";
import { RigidBody } from "@react-three/rapier";

export default function Bridge() {
  return <RigidBody type="fixed" restitution={1}>
    <BridgeModel />;
  </RigidBody>
}
