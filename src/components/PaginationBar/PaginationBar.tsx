import React from "react";
import styles from "./PaginationBar.module.css";

type PaginationBarProps = {
  total: number;
  pageSize: number;
  currentPage: number;
  numRows: number;
  onPageChange: (page: number) => void;
};

function getPageButtons(totalPages: number) {
  const buttons = [];
  for (let i = 1; i <= totalPages; i++) {
    buttons.push(i);
  }
  return buttons;
}

export const PaginationBar: React.FC<PaginationBarProps> = ({
  total,
  pageSize,
  currentPage,
  numRows,
  onPageChange,
}) => {
  const totalPages = Math.ceil(total / pageSize);
  if (totalPages < 1) return null;

  const plural = total === 1 ? "" : "s";

  return (
    <div className={styles.paginationBarContainer}>
      <div className={styles.paginationInfo}>{`Showing ${numRows} of ${total} item${plural}`}</div>
      <div className={styles.paginationBar}>
        {getPageButtons(totalPages).map((btn, idx) =>
          <button
            key={btn}
            className={`${styles.paginationButton} ${btn === currentPage ? styles.active : ""}`}
            onClick={() => {
              if (btn === currentPage) return;
              onPageChange(Number(btn))
            }}
          >
            {btn}
          </button>
        )}
      </div>
    </div>
  );
};