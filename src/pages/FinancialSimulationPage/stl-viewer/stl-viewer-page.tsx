import STLCanvas from "./components/STLCanvas";
import { type RefObject, Suspense, useRef } from "react";

import type { STLCanvasProps } from "./components/STLCanvas";
import styles from "./stl-viewer-page.module.css";

export default function STLPage() {
    const buttonRef = useRef<HTMLButtonElement>(null);
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
                <button ref={buttonRef}
                    className={styles.resetButton}>
                    RESET
                </button>
            </Suspense>

        </div>
    )
}