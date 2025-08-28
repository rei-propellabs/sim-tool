import { useState } from "react"
import styles from "./SummarySection.module.css"
import { MetricCardTwoRows } from "components/MetricCard/MetricCardTwoRows"
import { TabBar } from "components/TabBar/TabBar"
import { scenarioData_mock } from "api/mock/MiningScenarioDataMock"
import { MiningScenarioData } from "api/models/MiningScenarioData"
import { MetricCardOneRow } from "components/MetricCard/MetricCardOneRow"
import { financialOutput_mock } from "api/mock/FinancialOutputMock"
import { operationalOutput_mock } from "api/mock/OperationOutputMock"
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData"
import { MetricCardComposite } from "components/MetricCard/MetricCardComposite"
import { MetricCardThreeRows } from "components/MetricCard/MetricCardThreeRows"
import { formatNumberWithAbbreviation } from "utils/NumberFormatter"

export function SummarySection() {
  const scenarioData = scenarioData_mock
  const financialData = financialOutput_mock
  const operationalData = operationalOutput_mock

  const [activeScenario, setActiveScenario] = useState<string>("SCENARIO 1")
  const [activeOutput, setActiveOutput] = useState<string>("financial")

  const scenarios = Object.keys(scenarioData)
  const outputs = ["financial", "operational"]
  const currentData = scenarioData[activeScenario]
  const currentFinancialData = financialData[activeScenario]
  const currentOperationalData = operationalData[activeScenario]


  function InputPanel(metric: MiningScenarioData) {
    return (
      <div className={styles.metricsGridLeft}>
        <MetricCardTwoRows key="baselineMiningCost" value={`$${metric.baselineMiningCost}`} label="Baseline Mining Cost per Tonne" />

        <MetricCardTwoRows key="processingCost" value={`$${metric.processingCost}`} label="Processing Cost per Tonne" />

        <MetricCardTwoRows key="wasteCost" value={`$${metric.wasteCost}`} label="Waste Cost per Tonne" />

        <MetricCardTwoRows key="commodityPrice" value={`$${metric.commodityPrice}/oz`} label="Commodity Price" />

        <MetricCardTwoRows key="millRecovery" value={`${metric.millRecovery}%`} label="Mill Recovery" />

        <MetricCardTwoRows key="numberOfDrills" value={metric.numberOfDrills} label="Number of Drills" />

        <MetricCardTwoRows key="cutterHeadSize" value={`${metric.cutterHeadSize}m`} label="Cutter Head Size" />

        <MetricCardTwoRows key="availability" value={`${metric.availability}%`} label="Availability" />

        <MetricCardTwoRows key="maxHoleLength" value={`${metric.maxHoleLength}m`} label="Maximum Hole Length" />

        <MetricCardTwoRows key="minHoleInclination" value={`${metric.minHoleInclination}°`} label="Minimum Hole Inclination" />

        <MetricCardTwoRows key="discountRate" value={`${metric.discountRate}%`} label="Discount Rate" fullWidth />
      </div>
    )
  }

  function FinancialOutputPanel(metric: FinancialOutputData) {
    return (
      <div className={styles.outputGridRight}>
        <MetricCardOneRow key="revenue" value={`$${formatNumberWithAbbreviation(metric.revenue, 1)}`} label="Revenue" />
        <MetricCardOneRow key="netCashFlow" value={`$${formatNumberWithAbbreviation(metric.netCashFlow, 1)}`} label="Net Cash Flow" />
        <MetricCardOneRow key="capex" value={`$${formatNumberWithAbbreviation(metric.capex, 1)}`} label="Capex" />
        <MetricCardOneRow key="miningCost" value={`$${formatNumberWithAbbreviation(metric.miningCost, 1)}`} label="Mining Cost" />
        <span />
        <MetricCardComposite
          dataLeft={{ key: "processingCostOre", value: `$${formatNumberWithAbbreviation(metric.processingCostOre, 1)}`, label: "Processing Cost (Ore)" }}
          dataRight={{ key: "processingCostWaste", value: `$${formatNumberWithAbbreviation(metric.processingCostWaste, 1)}`, label: "Processing Cost (Waste)" }}
          dataBottom={{ key: "totalProcessingCost", value: `$${formatNumberWithAbbreviation(metric.totalProcessingCost, 1)}`, label: "Total Processing Cost" }}
        />

        <MetricCardTwoRows key="allInCostTonne" value={`$${formatNumberWithAbbreviation(metric.allInCostTonne, 1)}`} label="All In Cost / Tonne" dim />
        <MetricCardTwoRows key="aisc" value={`$${formatNumberWithAbbreviation(metric.aisc, 1)}`} label="AISC" description="All-In Sustaining Costs" dim />

        <MetricCardTwoRows key="allInCostMeter" value={`$${formatNumberWithAbbreviation(metric.allInCostMeter, 1)}`} label="All In Cost / Meter" dim />
        <MetricCardTwoRows key="revenueMeter" value={`$${formatNumberWithAbbreviation(metric.revenueMeter, 1)}`} label="Revenue / Meter" dim />

        <MetricCardTwoRows key="cashFlowMeter" value={`$${formatNumberWithAbbreviation(metric.cashFlowMeter, 1)}`} label="Cash Flow / Meter" dim fullWidth />

      </div>
    )
  }

  function OperationalOutputPanel(metric: OperationalOutputData) {
    return (
      <div className={styles.outputGridRight}>
        <MetricCardOneRow key="grade" value={`${metric.gradeGramPerTonne.toFixed(1)}g/t`} label="Grade" />
        <MetricCardOneRow key="lom" value={`${metric.LOMMoth} mo`} label="LOM" description="Life of Mine" />
        <span /><span />
        <MetricCardTwoRows key="extractionHoles" value={`${metric.extractionHoles.toLocaleString(undefined)}`} label="Extraction holes" dim />
        <MetricCardTwoRows key="totalLength" value={`${metric.totalLength.toLocaleString(undefined)}m`} label="Total Length" dim />
        <MetricCardTwoRows key="wasteMass" value={`${metric.wasteMass.toLocaleString(undefined)}t`} label="Waste Mass" dim />
        <MetricCardTwoRows key="oreMass" value={`${metric.oreMass.toLocaleString(undefined)}t`} label="Ore Mass" dim />

        <MetricCardTwoRows key="totalCommodityVolume" value={`${metric.totalCommodityVolume.toLocaleString(undefined)}oz`} label="Total Commodity Volume" fullWidth dim />
        <MetricCardThreeRows label="Hole Length"
          values={[
            { key: "holeLengthMin", value: `${metric.holeLength.min}m`, label: "MIN" },
            { key: "holeLengthMax", value: `${metric.holeLength.max}m`, label: "MAX" },
            { key: "holeLengthAvg", value: `${metric.holeLength.average}m`, label: "AVG" },
          ]}
        />

        <MetricCardThreeRows label="Hole Inclination"
          values={[
            { key: "holeInclinationMin", value: `${metric.holeInclination.min}°`, label: "MIN" },
            { key: "holeInclinationMax", value: `${metric.holeInclination.max}°`, label: "MAX" },
            { key: "holeInclinationAvg", value: `${metric.holeInclination.average}°`, label: "AVG" },
          ]}
        />

        <MetricCardThreeRows label="Quantity of Holes per Inclination"
          values={Object.keys(metric.numHoles).map((key) => {
            const typedKey = key as keyof typeof metric.numHoles
            return { key: `numHoles${key}`, value: `${metric.numHoles[typedKey]}`, label: `${key}°` }
          })}
        />
      </div>
    )
  }
  return (
    <div className={styles.summary}>
      {/* Input Panel */}
      <div>
        <div className={styles.scenarioTab}>
          <TabBar
            texts={scenarios} activeText={activeScenario}
            onActiveTextChange={setActiveScenario} />
        </div>
        {InputPanel(currentData)}
      </div>

      {/* Output Panel */}
      <div>
        <div className={styles.outputTab}>
          <TabBar
            texts={outputs} activeText={activeOutput}
            onActiveTextChange={setActiveOutput} />
        </div>
        {activeOutput === "financial" ? FinancialOutputPanel(currentFinancialData) : OperationalOutputPanel(currentOperationalData)}
      </div>

    </div>
  )
}