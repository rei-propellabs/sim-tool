import { useState } from "react"
import styles from "./OverviewSection.module.css"
import { MetricCardTwoRows } from "components/MetricCard/MetricCardTwoRows"
import { TabBar } from "components/TabBar/TabBar"
import { MetricCardThreeRows } from "components/MetricCard/MetricCardThreeRows"
import { formatNumberWithAbbreviation } from "utils/NumberFormatter"
import STLPage from "../stl-viewer/stl-viewer-page"
import planView from "images/planView.png"
import planView2 from "images/planView2.png"
import planView3 from "images/planView3.png"
import ScrollableImage from "./ScrollableImage/ScrollableImage"
import { ParametersData, ScenarioData } from "api/models/ScenarioData"
import GroupedInfoCard from "components/MetricCard/GroupedInfoCard"
import { ResponsiveMetalCard } from "components/MetricCard/ResponsiveMetalsCard"

interface OverviewSectionProps {
  activeScenarioIdx: number,
  setActiveScenarioIdx: (index: number) => void,
  scenarioData?: ScenarioData
}
export const OverviewSection: React.FC<OverviewSectionProps> = (props) => {
  const { activeScenarioIdx, setActiveScenarioIdx, scenarioData } = props
  const [activeOutputIdx, setActiveOutputIdx] = useState<number>(0)
  const [activeOrebodyView, setActiveOrebodyView] = useState<number>(0)

  const [scrollPosition, setScrollPosition] = useState(0.5);

  const scenarios = ["SCENARIO 1", "SCENARIO 2", "SCENARIO 3"]
  const outputs = ["financial (USD)", "operational"]
  const orebodyView = ["3D animation", "plan view"]

  // const currentData = scenarioData[activeScenarioIdx]
  const currentData = scenarioData // ? scenarioData : scenarioData_mock[0]
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
        <GroupedInfoCard key="revenue"
          rows={[
            {
              leftLabel: "Revenue",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.revenue, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.revenueTonne, 1), "$")}`
            },
          ]}
        />
        <span />
        <GroupedInfoCard key="capex"
          rows={[
            {
              leftLabel: "Capex",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.capex, 1), "$")}`,
            },
          ]}
        />

        <GroupedInfoCard key="costBreakdown"
          rows={[
            {
              leftLabel: "Extraction Cost",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.extractionCost, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.extractionCostTonne, 1), "$")}`
            },
            {
              leftLabel: "Imaging Cost",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.imagingCost, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.imagingCostTonne, 1), "$")}`
            },
            {
              leftLabel: "Closure Cost",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.closureCost, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.closureCostTonne, 1), "$")}`
            },
          ]}
        />

        <GroupedInfoCard key="totalProcessingCost"
          rows={[
            {
              leftLabel: "Total Processing Cost",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.totalProcessingCost, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.totalProcessingCostTonne, 1), "$")}`
            },
          ]}
        />

        <GroupedInfoCard key="totalProjectCost"
          rows={[
            {
              leftLabel: "Total Project Cost",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.allInCost, 1), "$")}`,
              dark: true,
            },
          ]}
        />

        <span />

        <GroupedInfoCard key="netCashFlow"
          rows={[
            {
              leftLabel: "Project Net Cash Flow",
              leftValue: `${displayValue(formatNumberWithAbbreviation(metric.netCashFlow, 1), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(formatNumberWithAbbreviation(metric.netCashFlowTonne, 1), "$")}`,
            },
          ]}
        />
      </div>
    )
  }

  function OperationalOutputPanel() {
    if (!currentData) {
      return null
    }

    const metric = currentData.operational

    const metals = metric.metals

    const gradeAndLom = () => {
      switch (metals.length) {
        case 1:
          return (
            <view className={styles.row}>
              <MetricCardTwoRows
                key="grade"
                value={`${displayValue(metals[0].grade)} `}
                unitSuffix={metals[0].unit}
                label="Grade" />
              <MetricCardTwoRows
                key="lom"
                value={`${displayValue(metric.lom, "", "mo")}`}
                label="LOM"
                description="Life of Mine"
                unitSuffix="" />
            </view>
          )
        case 2:
          return (
            <view className={styles.row}>
              {/* <MetricCardThreeRows
                topLabels={metals.map(metal => metal.name)}
                values={
                  metals.map(metal => ({ key: `grade-${metal.name}`, value: `${localeNumber(metal.grade)}`, label: "", sufix: metal.unit }))
                }
                bottomLabel="Grade"
              /> */}
              <ResponsiveMetalCard
                values={metals.map(metal => ({ name: metal.name, value: metal.grade }))}
                title={"Grade"}
              />
              <MetricCardTwoRows
                key="lom"
                value={`${displayValue(metric.lom, "", "mo")}`}
                label="LOM"
                description="Life of Mine" />
            </view>
          )
        case 3:
        case 4:
          return (
            <>
              <MetricCardThreeRows
                topLabels={metals.map(metal => metal.name)}
                values={
                  metals.map(metal => ({
                    key: `grade-${metal.name}`,
                    value: `${formatNumberWithAbbreviation(metal.grade)}`,
                    label: "",
                    sufix: metal.unit
                  }))
                }
                bottomLabel="Grade"
              />
              <MetricCardTwoRows
                key="lom"
                value={`${displayValue(metric.lom, "", "mo")}`}
                label="LOM"
                description="Life of Mine" />
            </>
          )
      }

    }
    const numHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"]
    return (
      <div className={styles.outputGridRight}>
        {gradeAndLom()}
        <span /><span />

        <view className={styles.row}>
          <MetricCardTwoRows key="extractionHoles" value={`${displayValue(localeNumber(metric.extractionHoles), "", "")}`} label="Extraction holes" dim />
          <MetricCardTwoRows key="totalLength" value={`${displayValue(localeNumber(metric.totalLength), "", "m")}`} label="Total Length" dim />
        </view>

        <MetricCardTwoRows key="totalCommodityVolume" value={`${displayValue(localeNumber(metric.totalCommodityVolume), "", "oz")}`} label="Total Commodity Volume" fullWidth dim />
        <MetricCardThreeRows topLabels={["Hole Length"]}
          values={[
            { key: "holeLengthMin", value: `${displayValue(localeNumber(metric.holeLengthMin), "", "")}`, label: "MIN", unitSuffix: "m" },
            { key: "holeLengthMax", value: `${displayValue(localeNumber(metric.holeLengthMax), "", "")}`, label: "MAX", unitSuffix: "m" },
            { key: "holeLengthAvg", value: `${displayValue(localeNumber(Math.round(metric.holeLengthAvg)), "", "")}`, label: "AVG", unitSuffix: "m" },
          ]}
        />

        <MetricCardThreeRows topLabels={["Hole Inclination"]}
          values={[
            { key: "holeInclinationMin", value: `${displayValue(metric.holeInclinationMin, "", "°")}`, label: "MIN" },
            { key: "holeInclinationMax", value: `${displayValue(metric.holeInclinationMax, "", "°")}`, label: "MAX" },
            { key: "holeInclinationAvg", value: `${displayValue(Math.round(metric.holeInclinationAvg), "", "°")}`, label: "AVG" },
          ]}
        />

        <MetricCardThreeRows topLabels={["Quantity of Holes per Inclination"]}
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