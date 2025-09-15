// GroupedInfoCard.tsx
import React from 'react';
import styles from './GroupedInfoCard.module.css';

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
  const { leftLabel: label, leftValue, rightValue, rightLabel, dark } = props;

  return (
    <div className={styles.cardRow + (dark ? ` ${styles.dark}` : '')}>
      <div className={styles.rowLeft}>
        <div className={styles.value}>{leftValue}</div>
        <div className={styles.label}>{label}</div>
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
          key={index}
          {...row}
        />
      ))}
    </div>
  );
};

export default GroupedInfoCard;