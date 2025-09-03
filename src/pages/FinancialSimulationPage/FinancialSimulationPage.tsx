import { useEffect, useState } from "react"
import styles from "./FinancialSimulationPage.module.css"
import { NPVSection } from "./NPVSection/NPVSection"
import { SummarySection } from "./SummarySection/SummarySection"
import * as XLSX from 'xlsx'
import { CashFlowRow } from "models/CashFlow"
import { FinancialSimulationData } from "models/FinancialSimulationData"
import MonthlySummarySection from "./MonthlySummarySection/MonthlySummarySection"
import ComparisonSection from "./ComparisonSection/ComparisonSection"
import { ScenarioData } from "types/ScenarioData"
import { operationalOutput_mock } from "api/mock/OperationOutputMock"
import { financialOutput_mock } from "api/mock/FinancialOutputMock"

const demoScenarios = [
  {
    fileName: "/demo/scenario1/Drill 200 Cu Cashflows.xlsx",
    title: "SCENARIO 1"
  },
  {
    fileName: "/demo/scenario2/Cashflow ReAlloys.xlsx",
    title: "SCENARIO 2"
  },
  {
    fileName: "/demo/scenario3/West Red Lake Cashflows.xlsx",
    title: "SCENARIO 3"
  },
]
const scenarioData: ScenarioData[] = [
  {
    id: 1,
    timeHorizonData: [10, 25, 20, 18, 30, 42, 43],
    keyAssumptions: {
      cutterHeadSize: "2m",
    },
    financials: {
      revenue: 127845731,
      miningCost: 80314891,
      totalProcessingCost: 7482234,
      netCashFlow: 31828606,
    },
    operational: {
      lifeOfMine: "54 months",
      extractionHoles: 730,
      totalLength: "36,065m",
      oreMass: "330,840 tonnes",
      grade: "5.91 g/tonnes",
    },
    holeLength: { min: 3, max: 132, avg: 44 },
    holeInclination: { min: 40, max: 90, avg: 55 },
    quantityOfHoleInclinations: {
      ranges: ["35-39", "40-49", "50-59", "60-69", "70-79", "80-90"],
      values: [25, 75, 50, 0, 100, 10],
    },
  },
  {
    id: 2,
    timeHorizonData: [12, 18, 24, 28, 32, 36, 38],
    keyAssumptions: {
      cutterHeadSize: "2.5m",
      change: "+25%",
    },
    financials: {
      revenue: 135425720,
      miningCost: 82941936,
      totalProcessingCost: 8259759,
      netCashFlow: 36220000,
    },
    operational: {
      lifeOfMine: "55 months",
      extractionHoles: 541,
      totalLength: "25,332m",
      oreMass: "335,097 tonnes",
      grade: "5.66 g/tonnes",
    },
    holeLength: { min: 3, max: 132, avg: 44 },
    holeInclination: { min: 60, max: 90, avg: 55 },
    quantityOfHoleInclinations: {
      ranges: ["35-39", "40-49", "50-59", "60-69", "70-79", "80-90"],
      values: [25, 74, 0, 0, 95, 25],
    },
  },
  {
    id: 3,
    timeHorizonData: [8, 12, 18, 22, 28, 32, 35],
    keyAssumptions: {
      cutterHeadSize: "3m",
      change: "+20%",
    },
    financials: {
      revenue: 137032338,
      miningCost: 82067206,
      totalProcessingCost: 8259759,
      netCashFlow: 38245574,
    },
    operational: {
      lifeOfMine: "54 months",
      extractionHoles: 407,
      totalLength: "18,032m",
      oreMass: "372,185 tonnes",
      grade: "5.52 g/tonnes",
    },
    holeLength: { min: 3, max: 132, avg: 44 },
    holeInclination: { min: 40, max: 90, avg: 55 },
    quantityOfHoleInclinations: {
      ranges: ["35-39", "40-49", "50-59", "60-69", "70-79", "80-90"],
      values: [25, 74, 0, 0, 95, 25],
    },
  },
]

export function FinancialSimulationPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0)

  const [loading, setLoading] = useState(true)
  const [parsedData, setParsedData] = useState<FinancialSimulationData[]>([])

  useEffect(() => {
    const handleXLSX = async (index: number) => {
      try {
        const response = await fetch(demoScenarios[index].fileName)
        if (!response.ok) {
          throw new Error("Failed to fetch file")
        }
        const arrayBuffer = await response.arrayBuffer()
        const data = new Uint8Array(arrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        const headers = [
          "Mining Cost",
          "Total Processing Cost",
          "Gross Revenue",
          "Net Revenue",
          "Period Beginning"
        ]

        const filterRows = (rows: any[]): CashFlowRow[] =>
          rows.map(row => {
            // Create a new object with trimmed keys
            const trimmedRow: Record<string, any> = {}
            Object.keys(row).forEach(k => {
              trimmedRow[k.trim()] = row[k]
            })
            const result: any = {}
            headers.forEach(h => {
              result[h] = Number(trimmedRow[h]) || 0
            })
            return result
          }) as CashFlowRow[]

        const monthlyCashFlow = filterRows(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]))
        const quarterlyCashFlow = filterRows(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[1]]))
        const annuallyCashFlow = filterRows(XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[2]]))
        const cashFlow = {
          monthly: monthlyCashFlow,
          quarterly: quarterlyCashFlow,
          annually: annuallyCashFlow
        }

        setParsedData((data) => [...data, {
          title: demoScenarios[index].title,
          cashFlow: cashFlow
        }])

        setLoading(false)
      } catch (error) {
        console.error(error)
        setLoading(false)
      }
    }
    [0, 1, 2].forEach((index) => {
      handleXLSX(index)
    })
  }, [])

  if (loading) {
    return <div className={styles.spinner}>Loading...</div>
  }
  return (
    <div className={styles.dashboard}>
      <SummarySection
        activeScenario={demoScenarios[activeScenarioIdx].title}
        setActiveScenarioIdx={setActiveScenarioIdx} />
      <NPVSection
        cashFlowData={parsedData[activeScenarioIdx].cashFlow}
        scenario={demoScenarios[activeScenarioIdx].title} />
      <MonthlySummarySection
        data={1}
        scenario={demoScenarios[activeScenarioIdx].title} />
      <ComparisonSection 
        scenarios={scenarioData}
        financialOutputData={Object.values(financialOutput_mock)}
        operationalOutputData={Object.values(operationalOutput_mock)}
      />
    </div>

  )
}
