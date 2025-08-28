import { CircularProgress } from "@mui/material"
import styles from "./FullLoadingSpinner.module.css"

export const FullLoadingSpinner = () => {
  return (
    <div className={styles.loadingContainer} >
      <CircularProgress size="20px" sx={{color: "var(--accent)"}} />
    </div>
  )
}