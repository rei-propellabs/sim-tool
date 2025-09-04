import { useState } from "react"
import styles from "./ComparisonTable.module.css"
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData"
import { getMetricBgClasses, getValuesRelativeToMax } from "./ComparisonTableHelper"
import AngleIndicator from "./AngleIndicator"
import { Area, ComposedChart, Line, ResponsiveContainer } from "recharts"
import { MiningScenarioData } from "api/models/MiningScenarioData"
import { CashFlowRow } from "models/CashFlow"

interface ComparisonTableProps {
  cashFlowData: CashFlowRow[][];
  keyAssumptions: MiningScenarioData[]
  financialOutputData: FinancialOutputData[]
  operationalOutputData: OperationalOutputData[]
}

const ComparisonTable = (props: ComparisonTableProps) => {
  const { cashFlowData, keyAssumptions, financialOutputData, operationalOutputData } = props
  const [showMore, setShowMore] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const LineChart = ({ data }: { data: number[] }) => {
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
              activeDot={false}

            />
            <Area
              isAnimationActive={false}
              type="linear"
              dataKey={v => v}
              stroke="none"
              fill="url(#lineGradient)"
              activeDot={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    )
  }

  const HorizontalBarChart = ({ data }: { data: Record<string, number> }) => {
    const { min, max, average } = data;
    const widths = getValuesRelativeToMax([min, max, average])

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
          <span className={styles.barValue}>{average}m</span>
        </div>
      </div>
    )
  }

  const InclinationIndicator = ({ data }: { data: Record<string, number> }) => {
    const { min, max, average } = data;
    const radiusVw = 2.3
    const radiusPx = window.innerWidth * (radiusVw / 100);

    return (
      <div className={styles.inclinationIndicator}>
        <div className={styles.inclinationColumn}>
          <span className={styles.inclinationLabel}>MIN</span>
          <AngleIndicator angle={min} radius={radiusPx} />
          <span className={styles.inclinationValue}>{min}°</span>
        </div>
        <div className={styles.inclinationColumn}>
          <span className={styles.inclinationLabel}>MAX</span>
          <AngleIndicator angle={max} radius={radiusPx} />
          <span className={styles.inclinationValue}>{max}°</span>
        </div>
        <div className={styles.inclinationColumn}>
          <span className={styles.inclinationLabel}>AVG</span>
          <AngleIndicator angle={average} radius={radiusPx} />
          <span className={styles.inclinationValue}>{average}°</span>
        </div>
      </div>
    )
  }

  const QuantityBarChart = ({ data }: { data: Record<string, number> }) => {
    const ranges = Object.keys(data)
    const values = Object.values(data) as number[]
    const heights = getValuesRelativeToMax(values)

    return (
      <div className={styles.quantityChart}>
        {ranges.map((range, index) => (
          <div key={range} className={styles.quantityBar}>
            <div className={styles.quantityValue}>{values[index]}</div>

            <div
              className={styles.quantityBarFillOuter}

            >
              <div className={styles.quantityBarFill}
                style={{
                  height: `${Math.max(heights[index], 0.02) * 100}%`,
                  background: heights[index] > 0 ? "var(--accent)" : "var(--completed)"
                }} />
            </div>
            <span className={styles.quantityLabel}>{range}°</span>
          </div>
        ))}
      </div>
    )
  }

  const keyAssumptionRow = (label: string, key: string, unit: string) => {
    // const values = [2, 2.5, 3]
    const values = keyAssumptions.map((item) => item[key as keyof MiningScenarioData] as number);
    const relativeDifferences = values.map((value, idx) =>
      idx === 0 ? 0 : Number(((value - values[0]) / values[0] * 100).toFixed(2))
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
      renderDataRow(label, keyAssumptions.map((scenario, index) => (
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
          <span>{formatValue(values[index])}</span>
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
      <div key={id} className={styles.textCell}>
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
      <div  key={id} className={styles.textCell}>
        {typeof value === "number" ? `${value}${unit}` : ""}
      </div>
    )));
  }

  const chartDataRow = (label: string, dataKey: keyof OperationalOutputData, Component: React.ComponentType<any>) => {
    return renderDataRow(label, operationalOutputData.map((scenario) => {
      const value = scenario[dataKey];
      return typeof value === "object" && value !== null
        ? <Component data={value} />
        : null;
    }));
  }

  const renderDataRow = (label: string, cellContents: React.ReactNode[], backgroundColors?: string[]) => {
    return (
      <div key={label} className={`${styles.row} ${styles.borderBottom}`}>
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
        {Array.from({ length: keyAssumptions.length + 1 }).map((_, idx) => (
          <div key={idx} className={`${styles.sectionCell} ${isSmall ? styles.sectionCellSmall : ""}`}>
            <div className={styles.sectionTitle}>{title}</div>
          </div>
        ))}
      </div>
    )
  }

  const keyAssumptionSection = () => {
    const keyAssumptionRows = [
      keyAssumptionRow("Cutter Head Size", "cutterHeadSize", "m"),
      keyAssumptionRow("Baseline Mining Cost/Tonne", "baselineMiningCost", "$"),
      keyAssumptionRow("Processing Cost per Tonne", "processingCost", "$"),
      keyAssumptionRow("Waste Cost per Tonne", "wasteCost", "$"),
      keyAssumptionRow("Commodity Price", "commodityPrice", "$/oz"),
      keyAssumptionRow("Mill Recovery", "millRecovery", "%"),
      keyAssumptionRow("Number of Drills", "numberOfDrills", ""),
      keyAssumptionRow("Rate of Penetration", "rateOfPenetration", "m / hr"),
      keyAssumptionRow("Availability", "availability", "%"),
      keyAssumptionRow("Maximum Hole Length", "maxHoleLength", "m"),
      keyAssumptionRow("Minimum Hole Inclination", "minHoleInclination", "°"),
    ];
    const visibleRows = keyAssumptionRows.filter(Boolean);

    return (
      <>
        {visibleRows.length > 0 && sectionTitleRow("KEY ASSUMPTIONS", true)}
        {visibleRows}
      </>
    )
  }

  const financialSection = () => {
    const financialRows = [
      financialRow("Revenue", "revenue", true),
      financialRow("Mining Cost", "miningCost", false),
      financialRow("Processing Cost (Ore)", "processingCostOre", false),
      financialRow("Processing Cost (Waste)", "processingCostWaste", false),
      financialRow("Total Processing Cost", "totalProcessingCost", false),
      financialRow("CapEx", "capex", false),
      financialRow("Net Cash Flow", "netCashFlow", true),
      financialRow("All In Cost / Tonne", "allInCostTonne", false),
      financialRow("All In Sustaining Costs (AISC)", "aisc", false),
      financialRow("All In Cost / Meter", "allInCostMeter", false),
      financialRow("Revenue / Meter", "revenueMeter", true),
      financialRow("Cash Flow / Meter", "cashFlowMeter", true),
    ];

    const visibleRows = financialRows.filter(Boolean);

    return (
      <>
        {visibleRows.length > 0 && sectionTitleRow("FINANCIALS")}
        {visibleRows}
      </>
    )
  }

  const operationalSection = () => {
    const operationalRows = [
      operationalRow("Life of Mine (LOM)", "LOMMoth", " months"),
      operationalRow("Extraction Holes", "extractionHoles", ""),
      operationalRow("Total Length", "totalLength", "m"),
      operationalRow("Ore Mass", "oreMass", " tonnes"),
      operationalRow("Grade", "gradeGramPerTonne", " g/ tonnes"),
      chartDataRow("Hole Length", "holeLength", HorizontalBarChart),
      chartDataRow("Hole Inclination", "holeInclination", InclinationIndicator),
      chartDataRow("Quantity of Hole Inclinations", "numHoles", QuantityBarChart)
    ];
    return (
      <>
        {sectionTitleRow("OPERATIONAL")}
        {operationalRows}
      </>
    )
  }

  return (
    <div className={styles.tableContainer}>
      <div className={styles.header}>
        <div className={styles.subheader}>SCENARIO</div>
        {keyAssumptions.map((scenario, index) => (
          <div key={index} className={styles.headerCell}>
            {index + 1}
          </div>
        ))}
      </div>

      <div className={styles.row}>
        <div className={styles.subheader}>TIME HORIZON</div>
        {cashFlowData.map((scenario, index) => (
          <div key={index} className={styles.cell}>
            <LineChart data={scenario.map(d => d["Cumulative Net Cash"])} />
          </div>
        ))}
      </div>

      {keyAssumptionSection()}

      {financialSection()}

      {operationalSection()}

      <div className={styles.seeMoreButton} onClick={() => setShowMore(!showMore)}>
        {showMore ? "See less" : "See more"}
      </div>
    </div>
  )
}

export default ComparisonTable