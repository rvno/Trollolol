import { useMemo } from "react";
import Bridge from "./Bridge"
import Floor from "./Floor"
import Rocks from "./Rocks";
import Tree from "./Tree";
import Farm from "./Farm";

export default function Scene({count = 7}) {
  const rockGroup = useMemo(() => {
    const rockGroup = []
    for (let i=0; i < count; i++) {
      rockGroup.push(Rocks)
    }
    return rockGroup
  }, [count])

  const trees = useMemo(() => {
    const trees = []
    for (let i=0; i < count; i++) {
      trees.push(Tree)
    }
    return trees
  }, [count])

  return (
    <>
      <Bridge />
      <Floor />
      <Farm position={[6, 0, -8]} scale={2} rotation={[0, - Math.PI / 2, 0]} />
      { rockGroup.map((Rocks, index) => 
        <Rocks key={index} position={[-12 + Math.random() * 3, 0, -12 + (index * 2) ]} scale={Math.random() * 2.5} />
      )}
      { trees.map((Tree, index) => 
        <Tree key={index} position={[12 - Math.random() * trees.length, 0, -12]} scale={Math.random() * .25} />
      )}
    </>
  )
}