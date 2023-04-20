import { useGLTF } from "@react-three/drei";
import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef, useState } from "react";
import { RigidBody } from "@react-three/rapier";
import { useKeyboardControls } from "@react-three/drei";
import useStore from "./stores/useStore";
import * as THREE from "three";

export default function Train({ position =[0, 0.45, -6.5]}) {
  const { clock, camera } = useThree()  
  const start = useStore((state) => state.start)
  const restart = useStore((state) => state.restart)
  const toggleDrive = useStore((state) => state.toggleDrive)
  const [isMoving, setIsMoving] = useState(false)
  const [isDefault, setIsDefault] = useState(true)
  const train = useRef();
  const [ smoothedCameraPosition ] = useState(() => new THREE.Vector3(10, 10, 10))
  const [ smoothedCameraTarget ] = useState(() => new THREE.Vector3())
  const trainGLTF = useGLTF(
    "https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/models/citroen-old-van/model.gltf"
  );
  trainGLTF.scene.children.forEach((mesh) =>
  {
      mesh.castShadow = true
  })

  const [ subscribeKeys, getKeys ] = useKeyboardControls()

  const resetGame = () => {
    clock.start()
    resetCamera()
    train.current.setTranslation({ x: 0, y: 0.45, z: -6.5 })
    train.current.setLinvel({ x: 0, y: 0, z: 0 })
    train.current.setAngvel({ x: 0, y: 0, z: 0 })
    const quaternion = new THREE.Quaternion();
    train.current.setRotation(quaternion, true)

    // state resets
    setIsMoving(true)
    setIsDefault(true)
    
    restart()
  }

  const startHandler = () => {
    if (isDefault) {
      setIsMoving(true)
      setIsDefault(true)
    } else {
      setIsMoving(false)
      setIsDefault(false)
    }
    // start()
    // reset clock
    clock.start()

    // reset camera
    // resetCamera()
  }

  const resetCamera = () => {
    camera.position.set(2.5, 4,6 )
    camera.rotation.set( 0, 0, 0)
    camera.lookAt(0,0,0)
    camera.updateProjectionMatrix()
  }

  const jump = () => {
    train.current.applyImpulse({ x: 0, y: 5, z: 0}, true)
  }
  
  useEffect(() => {
    // const unsubscribeReset = subscribeKeys(
    //   (state) => state,
    //   (value) => {
    //     // @note: interestingly picks up all key values..
    //     // alert(value)
    //     // if (value.jump) {
    //     //   jump()
    //     // }
    //   }
    // )

    const unsubscribePhase = useStore.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'playing') {
          // if any thing should trigger after starting, do it here
          startHandler()
        } else if (value === 'ready') {
          resetGame()
        }
      }
    )

    const unsubscribeMode = useStore.subscribe(
      (state) => state.mode,
      (value) => {
        // @TODO: maybe have a switch?
        if (value === 'train') {
          setIsDefault(false)
        } else {
          setIsDefault(true)
          setIsMoving(true)
        }
      }
    )

    return () => {
      unsubscribePhase()
      unsubscribeMode()
    }
  }, [])

  // @note: because of the conditional for jump being based on state, had to subscribe and add state dependency
  useEffect(() => {
    const unsubscribeReset = subscribeKeys(
      (state) => state,
      (value) => {
        if (value.reset) {
          resetGame()
        }

        if (value.trainview) {
          toggleDrive()
        }

        // @note: interestingly picks up all key values..
        // alert(value)
        // if (value.jump) {
        //   jump()
        // }
      }
    )

     const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value && isDefault === false) {
          jump()
        }
      }
    )

    return () => {
      unsubscribeReset()
      unsubscribeJump()
    }
  }, [isDefault])

  useFrame((state, delta) =>
  {
    /**
     * Controls
     */
    const { forward, backward, left, right } = getKeys()

    // @TODO: apply torque for more accurate driving
    if (!isDefault) {
      if (forward) {
        train.current.applyImpulse({ x: 0, y: 0,  z: .4 }, true);
      }
  
      if (right) {
        train.current.applyImpulse({ x: -.4, y: 0,  z: 0}, true);
        train.current.applyTorqueImpulse({ x: 0, y: -.05, z: 0 }, true);
      }
  
      if (backward) {
        train.current.applyImpulse({ x: 0, y: 0,  z: -.4 }, true);
      }
      
      if (left) {
        train.current.applyImpulse({ x: .4, y: 0,  z: 0}, true);
        train.current.applyTorqueImpulse({ x: 0, y: .05, z: 0 }, true);
      }
    }

    // handle camera
    const trainPosition = train.current.translation()
    // end of road/fall
    // @note: seems like after the first restart, it may not be the same mesh/ref object as its no longer resetting
    if (trainPosition.z > 12 || trainPosition.y < -4) {
      restart()
    }

    if (isDefault === false) {
      const cameraPosition = new THREE.Vector3()
      cameraPosition.copy(trainPosition)
      cameraPosition.z -= 3.25
      cameraPosition.y += 5.25

      const cameraTarget = new THREE.Vector3()
      cameraTarget.copy(trainPosition)
      cameraTarget.y += 2.25

      smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
      smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

      state.camera.position.copy(smoothedCameraPosition)
      state.camera.lookAt(smoothedCameraTarget)
    } else {
      // reset/default camera
      // @note: this messes with orbit controls - ideally camera is reset and this stops getting firing once returned to original position
      const cameraPosition = new THREE.Vector3(2.5, 4, 6)
      const cameraTarget = new THREE.Vector3()

      smoothedCameraPosition.lerp(cameraPosition, 5 * delta)
      smoothedCameraTarget.lerp(cameraTarget, 5 * delta)

      state.camera.position.copy(smoothedCameraPosition)
      state.camera.lookAt(smoothedCameraTarget)
    }

    // handle movement
    if (isMoving) {
      const time = state.clock.getElapsedTime()
      const z = 2.5 * time

      if (isDefault) {
        train.current.applyImpulse({ x: 0, y: 0,  z: .1 }, true);
      }

    }
  })

  return (
    <RigidBody
      ref={train}
      colliders="cuboid"
      position={position}
    >
      <primitive
        object={trainGLTF.scene}
        scale={0.45}
      />
    </RigidBody>
  );
}
