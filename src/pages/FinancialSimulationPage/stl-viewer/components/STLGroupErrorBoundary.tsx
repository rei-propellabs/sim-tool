import React, {Component, type ErrorInfo, type ReactNode} from "react";
import {Html} from "@react-three/drei";
import "../style.css"

interface Props {
    children: ReactNode;
    fallback: ReactNode;
}

interface State {
    hasError: boolean;
}

export class STLGroupErrorBoundary extends Component<Props, State> {
    public state: State = {
        hasError: false,
    };

    public static getDerivedStateFromError(_: Error): State {
        return {hasError: true};
    }

    public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
        console.error("Caught an error:", error, errorInfo);
    }

    public render() {
        if (this.state.hasError) {
            return this.props.fallback;
        }
        return this.props.children;
    }
}

export function STLErrorFallback(){
    return(
        <Html center className="px-4 py-3 w-[50vw] rounded-xs text-red-500 bg-black text-lg font-mono ">
            Error loading one or more STL files. Please check if the files are corrupted
        </Html>
    )
}