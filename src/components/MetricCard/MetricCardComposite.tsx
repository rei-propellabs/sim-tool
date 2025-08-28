import styles from "./MetricCard.module.css"
import { MetricCardBase } from "./MetricCardBase"
import { useEffect, useRef, useState } from "react";

interface MetricCardCompositeProps {
  dataLeft: MetricCardProps,
  dataRight: MetricCardProps,
  dataBottom: MetricCardProps,
}

export function MetricCardComposite(props: MetricCardCompositeProps) {
  const { dataLeft, dataRight, dataBottom } = props

  const { key: leftKey, ...dataLeftProps } = dataLeft;
  const { key: rightKey, ...dataRightProps } = dataRight;
  const { key: bottomKey, ...dataBottomProps } = dataBottom;


  // Individual flash states and previous values
  const [flashLeft, setFlashLeft] = useState(false);
  const [flashRight, setFlashRight] = useState(false);
  const [flashBottom, setFlashBottom] = useState(false);

  const prevLeftValue = useRef(dataLeft.value);
  const prevRightValue = useRef(dataRight.value);
  const prevBottomValue = useRef(dataBottom.value);

  useEffect(() => {
    if (prevLeftValue.current !== dataLeft.value) {
      setFlashLeft(true);
      const timeout = setTimeout(() => setFlashLeft(false), 1500);
      prevLeftValue.current = dataLeft.value;
      return () => clearTimeout(timeout);
    }
  }, [dataLeft.value]);
  useEffect(() => {
    if (prevRightValue.current !== dataRight.value) {
      setFlashRight(true);
      const timeout = setTimeout(() => setFlashRight(false), 1500);
      prevRightValue.current = dataRight.value;
      return () => clearTimeout(timeout);
    }
  }, [dataRight.value]);

  useEffect(() => {
    if (prevBottomValue.current !== dataBottom.value) {
      setFlashBottom(true);
      const timeout = setTimeout(() => setFlashBottom(false), 1500);
      prevBottomValue.current = dataBottom.value;
      return () => clearTimeout(timeout);
    }
  }, [dataBottom.value]);

  return (
    <div className={styles.metricCardComposite}>
      <div className={styles.row}>
        <div className={`${styles.metricCard} ${styles.leftData} ${flashLeft ? styles.flash : ""}`}>
          <MetricCardBase {...dataLeftProps} key={leftKey} dim />
        </div>
        <div className={`${styles.metricCard} ${styles.rightData} ${flashRight ? styles.flash : ""}`}>
          <MetricCardBase {...dataRightProps} key={rightKey} dim />
        </div>
      </div>
      <div className={`${styles.metricCard} ${styles.bottomData} ${flashBottom ? styles.flashDark : ""}`}>
        <MetricCardBase {...dataBottomProps} key={bottomKey} dim />
      </div>
    </div>
  )
}
