import styles from './NPVSection.module.css';
import DataPanel from "./DataPanel/DataPanel";
import ChartSection from "../ChartSection/ChartSection";
import { CashFlowData } from "models/CashFlow";
import { useEffect, useState } from "react";
import { cashFlowToChartData, getTotalValues } from "./NPVHelper";

export interface NPVSectionProps {
  scenario: string;
  cashFlowData?: CashFlowData
}

const legendItems = [
  { label: "REVENUE", color: "var(--revenue)" },
  { label: "MINING COST", color: "var(--mining-cost)" },
  { label: "PROCESSING COST", color: "var(--processing-cost)" },
  { label: "CUMULATIVE NET CASH", color: "var(--cumulative-net-cash)" },
];

// const chartData = [
//   {
//     month: "JAN '26",
//     revenue: 12000000,
//     miningCost: -3000000,
//     processingCost: -1500000,
//     cumulativeNetCash: 10000000,
//   },
//   {
//     month: "APR '26",
//     revenue: 12500000,
//     miningCost: -3200000,
//     processingCost: -1600000,
//     cumulativeNetCash: 18000000,
//   },
//   {
//     month: "JUL '26",
//     revenue: 11800000,
//     miningCost: -3100000,
//     processingCost: -1550000,
//     cumulativeNetCash: 25000000,
//   },
//   {
//     month: "OCT '26",
//     revenue: 12200000,
//     miningCost: -3300000,
//     processingCost: -1650000,
//     cumulativeNetCash: 32000000,
//   },
//   {
//     month: "JAN '27",
//     revenue: 11500000,
//     miningCost: -3000000,
//     processingCost: -1500000,
//     cumulativeNetCash: 39000000,
//   },
//   {
//     month: "APR '27",
//     revenue: 11000000,
//     miningCost: -2900000,
//     processingCost: -1450000,
//     cumulativeNetCash: 45000000,
//   },
//   {
//     month: "JUL '27",
//     revenue: 10500000,
//     miningCost: -2800000,
//     processingCost: -1400000,
//     cumulativeNetCash: 51000000,
//   },
//   { month: "OCT '27", revenue: 9800000, miningCost: -2700000, processingCost: -1350000, cumulativeNetCash: 56000000 },
//   { month: "JAN '28", revenue: 9200000, miningCost: -2600000, processingCost: -1300000, cumulativeNetCash: 61000000 },
//   { month: "APR '28", revenue: 8800000, miningCost: -2500000, processingCost: -1250000, cumulativeNetCash: 65000000 },
//   { month: "JUL '28", revenue: 8400000, miningCost: -2400000, processingCost: -1200000, cumulativeNetCash: 68000000 },
//   { month: "OCT '28", revenue: 8000000, miningCost: -2300000, processingCost: -1150000, cumulativeNetCash: 71000000 },
//   { month: "JAN '29", revenue: 7600000, miningCost: -2200000, processingCost: -1100000, cumulativeNetCash: 73000000 },
//   { month: "APR '29", revenue: 7200000, miningCost: -2100000, processingCost: -1050000, cumulativeNetCash: 75000000 },
//   { month: "JUL '29", revenue: 6800000, miningCost: -2000000, processingCost: -1000000, cumulativeNetCash: 77000000 },
// ]

export function NPVSection({ scenario, cashFlowData }: NPVSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (cashFlowData === undefined) {
    return null;
  }

  const chartData = cashFlowToChartData(cashFlowData)
  const totalValue = getTotalValues(cashFlowData)
  return (
    <div className={styles.container}>

      <div className={styles.heading}>
        <div className={styles.left}>
          <div className={styles.scenarioLabel}>{scenario}</div>
          <div className={styles.title}>Net Presence Value</div>
        </div>
        <div className={styles.legend}>
          {legendItems.map((item, index) => (
            <div key={item.label} className={styles.legendItem}>

              <span className={styles.legendText}>{item.label}</span>

              {
                index === 3 ?
                  <div className={styles.lineLegendIconBackground}>
                    <div className={styles.lineLegendIcon} />

                  </div>
                  :
                  <span
                    className={styles.colorBox}
                    style={{ backgroundColor: item.color }}
                  />
              }

            </div>
          ))}
        </div>
      </div>

      <div className={styles.chartContainer}>
        <ChartSection data={chartData}
          hoveredIndex={hoveredIndex}
          setHoveredIndex={setHoveredIndex}
        />
      </div>

      <div className={styles.dataPanelContainer}>
        <DataPanel
          totalGrossRevenue={hoveredIndex !== null ? chartData[hoveredIndex].revenue : totalValue.totalGrossRevenue}
          totalMiningCost={hoveredIndex !== null ? chartData[hoveredIndex].miningCost : totalValue.totalMiningCost}
          totalProcessingCost={hoveredIndex !== null ? chartData[hoveredIndex].processingCost : totalValue.totalProcessingCost}
          totalNetCashFlow={hoveredIndex !== null ? chartData[hoveredIndex].cumulativeNetCash : chartData[chartData.length - 1].cumulativeNetCash}
          totalNetCashFlowPeriod={hoveredIndex !== null ? chartData[hoveredIndex].revenue + chartData[hoveredIndex].miningCost + chartData[hoveredIndex].processingCost : undefined}
          netCashFlowRate={5} // is this discount rate??
        />
      </div>

    </div>
  );
}
