import { useEffect, useRef, useState, useLayoutEffect } from "react";
import styles from "./MetricCard.module.css";
import { MetricCardBase } from "./MetricCardBase";

interface ResponsiveMetalCardProps {
  values: { name: string, value: string }[];
  unitPrefix?: string;
  unitSuffix?: string;
  title: string;
}

function getDisplayLength(value: string, unitPrefix?: string, unitSuffix?: string) {
  return (unitPrefix?.length || 0) + value.length + (unitSuffix?.length || 0);
}

export function ResponsiveMetalCard(props: ResponsiveMetalCardProps) {
  const { values, unitPrefix, unitSuffix, title } = props;

  const [flash, setFlash] = useState(false);
  const prevValues = useRef(values);
  const containerRef = useRef<HTMLDivElement>(null);
  const [parentWidth, setParentWidth] = useState<number>(0);

  // Calculate display lengths
  const valueStrings = values.map(v => v.value);
  const displayLengths = valueStrings.map((val, i) => getDisplayLength(val, unitPrefix, unitSuffix));
  const maxDisplayLength = Math.max(...displayLengths, 0);

  // Heuristic: estimate min col width based on char count (assume 10px per char + padding)
  const minColWidth = Math.max(50, maxDisplayLength * 10);

  // Try to fit as many columns as possible, but max 5
  let columns = Math.min(values.length, 5);
  if (parentWidth > 0) {
    while (columns > 1 && columns * minColWidth > parentWidth) {
      columns--;
    }
  }
  // Special case: 4 values, 2 rows, force 2 columns (2 per row)
  if (values.length === 4 && Math.ceil(values.length / columns) === 2) {
    columns = 2;
  }

  const rows = Math.ceil(values.length / columns);
  const specialCase = (values.length === 3 || values.length === 5) && (rows === 2 || rows === 3);

  useEffect(() => {
    if (JSON.stringify(prevValues.current) !== JSON.stringify(values)) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 1500);
      prevValues.current = values;
      return () => clearTimeout(timeout);
    }
  }, [values]);

  // Measure parent width
  useLayoutEffect(() => {
    function updateWidth() {
      if (containerRef.current) {
        setParentWidth(containerRef.current.offsetWidth);
        console.log("Width", containerRef.current.offsetWidth)
      }
    }
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, []);

  // Render a single data cell, with horizontal alignment if only one data per row
  function renderDataCell({ name, value }: { name: string, value: string }) {
    if (columns === 1) {
      // Only one data per row: align horizontally, space-between
      return (
        <div className={styles.metricGridCell} style={{ flexDirection: 'row', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {values.length > 1 && <div className={styles.metricLabel}>{name}</div>}
          <div className={styles.value}>
            {unitPrefix && <span className={styles.prefix}>{unitPrefix}</span>}
            {value}
            {unitSuffix && <span className={styles.sufix}>{unitSuffix}</span>}
          </div>
        </div>
      );
    }
    // Default: vertical layout
    return (
      <div className={styles.metricGridCell}>
        <div className={styles.metricLabel}>{name}</div>
        <div className={styles.value}>
          {unitPrefix && <span className={styles.prefix}>{unitPrefix}</span>}
          {value}
          {unitSuffix && <span className={styles.sufix}>{unitSuffix}</span>}
        </div>
      </div>
    );
  }

  function renderGridCells() {
    if (!specialCase) {
      // Default: all data, then title below
      return values.map((v, i) => (
        <div key={`data-${i}-${v.name}`}>
          {renderDataCell({ name: values.length === 1 ? "" : v.name, value: v.value })}
        </div>
      ));
    }
    // Special case: fill all but last row with data
    const cells = [];
    const fullRows = rows - 1;
    let idx = 0;
    for (let r = 0; r < fullRows; r++) {
      for (let c = 0; c < columns; c++) {
        if (idx < values.length) {
          cells.push(
            <div key={`data-${idx}-${values[idx].name}`}>
              {renderDataCell({ name: values.length === 1 ? "" : values[idx].name, value: values[idx].value })}
            </div>
          );
          idx++;
        }
      }
    }
    // Last row: first cell is title, rest are data or empty
    cells.push(
      <div className={styles.metricGridCell} key={`title-${title}`}>
        <div className={styles.metricLabel}>{title}</div>
      </div>
    );
    for (let c = 1; c < columns; c++) {
      if (idx < values.length) {
        cells.push(
          <div key={`data-${idx}-${values[idx].name}`}>
            {renderDataCell({ name: values.length === 1 ? "" : values[idx].name, value: values[idx].value})}
          </div>
        );
        idx++;
      } else {
        cells.push(<div className={styles.metricGridCell} key={`placeholder-${c}`} style={{ opacity: 0 }} />);
      }
    }
    return cells;
  }

  return (
    <div
      key={`metric-card-${title}`}
      ref={containerRef}
      className={`${styles.metricCardThreeRows} ${flash ? styles.flash : ""}`}
    >
      <div
        className={styles.metricGrid}
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
        }}
      >
        {renderGridCells()}
      </div>
      {/* Only show title below grid if not in special case */}
      { !specialCase && (
        <div className={styles.metricLabel}>
          {title}
        </div>
      )}
    </div>
  );
}
