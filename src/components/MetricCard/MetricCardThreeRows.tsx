import { useEffect, useRef, useState } from "react";
import styles from "./MetricCard.module.css"
import { MetricCardBase } from "./MetricCardBase"

interface MetricCardThreeRowsProps {
  labels: string[];
  values: MetricCardProps[]
}
export function MetricCardThreeRows(props: MetricCardThreeRowsProps) {
  const { values, labels } = props

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
      {labels.map((label, index) => (
        <div className={styles.metricLabel} key={`label-${index}`}>
          {label}
        </div>
      ))}

      <div className={styles.row}>
        {values.map((value, index) => {

          const { key, ...dataProps } = value
          return (
            <div className={styles.metricCard} key={`${labels[index]}-${index}`}>
              <MetricCardBase {...dataProps} key={`metricCard-${key}-${index}`} dim />
            </div>
          )
        })}
      </div>
    </div>
  )
}
