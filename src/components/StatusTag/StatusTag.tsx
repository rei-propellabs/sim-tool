
import React from "react";
import styles from "./StatusTag.module.css";

interface StatusTagProps {
  text: string;
  color: string;
}

export const StatusTag: React.FC<StatusTagProps> = ({ text, color }) => {
  return (
    <div
      className={styles.statusText}
      style={{ backgroundColor: color }}
    >
      {text}
    </div>
  );
};



