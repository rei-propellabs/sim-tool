import { useRef} from "react";
import { BufferGeometry} from "three";
import "../style.css"

interface STLMeshProps {
    stl: BufferGeometry,
    color?: string,
    wireframe?: boolean,
    opacity?: number
}


export default function STLMesh({
                                    stl, color = '#626262', wireframe = false, opacity = 1,
                                }: STLMeshProps) {
    const meshRef = useRef(null)
    return (
        <mesh ref={meshRef} castShadow>
            <primitive
                object={stl}/>
            <meshPhysicalMaterial side={2} transparent opacity={opacity} wireframe={wireframe} shadowSide={2}
                                  metalness={1.0} roughness={0.65} color={color}/>
        </mesh>
    )
}