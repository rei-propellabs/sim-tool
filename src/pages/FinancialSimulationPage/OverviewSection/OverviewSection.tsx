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
  const planViews = [planView, planView, planView]

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

    const metals = currentData!.operational.metals

    function processingAndWasteCost() {
      let needTwoRows = false

      if (metals.length === 1) {
        needTwoRows = false
      } else if (metals.length === 2) {
        const maxCharLength = Math.max(...metals.map(metal => Math.round(metal.costTonne).toLocaleString().length + 1))
        needTwoRows = maxCharLength > 7
      } else {
        needTwoRows = true
      }

      const cards = (
        <>
          <ResponsiveMetalCard
            values={currentData!.operational.metals.map((metal) => ({ name: metal.name, value: metal.costTonne }))}
            title={"Processing Cost per Tonne"}
            unitPrefix="$"
          />
          <ResponsiveMetalCard
            values={currentData!.processStreams.filter(ps => ps.name === "Waste").map((ps) => ({ name: ps.name, value: ps.cost }))}
            title={"Waste Cost per Tonne"}
            unitPrefix="$"
          />
        </>
      )
      if (needTwoRows) {
        return cards
      } else {
        return <div className={styles.row}>{cards}</div>
      }
    }

    return (
      <div className={styles.metricsGridLeft}>
        <ResponsiveMetalCard
          values={currentData.metals.map(metal => ({ name: metal.name, value: Math.round(metal.price).toLocaleString() }))}
          title={"Commodity Price"}
          unitPrefix="$"
          unitSuffix={`/` + (currentData.metals[0]?.per || "")}
        />
        <div className={styles.row}>
          <ResponsiveMetalCard
            values={[{ name: "", value: currentData.parameters.numberOfDrills }]}
            title={"Number of Drills"}
          />
          <ResponsiveMetalCard
            values={[{ name: "", value: currentData.parameters.cutterHeadSize }]}
            title={"Cutter Head Size"}
            unitSuffix="m"
          />
        </div>
        {
          currentData.metals.map((metal) => {
            return <ResponsiveMetalCard
              values={metal.streams.map((stream) => (
                { name: stream.name, value: Math.round(stream.recovery).toLocaleString() }))}
              title={`${metal.name} Recovery`}
              unitSuffix="%"
            />
          })
        }

        <ResponsiveMetalCard
          values={currentData.streams.map((stream) => (
            { name: stream.name, value: Math.round(stream.costTonne).toLocaleString() }))}
          title={`Processing Cost per Tonne`}
          unitPrefix="$"
        />
        {/* {processingAndWasteCost()} */}
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
              leftValue: `${displayValue(localeNumber(metric.revenue, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.revenueTonne, 0), "$")}`
            },
          ]}
        />
        <span />
        <GroupedInfoCard key="capex"
          rows={[
            {
              leftLabel: "Capex",
              leftValue: `${displayValue(localeNumber(metric.capex, 0), "$")}`,
            },
          ]}
        />

        <GroupedInfoCard key="costBreakdown"
          rows={[
            {
              leftLabel: "Extraction Cost",
              leftValue: `${displayValue(localeNumber(metric.extractionCost, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.extractionCostTonne, 1), "$")}`
            },
            {
              leftLabel: "Imaging Cost",
              leftValue: `${displayValue(localeNumber(metric.imagingCost, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.imagingCostTonne, 0), "$")}`
            },
            {
              leftLabel: "Closure Cost",
              leftValue: `${displayValue(localeNumber(metric.closureCost, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.closureCostTonne, 0), "$")}`
            },
          ]}
        />

        <GroupedInfoCard key="totalProcessingCost"
          rows={[
            {
              leftLabel: "Total Processing Cost",
              leftValue: `${displayValue(localeNumber(metric.totalProcessingCost, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.totalProcessingCostTonne, 0), "$")}`
            },
          ]}
        />

        <GroupedInfoCard key="totalProjectCost"
          rows={[
            {
              leftLabel: "Total Project Cost",
              leftValue: `${displayValue(localeNumber(metric.allInCost, 0), "$")}`,
              dark: true,
            },
          ]}
        />

        <span />

        <GroupedInfoCard key="netCashFlow"
          rows={[
            {
              leftLabel: "Project Net Cash Flow",
              leftValue: `${displayValue(localeNumber(metric.netCashFlow, 0), "$")}`,
              rightLabel: "/tonne",
              rightValue: `${displayValue(localeNumber(metric.netCashFlowTonne, 0), "$")}`,
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
      let needTwoRows = false

      if (metals.length === 1) {
        needTwoRows = false
      } else if (metals.length === 2) {
        const maxCharLength = Math.max(...metals.map(metal => Math.round(metal.grade).toLocaleString().length + (metal.unit?.length || 0)))
        needTwoRows = maxCharLength > 7
      } else {
        needTwoRows = true
      }

      const gradeAndLomContent = (
        <>
          <ResponsiveMetalCard
            values={metals.map(metal => ({ name: metal.name, value: Math.round(metal.grade).toLocaleString() }))}
            title="Grade"
            unitSuffix={metals[0]?.unit || ""}
          />
          <MetricCardTwoRows
            key="lom"
            value={`${displayValue(metric.lom)}`}
            label="LOM"
            description="Life of Mine"
            unitSuffix="mo" />
        </>
      );

      if (needTwoRows) {
        return gradeAndLomContent
      } else {
        return <view className={styles.row}>{gradeAndLomContent}</view>;
      }

    }

    function wasteAndOreMass() {
      let needTwoRows = false

      if (metals.length === 1) {
        needTwoRows = false
      } else if (metals.length === 2) {
        let maxCharLength = Math.max(...metals.map(metal => Math.round(metal.wastePer).toLocaleString().length + (metal.unit?.length || 0)))
        maxCharLength = Math.max(maxCharLength, ...metals.map(metal => Math.round(metal.mass).toLocaleString().length + (metal.unit?.length || 0)))

        needTwoRows = maxCharLength > 7
      } else {
        needTwoRows = true
      }

      const content = (
        <>
          <ResponsiveMetalCard
            values={metals.map((metal) => ({ name: metal.name, value: Math.round(metal.wastePer).toLocaleString() }))} // todo confirm this is correct
            unitSuffix={metals[0].per}
            title={"Waste Mass"}
          />

          <ResponsiveMetalCard
            values={metals.map((metal) => ({ name: metal.name, value: Math.round(metal.mass).toLocaleString() }))} // todo confirm this is correct
            unitSuffix={metals[0].per}
            title={"Ore Mass"}
          />
        </>
      )
      if (needTwoRows) {
        return content
      } else {
        return <view className={styles.row}>{content}</view>;
      }
    }

    const numHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"]
    return (
      <div className={styles.outputGridRight}>
        {/* {gradeAndLom()} */}
        <MetricCardTwoRows
          key="lom"
          value={`${displayValue(metric.lom)}`}
          label="LOM"
          description="Life of Mine"
          unitSuffix="mo" />
        <ResponsiveMetalCard
          values={currentData.metals.map((metal) => ({
            name: metal.name,
            value: Math.round(
              metal.streams
                .filter(stream => stream.name !== "Waste")
                .map(stream => stream.commodity)
                .reduce((a, b) => a + b, 0)
            ).toLocaleString()
          }))}
          unitSuffix={`${currentData.metals[0]?.per || ""}`}
          title={"Total Commodity Volume"}
        />

        {
          currentData.metals.map((metal) => (
            <ResponsiveMetalCard
              values={metal.streams.map(stream => ({ name: stream.name, value: localeNumber(stream.grade, 3) ?? "" }))}
              title={`${metal.name} Grade`}
              unitSuffix={metal.unit || ""}
            />
          ))
        }
        {/* <ResponsiveMetalCard
          key={"MassOfMaterialsProcessed"}
          values={currentData.metals.map(metal => ({ name: metal.name, value: localeNumber(metal.mass) ?? "" }))}
          title={`Mass of Materials Processed`}
          unitSuffix={"t"}
        /> */}

        <span /><span />
        <view className={styles.row}>
          <ResponsiveMetalCard
            values={[{ name: "", value: metric.extractionHoles }]}
            title={"Extraction Holes"}
          />

          <ResponsiveMetalCard
            values={[{ name: "", value: metric.totalLength }]}
            unitSuffix="m"
            title={"Total Length"}
          />
        </view>

        <MetricCardThreeRows topLabels={["Hole Length"]}
          values={[
            { key: "holeLengthMin", value: `${displayValue(localeNumber(metric.holeLengthMin), "", "")}`, label: "MIN", unitSuffix: "m" },
            { key: "holeLengthMax", value: `${displayValue(localeNumber(metric.holeLengthMax), "", "")}`, label: "MAX", unitSuffix: "m" },
            { key: "holeLengthAvg", value: `${displayValue(localeNumber(Math.round(metric.holeLengthAvg)), "", "")}`, label: "AVG", unitSuffix: "m" },
          ]}
        />

        <MetricCardThreeRows topLabels={["Hole Inclination"]}
          values={[
            { key: "holeInclinationMin", value: `${displayValue(metric.holeInclinationMin)}`, label: "MIN", unitSuffix: "°" },
            { key: "holeInclinationMax", value: `${displayValue(metric.holeInclinationMax)}`, label: "MAX", unitSuffix: "°" },
            { key: "holeInclinationAvg", value: `${displayValue(metric.holeInclinationAvg.toFixed(1))}`, label: "AVG", unitSuffix: "°" },
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

      <div className="absolute-fill">
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
      <div >
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