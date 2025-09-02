"use client"

import { useState } from "react"
import styles from "./ComparisonTable.module.css"
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData"
import { CashFlowData } from "models/CashFlow"
import { ScenarioData } from "types/ScenarioData"
import { getMetricBgClasses, getNormalizedValues } from "./ComparisonTableHelper"


interface ComparisonTableProps {
  scenarios: ScenarioData[]
  financialOutputData: FinancialOutputData[]
  operationalOutputData: OperationalOutputData[]
  hideRows?: string[]
}

const ComparisonTable = (props: ComparisonTableProps) => {
  const { scenarios, financialOutputData, operationalOutputData, hideRows = [] } = props
  const [showMore, setShowMore] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat("en-US").format(value)
  }

  const MiniChart = ({ data }: { data: number[] }) => (
    <div className={styles.miniChart}>
      <svg width="80" height="40" viewBox="0 0 80 40">
        <polyline
          points={data
            .map((value, index) => `${(index / (data.length - 1)) * 80},${40 - (value / Math.max(...data)) * 30}`)
            .join(" ")}
          fill="none"
          stroke="#4ade80"
          strokeWidth="2"
        />
      </svg>
    </div>
  )

  const HorizontalBarChart = ({ min, max, avg }: { min: number; max: number; avg: number }) => (
    <div className={styles.horizontalBarChart}>
      <div className={styles.barRow}>
        <span className={styles.barLabel}>MIN</span>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: "10%" }}></div>
        </div>
        <span className={styles.barValue}>{min}m</span>
      </div>
      <div className={styles.barRow}>
        <span className={styles.barLabel}>MAX</span>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: "90%" }}></div>
        </div>
        <span className={styles.barValue}>{max}m</span>
      </div>
      <div className={styles.barRow}>
        <span className={styles.barLabel}>AVG</span>
        <div className={styles.barContainer}>
          <div className={styles.bar} style={{ width: "30%" }}></div>
        </div>
        <span className={styles.barValue}>{avg}m</span>
      </div>
    </div>
  )

  const InclinationIndicator = ({ min, max, avg }: { min: number; max: number; avg: number }) => (
    <div className={styles.inclinationIndicator}>
      <div className={styles.inclinationRow}>
        <span className={styles.inclinationLabel}>MIN</span>
        <div className={styles.angleIndicator} style={{ transform: `rotate(${min}deg)` }}></div>
        <span className={styles.inclinationValue}>{min}°</span>
      </div>
      <div className={styles.inclinationRow}>
        <span className={styles.inclinationLabel}>MAX</span>
        <div className={styles.angleIndicator} style={{ transform: `rotate(${max}deg)` }}></div>
        <span className={styles.inclinationValue}>{max}°</span>
      </div>
      <div className={styles.inclinationRow}>
        <span className={styles.inclinationLabel}>AVG</span>
        <div className={styles.angleIndicator} style={{ transform: `rotate(${avg}deg)` }}></div>
        <span className={styles.inclinationValue}>{avg}°</span>
      </div>
    </div>
  )

  const QuantityChart = ({ ranges, values }: { ranges: string[]; values: number[] }) => {
    const heights = getNormalizedValues(values)

    return (
      <div className={styles.quantityChart}>
        {ranges.map((range, index) => (
          <div key={range} className={styles.quantityBar}>
            <div className={styles.quantityValue}>{values[index]}</div>

              
            <div
              className={styles.quantityBarFill}
              style={{
                height: heights[index] > 0 ? `${heights[index] * 100}%` : "2px",
                background: heights[index] > 0 ? "var(--accent)" : "var(--completed)"
              }}
            ></div>
            <span className={styles.quantityLabel}>{range}°</span>
          </div>
        ))}
      </div>
    )

  }

  const visibleRows = [
    "timeHorizon",
    "keyAssumptions",
    "financials",
    "operational",
    ...(showMore ? ["holeLength", "holeInclination", "quantityOfHoleInclinations"] : []),
  ]

  const keyAssumptionRow = () => {
    return (
      <div className={styles.row}>
        <div className={styles.rowLabel}>
          <span className={styles.sectionTitle}>KEY ASSUMPTIONS</span>
          <span className={styles.rowSubLabel}>Cutter Head Size</span>
        </div>
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.cell}>
            <div className={styles.keyAssumptions}>
              <span className={styles.sectionTitle}>KEY ASSUMPTIONS</span>

              <div className={styles.assumptionValue}>
                {scenario.keyAssumptions.change ? (
                  <div className={styles.diaDifference}>
                    {scenario.keyAssumptions.change}
                    <span className={styles.diaDifferenceIcon}>▲</span>
                  </div>)
                  :
                  <div className={styles.diaDifference}>
                    <span className={styles.diaDifferenceIcon}>-</span>
                  </div>
                }
                <span>{scenario.keyAssumptions.cutterHeadSize}</span>

              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const financialRow = (label: string, key: string, higherIsBetter: boolean) => {
    const values = financialOutputData.map((item) => item[key as keyof FinancialOutputData]);
    const colorCodes = getMetricBgClasses(values, higherIsBetter);

    return (
      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.rowLabel}>
          <span className={styles.rowSubLabel}>{label}</span>
        </div>
        {values.map((value, id) => (
          <div key={id} className={styles.cell}
            style={{ backgroundColor: colorCodes[id] }}
          >
            <div className={styles.textCell}>
              {formatCurrency(value)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  const operationalRow = (label: string, key: string, unit: string) => {
    const values = operationalOutputData.map((item) => item[key as keyof OperationalOutputData]);

    return (
      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.rowLabel}>
          <span className={styles.rowSubLabel}>{label}</span>
        </div>
        {values.map((value, id) => (
          <div key={id} className={styles.cell}>
            <div className={styles.textCell}>
              {
                typeof value === "number" ? `${value}${unit}` : ""
              }
            </div>
          </div>
        ))}
      </div>
    )
  }

  const sectionTitleRow = (title: string) => {
    return (
      <div className={styles.row}>
        {Array.from({ length: scenarios.length + 1 }).map((_, idx) => (
          <div key={idx} className={styles.sectionCell}>
            <div className={styles.sectionTitle}>{title}</div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div className={styles.subheader}>SCENARIO</div>
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.headerCell}>
            {scenario.id}
          </div>
        ))}
      </div>

      {visibleRows.includes("timeHorizon") && (
        <div className={styles.row}>
          <div className={styles.subheader}>TIME HORIZON</div>
          {scenarios.map((scenario) => (
            <div key={scenario.id} className={styles.cell}>
              <MiniChart data={scenario.timeHorizonData} />
            </div>
          ))}
        </div>
      )}

      {visibleRows.includes("keyAssumptions") && (
        keyAssumptionRow()
      )}

      {visibleRows.includes("financials") && (
        <>
          {sectionTitleRow("FINANCIALS")}
          {financialRow("Revenue", "revenue", true)}
          {financialRow("Mining Cost", "miningCost", false)}
          {financialRow("Total Processing Cost", "totalProcessingCost", false)}
          {financialRow("Net Cash Flow", "netCashFlow", true)}
        </>
      )}

      {visibleRows.includes("operational") && (
        <>
          {sectionTitleRow("OPERATIONAL")}
          {operationalRow("Life of Mine (LOM)", "LOMMoth", " months")}
          {operationalRow("Extraction Holes", "extractionHoles", "")}
          {operationalRow("Total Length", "totalLength", "m")}
          {operationalRow("Ore Mass", "oreMass", " tonnes")}
          {operationalRow("Grade", "gradeGramPerTonne", " g/ tonnes")}
        </>
      )}

      {visibleRows.includes("holeLength") && (
        <div className={`${styles.row} ${styles.borderBottom}`}>
          <div className={styles.rowLabel}>
            <span className={styles.rowSubLabel}>Hole Length</span>
          </div>
          {scenarios.map((scenario) => (
            <div key={scenario.id} className={styles.cell}>
              <HorizontalBarChart {...scenario.holeLength} />
            </div>
          ))}
        </div>
      )}

      {visibleRows.includes("holeInclination") && (
        <div className={`${styles.row} ${styles.borderBottom}`}>
          <div className={styles.rowLabel}>
            <span className={styles.rowSubLabel}>Hole Inclination</span>
          </div>
          {scenarios.map((scenario) => (
            <div key={scenario.id} className={styles.cell}>
              <InclinationIndicator {...scenario.holeInclination} />
            </div>
          ))}
        </div>
      )}

      {visibleRows.includes("quantityOfHoleInclinations") && (
        <div className={`${styles.row} ${styles.borderBottom}`}>
          <div className={styles.rowLabel}>
            <span className={styles.rowSubLabel}>Quantity of Hole Inclinations</span>
          </div>
          {scenarios.map((scenario) => (
            <div key={scenario.id} className={styles.cell}>
              <QuantityChart {...scenario.quantityOfHoleInclinations} />
            </div>
          ))}
        </div>
      )}

      <div className={styles.seeMoreButton} onClick={() => setShowMore(!showMore)}>
        {showMore ? "See less" : "See more"}
      </div>
    </div>
  )
}

export default ComparisonTable