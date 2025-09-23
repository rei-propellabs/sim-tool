import styles from "./NoItemsText.module.css";

interface NoItemsTextProps {
  title: string;
  subtitle?: string;
  actionButtonText?: string;
  onActionButtonClick?: () => void;
}

export const NoItemsText = (props: NoItemsTextProps) => {
  const { title, subtitle, actionButtonText, onActionButtonClick } = props;
  return (
    <div className={styles.noItemsContainer}>
      <div className={styles.title}>{title}</div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
      {actionButtonText && (
        <button onClick={onActionButtonClick} className={styles.actionButton}>
          {actionButtonText}
        </button>
      )}
    </div>
  );
};