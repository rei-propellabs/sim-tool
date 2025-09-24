import {
  Checkbox as MuiCheckbox,
  SvgIcon,
  CheckboxProps,
} from "@mui/material";

interface CheckboxLabelProps {
  onChange: (value: boolean) => void;
  checked: boolean;
  disabled?: boolean;
}

const FilledCheckboxIcon = () => (
  <SvgIcon
    fontSize="small"
    viewBox="0 0 24 24"
    sx={{
      width: 20,
      height: 20,
    }}
  >
    <rect
      x="4"
      y="4"
      width="16"
      height="16"
      rx="2"
      ry="2"
      fill="#cccccc" // your disabled fill color
      stroke="#cccccc"
    />
  </SvgIcon>
);

export const Checkbox = ({ checked, onChange, disabled }: CheckboxLabelProps) => {
  return (
    <MuiCheckbox
      size="small"
      checked={disabled ? true : checked}
      disabled={disabled}
      onChange={(e) => onChange(e.target.checked)}
      onClick={(event) => {
        event.stopPropagation();
      }}
      icon={disabled ? <FilledCheckboxIcon /> : undefined}
      checkedIcon={disabled ? <FilledCheckboxIcon /> : undefined}
      sx={{
        color: "var(--darker-text)", // unchecked color
        '&.Mui-checked': {
          color: "var(--accent)", // checked color
        },
        '&.Mui-disabled': {
          color: "#cccccc",
        },
      }}
    />
  );
};
