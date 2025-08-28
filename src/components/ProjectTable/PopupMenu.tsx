import React, { useEffect, useRef, useState } from "react";
import styles from "./PopupMenu.module.css";

interface PopupMenuProps {
  open: boolean;
  anchorRef: React.RefObject<HTMLElement>;
  onClose: () => void;
  style?: React.CSSProperties;
  children: React.ReactNode;
  menuRef?: React.RefObject<HTMLDivElement>;
}


export const PopupMenu: React.FC<PopupMenuProps> = ({ open, anchorRef, onClose, style, children, menuRef: externalMenuRef }) => {
  const internalMenuRef = useRef<HTMLDivElement>(null);
  const menuRef = externalMenuRef || internalMenuRef;
  const [menuStyle, setMenuStyle] = useState({});

  useEffect(() => {
    if (!open) return;

    if (anchorRef.current) {
        const rect = anchorRef.current.getBoundingClientRect();
        setMenuStyle({
          position: "fixed",
          display: "block", // it's temporary hidden until it's in the right position. display it now.
          ...style,
        });
      }

    function handleClickOutside(event: MouseEvent | TouchEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        anchorRef.current &&
        !anchorRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    }
    document.addEventListener('mousedown', handleClickOutside, true);
    document.addEventListener('touchstart', handleClickOutside, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true);
      document.removeEventListener('touchstart', handleClickOutside, true);
    };
  }, [open, onClose, anchorRef]);


  if (!open) return null;



  return (
    <div 
      className={styles.container} ref={menuRef} style={menuStyle}>
      {children}
    </div>
  );
};
