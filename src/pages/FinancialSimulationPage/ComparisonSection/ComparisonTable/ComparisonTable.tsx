import { useState } from "react"
import styles from "./ComparisonTable.module.css"
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData"
import { ScenarioData } from "types/ScenarioData"
import { getMetricBgClasses, getNormalizedValues } from "./ComparisonTableHelper"
import AngleIndicator from "./AngleIndicator"
import { Area, ComposedChart, Line, LineChart, ResponsiveContainer } from "recharts"

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

  const MiniChart = ({ data }: { data: number[] }) => {
    return (
      <div className={styles.miniChart}>
        <ResponsiveContainer width="100%" height={80}>
          <ComposedChart data={data}>
            <defs>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--accent)" stopOpacity={0.4} />
                <stop offset="100%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
            </defs>

            <Line
              isAnimationActive={false}
              type="linear"
              dataKey={v => v}
              stroke="var(--accent)"
              dot={false}
            />
            <Area
              isAnimationActive={false}
              type="linear"
              dataKey={v => v}
              stroke="none"
              fill="url(#lineGradient)"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const HorizontalBarChart = ({ min, max, avg }: { min: number; max: number; avg: number }) => {
    const widths = getNormalizedValues([min, max, avg])

    return (
      <div className={styles.horizontalBarChart}>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>MIN</span>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ width: `${Math.max(widths[0], 0.01) * 100}%` }}></div>
          </div>
          <span className={styles.barValue}>{min}m</span>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>MAX</span>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ width: `${widths[1] * 100}%` }}></div>
          </div>
          <span className={styles.barValue}>{max}m</span>
        </div>
        <div className={styles.barRow}>
          <span className={styles.barLabel}>AVG</span>
          <div className={styles.barContainer}>
            <div className={styles.bar} style={{ width: `${widths[2] * 100}%` }}></div>
          </div>
          <span className={styles.barValue}>{avg}m</span>
        </div>
      </div>
    )
  }

  const InclinationIndicator = ({ min, max, avg }: { min: number; max: number; avg: number }) => (
    <div className={styles.inclinationIndicator}>
      <div className={styles.inclinationColumn}>
        <span className={styles.inclinationLabel}>MIN</span>
        <AngleIndicator angle={min} />
        <span className={styles.inclinationValue}>{min}°</span>
      </div>
      <div className={styles.inclinationColumn}>
        <span className={styles.inclinationLabel}>MAX</span>
        <AngleIndicator angle={max} />
        <span className={styles.inclinationValue}>{max}°</span>
      </div>
      <div className={styles.inclinationColumn}>
        <span className={styles.inclinationLabel}>AVG</span>
        <AngleIndicator angle={avg} />
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
                height: `${Math.max(heights[index], 0.02) * 100}%`,
                background: heights[index] > 0 ? "var(--accent)" : "var(--completed)"
              }}
            ></div>
            <span className={styles.quantityLabel}>{range}°</span>
          </div>
        ))}
      </div>
    )
  }

  // const visibleRows = [
  //   "timeHorizon",
  //   "keyAssumptions",
  //   "financials",
  //   "operational",
  //   ...(showMore ? ["holeLength", "holeInclination", "quantityOfHoleInclinations"] : []),
  // ]

  const keyAssumptionRow = (label: string, key: string, unit: string) => {
    const dia = [2, 2, 2]
    const relativeDifferences = dia.map((value, idx) =>
      idx === 0 ? 0 : Number(((value - dia[0]) / dia[0] * 100).toFixed(2))
    );

    const sameValues = relativeDifferences.every((val) => val === 0);
    if (sameValues && !showMore) {
      return null
    }

    const formatValue = (value: number) => {
      if (unit === "$") {
        return formatCurrency(value);
      } else if (unit.startsWith("$/")) {
        return <span>{formatCurrency(value)} / {unit.slice(2)}</span>;
      } else {
        return `${value}${unit}`;
      }
    };

    return (
      renderDataRow(label, scenarios.map((scenario, index) => (
        <div className={styles.assumptionValue}>
          {relativeDifferences[index] === 0 ?
            <div className={styles.diaDifference}>
              <div className={styles.noData} />
            </div>
            :
            <div className={styles.diaDifference}>
              {relativeDifferences[index] > 0 ? "+" : ""}
              {relativeDifferences[index]}%
              <span className={styles.diaDifferenceIcon}>
                {relativeDifferences[index] > 0 ? "▲" : "▼"}
              </span>
            </div>
          }
          <span>{formatValue(dia[index])}</span>
        </div>
      )))
    )
  }

  const financialRow = (label: string, key: string, higherIsBetter: boolean) => {
    const values = financialOutputData.map((item) => item[key as keyof FinancialOutputData]);

    const sameValues = values.every((val, _, arr) => val === arr[0]);
    if (sameValues && !showMore) {
      return null
    }

    const colorCodes = getMetricBgClasses(values, higherIsBetter);

    return renderDataRow(label, values.map((value, id) => (
      <div className={styles.textCell}>
        {formatCurrency(value)}
      </div>
    )), colorCodes);
  }

  const operationalRow = (label: string, key: string, unit: string) => {
    const values = operationalOutputData.map((item) => item[key as keyof OperationalOutputData]);
    const sameValues = values.every((val, _, arr) => val === arr[0]);
    if (sameValues && !showMore) {
      return null
    }

    return renderDataRow(label, values.map((value, id) => (
      <div className={styles.textCell}>
        {typeof value === "number" ? `${value}${unit}` : ""}
      </div>
    )));
  }

  const chartDataRow = (label: string, dataKey: keyof ScenarioData, Component: React.ComponentType<any>) => {
    return renderDataRow(label, scenarios.map((scenario) => {
      const value = scenario[dataKey];
      return typeof value === "object" && value !== null
        ? <Component {...value} />
        : <Component value={value} />;
    }));
  }

  const renderDataRow = (label: string, cellContents: React.ReactNode[], backgroundColors?: string[]) => {
    return (
      <div className={`${styles.row} ${styles.borderBottom}`}>
        <div className={styles.rowLabel}>
          <span className={styles.rowSubLabel}>{label}</span>
        </div>
        {cellContents.map((content, index) => (
          <div
            key={index}
            className={styles.cell}
            style={backgroundColors ? { backgroundColor: backgroundColors[index] } : {}}
          >
            {content}
          </div>
        ))}
      </div>
    )
  }

  const sectionTitleRow = (title: string, isSmall?: boolean) => {
    return (
      <div className={styles.row}>
        {Array.from({ length: scenarios.length + 1 }).map((_, idx) => (
          <div key={idx} className={`${styles.sectionCell} ${isSmall ? styles.sectionCellSmall : ""}`}>
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

      <div className={styles.row}>
        <div className={styles.subheader}>TIME HORIZON</div>
        {scenarios.map((scenario) => (
          <div key={scenario.id} className={styles.cell}>
            <MiniChart data={scenario.timeHorizonData} />
          </div>
        ))}
      </div>

      {sectionTitleRow("KEY ASSUMPTIONS", true)}
      {keyAssumptionRow("Cutter Head Size", "dia", "m")}
      {keyAssumptionRow("Baseline Mining Cost/Tonne", "dia", "$")}
      {keyAssumptionRow("Processing Cost per Tonne", "dia", "$")}
      {keyAssumptionRow("Waste Cost per Tonne", "dia", "$")}
      {keyAssumptionRow("Commodity Price", "dia", "$/oz")}
      {keyAssumptionRow("Mill Recovery", "dia", "%")}
      {keyAssumptionRow("Number of Drills", "dia", "")}
      {keyAssumptionRow("Rate of Penetration", "dia", "m / hr")}
      {keyAssumptionRow("Availability", "dia", "%")}
      {keyAssumptionRow("Maximum Hole Length", "dia", "m")}
      {keyAssumptionRow("Minimum Hole Inclination", "dia", "°")}

      {sectionTitleRow("FINANCIALS")}
      {financialRow("Revenue", "revenue", true)}
      {financialRow("Mining Cost", "miningCost", false)}
      {financialRow("Total Processing Cost", "totalProcessingCost", false)}
      {financialRow("Net Cash Flow", "netCashFlow", true)}

      {sectionTitleRow("OPERATIONAL")}
      {operationalRow("Life of Mine (LOM)", "LOMMoth", " months")}
      {operationalRow("Extraction Holes", "extractionHoles", "")}
      {operationalRow("Total Length", "totalLength", "m")}
      {operationalRow("Ore Mass", "oreMass", " tonnes")}
      {operationalRow("Grade", "gradeGramPerTonne", " g/ tonnes")}

      {chartDataRow("Hole Length", "holeLength", HorizontalBarChart)}
      {chartDataRow("Hole Inclination", "holeInclination", InclinationIndicator)}
      {chartDataRow("Quantity of Hole Inclinations", "quantityOfHoleInclinations", QuantityChart)}

      <div className={styles.seeMoreButton} onClick={() => setShowMore(!showMore)}>
        {showMore ? "See less" : "See more"}
      </div>
    </div>
  )
}

export default ComparisonTable