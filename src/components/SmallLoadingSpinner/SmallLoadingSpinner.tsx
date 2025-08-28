import { CircularProgress } from "@mui/material"

export const SmallLoadingSpinner = () => {
  return (
    <div style={{ marginTop: "20px", 
      alignSelf: "center",
      display: "flex",
      justifyContent: "center" }}>
      <CircularProgress size="20px"
        sx={{
          color: "var(--accent)",
        }} />
    </div>

  )
}