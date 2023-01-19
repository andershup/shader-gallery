import {
  useGLTF,
  useTexture,
  shaderMaterial,
  Line,
  Sphere,
  Stars,
  Trail,
  Float,
} from "@react-three/drei";
import { useRef, useEffect, useMemo } from "react";
import portalVertexShader from "./shaders/portal/vertex.js";
import portalFragmentShader from "./shaders/portal/fragment.js";
// NOTE THE USE OF BACKTICKS AND THE CHANGE OF FILE NAME EXTENSION TO .JS IN THE SHADERS FOLDER
import * as THREE from "three";
import { extend, useFrame } from "@react-three/fiber";
import { button, useControls } from "leva";
import { MeshStandardMaterial } from "three";

const PortalMaterial = shaderMaterial(
  {
    // here we provide the 3 uniforms that the shader will use
    uTime: 0,
    uColorStart: new THREE.Color("#000000"),
    uColorEnd: new THREE.Color("#FFFFFF"),
    derivatives: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true,
    opacity: 0.1,
    side: THREE.DoubleSide,
  },
  portalVertexShader,
  portalFragmentShader
);

extend({ PortalMaterial }); //({ PortalMaterial: PortalMaterial }) // this is the same
// can now be referenced as <portalMaterial /> in the Experience component in camelCase

// change to Draco compressed models
// i think all neons need to be in one mesh from blender like his 'baked' mesh for portal scene
useGLTF.preload("./cinema3.glb");
// useGLTF.preload("./keyboard-model.gltf");

// used https://github.com/pmndrs/gltfjsx to convert gltf to jsx
// console.log(neonTexture)
export function HouseModel(props) {
  const { nodes } = useGLTF("/cinema3.glb");
  // console.log(nodes.portal.geometry)
  // maybe seperate the neon texures in individual bakes
  // three is going mad about focusNeon.jpg being a png
  // const neonTexture = useTexture("./1024neons.jpg",(neonTexture) => {
  //   neonTexture.flipY = false;} )
  const neonTexture = useTexture("./green.jpg");
  neonTexture.flipY = false;
  //  console.log(neonTexture)
  // const neonScssRef = useRef(neonTexture);
  // const neonBlenderRef = useRef(neonTexture);
  // const neonJavascriptRef = useRef(neonTexture);
  // const neonRef = useRef(neonTexture)

  const portalMaterial = useRef();

  useFrame((state, delta) => {
    portalMaterial.current.uTime += delta;
  });

  return (
    <group {...props} dispose={null}>
      {/* <mesh
        geometry={nodes["back-wall"].geometry}
        material={nodes["back-wall"].material}
        position={[0, 0, -11]}
      /> */}
      {/* <mesh geometry={nodes.floor.geometry} material={nodes.floor.material} /> */}
      <mesh
        geometry={nodes["left-wall"].geometry}
        material={nodes["left-wall"].material}
        position={[-11, 0, 0]}
        // receiveShadow={true}
      />
      <mesh
        geometry={nodes.Man.geometry}
        material={nodes.Man.material}
        position={[1.72, 0, -6.02]}
        rotation={[-Math.PI, -0.26, -Math.PI]}
        scale={0.43}
      />
      {/* <mesh
        geometry={nodes["right-wall"].geometry}
        material={nodes["right-wall"].material}
        position={[11, 0, 0]}      
      /> */}
      ///////////////////neons/////////////////////
      <group
      // ref={neonRef}
      >
        <mesh
          // ref={neonScssRef}
          geometry={nodes.scss.geometry}
          material={neonTexture}
          position={[10.85, 2.53, -8.23]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={2.24}
        />
        <mesh
          // ref={neonRef}
          geometry={nodes.javascript.geometry}
          material={neonTexture}
          position={[10.92, 0.79, -4.9]}
          rotation={[0, -Math.PI / 2, 0]}
          scale={1.71}
        />
        <mesh
          // ref={neonBlenderRef}
          geometry={nodes.blender.geometry}
          material={neonTexture}
          position={[10.78, 4.53, -6.61]}
          rotation={[0, -Math.PI / 2, 0]}
        />
      </group>
      ///////////////////portal/////////////////////
      <mesh
        geometry={nodes.portal.geometry}
        scale={2.5}
        position={[0, 8, -11]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <portalMaterial ref={portalMaterial} />
      </mesh>
    </group>
  );
}

///////////////////////////keyboard///////////////////////////
// export function KeyboardModel(props) {
//   const { nodes, materials } = useGLTF('/keyboard-model.gltf')
//   console.log(nodes)
//   return (
//     <group {...props} dispose={null}>
//       <mesh geometry={nodes.Case.geometry} material={materials['Black rubber']} position={[0.59, 0, 0]} />
//       <mesh geometry={nodes.Keyboard_cable.geometry} material={materials['Black rubber']} position={[0.59, 0, 0]} />
//       <mesh geometry={nodes.Keycaps.geometry} material={materials['Keycap material']} material-color="green" position={[0.59, 0, 0]} />
//     </group>
//   )
// }
