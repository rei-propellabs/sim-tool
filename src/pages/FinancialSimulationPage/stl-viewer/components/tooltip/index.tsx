import {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";

import {useFrame} from "@react-three/fiber";
import {type TooltipInterface, ViewerContext} from "../STLCanvas";
import {BBAnchor, Billboard, Html} from "@react-three/drei";
import * as THREE from "three";
import {ToolTipColors, TooltipIcons} from "../../stl-viewer-page";
// import "style.css"

export interface ToolTipContext {
    position: { x: number; y: number; z: number };
    hoverState: boolean,
    clickedState: boolean
}

export const ToolTipContext = createContext<ToolTipContext>({
    position: {x: 0, y: 0, z: 0},
    hoverState: false,
    clickedState: false
} as ToolTipContext);

export default function ToolTip(toolTipData: TooltipInterface) {

    const {config, dispatch} = useContext(ViewerContext);
    const showToolTip = useCallback(() => config.showToolTipInPlanOnly ? config.mode === 'plan' : true, [config.mode])

    const [hoverState, setHoverState] = useState(false);
    const [clickedState, setClickedState] = useState(false);
    const meshRef = useRef<THREE.Mesh>(null);
    const ringRef = useRef<THREE.Mesh>(null);
    const billboardRef = useRef(null);
    const flipHover = () => setHoverState(!hoverState);
    const flipClick = () => setClickedState(!clickedState);

    useFrame((state, delta) => {
        if (meshRef.current) {
            if (hoverState && showToolTip()) {
                meshRef.current.rotation.z += delta * 6;
            } else
                meshRef.current.rotation.z += delta * 2; // Rotate at 0.5 radians per second


        }
    });

    // Calculate tooltip color based on Gold_vol
    const getToolTipLevel = (goldVol: number): keyof typeof ToolTipColors.levels => {
        if (goldVol > 100) return 5;
        if (goldVol <= 25) return 1;
        if (goldVol <= 50) return 2;
        if (goldVol <= 75) return 3;
        return 4; // 76-100
    };

    const toolTipColor: string = ToolTipColors.levels[getToolTipLevel(toolTipData.Gold_vol)].color;


    let formatter = Intl.NumberFormat('en', {notation: 'compact'});
    let revenue = formatter.format(toolTipData.net_value);


    return (
        <ToolTipContext.Provider value={{
            position: toolTipData.position,
            hoverState: hoverState,
            clickedState: clickedState,
        }}>

            <mesh ref={meshRef} position={[toolTipData.position.x, toolTipData.position.y, toolTipData.position.z]}
                  onClick={showToolTip() ? flipClick : () => {
                  }}
                  onPointerEnter={showToolTip() ? flipHover : () => {
                  }} onPointerLeave={showToolTip() ? flipHover : () => {
            }} castShadow>
                <octahedronGeometry args={[0.5]}/>
                <meshPhysicalMaterial side={2} transparent
                                      metalness={1.0} roughness={0.65}
                                      color={toolTipColor}/>
            </mesh>
            {
                clickedState && showToolTip() &&
                <>
                    <Billboard
                        ref={billboardRef}
                        position={[toolTipData.position.x, toolTipData.position.y, toolTipData.position.z]}
                    >
                        <mesh ref={ringRef}>
                            <ringGeometry args={[0.8, 1.0, 4]}/>
                            <meshPhysicalMaterial side={2} transparent
                                                  metalness={1.0} roughness={0.65}
                                                  color={toolTipColor}/>
                        </mesh>
                        <BBAnchor anchor={[1, 1, 0]}>
                            <Html position={[0.5, 0.5, 0]} center>
                                <div
                                    className={'p-2 relative flex flex-col gap-1.5   max-w-72 bg-tooltip-bg border border-tooltip-border font-manrope text-tooltip-text rounded-sm text-nowrap '}>
                                    <div className={' flex flex-row justify-between gap-2 items-center text-sm w-full font-semibold'}>
                                        <p> BH-{
                                            toolTipData.serial
                                        }</p>
                                        <button
                                            onClick={flipClick}>
                                            <img loading={'eager'} src={TooltipIcons.close} className={'size-3 text-tooltip-text '}/>
                                        </button>

                                    </div>
                                    <div className={'flex flex-row  items-center gap-1 font-normal text-xs '}>
                                        <div
                                            style={{
                                                background: ToolTipColors.levels[getToolTipLevel(toolTipData.Gold_vol)].color,
                                                border: `2px solid ${ToolTipColors.levels[getToolTipLevel(toolTipData.Gold_vol)].border}`
                                            }}
                                            className={`size-3 rounded-full`}/>
                                        <p>{toolTipData.Gold_vol.toPrecision(4)}{" "} g/t Au</p>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1 font-normal text-xs'}>
                                        <img loading={'eager'} src={TooltipIcons.delete} className={'size-3'}/>
                                        <p>{toolTipData.Waste_Vol.toPrecision(4)} g/t</p>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1 font-normal text-xs '}>
                                        <img loading={'eager'} src={TooltipIcons.arrows_vertical} className={'size-3'}/>
                                        <p>{toolTipData.depth.toPrecision(4)} g/t</p>
                                    </div>
                                    <div className={'flex flex-row items-center gap-1 font-normal text-xs '}>
                                        <img loading={'eager'} src={TooltipIcons.currency_dollar} className={'size-3'}/>
                                        <p>{revenue}</p>
                                    </div>


                                </div>
                            </Html>
                        </BBAnchor>
                    </Billboard>
                </>
            }
        </ToolTipContext.Provider>
    )
}
