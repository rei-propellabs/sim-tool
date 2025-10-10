import styles from './NPVSection.module.css';
import finSimStyles from '../FinancialSimulationPage.module.css';

import DataPanel from "./DataPanel/DataPanel";
import NPVChart from "./NPVChart/NPVChart";
import { CashFlowData } from "models/CashFlow";
import { useEffect, useState } from "react";
import { cashFlowToChartData, getTotalValues } from "./NPVHelper";
import { Cashflow } from "api/models/ScenarioData";

export interface NPVSectionProps {
  scenarioTitle: string;
  cashFlowData?: Cashflow;
  discountRate: number;

}

const legendItems = [
  { label: "REVENUE", color: "var(--revenue)" },
  { label: "MINING COST", color: "var(--mining-cost)" },
  { label: "PROCESSING COST", color: "var(--processing-cost)" },
  { label: "CUMULATIVE NET CASH", color: "var(--cumulative-net-cash)" },
];

export function NPVSection({ scenarioTitle, cashFlowData, discountRate }: NPVSectionProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  if (cashFlowData === undefined) {
    return null;
  }

  const chartData = cashFlowToChartData(cashFlowData)
  const totalValue = getTotalValues(cashFlowData)
  const npv = chartData[chartData.length - 1].cumulativeNetCash / ((1 + discountRate / 100) ** (cashFlowData.yearly.length))

  return (
    <div className={finSimStyles.sectionContainer}>
      <div className={finSimStyles.content}>

        <div className={finSimStyles.heading}>
          <div className={finSimStyles.left}>
            <div className={finSimStyles.scenarioLabel}>{scenarioTitle}</div>
            <div className={finSimStyles.title}>Net Present Value</div>
          </div>
          <div className={styles.legend}>
            {legendItems.map((item, index) => (
              <div key={item.label} className={styles.legendItem}>

                <span className={styles.legendText}>{item.label}</span>
                {
                  index === 3 ? // icon for cumulative-net-cash
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
          <NPVChart data={chartData}
            hoveredIndex={hoveredIndex}
            setHoveredIndex={setHoveredIndex}
          />
        </div>

        <div className={styles.dataPanelContainer}>
          <DataPanel
            totalGrossRevenue={hoveredIndex !== null ? chartData[hoveredIndex].revenue : totalValue.totalGrossRevenue}
            totalMiningCost={hoveredIndex !== null ? chartData[hoveredIndex].miningCost : totalValue.totalMiningCost}
            totalProcessingCost={hoveredIndex !== null ? chartData[hoveredIndex].processingCost : totalValue.totalProcessingCost}
            totalNetCashFlow={hoveredIndex !== null ? chartData[hoveredIndex].cumulativeNetCash : npv}
            totalNetCashFlowPeriod={hoveredIndex !== null ? chartData[hoveredIndex].revenue + chartData[hoveredIndex].miningCost + chartData[hoveredIndex].processingCost : undefined}
            discountRate={discountRate}
          />
        </div>

      </div>
    </div>
  );
}
