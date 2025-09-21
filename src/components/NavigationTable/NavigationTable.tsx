import { PopupMenu } from "components/ProjectTable/PopupMenu";
import styles from './NavigationTable.module.css';
import MenuDots from "images/MenuDots.svg";
import React from "react";

export type ColumnConfig<T> = {
  key: string;
  header: string;
  render?: (item: T, index: number) => React.ReactNode;
};

export type TableViewProps<T> = {
  columns: ColumnConfig<T>[];
  data: T[];
  onRowClick: (rowIndex: number) => void;
  renderMenuButton?: (rowIndex: number, openMenu: () => void, ref: React.RefObject<HTMLButtonElement>) => React.ReactNode;
  renderMenu?: (rowIndex: number, closeMenu: () => void) => React.ReactNode;
  expandIndexes?: number[];
};

export const NavigationTable = <T extends object>(props: TableViewProps<T>) => {
  const { columns, data, onRowClick, renderMenuButton, renderMenu, expandIndexes } = props;
  const [showMenu, setShowMenu] = React.useState(false);
  const [selectedMenuIndex, setSelectedMenuIndex] = React.useState<number | null>(null);
  const menuButtonRefs = React.useRef<Array<React.RefObject<HTMLButtonElement>>>([]);
  const [menuButtonRef, setMenuButtonRef] = React.useState<React.RefObject<HTMLButtonElement> | null>(null);
  const popupMenuRef = React.useRef<HTMLDivElement>(null);
  const ignoreNextRowClick = React.useRef(false);

  // Generate grid template columns based on expand/shrink configuration
  const gridTemplateColumns = React.useMemo(() => {
    return columns.map((_, index) => {
      if (expandIndexes?.includes(index)) {
        return '1fr'; // Expand columns get equal fractions
      } else {
        return 'auto'; // Shrink columns get auto sizing
      }
    }).join(' ');
  }, [columns, expandIndexes]);

  React.useEffect(() => {
    if (!showMenu) return;

    function handleClick(event: MouseEvent) {
      if (
        (popupMenuRef.current && popupMenuRef.current.contains(event.target as Node)) ||
        (menuButtonRef?.current && menuButtonRef.current.contains(event.target as Node))
      ) {
        return;
      }
      setShowMenu(false);
      ignoreNextRowClick.current = true;
    }

    document.addEventListener("mousedown", handleClick, true);
    return () => document.removeEventListener("mousedown", handleClick, true);
  }, [showMenu, menuButtonRef]);

  const header = () => {
    return (
      columns.map((col, i) => (
        <th key={`header-${i}`}
          className={`${styles.th} ${expandIndexes?.includes(i) ? styles.expand : styles.shrink}`}

        >
          {col.key === "menu" ? null : col.header}
        </th>
      ))
    )
  }

  const tableBody = (item: T, rowIndex: number) => {

    const renderCell = (col: ColumnConfig<T>, item: T, colIndex: number) => {
      if (col.key === "menu") {
        if (!menuButtonRefs.current[rowIndex]) {
          menuButtonRefs.current[rowIndex] = React.createRef<HTMLButtonElement>();
        }
        const thisButtonRef = menuButtonRefs.current[rowIndex];

        return (
          <button
            ref={thisButtonRef}
            onClick={(e) => {
              if (showMenu) {
                e.stopPropagation();
                setShowMenu(false);
              } else {
                e.stopPropagation();
                setMenuButtonRef(thisButtonRef);
                setSelectedMenuIndex(rowIndex);
                setShowMenu(true);
              }

            }}
            className={`buttonNoBg`}>
            <img src={MenuDots} />
          </button>
        );
      }
      if (col.render) {
        return col.render(item, rowIndex);
      }

      return item[col.key as keyof T] as any ?? "N/A";
    };

    const textStyle = (key: string, text: string) => {
      if (key === "uploadedTo" && text === "No particular project") {
        return { color: "var(--darker-text)" }
      }
    }
    return (
      <tr className={styles.tr}>
        {columns.map((col, colIndex) => (
          <td key={colIndex}
            className={`${styles.td} ${expandIndexes?.includes(colIndex) ? styles.expand : styles.shrink}`}
            style={textStyle(col.key, renderCell(col, item, colIndex))}>
            <div className={styles.tdContent}>
              {renderCell(col, item, colIndex)}
            </div>
          </td>
        ))}
      </tr>
    )
  }

  return (
    <div className={styles.flexTableWrapper}>
      <table
        className={styles.table}
        style={{ 
          width: "100%", 
          textAlign: "left",
          gridTemplateColumns: gridTemplateColumns
        }}>
        <thead className={styles.thead}>
          <tr className={styles.tr}>
            {header()}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((item, rowIndex) => (
            // Use tableBody to render the row as a flex row
            React.cloneElement(tableBody(item, rowIndex), {
              key: rowIndex,
              onClick: (e: React.MouseEvent) => {
                if (ignoreNextRowClick.current) {
                  console.log("Ignoring row click due to menu close");
                  ignoreNextRowClick.current = false;
                  e.preventDefault();
                  return;
                } else {
                  e.preventDefault();
                  onRowClick(rowIndex);
                }
              }
            })
          ))}
        </tbody>
      </table>
      <div ref={popupMenuRef}>
        <PopupMenu
          open={showMenu}
          anchorRef={menuButtonRef ?? { current: null }}
          onClose={() => setShowMenu(false)}
          style={{
            top: menuButtonRef ? menuButtonRef.current?.getBoundingClientRect().bottom : 0,
            marginTop: 0,
            right: 20
          }}
        >
          {renderMenu && selectedMenuIndex !== null
            ? renderMenu(selectedMenuIndex, () => setShowMenu(false))
            : null}
        </PopupMenu>
      </div>
    </div>
  );
}