import { type RefObject, Suspense, useEffect, useRef, useState } from "react";
import { Canvas, useLoader } from "@react-three/fiber";
import { Html, OrbitControls, useHelper } from "@react-three/drei";
import { Box3, PointLightHelper, SpotLightHelper, Vector3 } from "three";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";

import * as THREE from "three";
import { STLLoader } from "three-stdlib";
import Helpers from "./Helpers";
import STLMesh from "./STLMesh";

export const STLColorPalette =
    [
        '#393159', '#e5b85b',
        '#703558', '#add05c',
        '#940000', '#8ce8ef',
        '#03a126', '#f8e57a',
    ]

function getRandomInt(max: number) {
    return Math.floor(Math.random() * max);
}

function STLGroup({ stls, objects }: {
    stls: THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>[],
    objects: STLObjectProp[]
}) {
    const groupRef = useRef(null);
    const [groupScale, setGroupScale] = useState(1)
    const [scaleCalculated, setScaleCalculated] = useState(false);

    useEffect(() => {
        if (!scaleCalculated && groupRef.current && stls.length > 0) {
            // Reset scale to 1 before measuring
            //@ts-ignore
            groupRef.current.scale.setScalar(1);

            const scale = normalizeScale({ object: groupRef.current, targetSize: 200 });
            setGroupScale(scale);
            setScaleCalculated(true);
        }

    }, [stls.length, scaleCalculated]);


    return (
        <group scale={groupScale} ref={groupRef}>
            {
                stls.map((stl, index) => {
                    console.log(`Rendering STL URL[${index}]`)
                    return (
                        <>
                            <STLMesh key={index}
                                color={objects[index].color}
                                opacity={objects[index].opacity}
                                wireframe={objects[index].wireframe}
                                stl={stl} />
                        </>
                    )
                }
                )
            }
        </group>
    )
}

export interface STLObjectProp {
    /**Object storage URL**/
    url: string,
    /**Hex value of format #FFFFFF**/
    color: string,
    /**Opacity value between 0 and 1**/
    opacity: number,
    /**Check this value if you want this mesh to be visible as a wireframe**/
    wireframe: boolean,
}

export interface STLCanvasProps {
    objects: STLObjectProp[],
    /**Enable this if you want to display grid, light helpers, gizmos, etc.**/
    debugMode: boolean,
    /**Passing this ref is optional. For usage, see the containing file - stl-viewer-page.tsx**/
    resetButton?: RefObject<RefObject<HTMLButtonElement> | null> | RefObject<HTMLButtonElement | null> | null,
    /**Style the containing div of the 3D canvas. Note that by default it has some predefined tailwind styles applied, including `absolute inset-0 bg-slate-800` **/
    className?: string,
}


export default function STLCanvas({ objects, debugMode, resetButton, className }: STLCanvasProps) {
const orbitRef = useRef<ThreeOrbitControls | null>(null);

const containerRef = useRef<HTMLDivElement>(null);

    const stls = objects.map((object, index) => {
        console.log(`Loading STL URL[${index}] : ${object.url}`);
        return useLoader(STLLoader, object.url);
    })

    // Add this useEffect to detect button clicks and reset OrbitControls
    // Add this useEffect to detect button clicks and reset OrbitControls
    useEffect(() => {
        if (resetButton?.current) {
            const button = resetButton.current as HTMLButtonElement;

            const handleReset = () => {
                if (orbitRef.current) {
                    // Reset the OrbitControls to the default position
                    orbitRef.current.reset();
                    console.log('OrbitControls reset!');
                }
            };

            button.addEventListener('click', handleReset);

            // Cleanup event listener on unmount
            return () => {
                button.removeEventListener('click', handleReset);
            };
        }
    }, [resetButton]);

    useEffect(() => {
        // Hold Control to enable scrolling
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Control" && orbitRef.current) {
                orbitRef.current.enableZoom = true;
            }
        };
        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.key === "Control" && orbitRef.current) {
                orbitRef.current.enableZoom = false;
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);
        // Disable zoom by default
        if (orbitRef.current) {
            orbitRef.current.enableZoom = false;
        }
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        };
    }, []);
    return (
        <div className={"absolute-fill"} ref={containerRef}>
            <Canvas camera={{ position: [-100, 100, -100], fov: 30, far: 1000 }}>
                <OrbitControls
                    target={[10, 0, 0]}
                    zoomToCursor
                    zoomSpeed={2}
                    maxAzimuthAngle={0}
                    ref={orbitRef}
                    enableZoom={false}
                />
                {debugMode && <Helpers />}
                <Lights showHelpers={debugMode} />
                <Suspense fallback={<Html center><span className={'text-blue-500'}> Loading</span></Html>}>
                    <STLGroup stls={stls} objects={objects} />
                </Suspense>
            </Canvas>
        </div>
    )
}

function Lights({ showHelpers = false }: { showHelpers?: boolean }) {

    const spotLightRef1 = useRef<THREE.SpotLight>(new THREE.SpotLight());
    const spotLightRef2 = useRef<THREE.SpotLight>(new THREE.SpotLight());
    const pointLightRef = useRef<THREE.PointLight>(new THREE.PointLight());

    const spotLight1Color = '#70b989'
    const spotLight2Color = '#e7a2ff'
    const pointLightColor = '#a24e4e'


    useHelper(showHelpers && spotLightRef1, SpotLightHelper, spotLight1Color);
    useHelper(showHelpers && spotLightRef2, SpotLightHelper, spotLight2Color);
    useHelper(showHelpers && pointLightRef, PointLightHelper, 2, pointLightColor);

    const spotLightPos1 = new Vector3(150, 150, 0)
    const spotLightPos2 = new Vector3(0, 0, 150)
    const pointLightPos = new Vector3(0, -125, 0)


    return (
        <>
            <ambientLight intensity={3} />
            <pointLight ref={pointLightRef} color={pointLightColor} position={pointLightPos} castShadow
                intensity={100000}
            />
            <spotLight angle={45} ref={spotLightRef1} color={spotLight1Color} castShadow position={spotLightPos1}
                intensity={100000} />
            <spotLight angle={45} ref={spotLightRef2} color={spotLight2Color} castShadow position={spotLightPos2}
                intensity={100000} />
        </>
    )
}

function normalizeScale({ object, targetSize = 200 }: { object: any, targetSize: number }) {

    if (!object) {
        console.log('null object receiev')
        return 1
    }
    ;
    // Calculate bounding box
    const box = new Box3().setFromObject(object);
    const size = new Vector3();

    box.getSize(size);
    console.log(`group's size is ${JSON.stringify(size)}`)
    // Find the largest dimension
    const maxDimension = Math.max(size.x, size.y, size.z);

    // Calculate a scale factor to make the largest dimension equal to targetSize
    console.log(`calculated scale: ${JSON.stringify(targetSize / maxDimension)}`)

    return maxDimension > 0 ? targetSize / maxDimension : 1;

}