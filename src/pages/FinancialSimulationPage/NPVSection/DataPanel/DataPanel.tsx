import { formatNumberWithAbbreviation } from "utils/NumberFormatter"
import styles from "./DataPanel.module.css"

interface DataPanelProps {
  totalGrossRevenue: number
  totalMiningCost: number
  totalProcessingCost: number
  totalNetCashFlow: number
  totalNetCashFlowPeriod?: number
  netCashFlowRate?: number
}

export default function DataPanel({
  totalGrossRevenue,
  totalMiningCost,
  totalProcessingCost,
  totalNetCashFlow,
  totalNetCashFlowPeriod,
  netCashFlowRate = 5,
}: DataPanelProps) {

  const isHovered = totalNetCashFlowPeriod !== undefined;

  return (
    <div className={styles.dataPanel}>
      <div className={`${styles.metricCard}`}>
        <div className={styles.valueContainer}>
          <div className={`${styles.colorIndicator} ${styles.revenue}`} />
          <div className={styles.value}>
            <span className="dim">$</span>
            {formatNumberWithAbbreviation(totalGrossRevenue, 1)}
          </div>
        </div>
        <div className={styles.label}>Total Gross Revenue</div>
      </div>

      <div className={`${styles.metricCard}`}>
        <div className={styles.valueContainer}>
          <div className={`${styles.colorIndicator} ${styles.miningCost}`}
          />
          <div className={styles.value}>
            <span className="dim">$</span>
            {formatNumberWithAbbreviation(Math.abs(totalMiningCost), 1)}
          </div>
        </div>
        <div className={styles.label}>Total Mining Cost</div>
      </div>

      <div className={`${styles.metricCard}`}>
        <div className={styles.valueContainer}>
          <div className={`${styles.colorIndicator} ${styles.processingCost}`}
          />
          <div className={styles.value}>
            <span className="dim">$</span>
            {formatNumberWithAbbreviation(Math.abs(totalProcessingCost), 1)}
          </div>
        </div>
        <div className={styles.label}>Total Processing Cost</div>
      </div>

      <div className={`${styles.metricCard} ${styles.darkBackground}`}>
        <div className={"flex flex-row gap-8"}>
          {
            isHovered &&
            // insert period net cash flow if a bar is hovered
            <div className={styles.netCashFlowContainer}>
              <div className={styles.valueContainer}>
                <div className={`${styles.colorIndicator} ${styles.netCash}`} />
                <div className={styles.value}>
                  <span className="dim">$</span>
                  {formatNumberWithAbbreviation(totalNetCashFlowPeriod, 1)}
                </div>
              </div>
              <div className={styles.label}>
                Net Cash Flow (Period)
              </div>
            </div>
          }

          <div className={styles.netCashFlowContainer}>
            <div className={styles.valueContainer}>
              <div className={`${isHovered ? "" : styles.colorIndicator} ${styles.netCash}`} />
              <div className={styles.value}>
                <span className="dim">$</span>
                {formatNumberWithAbbreviation(totalNetCashFlow, 1)}
                {
                  !isHovered && <span className="dim"> @ {netCashFlowRate}%</span>
                }
              </div>
            </div>
            <div className={styles.label}>
              {
                isHovered ? "(Cumulative)" : "Total Net Cash Flow"
              }
            </div>
          </div>
        </div>
      </div>
    </div >
  )
}
