import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState, useCallback } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Dude({ position=[0,1.3, -2]}) {
    const dude = useRef()
    const [hits, setHits] = useState(0)
    
    const dudeGLTF = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/young-korrigan/model.gltf')
    const animations = useAnimations(dudeGLTF.animations, dudeGLTF.scene)
    console.log(animations)

    const [ subscribeKeys, getKeys ] = useKeyboardControls()

    const [oof1] = useState(() => new Audio('/oof1.mp3'))
    const [oof2] = useState(() => new Audio('/oof2.mp3'))
    const [oof3] = useState(() => new Audio('/oof3.mp3'))
  
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

    dudeGLTF.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    useEffect(() => {
        const action = animations.actions.pose_jeune
        action.play()

        return () => {
        }
    },[])

    const applyImpulse = () => {
    if (hits < 2) {
        // playSound()
        // dude.current.applyTorqueImpulse({ x: -9999, y: -14440, z: 190 }, true);
    }

    }

    return (
        <RigidBody ref={dude} restitution={0} castShadow position={[position[0], position[1], position[2]]} onCollisionEnter={() => {setHits(hits + 1); applyImpulse()}}>
            <primitive object={dudeGLTF.scene} scale={1.5} />
        </RigidBody>
    )
}