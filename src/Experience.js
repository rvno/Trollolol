import Lights from "./Lights";
import Bridge from "./scene/Bridge";
import Train from "./Train";
import { Line, Sky } from "@react-three/drei";
import Troll from "./characters/Troll";
import Dude from "./characters/Dude";
import Female from "./characters/Female";
import { Physics, Debug, RigidBody, CuboidCollider } from "@react-three/rapier";

import Helicopter from "./Helicopter";
import { useMemo } from "react";
import Scene from "./scene/Scene";
import * as THREE from 'three'

const LINE_POINTS = 2000

export default function Experience({}) {
  const curveOne = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.5, 0, -12),
      new THREE.Vector3(-.5, 0, -6),
      new THREE.Vector3(-.5, 0, 0),
      new THREE.Vector3(-.5, 0, 6),
      new THREE.Vector3(-.5, 0, 12),
    ],
    false,
    "catmullrom",
    0.5)
  })

  const curveTwo = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(.5, 0, -12),
      new THREE.Vector3(.5, 0, -6),
      new THREE.Vector3(.5, 0, 0),
      new THREE.Vector3(.5, 0, 6),
      new THREE.Vector3(.5, 0, 12),
    ],
    false,
    "catmullrom",
    0.5)
  })

  const curveThree = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(-.5, 0, -12),
      new THREE.Vector3(-.5, 0, -6),
      new THREE.Vector3(-.5, 0, -3),
      new THREE.Vector3(-1.25, 0, .5),
      new THREE.Vector3(-7, 0, 3),
      new THREE.Vector3(-9, 0, 5.5),
      new THREE.Vector3(-10, 0, 12),
    ],
    false,
    "catmullrom",
    0.5)
  })

  const curveFour = useMemo(() => {
    return new THREE.CatmullRomCurve3([
      new THREE.Vector3(.5, 0, -12),
      new THREE.Vector3(.5, 0, -6),
      new THREE.Vector3(.5, 0, -3),
      new THREE.Vector3(.5, 0, .25),
      new THREE.Vector3(-.5, 0, 1.5),
      new THREE.Vector3(-6.5, 0, 4),
      new THREE.Vector3(-8, 0, 7.5),
      new THREE.Vector3(-8.5, 0, 12),
    ],
    false,
    "catmullrom",
    0.5)
  })

  const lineOnePoints = useMemo(() => {
    return curveOne.getPoints(LINE_POINTS)
  }, [curveOne])

  const lineTwoPoints = useMemo(() => {
    return curveTwo.getPoints(LINE_POINTS)
  }, [curveTwo])

  const lineThreePoints = useMemo(() => {
    return curveThree.getPoints(LINE_POINTS)
  }, [curveThree])

  const lineFourPoints = useMemo(() => {
    return curveFour.getPoints(LINE_POINTS)
  }, [curveFour])

  return (
    <>
      <Lights />
      <Sky distance={450000} sunPosition={[0, 1, 0]} inclination={0} />
      <Physics>
        {/* <Debug /> */}
        <Bridge />

        {/* @TODO: lines need to be available for vehicle  */}
        <group>
          <Line
            points={lineOnePoints}
            opacity={1}
            color={"black"}
            lineWidth={16}
          />
          <Line
            points={lineTwoPoints}
            color={"black"}
            opacity={0.7}
            lineWidth={16}
          />
          <Line
            points={lineThreePoints}
            color={"black"}
            opacity={0.7}
            lineWidth={16}
          />
          <Line
            points={lineFourPoints}
            color={"black"}
            opacity={0.7}
            lineWidth={16}
          />
        </group>

        {/* @TODO: group into a scene component */}
        <Troll />
        <Dude />
        <Female />
        
        <Scene />
        <Train />
        <Helicopter scale={.15} position={[4, 3, 4]}/>
      </Physics>
      {/* <gridHelper args={[25, 25, 0xff0000, "teal"]} /> */}
    </>
  );
}
