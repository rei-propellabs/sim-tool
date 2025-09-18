import STLCanvas, {type CameraMode, type TooltipInterface} from "./components/STLCanvas";
import {type RefObject, Suspense, useRef, useState} from "react";

import type {STLCanvasProps} from "./components/STLCanvas";
import {CollarData} from "./tableConvert.com_h97une";

/**
 * Colors used to decorate the tooltips based off of `Au g/t`
 * @remarks
 * Suggestion : Add these colors to your tailwind theme too so that the tooltip dialog can also use the same colors
 **/
export const ToolTipColors = {
    text: `#E5F3EB99`,
    background: `#1A1E1B`,
    border: '#E5F3EB',
    levels: {
        1:
            {
                color: '#29BBAC',
                border:
                    '#155C554D'
            }
        ,
        2:
            {
                color: '#58CD8D',
                border:
                    '#37B97466'
            }
        ,
        3:
            {
                color: '#ECC92A',
                border:
                    '#9D820B99'
            }
        ,
        4:
            {
                color: '#F2A61D',
                border:
                    '#BE7C09CC'
            }
        ,
        5:
            {
                color: '#FE592A',
                border:
                    '#D94C24'
            }
    }
}

export const TooltipIcons = {
    delete : '/icons/Delete.svg',
    arrows_vertical : '/icons/ArrowsVertical.svg',
    currency_dollar : '/icons/CurrencyDollar.svg',
    close : '/icons/close.svg',
}

export default function STLPage() {
    const buttonRef = useRef<RefObject<HTMLButtonElement>>(null);

    const toolTipCoordinates = CollarData.map((item) => {
        return {
            position: {x: item.collar_render_x, y: item.collar_render_y, z: item.collar_render_z},
            serial: item.serial,
            Gold_vol: item.Gold_Vol,
            Gold_Mass: item.Gold_Mass,
            Gold_Au_kg: item.Gold_Au_kg,
            Waste_Mass: item.Waste_Mass,
            Waste_Au_ppm: item.Waste_Au_ppm,
            Waste_Au_kg: item.Waste_Au_kg,
            Waste_Vol: item.Waste_Vol,
            depth: item.depth,
            net_value: item["Net Value"],
            Gold_Au_ppm: item.Gold_Au_ppm,

        } as TooltipInterface;
    })

    const [camMode,setCamMode] = useState<CameraMode>('free');

    const flipMode = () => {
        if (camMode === 'free') {
            setCamMode('plan');
        }else setCamMode('free');
    }

    const stlCanvasProps: STLCanvasProps = {
        objects: [
            {
                url: "/Monster_Lake/scenario_1_render/scenario_1_drillholes_Gold.stl",
                color: '#ffd500',
                wireframe: false,
                opacity: camMode==='free'?0.35:0.8
            },
            {
                url: "/Monster_Lake/scenario_1_render/scenario_1_drillholes_Waste.stl",
                color: '#4e9333',
                wireframe: false,
                opacity: camMode==='free'?0.35:0.8
            },
            {
                url: "/Monster_Lake/scenario_1_render/tacuma_Au_3.stl",
                color: '#1db6c4',
                wireframe: false,
                opacity: 0.85
            },

            {
                url: "/Monster_Lake/scenario_1_render/tacuma_Au_6.stl",
                color: '#c1a6ff',
                wireframe: false,
                opacity: 0.85
            },
            {
                url: "/Monster_Lake/scenario_1_render/tacuma_Au_9.stl",
                color: '#e06c87',
                wireframe: false,
                opacity: 0.85
            },
            // {
            //     url: "/Monster_Lake/scenario_1_render/tacuma_scenario_1_topo.stl",
            //     color: '#78a1ff',
            //     wireframe: false,
            //     opacity: 1
            // }
        ],
        debugMode: import.meta.env.MODE === 'development',
        resetButton: buttonRef,
        className: '',
        environmentMapIntensity: 0.33,
        tooltips: toolTipCoordinates,
        cameraMode: camMode,
        showToolTipInPlanOnly: true,
        setRotation: {
            rotateZ: Math.PI / 2,
            rotateX: -Math.PI / 2,
        }
    }

    return (
        <div className={'relative border-2  h-svh overflow-clip border-blue-500 '}>
            <Suspense fallback={
                <div className={'flex flex-row h-full w-full items-center justify-center font-mono text-5xl'}>
                    Loading
                </div>
            }>
                <STLCanvas {...stlCanvasProps}  />
                <div className={'absolute top-1/2 z-10 left-4 flex flex-col gap-2'}>
                    {/*// @ts-ignore*/}
                    <button ref={buttonRef}
                            className={'px-3 py-2 font-mono bg-blue-200 hover:bg-blue-300'}>
                        RESET
                    </button>
                    <button onClick={flipMode}
                            className={'px-3 py-2 font-mono bg-blue-200 hover:bg-blue-300'}>
                        Current Mode : {camMode}
                    </button>

                </div>
            </Suspense>

        </div>
    )
}