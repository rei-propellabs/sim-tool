import {
    createContext, type Dispatch,
    type RefObject,
    type SetStateAction,
    Suspense, useContext,
    useEffect,
    useRef,
    useState
} from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Box3, Vector3 } from "three";
import * as THREE from "three";
import Helpers from "../components/Helpers";
import { STLErrorFallback, STLGroupErrorBoundary } from "../components/STLGroupErrorBoundary";
import STLGroupLoaderSuspense from "../components/STLLoaderSuspense";
import STLLoaderGroup from "../components/STLGroup";
import { OrbitControls as ThreeOrbitControls } from "three-stdlib";
import styles from "./STLCanvas.module.css";

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
    debugMode: boolean
    /**Passing this ref is optional. For usage, see the containing file - stl-viewer-page.tsx**/
    resetButton?: RefObject<RefObject<HTMLButtonElement> | null> | RefObject<HTMLButtonElement | null> | null,
    /**Style the containing div of the 3D canvas. Note that by default it has some predefined tailwind styles applied,
     * including `absolute inset-0 bg-slate-800` **/
    className?: string,
    /**If true, play animation*/
    autoRotate?: boolean,
    /**If true, rotate to show the surface */
    showSurface?: boolean,
    setShowSurface?: (value: boolean) => void,
    environmentMapIntensity: number,
    cameraMode: CameraMode,
    tooltips: TooltipInterface[],
    /**
     * If this is true, clicking on a tooltip indicator in 'free' mode will not trigger the display of tooltips.
     * Hover and clicked states for tooltips will also not register
     **/
    showToolTipInPlanOnly: boolean,
    /**
     * Set the rotation on the group of STLs (the list of STLs passed in `objects`) you are passing to `STLCanvas` along each axis
     **/
    setRotation?: {
        rotateX?: number,
        rotateY?: number,
        rotateZ?: number,
    }
}

export interface TooltipInterface {
    position: {
        x: number,
        y: number,
        z: number
    },
    serial: number,
    Waste_Vol: number,
    Waste_Mass: number,
    Waste_Au_kg: number,
    Waste_Au_ppm: number,
    Gold_vol: number,
    Gold_Mass: number,
    Gold_Au_kg: number,
    Gold_Au_ppm: number,
    depth: number,
    net_value: number,
    note?: string
}

export interface BoundingBox {
    size: Vector3,
    center: Vector3,
    maxDimension: number
}

export interface ViewerConfig {
    orthographic: {
        camera: THREE.OrthographicCamera;
        resetPosition?: Vector3;
    }
    perspective: {
        camera: THREE.PerspectiveCamera;
        resetPosition?: Vector3;
    },
    mode: CameraMode,
    boundingBox?: Box3,
    groupRef: RefObject<THREE.Group | null> | null,
    rotateX?: number;
    rotateY?: number;
    rotateZ?: number;
    showToolTipInPlanOnly: boolean,
}

export type CameraMode = "plan" | "free"


export const DebugContext = createContext(false)
// @ts-ignore
export const OrbitContext = createContext<OrbitControls>()

// @ts-ignore
export const ViewerContext = createContext<{
    config: ViewerConfig,
    dispatch: Dispatch<SetStateAction<ViewerConfig>>
}>()

export default function STLCanvas({
    objects,
    debugMode,
    resetButton,
    className,
    environmentMapIntensity,
    tooltips,
    cameraMode,
    showToolTipInPlanOnly,
    autoRotate,

    setRotation,
}: STLCanvasProps) {
    const orbitRef = useRef<ThreeOrbitControls | null>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);


    const defaultOrthographic = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 10000)
    defaultOrthographic.zoom = 10

    const defaultPerspective = new THREE.PerspectiveCamera(12, window.innerWidth / window.innerHeight, 1, 10000)
    defaultPerspective.position.set(100, 100, 100)

    const [viewerConfig, setViewerConfig] = useState<ViewerConfig>({
        orthographic: {
            camera: defaultOrthographic,
        },
        perspective: {
            camera: defaultPerspective,
        },
        mode: cameraMode,
        groupRef: null,
        showToolTipInPlanOnly,
        rotateX: setRotation?.rotateX,
        rotateY: setRotation?.rotateY,
        rotateZ: setRotation?.rotateZ,
    });

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

    // Add this useEffect to detect button clicks and reset OrbitControls
    useEffect(() => {
        if (resetButton?.current) {
            const button = resetButton.current as HTMLButtonElement;

            const handleReset = () => {
                if (orbitRef.current) {
                    // Reset the OrbitControls to the default position
                    // @ts-ignore
                    orbitRef.current.reset();
                    if (debugMode) console.info('OrbitControls reset!');
                }
            };

            button.addEventListener('click', handleReset);

            // Cleanup event listener on unmounting
            return () => {
                button.removeEventListener('click', handleReset);
            };
        }
    }, [resetButton]);


    useEffect(() => {
        setViewerConfig({ ...viewerConfig, mode: cameraMode });

    }, [cameraMode]);

    useEffect(() => {
    }, [viewerConfig]);

    return (
        <DebugContext.Provider value={debugMode}>
            <OrbitContext.Provider value={orbitRef}>
                <ViewerContext.Provider value={{ config: viewerConfig, dispatch: setViewerConfig }}>
                    <div className={`absolute inset-0 ${styles.stlCanvas} ${className} `}>
                        <Canvas camera={cameraMode === 'plan' ? defaultOrthographic : defaultPerspective}
                        >
                            <CameraController />
                            <OrbitControls enableRotate={cameraMode != 'plan'}
                                autoRotate={autoRotate}
                                zoomSpeed={2} ref={orbitRef}
                                autoRotateSpeed={0.3} enableZoom={false} />
                            {debugMode && <Helpers />}
                            <STLGroupErrorBoundary fallback={<STLErrorFallback />}>
                                <Suspense fallback={<STLGroupLoaderSuspense />}>
                                    <STLLoaderGroup tooltips={tooltips} envIntensity={environmentMapIntensity}
                                        objects={objects} />
                                </Suspense>
                            </STLGroupErrorBoundary>
                        </Canvas>
                    </div>
                </ViewerContext.Provider>
            </OrbitContext.Provider>
        </DebugContext.Provider>
    )
}


function CameraController() {
    const { camera } = useThree();
    const { config: viewerConfig } = useContext(ViewerContext);
    const orbitContext = useContext(OrbitContext);

    useEffect(() => {
        console.log('[CameraController effect] triggered', {
            camera,
            boundingBox: viewerConfig.boundingBox,
            mode: viewerConfig.mode,
            perspectiveReset: viewerConfig.perspective.resetPosition,
            orthographicReset: viewerConfig.orthographic.resetPosition
        });
        if (!viewerConfig.boundingBox || !viewerConfig.groupRef?.current) {
            return;
        }

        const { mode, perspective, orthographic, boundingBox } = viewerConfig;
        const center = new Vector3();
        boundingBox.getCenter(center);

        if (mode === 'free' && perspective.resetPosition) {
            console.info(`[CameraController] setting perspective: ${JSON.stringify(perspective.resetPosition)}`);
            camera.position.copy(perspective.resetPosition);
            camera.lookAt(center);
        } else if (mode === 'plan' && orthographic.resetPosition) {
            console.info(`[CameraController] setting orthographic: ${JSON.stringify(orthographic.resetPosition)}`);
            camera.position.copy(orthographic.resetPosition);
            camera.lookAt(center);
        }
        orbitContext.current.saveState();
        console.info(`[CameraController] OrbitControls position0 : ${JSON.stringify(orbitContext.current.position0)}`);

    }, [camera, viewerConfig.boundingBox, viewerConfig.mode, viewerConfig.perspective.resetPosition, viewerConfig.orthographic.resetPosition]);

    return null;
}
