/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
*/

import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'

export function Model(props) {
  const { nodes, materials } = useGLTF('/keyboard-model.gltf')
  return (
    <group {...props} dispose={null}>
      <mesh geometry={nodes.Case.geometry} material={materials['Black rubber']} position={[0.59, 0, 0]} />
      <mesh geometry={nodes.Keyboard_cable.geometry} material={materials['Black rubber']} position={[0.59, 0, 0]} />
      <mesh geometry={nodes.Keycaps.geometry} material={materials['Keycap material']} position={[0.59, 0, 0]} />
    </group>
  )
}

useGLTF.preload('/keyboard-model.gltf')