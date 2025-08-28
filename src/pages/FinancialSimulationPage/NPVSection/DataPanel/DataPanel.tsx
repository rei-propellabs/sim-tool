import { formatNumberWithAbbreviation } from "utils/NumberFormatter"
import styles from "./DataPanel.module.css"

interface DataPanelProps {
  totalGrossRevenue: number
  totalMiningCost: number
  totalProcessingCost: number
  totalNetCashFlow: number
  netCashFlowRate?: number
}

export default function DataPanel({
  totalGrossRevenue,
  totalMiningCost,
  totalProcessingCost,
  totalNetCashFlow,
  netCashFlowRate = 5,
}: DataPanelProps) {

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
            {formatNumberWithAbbreviation(totalMiningCost, 1)}
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
            {formatNumberWithAbbreviation(totalProcessingCost, 1)}
          </div>
        </div>
        <div className={styles.label}>Total Processing Cost</div>
      </div>

      <div className={`${styles.metricCard} ${styles.darkBackground}`}>
        <div className={styles.valueContainer}>
          <div className={`${styles.colorIndicator} ${styles.netCash}`}/>
          <div className={styles.value}>
            <span className="dim">$</span>
            {formatNumberWithAbbreviation(totalNetCashFlow, 1)}
            <span className="dim"> @ {netCashFlowRate}%</span>
          </div>
        </div>
        <div className={styles.label}>Total Net Cash Flow</div>
      </div>
    </div >
  )
}
