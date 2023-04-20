import { useGLTF } from "@react-three/drei";
import { useRef, useState, useEffect, useCallback } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";
import useStore from "../stores/useStore";
import { SphereGeometry } from "three";

export default function Troll({ position = [0, .5, 0]}) {
  const troll = useRef()
  const trollGLTF  = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/old-korrigan/model.gltf')
  const [hits, setHits] = useState(0)

  const [oof1] = useState(() => new Audio('/oof1.mp3'))
  const [oof2] = useState(() => new Audio('/oof2.mp3'))
  const [oof3] = useState(() => new Audio('/oof3.mp3'))

  // HIT
  const [location, setLocation] = useState({x: 0, y: 20, z: 0})
  
  const playSound = () => {
    const soundIndex = Math.ceil(Math.random() * 3)
    let sound
    switch (soundIndex) {
      case 1:
        sound = oof1
        break
      case 2:
        sound = oof2
        break
      case 3:
        sound = oof3
      default:
        sound = oof1
        break
    }
    sound.currentTime = 0
    sound.volume = Math.random()
    sound.play()
  }

  const applyImpulse = () => {
    if (hits < 2) {
      // playSound()
    }
  }

  trollGLTF.scene.children.forEach((mesh) =>
  {
    mesh.castShadow = true
  })

  const resetTroll = () => {
    troll.current.setTranslation({ x: position[0], y: position[1], z: position[2] })
    troll.current.setLinvel({ x: 0, y: 0, z: 0 })
    troll.current.setAngvel({ x: 0, y: 0, z: 0 })
  }

  useEffect(() => {
    const unsubscribePhase = useStore.subscribe(
      (state) => state.phase,
      (value) => {
        if (value === 'playing') {
          // if any thing should trigger after starting, do it here
        } else if (value === 'ready') {
          // resettroll()
        }
      }
    )

    return () => {
      unsubscribePhase()
    }

  }, [])


  return (
    <group>

      <RigidBody ref={troll} castShadow resitution={0} position={[position[0], position[1], position[2]]} onCollisionEnter={({manifold, target, other}) => {
        setHits(hits + 1);
        applyImpulse()
        // console.log(manifold.solverContactPoint(0))
        // setLocation(manifold.solverContactPoint(0))
        // alert(Object.values(manifold.solverContactPoint(0)))
      }
      }>
        <primitive object={trollGLTF.scene} scale={2}/>
      </RigidBody>
        <mesh>
          <sphereGeometry args={[.25]} position={[...Object.values(location)]} />
          <meshStandardMaterial color="red" />
        </mesh>
    </group>
  )
}