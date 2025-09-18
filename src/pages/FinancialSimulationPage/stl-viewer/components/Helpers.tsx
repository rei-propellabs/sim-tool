import {GizmoHelper, GizmoViewport, Grid} from "@react-three/drei";
import {useControls} from "leva";

export default function Helpers() {

    const {gridSize, showGrid, ...gridConfig} = useControls({
        showGrid: false,
        gridSize: [10, 10],
        cellSize: {value: 1, min: 0, max: 10, step: 0.1},
        cellThickness: {value: 0.5, min: 0, max: 5, step: 0.1},
        cellColor: '#6f6f6f',
        sectionSize: {value: 5, min: 0, max: 10, step: 0.1},
        sectionThickness: {value: 0.8, min: 0, max: 5, step: 0.1},
        sectionColor: '#bababa',
        fadeDistance: {value: 500, step: 10, min:0},
        fadeStrength: {value: 1, min: 0, max: 1, step: 0.1},
        followCamera: false,
        infiniteGrid: true
    })


    return (
        showGrid &&
        <>
            <Grid position={[0, 0, 0]} args={gridSize} {...gridConfig} />
            <GizmoHelper
                alignment="bottom-left" // widget alignment within scene
                margin={[80, 80]} // widget margins (X, Y)
            >
                {/*<GizmoViewcube  color={'#4965fc'} hoverColor={'#03ffe0'} strokeColor={'#010598'} textColor={'#1b0050'}/>*/}
                <GizmoViewport  axisColors={['red', 'green', 'blue']} labelColor="white"/>
            </GizmoHelper>
            <mesh position={[0,0,0]} castShadow receiveShadow>
                <sphereGeometry args={[5, 64, 32 ]}/>
                <meshPhysicalMaterial  transparent color={'#00ff00'} fog metalness={1}  roughness={1}   />
            </mesh>
        </>
    )
}