import { useRapier, RigidBody } from "@react-three/rapier"
import { useFrame, useThree } from "@react-three/fiber"
import {
  CameraControls,
  OrbitControls,
  PerspectiveCamera,
  useKeyboardControls,
} from "@react-three/drei"
import { useState, useEffect, useRef } from "react"
import * as THREE from "three"

const directionOffset = ({ forward, backward, leftward, rightward }) => {
  let directionOffset = 0

  if (forward) {
    if (leftward) {
      directionOffset = Math.PI / 4
    } else if (rightward) {
      directionOffset = -Math.PI / 4
    }
  } else if (backward) {
    if (leftward) {
      directionOffset = Math.PI / 4 + Math.PI / 2
    } else if (rightward) {
      directionOffset = -Math.PI / 4 - Math.PI / 2
    } else {
      directionOffset = Math.PI
    }
  } else if (leftward) {
    directionOffset = Math.PI / 2
  } else if (rightward) {
    directionOffset = -Math.PI / 2
  }
  return directionOffset
}

export default function Player() {
  const [subscribeKeys, getKeys] = useKeyboardControls()
  const body = useRef()

  const cameraControlsRef = useRef()
  const orbotitControlesRef = useRef()
  const meshRef = useRef()
  const groupRef = useRef()

  let moveDirection = new THREE.Vector3()
  let rotateAngle = new THREE.Vector3(0, 1, 0)
  let rotateQuaternion = new THREE.Quaternion()
  let cameraTarget = new THREE.Vector3()

  useFrame((state, delta) => {
    if (forward || backward || leftward || rightward) {
      const camera = cameraControlsRef.current.camera
      const { forward, backward, leftward, rightward } = getKeys()
      const impulseStrength = 0.6 * delta
      const torqueStrength = 0.2 * delta
      let angleYCameraDirection = Math.atan2(
        camera.position.x - meshRef.current.position.x,
        camera.position.z - meshRef.current.position.z
      )

      let newDirectionOffset = directionOffset({
        forward,
        backward,
        leftward,
        rightward,
      })

      rotateQuaternion.setFromAxisAngle(
        rotateAngle,
        angleYCameraDirection + newDirectionOffset
      )

      camera.getWorldDirection(moveDirection)
      moveDirection.y = 0
      moveDirection.normalize()
      moveDirection.applyAxisAngle(rotateAngle, newDirectionOffset)

      const moveX = moveDirection.x * impulseStrength
      const moveZ = moveDirection.z * impulseStrength

      body.current.applyImpulse({ x: moveX, y: 0, z: moveZ })
    }
  })

  return (
    <>
      <group ref={groupRef}>
        <RigidBody
          ref={body}
          colliders="ball"
          restitution={0.2}
          friction={1}
          linearDamping={0.5}
          angularDamping={0.5}
          position={[0, 1, 0]}
        >
          <mesh castShadow ref={meshRef}>
            <icosahedronGeometry args={[0.3, 1]}></icosahedronGeometry>
            <meshStandardMaterial flatShading color="mediumpurple" />
          </mesh>
        </RigidBody>
      </group>
      <CameraControls ref={cameraControlsRef} makeDefault />
      <OrbitControls ref={orbotitControlesRef} makeDefault />
    </>
  )
}
