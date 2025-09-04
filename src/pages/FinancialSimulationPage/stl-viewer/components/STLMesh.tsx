
import { useMemo} from "react";
import {Box3, BufferGeometry, Mesh, Vector3} from "three";

interface STLMeshProps {
    stl: BufferGeometry,
    color?: string,
    wireframe?: boolean,
    opacity? : number
}


export default function STLMesh({
                                    stl,color='#626262',wireframe=false,opacity=1,
                                }: STLMeshProps) {


    return (
        <mesh  castShadow position={[0, 0, 0]} scale={1}>
            <primitive
                object={stl}/>
            <meshPhysicalMaterial transparent opacity={opacity}  wireframe={wireframe} shadowSide={2} metalness={0.5} roughness={0.5}  color={color}/>

        </mesh>
    )
}