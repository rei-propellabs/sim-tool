export const checkboxStyle = {
  paddingTop: "3px",
  paddingBottom: "3px",
  paddingRight: "4px",
  color: "var(--background-color)",
  '&.Mui-checked': { color: "var(--accent)" },
  "& .MuiSvgIcon-root": {
    width: "20px",
  },
}

export const boxStyle = {
  width: "16px",
  height: "16px",
  color: "var(--default-text)",
  '&.Mui-checked': {
    color: "var(--accent)",
  },
}

export const checkboxLabelStyle = {
  width: "-webkit-fill-available",
  ".MuiFormControlLabel-label": {
    color: "var(--default-text)",
    fontSize: "0.8rem",
  }
}

export const checkboxLabelStyleBold = {
  ...checkboxLabelStyle,
  ".MuiFormControlLabel-label": {
    ...checkboxLabelStyle[".MuiFormControlLabel-label"],
    fontWeight: "bold",
  }
}

export const formLabel = {
  ".MuiFormControlLabel-label": {
    fontSize: "0.8rem",
  }
}