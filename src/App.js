import { Canvas } from "@react-three/fiber";
import { KeyboardControls, OrbitControls } from "@react-three/drei";
import Experience from "./Experience";
import Interface from "./Interface";
import { Perf } from "r3f-perf";
import "./styles.css";

export default function App() {
  return (
    <>
      <KeyboardControls
        map={ [
            { name: 'forward', keys: [ 'ArrowUp', 'KeyW' ] },
            { name: 'backward', keys: [ 'ArrowDown', 'KeyS' ] },
            { name: 'left', keys: [ 'ArrowLeft', 'KeyA' ] },
            { name: 'right', keys: [ 'ArrowRight', 'KeyD' ] },
            { name: 'reset', keys: ['KeyR']},
            { name: 'trainview', keys: [ 'KeyT']},
            { name: 'jump', keys: ['KeyM']}
            // @note: had issues with Space, Ctrl.., sometimes getting registered as Shift?
        ] }
      >
        <Canvas
          shadows
          camera={{
            fov: 80,
            near: 0.1,
            far: 400,
            position: [2.5, 4, 6]
          }}
          >
          <Perf position="bottom-right" />
          <OrbitControls />
          <axesHelper args={[5]} />
          <Experience />
        </Canvas>
      </KeyboardControls>
      <Interface />
    </>
  );
}
