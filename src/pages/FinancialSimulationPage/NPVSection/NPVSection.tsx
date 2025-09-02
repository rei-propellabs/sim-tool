import styles from './NPVSection.module.css';
import finSimStyles from '../FinancialSimulationPage.module.css';

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

export function NPVSection({ scenario, cashFlowData }: NPVSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (cashFlowData === undefined) {
    return null;
  }

  const chartData = cashFlowToChartData(cashFlowData)
  const totalValue = getTotalValues(cashFlowData)
  return (
    <div className={finSimStyles.sectionContainer}>

      <div className={finSimStyles.heading}>
        <div className={finSimStyles.left}>
          <div className={finSimStyles.scenarioLabel}>{scenario}</div>
          <div className={finSimStyles.title}>Net Present Value</div>
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
