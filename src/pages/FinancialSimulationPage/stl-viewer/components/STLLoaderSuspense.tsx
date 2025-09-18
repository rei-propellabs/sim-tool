import {Html} from "@react-three/drei";
import "../style.css"

export default function STLLoaderSuspense(){
        return(
            <Html center className={'px-4 py-2 bg-black font-mono text-white w-fit'}>
                <p className={'text-white text-nowrap'}>Loading...
                </p>
            </Html>
        )
}