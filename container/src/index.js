import './styles.css'
import ReactDOM from 'react-dom/client'
import { Canvas } from '@react-three/fiber'
import App from './App.jsx'
import { StrictMode } from 'react'
import { Leva } from 'leva'
import { Environment } from '@react-three/drei'


const root = ReactDOM.createRoot(document.querySelector('#root'))

root.render(
    <StrictMode>
        <Leva
            collapsed={true}
        />
        <Canvas
            //   concurrent    
            // flat 
            // dpr={(Math.min(window.devicePixelRatio, 2))}
            //Note that you can set this to 
            dpr={[1, 2]}
            // to clamp based on window.devicePixelRatio 
            //which I believe is the default with v8? 
            // shadows

            gl={{
                antialias: true,
                alpha: false,
                powerPreference: 'high-performance',
                physicallyCorrectLights: true,
            }}
            camera={{
                fov: 45,
                near: 0.1,
                far: 50,
                position: [0.5, 5, 12]
            }}
        >
            <App />
        </Canvas>
    </StrictMode>


)