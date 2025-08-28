import Button from "@mui/material/Button"
import styles from "./DropdownMenu.module.css"
import {Chevron} from "images/Dynamic/Chevron"
import styled from "@emotion/styled"
import { useState } from "react"
import { Menu, MenuItem } from "@mui/material"


interface DropdownMenuProps {
  label: string,
  options: string[],
  onOptionSelect: (index: number) => void,
  isFocused?: boolean
}
export const DropdownMenu = (props: DropdownMenuProps) => {
  const { label, options, isFocused } = props

  const [openMenu, setOpenMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClose = (e: React.MouseEvent<HTMLLIElement, MouseEvent>, index?: number) => {
    e.stopPropagation();
    e.preventDefault();
    setOpenMenu(false);
    setAnchorEl(null);

    if (index != null) {
      props.onOptionSelect(index);

    }
  }

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
    setOpenMenu(prev => !prev);
  };

  return (
    <>
      <Button 
        className={styles.dropdownButton}
        style={{color: `${isFocused ? "var(--default-text)" : "var(--darker-text)"} !important`}}
        id="basic-button"
        onClick={(e) => {
          e.preventDefault();
          handleClick(e);
        }}
        aria-controls={openMenu ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={openMenu ? 'true' : undefined}
        endIcon={
          <div className={styles.arrowContainer}>
          <Chevron
            rotate={90}
            width={10}
            height={10}
            color={isFocused ? "var(--default-text)" : "var(--darker-text)"} />
          </div>
        }>
        {label}
      </Button>

      <Menu
      id="basic-menu"
      anchorEl={anchorEl}
      open={openMenu}
      onClose={(e: React.MouseEvent<HTMLLIElement, MouseEvent>) => handleClose(e)}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      >
        {
          options.map((text, i) => {
            return (
              <MenuItem 
                key={`menu-${text}`}
                sx={{
                  color: "var(--default-text) !important",
                  fontWeight: 500,
                  fontSize: "0.9rem !important",
                  '&.MuiMenuItem-root': {
                    background: "var(--popup-menu-bg)",
                    "&:hover": {
                      background: "var(--secondary-button)"
                    }
                  }
                }}
                onClick={(e) => handleClose(e, i)}>{text}</MenuItem>
            )
          })
        }
      </Menu>
      </>
  )
}