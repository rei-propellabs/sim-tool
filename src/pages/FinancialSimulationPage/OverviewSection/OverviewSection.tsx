import { useState } from "react"
import styles from "./OverviewSection.module.css"
import { MetricCardTwoRows } from "components/MetricCard/MetricCardTwoRows"
import { TabBar } from "components/TabBar/TabBar"
import { MetricCardThreeRows } from "components/MetricCard/MetricCardThreeRows"
import STLPage from "../stl-viewer/stl-viewer-page"
import planView from "images/planView.png"
import ScrollableImage from "./ScrollableImage/ScrollableImage"
import { ScenarioData } from "api/models/ScenarioData"
import GroupedInfoCard from "components/MetricCard/GroupedInfoCard"
import { ResponsiveMetalCard } from "components/MetricCard/ResponsiveMetalsCard"

interface OverviewSectionProps {
  activeScenarioIdx: number,
  setActiveScenarioIdx: (index: number) => void,
  scenarioData?: ScenarioData,
  scenarioTitles: string[],
}
export const OverviewSection: React.FC<OverviewSectionProps> = (props) => {
  const { activeScenarioIdx, scenarioData, scenarioTitles } = props
  const [activeOutputIdx, setActiveOutputIdx] = useState<number>(0)
  const [activeOrebodyView, setActiveOrebodyView] = useState<number>(0)

  const [scrollPosition, setScrollPosition] = useState(0.5);

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
            values={[{ name: "", value: currentData.parameters.numberOfDrills.toString() }]}
            title={"Number of Drills"}
          />
          <ResponsiveMetalCard
            values={[{ name: "", value: currentData.parameters.cutterHeadSize.toString() }]}
            title={"Cutter Head Size"}
            unitSuffix="m"
          />
        </div>
        {
          currentData.metals.map((metal, index) => {
            return <ResponsiveMetalCard
              key={`metal-recovery-${index}`}
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

    const numHolesLabels = ["35-49", "50-59", "60-69", "70-79", "80-90"]
    return (
      <div className={styles.outputGridRight}>
        <MetricCardTwoRows
          key="lom"
          value={`${displayValue(metric.lom)}`}
          label="LOM"
          description="Life of Mine"
          unitSuffix=" mo" />
        <ResponsiveMetalCard
          values={currentData.metals.map((metal) => ({
            name: metal.name,
            value: Math.round(metal.sold).toLocaleString()
          }))}
          unitSuffix={`${currentData.metals[0]?.per || ""}`}
          title={"Total Commodity Volume"}
        />

        {
          currentData.metals.map((metal, index) => (
            <ResponsiveMetalCard
              key={`metal-grade-${index}`}
              values={currentData.grade.processed.map((processed, i) => {
                const metalEntry = processed.metals.find(m => m.name === metal.name);
                return {
                  name: processed.name,
                  value: metalEntry ? metalEntry.grade.toString() : "-"
                };
              })}
              title={`${metal.name} Grade`}
              unitSuffix={metal.unit || ""}
            />
          ))
        }
        <ResponsiveMetalCard
          key={"MassOfMaterialsProcessed"}
          values={currentData.streams.map(stream => ({ name: stream.name, value: localeNumber(stream.tonnesProcessed) ?? "" }))}
          title={`Mass of Materials Processed`}
          unitSuffix={"t"}
        />

        <span /><span />
        <view className={styles.row}>
          <ResponsiveMetalCard
            values={[{ name: "", value: metric.extractionHoles.toString() }]}
            title={"Extraction Holes"}
          />

          <ResponsiveMetalCard
            values={[{ name: "", value: metric.totalLength.toLocaleString() }]}
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
        {/* <div className={styles.scenarioTab} style={{ zIndex: 1000 }}>
          <TabBar
            texts={scenarioTitles}
            activeIdx={activeScenarioIdx}
            onActiveIdxChange={setActiveScenarioIdx} />
        </div> */}
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