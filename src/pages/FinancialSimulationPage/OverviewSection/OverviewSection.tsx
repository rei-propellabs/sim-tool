import { useState } from "react"
import styles from "./OverviewSection.module.css"
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
import STLPage from "../stl-viewer/stl-viewer-page"
import planView from "images/planView.png"
import planView2 from "images/planView2.png"
import planView3 from "images/planView3.png"
import ScrollableImage from "./ScrollableImage/ScrollableImage"
import { ParametersData, ScenarioData } from "api/models/ScenarioData"

interface OverviewSectionProps {
  activeScenarioIdx: number,
  setActiveScenarioIdx: (index: number) => void,
  scenarioData?: ScenarioData
}
export const OverviewSection: React.FC<OverviewSectionProps> = (props) => {
  const { activeScenarioIdx, setActiveScenarioIdx, scenarioData } = props
  // const scenarioData = scenarioData_mock
  const financialData = financialOutput_mock
  const operationalData = operationalOutput_mock

  const [activeOutputIdx, setActiveOutputIdx] = useState<number>(0)
  const [activeOrebodyView, setActiveOrebodyView] = useState<number>(0)

  const [scrollPosition, setScrollPosition] = useState(0.5);

  const scenarios = ["SCENARIO 1", "SCENARIO 2", "SCENARIO 3"]
  const outputs = ["financial", "operational"]
  const orebodyView = ["3D animation", "plan view"]

  // const currentData = scenarioData[activeScenarioIdx]
  const currentData = scenarioData // ? scenarioData : scenarioData_mock[0]
  const currentFinancialData = financialData[activeScenarioIdx]
  const currentOperationalData = operationalData[activeScenarioIdx]
  const planViews = [planView, planView2, planView3]

  const displayValue = (value: number | string | undefined, prefix?: string, suffix?: string) => {
    if (value === undefined || value === null || Number.isNaN(value)) return "-";
    return `${prefix || ""}${value}${suffix || ""}`;
  }

  // add comma separator
  const localeNumber = (value: number | undefined, toFixed: number = 0) => {
    if (value === undefined || value === null || Number.isNaN(value)) return undefined;

    return value.toLocaleString("en-US", { maximumFractionDigits: toFixed });
  }

  function InputPanel() {
    if (!currentData) {
      return null
    }

    const metric = currentData.parameters
    return (
      <div className={styles.metricsGridLeft}>
        <MetricCardTwoRows key="baselineMiningCost" value={displayValue(metric.baselineMiningCostPerTonne, "$")} label="Baseline Mining Cost per Tonne" />

        <MetricCardTwoRows key="processingCost" value={displayValue(metric.processingCostPerTonne, "$")} label="Processing Cost per Tonne" />

        <MetricCardTwoRows key="wasteCost" value={displayValue(metric.wasteCostPerTonne, "$")} label="Waste Cost per Tonne" />

        <MetricCardTwoRows key="commodityPrice" value={displayValue(metric.commodityPrice, "$", "/oz")} label="Commodity Price" />

        <MetricCardTwoRows key="millRecovery" value={displayValue(metric.millRecovery, "", "%")} label="Mill Recovery" />

        <MetricCardTwoRows key="numberOfDrills" value={displayValue(metric.numberOfDrills)} label="Number of Drills" />

        <MetricCardTwoRows key="cutterHeadSize" value={displayValue(metric.cutterHeadSize, "", "m")} label="Cutter Head Size" />

        <MetricCardTwoRows key="availability" value={displayValue(metric.availability, "", "%")} label="Availability" />

        <MetricCardTwoRows key="maxHoleLength" value={displayValue(metric.maximumHoleLength, "", "m")} label="Maximum Hole Length" />

        <MetricCardTwoRows key="minHoleInclination" value={displayValue(metric.minimumHoleInclination, "", "°")} label="Minimum Hole Inclination" />

        <MetricCardTwoRows key="discountRate" value={displayValue(metric.discountRate, "", "%")} label="Discount Rate" fullWidth />
      </div>
    )
  }

  function FinancialOutputPanel() {
    if (!currentData) {
      return null
    }

    const metric = currentData.financial

    return (
      <div className={styles.outputGridRight}>
        <MetricCardOneRow key="revenue" value={`${displayValue(formatNumberWithAbbreviation(metric.revenue, 1), "$")}`} label="Revenue" />
        <MetricCardOneRow key="netCashFlow" value={`${displayValue(formatNumberWithAbbreviation(metric.netCashFlow, 1), "$")}`} label="Net Cash Flow" />
        <MetricCardOneRow key="capex" value={`${displayValue(formatNumberWithAbbreviation(metric.capex, 1), "$")}`} label="Capex" />
        <MetricCardOneRow key="miningCost" value={`${displayValue(formatNumberWithAbbreviation(metric.miningCost, 1), "$")}`} label="Mining Cost" />
        <span />
        <MetricCardComposite
          dataLeft={{ key: "processingCostOre", value: `${displayValue(formatNumberWithAbbreviation(metric.processingCostOre, 1), "$")}`, label: "Processing Cost (Ore)" }}
          dataRight={{ key: "processingCostWaste", value: `${displayValue(formatNumberWithAbbreviation(metric.processingCostWaste, 1), "$")}`, label: "Processing Cost (Waste)" }}
          dataBottom={{ key: "totalProcessingCost", value: `${displayValue(formatNumberWithAbbreviation(metric.totalProcessingCost, 1), "$")}`, label: "Total Processing Cost" }}
        />

        <MetricCardTwoRows key="allInCostTonne" value={`${displayValue(formatNumberWithAbbreviation(metric.allInCostTonne, 1), "$")}`} label="All In Cost / Tonne" dim />
        <MetricCardTwoRows key="aisc" value={`${displayValue(formatNumberWithAbbreviation(metric.aisc, 1), "$")}`} label="AISC" description="All-In Sustaining Costs" dim />

        <MetricCardTwoRows key="allInCostMeter" value={`${displayValue(formatNumberWithAbbreviation(metric.allInCostMeter, 1), "$")}`} label="All In Cost / Meter" dim />
        <MetricCardTwoRows key="revenueMeter" value={`${displayValue(formatNumberWithAbbreviation(metric.revenueMeter, 1), "$")}`} label="Revenue / Meter" dim />

        <MetricCardTwoRows key="cashFlowMeter" value={`${displayValue(formatNumberWithAbbreviation(metric.cashFlowMeter, 1), "$")}`} label="Cash Flow / Meter" dim fullWidth />

      </div>
    )
  }

  function OperationalOutputPanel() {
     if (!currentData) {
      return null
    }

    const metric = currentData.operational

    const numHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"]
    return (
      <div className={styles.outputGridRight}>
        <MetricCardOneRow key="grade" value={`${displayValue(metric.grade?.toFixed(1), "", "g/t")}`} label="Grade" />
        <MetricCardOneRow key="lom" value={`${displayValue(metric.lom, "", "mo")}`} label="LOM" description="Life of Mine" />
        <span /><span />
        <MetricCardTwoRows key="extractionHoles" value={`${displayValue(localeNumber(metric.extractionHoles), "", "")}`} label="Extraction holes" dim />
        <MetricCardTwoRows key="totalLength" value={`${displayValue(localeNumber(metric.totalLength), "", "m")}`} label="Total Length" dim />
        <MetricCardTwoRows key="wasteMass" value={`${displayValue(localeNumber(metric.wasteMass), "", "t")}`} label="Waste Mass" dim />
        <MetricCardTwoRows key="oreMass" value={`${displayValue(localeNumber(metric.oreMass), "", "t")}`} label="Ore Mass" dim />

        <MetricCardTwoRows key="totalCommodityVolume" value={`${displayValue(localeNumber(metric.totalCommodityVolume), "", "oz")}`} label="Total Commodity Volume" fullWidth dim />
        <MetricCardThreeRows label="Hole Length"
          values={[
            { key: "holeLengthMin", value: `${displayValue(localeNumber(metric.holeLengthMin), "", "m")}`, label: "MIN" },
            { key: "holeLengthMax", value: `${displayValue(localeNumber(metric.holeLengthMax), "", "m")}`, label: "MAX" },
            { key: "holeLengthAvg", value: `${displayValue(localeNumber(Math.round(metric.holeLengthAvg)), "", "m")}`, label: "AVG" },
          ]}
        />

        <MetricCardThreeRows label="Hole Inclination"
          values={[
            { key: "holeInclinationMin", value: `${displayValue(metric.holeInclinationMin, "", "°")}`, label: "MIN" },
            { key: "holeInclinationMax", value: `${displayValue(metric.holeInclinationMax, "", "°")}`, label: "MAX" },
            { key: "holeInclinationAvg", value: `${displayValue(Math.round(metric.holeInclinationAvg), "", "°")}`, label: "AVG" },
          ]}
        />

        <MetricCardThreeRows label="Quantity of Holes per Inclination"
          values={numHolesLabels.map((label, index) => {
            return { key: `numHoles${label}`, value: `${displayValue(localeNumber(metric.quantityOfHolesPerInclination[index]), "", "")}`, label: `${label}°` }
          })}
        />
      </div>
    )
  }
  return (
    <div className={styles.summary}>

      <div className="absolute-fill behind">
        {
          activeOrebodyView === 0 ?
            <STLPage /> :
            <ScrollableImage
              imageSrc={planViews[activeScenarioIdx]}
              scrollPosition={scrollPosition}
              onScrollPositionChange={setScrollPosition}
            />
        }

      </div>

      {/* Input Panel */}
      <div className="front">
        <div className={styles.scenarioTab} style={{ zIndex: 1000 }}>
          <TabBar
            texts={scenarios}
            activeIdx={activeScenarioIdx}
            onActiveIdxChange={setActiveScenarioIdx} />
        </div>
        {InputPanel()}
      </div>

      {/* Orebody view toggle */}
      <div className={styles.orebodyViewTab}>
        <TabBar
          texts={orebodyView}
          activeIdx={activeOrebodyView}
          onActiveIdxChange={setActiveOrebodyView} />
      </div>

      {/* Output Panel */}
      <div>
        <div className={styles.outputTab}>
          <TabBar
            texts={outputs}
            activeIdx={activeOutputIdx}
            onActiveIdxChange={setActiveOutputIdx}
          />
        </div>
        {activeOutputIdx === 0 ? FinancialOutputPanel() : OperationalOutputPanel()}
      </div>

    </div>
  )
}