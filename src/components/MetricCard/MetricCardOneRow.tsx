import { useEffect, useRef, useState } from "react";
import styles from "./MetricCard.module.css"
import { MetricCardBase } from "./MetricCardBase"

export function MetricCardOneRow(props: MetricCardProps) {
  const { value, label } = props
  const [flash, setFlash] = useState(false);
  const prevValue = useRef(value);

  useEffect(() => {
    if (prevValue.current !== value) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 1500);
      prevValue.current = value;
      return () => clearTimeout(timeout);
    }
  }, [value]);

  return (
    <div className={`${styles.metricCardOneRow} 
      ${props.fullWidth ? styles.fullWidth : ""}
      ${flash ? styles.flash : ""}`}>
      <MetricCardBase {...props} />
    </div>
  )
}
