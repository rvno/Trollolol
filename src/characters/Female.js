import { useGLTF, useKeyboardControls, useAnimations } from "@react-three/drei";
import { useRef, useEffect, useState, useCallback } from "react";
import { RigidBody, CuboidCollider } from "@react-three/rapier";

export default function Female({ position=[-3, 0, 2]}) {
    const female = useRef()
    const [hits, setHits] = useState(0)
    
    const femaleGLTF = useGLTF('https://vazxmixjsiawhamofees.supabase.co/storage/v1/object/public/models/korrigan-taning/model.gltf')
    const animations = useAnimations(femaleGLTF.animations, femaleGLTF.scene)

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

    femaleGLTF.scene.children.forEach((mesh) =>
    {
        mesh.castShadow = true
    })

    useEffect(() => {
        const action = animations.actions.pose_femme
        action.play()

        return () => {
        }
    },[])

    const applyImpulse = () => {
        if (hits < 2) {
            // playSound()
        }
    }

    return (
        <RigidBody ref={female} restitution={0} castShadow position={[position[0], position[1], position[2]]} onCollisionEnter={() => {setHits(hits + 1); applyImpulse()}}>
            <primitive object={femaleGLTF.scene} scale={1.5} />
        </RigidBody>
    )
}