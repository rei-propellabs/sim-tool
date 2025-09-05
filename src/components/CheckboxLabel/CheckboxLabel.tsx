import { Checkbox, FormControlLabel } from "@mui/material"

interface CheckboxLabelProps {
  text: string;
  onValueChange: (value: boolean) => void;
  checked: boolean;
}

export const CheckboxLabel = ({ text, onValueChange, checked }: CheckboxLabelProps) => {
  return (
    <FormControlLabel
      control={
        <Checkbox
          size="small"
          checked={checked}
          onChange={e => onValueChange(e.target.checked)}
          sx={{
            color: "var(--darker-text)", // unchecked color
            '&.Mui-checked': {
              color: "var(--accent)", // checked color
            },
          }}
        />
      }
      label={text}
      sx={{
        '.MuiFormControlLabel-label': {
          fontSize: '0.8rem',
          color: 'var(--darker-text)',
          userSelect: 'none',
        }
      }}
    />
  )
}