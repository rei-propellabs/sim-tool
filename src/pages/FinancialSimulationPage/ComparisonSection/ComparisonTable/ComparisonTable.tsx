import { useState } from "react"
import styles from "./ComparisonTable.module.css"
import { FinancialOutputData } from "api/models/OutputData"
import { getMetricBgClasses, getValuesRelativeToMax } from "./ComparisonTableHelper"
import AngleIndicator from "./AngleIndicator"
import { Area, ComposedChart, Line, ResponsiveContainer } from "recharts"
import { CashflowEntry, FinancialData, NumHolesLabels, OperationalData, ParametersData } from "api/models/ScenarioData"

export interface ComparisonTableProps {
  cashFlowData: CashflowEntry[][];
  keyAssumptions: ParametersData[];
  financialOutputData: FinancialData[]
  operationalOutputData: OperationalData[]
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
          <span className={styles.barValue}>{Math.round(average)}m</span>
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
          <span className={styles.inclinationValue}>{Math.round(average)}°</span>
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
    const values = keyAssumptions.map((item) => item[key as keyof ParametersData] as number);

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
          {
            values[index] === undefined ||
              relativeDifferences[index] === 0 ?
              <div className={styles.diaDifference}>
                <div className={styles.noData} />
              </div>
              :
              <>
                <div className={styles.diaDifference}>
                  {relativeDifferences[index] > 0 ? "+" : ""}
                  {relativeDifferences[index]}%
                  <span className={styles.diaDifferenceIcon}>
                    {relativeDifferences[index] > 0 ? "▲" : "▼"}
                  </span>
                </div>
              </>
          }
          {
            values[index] === undefined ? <span>999</span> :
              <span>{formatValue(values[index])}</span>

          }
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

  const financialSubRow = (label: string, key: string, perKey: string, higherIsBetter: boolean, indentLabel = false) => {
    const values = financialOutputData.map((item) => item[key as keyof FinancialOutputData]);
    const perValues = financialOutputData.map((item) => item[perKey as keyof FinancialOutputData]);

    const sameValues = values.every((val, _, arr) => val === arr[0]);
    if (sameValues && !showMore) {
      return null
    }

    const colorCodes = getMetricBgClasses(values, higherIsBetter);

    return renderDataRow(label, values.map((value, index) => (
      <>
        <div key={index} className={styles.textCell}>
          {formatCurrency(value)}
        </div>
        <span className={styles.divier}></span>
        <div key={index} className={styles.textCell}>
          {formatCurrency(perValues[index]) + "/tonne"}
        </div>
      </>

    )), colorCodes, indentLabel);
  }

  const operationalRow = (label: string, key: string, unit: string) => {
    const values = operationalOutputData.map((item) => item[key as keyof OperationalData]);
    const sameValues = values.every((val, _, arr) => val === arr[0]);
    if (sameValues && !showMore) {
      return null
    }

    return renderDataRow(label, values.map((value, id) => (
      <div key={id} className={styles.textCell}>
        {typeof value === "number" ? `${value}${unit}` : `999${unit}`}
      </div>
    )));
  }

  // Refactored: chartDataRow now takes a mapping function to extract/shape the data for the chart
  const chartDataRow = (
    label: string,
    Component: React.ComponentType<any>,
    dataMapper: (scenario: OperationalData) => any,
  ) => {
    return renderDataRow(
      label,
      operationalOutputData.map((scenario) => <Component data={dataMapper(scenario)} />),
      undefined
    );
  }

  const renderDataRow = (label: string, cellContents: React.ReactNode[], backgroundColors?: string[], indentLabel = false) => {
    return (
      <div key={label} className={`${styles.row} ${styles.borderBottom}`}>
        <div className={`${styles.rowLabel} ${indentLabel ? styles.indentLabel : ""}`}>
          <span className={`${styles.rowSubLabel}`}>
            {label}
          </span>
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
      keyAssumptionRow("Commodity Price", "commodityPrice", "$"),
      keyAssumptionRow("Number of Drills", "numberOfDrills", ""),
      keyAssumptionRow("Cutter Head Size", "cutterHeadSize", "m"),
      keyAssumptionRow("Mill Recovery", "millRecovery", "%"),
      keyAssumptionRow("Processing Cost per Tonne", "processingCostPerTonne", "$"),
      keyAssumptionRow("Waste Cost per Tonne", "wasteCostPerTonne", "$"),
      keyAssumptionRow("Minimum Hole Inclination", "minimumHoleInclination", "°"),
      keyAssumptionRow("Maximum Hole Length", "maximumHoleLength", "m"),

    ];

    const constantAssumptions = [
      keyAssumptionRow("Rate of Penetration", "rateOfPenetration", "m / hr"),
      keyAssumptionRow("Availability", "availability", "%"),
      keyAssumptionRow("Discount Rate", "discountRate", "%"),
    ]
    const visibleRows = keyAssumptionRows.filter(Boolean);

    return (
      <>
        {visibleRows.length > 0 && sectionTitleRow("KEY ASSUMPTIONS", true)}
        {visibleRows}

        {visibleRows.length > 0 && sectionTitleRow("CONSTANT ASSUMPTIONS", false)}
        {constantAssumptions}
      </>
    )
  }

  const financialSection = () => {
    const financialRows = [
      financialRow("Revenue", "revenue", true),
      financialRow("CapEx", "capex", false),
      financialRow("Total Mining Cost", "miningCost", false),
      financialSubRow("Extraction Cost", "extractionCost", "extractionCostTonne", false, true),
      financialSubRow("Imaging Cost", "imagingCost", "imagingCostTonne", false, true),
      financialSubRow("Closure Cost", "closureCost", "closureCostTonne", false, true),

      financialSubRow("Total Processing Cost", "totalProcessingCost", "totalProcessingCostTonne", false),
      financialSubRow("Processing Cost (Ore)", "totalProcessingCost", "totalProcessingCostTonne", false, true),
      financialSubRow("Processing Cost (Waste)", "totalProcessingCost", "totalProcessingCostTonne", false, true),

      financialRow("Net Cash Flow", "netCashFlow", true),
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
      operationalRow("Life of Mine (LOM)", "lom", " months"),
      operationalRow("Extraction Holes", "extractionHoles", ""),
      operationalRow("Total Length", "totalLength", "m"),
      operationalRow("Ore Mass", "oreMass", " tonnes"),
      operationalRow("Waste Mass", "wasteMass", " tonnes"),
      chartDataRow(
        "Hole Length",
        HorizontalBarChart,
        (scenario: OperationalData) => ({
          min: scenario.holeLengthMin,
          max: scenario.holeLengthMax,
          average: scenario.holeLengthAvg,
        })
      ),
      chartDataRow(
        "Hole Inclination",
        InclinationIndicator,
        (scenario: OperationalData) => ({
          min: scenario.holeInclinationMin,
          max: scenario.holeInclinationMax,
          average: scenario.holeInclinationAvg,
        })
      ),
      chartDataRow(
        "Quantity of Hole Inclinations",
        QuantityBarChart,
        (scenario: OperationalData) =>
          NumHolesLabels.reduce((acc, label, idx) => {
            acc[label] = scenario.quantityOfHolesPerInclination[idx] || 0;
            return acc;
          }, {} as Record<string, number>)
      ),
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
            <LineChart data={scenario.map(d => d.cumulativeNetCash)} />
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