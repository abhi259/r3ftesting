"use client"

import {
  KeyboardControls,
  OrbitControls,
  PerspectiveCamera,
  PointerLockControls,
} from "@react-three/drei"
import { Canvas } from "@react-three/fiber"
import { Physics, RigidBody } from "@react-three/rapier"
import Player from "./Player"


export default function Home() {
  return (
    <div className="h-[100vh] w-[100vw] fixed top-0 left-0 ">
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "leftward", keys: ["ArrowLeft", "a", "A"] },
          { name: "rightward", keys: ["ArrowRight", "d", "D"] },
          { name: "sprint", keys: ["ShiftLeft"] },
          { name: "jump", keys: ["Space"] },
        ]}
      >
        <Canvas    >
          <ambientLight />
          <pointLight position={[10, 10, 10]} />
          <Physics>
            <Player   />
            
            <RigidBody type="fixed"  >
              <mesh  >
                <boxGeometry args={[100, 0.5, 100]} />
                <meshStandardMaterial color="yellowgreen" />
              </mesh>
            </RigidBody>
          </Physics>
          {/* <OrbitControls makeDefault /> */}
        </Canvas>
      </KeyboardControls>
    </div>
  )
}
