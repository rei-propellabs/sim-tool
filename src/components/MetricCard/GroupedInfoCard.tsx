import React, { useEffect, useRef } from 'react';
import styles from './MetricCard.module.css';

interface GroupedInfoCardProps {
  rows: CardRowProps[];
}

interface CardRowProps {
  leftLabel: string;
  leftValue: string | number;
  rightValue?: string | number;
  rightLabel?: string;
  dark?: boolean;
}

const CardRow: React.FC<CardRowProps> = (props: CardRowProps) => {
  const { leftLabel, leftValue, rightValue, rightLabel, dark } = props;

  const prevLeftValue = useRef(leftValue);
  const prevRightValue = useRef(rightValue);
  const [flash, setFlash] = React.useState(false);

  useEffect(() => {
    if (prevLeftValue.current !== leftValue || prevRightValue.current !== rightValue) {
      setFlash(true);
      const timeout = setTimeout(() => setFlash(false), 1500);
      prevLeftValue.current = leftValue;
      prevRightValue.current = rightValue;
      return () => clearTimeout(timeout);
    }
  }, [leftValue, rightValue]);

  return (
    <div className={styles.cardRow + (dark ? ` ${styles.dark}` : '') + (flash ? ` ${styles.flash}` : '')}>
      <div className={styles.rowLeft}>
        <div className={styles.value}>{leftValue}</div>
        <div className={styles.label}>{leftLabel}</div>
      </div>
      {rightValue && (
        <div className={styles.rowRight}>
          <div className={styles.value}>{rightValue}</div>
          {rightLabel && <div className={styles.label}>{rightLabel}</div>}
        </div>
      )}
    </div>
  );
};


const GroupedInfoCard: React.FC<GroupedInfoCardProps> = ({ rows }) => {
  return (
    <div className={styles.groupedInfoCard}>
      {rows.map((row, index) => (
        <CardRow
          key={row.leftLabel}
          {...row}
        />
      ))}
    </div>
  );
};

export default GroupedInfoCard;