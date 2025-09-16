import { useEffect, useRef, useState } from "react";
import styles from "./MetricCard.module.css"
import { MetricCardBase } from "./MetricCardBase"

interface MetricCardThreeRowsProps {
  topLabels?: string[];
  values: MetricCardProps[];
  bottomLabel?: string;
}
export function MetricCardThreeRows(props: MetricCardThreeRowsProps) {
  const { values, topLabels, bottomLabel } = props

  const [flash, setFlash] = useState(false);
  const prevValues = useRef(values);

  useEffect(() => {
    if (JSON.stringify(prevValues.current) !== JSON.stringify(values)) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 1500);
      prevValues.current = values;
      return () => clearTimeout(timeout);
    }
  }, [values]);

  return (
    <div className={`${styles.metricCardThreeRows}  ${flash ? styles.flash : ""}`}>
      <div className={styles.row}>
        {
          topLabels && topLabels.map((label, index) =>
            <div className={`${styles.metricLabel} flex1`} key={`label-${index}`}>
              {label}
            </div>
          )
        }
      </div>
      <div className={styles.row}>
        {values.map((value, index) => {

          const { key, ...dataProps } = value
          return (
            <div className={styles.metricCard} key={`metriccard-${[index]}-${index}`}>
              <MetricCardBase {...dataProps} key={`metricbase-${key}-${index}`} />
            </div>
          )
        })}
      </div>
      {
        bottomLabel &&
        <div className={styles.metricLabel} >
          {bottomLabel}
        </div>
      }
    </div>
  )
}
