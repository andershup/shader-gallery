import {
  useFrame,
  useState,
  useThree,
  extend,
  Canvas,
} from "@react-three/fiber";
// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { Perf } from "r3f-perf";
import { useRef } from "react";
import { useControls, button } from "leva";
import {
  MeshReflectorMaterial,
  OrbitControls,
  useHelper,
  useTexture,
} from "@react-three/drei";
import { Debug, Physics, RigidBody } from "@react-three/rapier";
import * as THREE from "three";
import { SpotLightHelper } from "three";
import Overlay from "./Overlay.jsx";
import { HouseModel } from "./Models.jsx";
import { MeshStandardMaterial } from "three";
import Sophia from "./Sofia.jsx";

//////////////////STILL TO DO///////////
//README
// gui off for mobile

/////////////Mobile/////////////////////
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

// git remote -v to get remote name

//////////////////////////////////   APP    ////////////////////////////////////////
export default function App() {
  // const { camera, gl } = useThree()

  const [floor, normal] = useTexture([
    "./wet-concrete-floor_1K_.jpgl",
    "./wet-concrete-floor_1K_Normal.jpg",
  ]);

  const [frogWall] = useTexture(["./amazing-frog"]);
  const [thirdEye] = useTexture([
    "./Anders_242_stunningly_beautiful_Japanese_woman_wearing_a_shiny__6c8c9110-efcc-4f03-8035-05caaf1dea61.png",
  ]);
  const [thirdEye2] = useTexture([
    "./Anders_242_the_third_eye_of_Japanese_woman.png",
  ]);
  const [thirdEye3] = useTexture(["./third-eye-chinese-woman-3.jpg"]);
  const directionalLightRef = useRef();
  const spotLightRef = useRef();

  /////////////////////////////////HELPERS///////////////////////////////////

  useHelper(directionalLightRef, SpotLightHelper, "red");
  useHelper(spotLightRef, SpotLightHelper, "cyan");

  const { perfVisible } = useControls({
    perfVisible: true,
  });

  /////////////////////////////////LIGHTS DEBUG///////////////////////////////////

  const {
    directLiPosition,
    directLiIntensity,
    spotLightPosition,
    spotLightintensity,
    spotLightAngle,
    ambIntensity,
    fogColor,
    fogNear,
    fogFar,
  } = useControls("lights", {
    visible: false,
    directLiPosition: {
      value: { x: -30, y: 0, z: -30 },
    },
    directLiIntensity: {
      value: 2,
      min: 0,
      max: 20,
    },
    spotLightPosition: {
      value: { x: 0, y: 10, z: 0 },
    },
    spotLightAngle: {
      value: 1,
      min: 0,
      max: 2,
    },
    spotLightintensity: {
      value: 50,
      min: 0,
      max: 200,
      step: 0.3,
    },
    ambIntensity: {
      value: 5.4,
      min: 0,
      max: 2,
      step: 0.1,
    },
    fogColor: "rgb(255,255,255)",
    fogNear: {
      value: 30,
      min: 0,
      max: 100,
      step: 1,
    },
    fogFar: {
      value: 100,
      min: 0,
      max: 100,
      step: 1,
    },
  });

  ////////////////////////////// Floor DEBUG///////////////////////////////////

  const {
    floorMirror,
    metalness,
    color,
    normalScale,
    blur,
    resolution,
    args,
    mixBlur,
    mixStrength,
    reflectorOffset,
    minDepthThreshold,
    maxDepthThreshold,
    depthToBlurRatioBias,
    debug,
    mixContrast,
  } = useControls(
    // below we add a string to create a folder with the content as the second argument

    "floor",
    {
      blur: [0, 0],
      // Mirror environment, 0 = texture colors, 1 = pick up env colors
      mixBlur: {
        // how much blur mixes with the surf roughness. default 1
        value: 1,
        min: 0,
        max: 20,
        step: 2.8,
      },
      mixStrength: {
        value: 1,
        min: 0,
        max: 3,
        step: 0.2,
      }, // strength of the reflection
      resolution: {
        value: 512,
        min: 512,
        max: 2048,
        step: 512,
      },
      floorMirror: {
        value: 0.5,
        min: 0,
        max: 1,
        step: 0.01,
        // joystick: 'invertY'
      },
      metalness: {
        value: 0.4,
        min: -1,
        max: 2,
        step: 0.01,
      },
      color: "rgb(160,160,160)",

      minDepthThreshold: {
        value: 0.9,
        min: 0,
        max: 5,
        step: 0.1,
      },
      //Lower edge for the depthTexture interpolation (default = 0)
      maxDepthThreshold: {
        value: 0,
        min: 0,
        max: 5,
        step: 0.1,
      },
      // Upper edge for the depthTexture interpolation (default = 0)
      depthToBlurRatioBias: {
        value: 0.25,
        min: 0,
        max: 1,
        step: 0.1,
      }, // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTextur
      mixContrast: {
        value: 1,
        min: 0,
        max: 5,
        step: 0.5,
      },
      // Contrast of the reflections
      debug: {
        value: 0,
        min: 0,
        max: 4,
        step: 1,
      },
      //  Depending on the assigned value, one of the following channels is shown:
      // 0 = no debug
      // 1 = depth channel
      // 2 = base channel
      // 3 = distortion channel
      // 4 = lod channel (based on the roughness)
      normalScale: [2, 2],
      //blur width and height 0 to skip
      args: [22, 22],
      reflectorOffset: 0, // Offsets the virtual camera that projects the reflection. Useful when the reflective surface is some distance from the object's origin (default = 0)
      clickMe: button(() => {
        console.log("ok");
      }),
      choice: { options: ["a", "b", "c"] },
    }
  );

  //  note: to add second folder you need to call useControls again.
  const { scale, visible } = useControls("secondFolderForBox", {
    scale: {
      value: 1.3,
      min: 0,
      max: 3,
      step: 0.01,
    },
    visible: true,
  });

  return (
    <>
      <Perf position="top-left" />
      <OrbitControls makeDefault />
      /////////////////////////////////////////LIGHTS////////////////////////////////////////
      <color attach="background" args={["black"]} />
      {/* <fog attach="fog" color={fogColor} near={fogNear} far={fogFar} /> */}
      <ambientLight intensity={ambIntensity} />
      <directionalLight
        ref={directionalLightRef}
        position={[directLiPosition.x, directLiPosition.y, directLiPosition.z]}
        intensity={directLiIntensity}
      />
      *
      <spotLight
        ref={spotLightRef}
        position={[
          spotLightPosition.x,
          spotLightPosition.y,
          spotLightPosition.z,
        ]}
        intensity={spotLightintensity}
        angle={spotLightAngle}
      />
      ////////////Sophia/////////////////////// //// female model
      <Sophia scale={0.02} rotation={[0, Math.PI, 0]} position={[-5, 0, -7]} />
      ///////////////////TEST PLANE/////////////////////////
      <mesh
        position={[-10, 3, 0]}
        rotation-y={Math.PI * 0.5}
        // castShadow={true} receiveShadow={true}
      >
        <planeGeometry args={[5, 5]} />
        <meshStandardMaterial
          map={frogWall}
          // castShadow={true}
          // receiveShadow={true}
        />
      </mesh>
      ///////////////////TEST PLANE woman /////////////////////////
      {/* <mesh
        position={[10, 3, 0]}
        rotation-y={-Math.PI * 0.5}

        // castShadow={true} receiveShadow={true}
      >
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial
          map={thirdEye2}
          // castShadow={true}
          // receiveShadow={true}
        />
      </mesh> */}
      ////// plane on the portal ///////
      <mesh
        position={[0, 8, -11.02]}
        // castShadow={true} receiveShadow={true}
      >
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial
          map={thirdEye3}
          // castShadow={true}
          // receiveShadow={true}
        />
      </mesh>
      /////////////////////floor////////////////////////
      <Physics>
        <Debug /> // debug can be added anywhere inside the physics component
        <RigidBody type="fixed">
          <mesh rotation-x={-Math.PI * 0.5} rotation-z={Math.PI * 0.5}>
            <planeGeometry args={args} />
            <MeshReflectorMaterial
              args={[22, 22]}
              color={color}
              metalness={metalness}
              roughnessMap={floor}
              roughness={0.5}
              normalMap={normal}
              attach="material"
              // normalScale={normalScale}
              blur={blur}
              resolution={resolution}
              mirror={floorMirror}
              mixBlur={mixBlur}
              minDepthThreshold={minDepthThreshold}
              maxDepthThreshold={maxDepthThreshold}
              depthToBlurRatioBias={depthToBlurRatioBias} // Adds a bias factor to the depthTexture before calculating the blur amount [blurFactor = blurTexture * (depthTexture + bias)]. It accepts values between 0 and 1, default is 0.25. An amount > 0 of bias makes sure that the blurTexture is not too sharp because of the multiplication with the depthTextur
              mixStrength={mixStrength}
              reflectorOffset={reflectorOffset}
              mixContrast={mixContrast}
            ></MeshReflectorMaterial>
          </mesh>
        </RigidBody>
        <RigidBody colliders="ball" position={[-1.5, 8, 0]}>
          // note colliders not collider
          <mesh castShadow>
            <sphereGeometry />
            <meshStandardMaterial color="silver" opacity={0.9} />
          </mesh>
        </RigidBody>
        {/* <RigidBody
                ref={ cube }
                position={ [ 1.5, 2, 0 ] }
                gravityScale={ 1 }
                restitution={ 0 }
                friction={ 0.7 }
                colliders={ false }
                // onCollisionEnter={ collisionEnter }
                // onCollisionExit={ () => { console.log('exit') } }
                // onSleep={ () => { console.log('sleep') } }
                // onWake={ () => { console.log('wake') } }
            > */}
      </Physics>
      ///////////////////////////WALLS///////////////////////////////////////////////////////////////////////////////////
      <HouseModel />
      {/* <KeyboardModel /> */}
      ////////RIGHT WALL ///////////
    </>
  );
}
