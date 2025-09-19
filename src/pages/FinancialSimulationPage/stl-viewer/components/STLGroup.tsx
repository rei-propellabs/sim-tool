import { useContext, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box3, Vector3 } from "three";
import { useLoader } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import {
    DebugContext,
    OrbitContext,
    type BoundingBox,
    type STLObjectProp,
    type TooltipInterface,
    ViewerContext
} from "../components/STLCanvas";
import STLMesh from "../components/STLMesh";
import ToolTip from "../components/tooltip";
import { STLLoader } from "three-stdlib";
// import "style.css"

function STLGroup({ stls, tooltips, objects }: {
    stls: THREE.BufferGeometry<THREE.NormalBufferAttributes, THREE.BufferGeometryEventMap>[],
    tooltips: TooltipInterface[]
    objects: STLObjectProp[],

}) {
    const groupRef = useRef<THREE.Group | null>(null);
    const [boundingBox, setBoundingBox] = useState<BoundingBox>({
        size: new Vector3(0, 0, 0),
        center: new Vector3(0, 0, 0),
        maxDimension: 1
    });
    const [rotated, setRotated] = useState(false);
    const debugMode = useContext(DebugContext);
    const { config: viewerConfig, dispatch: setConfig } = useContext(ViewerContext);

    useEffect(() => {
        if (groupRef.current) {
            if (!rotated) {
                if (viewerConfig.rotateX != undefined)
                    groupRef.current.rotation.x = viewerConfig.rotateX;
                if (viewerConfig.rotateY != undefined)
                    groupRef.current.rotation.y = viewerConfig.rotateY;
                if (viewerConfig.rotateZ != undefined)
                    groupRef.current.rotation.z = viewerConfig.rotateZ;
                setRotated(true);

            }

            const box = new Box3().setFromObject(groupRef.current);
            const size = new Vector3();
            const center = new Vector3();
            box.getSize(size);
            box.getCenter(center);

            const maxDimension = Math.max(size.x, size.y, size.z);
            setBoundingBox({
                size: size,
                center: center,
                maxDimension: maxDimension
            })
            const cameraDistance = maxDimension + 10;


            const pDirection = new Vector3(0, 0, 1);
            const newPCameraPosition = center.clone().add(pDirection.multiplyScalar(cameraDistance));
            const newOCameraPosition = new Vector3(0, size.y + 10, 0);
            if (debugMode) {
                console.info(`Box size: ${JSON.stringify(size)}`);
                console.info(`Box center: ${JSON.stringify(center)}`);
                console.info(`Camera distance: ${cameraDistance}`);
            }
            setConfig({
                ...viewerConfig,
                boundingBox: box,
                perspective: {
                    camera: viewerConfig.perspective.camera,
                    resetPosition: newPCameraPosition
                },
                orthographic: {
                    camera: viewerConfig.orthographic.camera,
                    resetPosition: newOCameraPosition
                },
                groupRef: groupRef,
            })
        }
    }, [stls.length]);

    useEffect(() => {
        if (groupRef.current && boundingBox?.center) {
            console.info(`centering the bounding box : ${JSON.stringify(boundingBox.center)}`);

            groupRef.current.position.set(-boundingBox.center.x, -boundingBox.center.y, -boundingBox.center.z)
        }
    }, [boundingBox?.center]);


    return (
        <>
            {/* Debug bounding box visualization - positioned at origin since group is centered */}
            {debugMode && boundingBox && (
                <mesh position={[0, 0, 0]}>
                    <boxGeometry args={[boundingBox.size.x, boundingBox.size.y, boundingBox.size.z]} />
                    <meshBasicMaterial wireframe color="red" opacity={0.5} transparent />
                </mesh>
            )}


            <group ref={groupRef}>
                {/* Debug bounding box visualization */}

                {
                    stls.map((stl, index) => {
                        console.info(`Rendering STL URL[${index}]`)
                        return (
                            <STLMesh key={index}
                                color={objects[index].color}
                                opacity={objects[index].opacity}
                                wireframe={objects[index].wireframe}
                                stl={stl} />
                        )
                    }
                    )
                }
                {
                    tooltips.map((tooltip) => (
                        <ToolTip {...tooltip} />
                    ))
                }
            </group>
        </>
    )
}

export default function STLLoaderGroup({ objects, tooltips, envIntensity }: {
    objects: STLObjectProp[],
    tooltips: TooltipInterface[],
    envIntensity: number
}) {
    const urls = objects.map((object) => object.url);
    const stls = useLoader(STLLoader, urls);
    const envRotation = new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(0, 0, 0));

    return (
        <>
            <Environment files="/hdr/kiara_1_dawn_1k.hdr" />
            <STLGroup stls={stls} tooltips={tooltips} objects={objects} />;

        </>
    )
}
