import STLCanvas from "./components/STLCanvas";
import { type RefObject, Suspense, useRef, useState } from "react";

import type { STLCanvasProps } from "./components/STLCanvas";
import styles from "./stl-viewer-page.module.css";
import play from "images/play.svg";
import pause from "images/pause.svg";
import { CheckboxLabel } from "components/CheckboxLabel/CheckboxLabel";

export default function STLPage() {
    const buttonRef = useRef<HTMLButtonElement>(null);
    // State for checkboxes
    const [autoRotate, setAutoRotate] = useState(true);
    const [showSurface, setShowSurface] = useState(false);

    const stlCanvasProps: STLCanvasProps = {
        objects: [
            {
                url: 'https://iiyqz40cm5.ufs.sh/f/wUjDYoJQbUKjmTStrVUl2FSPwHiCvpgWcxnBIjs6NDZyEQ5J',
                color: '#393159',
                wireframe: false,
                opacity: 1.0
            },
            {
                url: 'https://iiyqz40cm5.ufs.sh/f/wUjDYoJQbUKjuDhJEE6QDj6wyeT5qbNR1HAChrVX4BkmoltG',
                color: '#e5b85b',
                wireframe: true,
                opacity: 0.5
            }
        ],
        debugMode: false,
        resetButton: buttonRef,
        autoRotate: autoRotate,
        showSurface: showSurface,
        setShowSurface: setShowSurface,
        className: ''
    }

    return (
        <div className={styles.container}>
            <Suspense fallback={
                <div className={styles.loading}>
                    Loading
                </div>
            }>
                <STLCanvas {...stlCanvasProps} />

                <div className={styles.controls}>

                    <button className={styles.playPause} onClick={() => setAutoRotate(!autoRotate)}>
                        <img src={autoRotate ? pause : play } />
                    </button>
                    <CheckboxLabel
                        text="AUTOROTATE"
                        checked={autoRotate}
                        onValueChange={setAutoRotate}
                    />
                    <CheckboxLabel
                        text="SHOW SURFACE"
                        checked={showSurface}
                        onValueChange={setShowSurface}
                    />
                </div>
{/*                 
                <button ref={buttonRef}
                    className={styles.resetButton}>
                    RESET
                </button> */}
            </Suspense>

        </div>
    )
}