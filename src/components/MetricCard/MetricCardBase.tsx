import { useState, useRef, useLayoutEffect, useEffect } from "react";
import styles from "./MetricCard.module.css";
import { Info } from "images/Dynamic/Info";

export const MetricCardBase = (props: MetricCardProps) => {
  const { value, label, description, dim } = props;
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipStyle, setTooltipStyle] = useState({});
  const iconRef = useRef<HTMLSpanElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (iconRef.current && tooltipRef.current) {
      const iconRect = iconRef.current.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();
      const padding = 8; // space from edge

      let left = iconRect.left + iconRect.width / 2 - tooltipRect.width / 2;
      let transform = "translateX(0)";
      // If tooltip overflows right edge
      if (left + tooltipRect.width + padding > window.innerWidth) {
        left = window.innerWidth - tooltipRect.width - padding;
        transform = "none";
      }
      // If tooltip overflows left edge
      if (left < padding) {
        left = padding;
        transform = "none";
      }
      console.log("iconRect.top", iconRect.top, "tooltipRect.height", tooltipRect.height)

      setTooltipStyle({
        left: `${left}px`,
        top: `${iconRect.top - tooltipRect.height - 8}px`,
        transform,
      });
    }
  }, []);

  return (
    <>
      <div className={`${styles.metricValue} ${dim ? styles.dim : ""}`}>{value}</div>
      <div className={styles.metricLabel}>
        {label}
        {description && (
          <span
            user-select="none"
            ref={iconRef}
            className={styles.infoContainer}
            onClick={() => setShowTooltip(!showTooltip)}
          >
            <Info size={14} color="var(--darker-text)" />
            <div
              ref={tooltipRef}
              className={styles.tooltipAbove}
              style={{
                ...tooltipStyle,
                visibility: showTooltip ? "visible" : "hidden" // hide until positioned
              }}
            >
              {description}
            </div>
          </span>
        )}
      </div>
    </>
  );
};