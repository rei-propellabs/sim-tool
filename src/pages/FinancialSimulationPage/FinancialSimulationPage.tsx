import { useEffect, useState } from "react"
import styles from "./FinancialSimulationPage.module.css"
import { NPVSection } from "./NPVSection/NPVSection"
import { OverviewSection } from "./OverviewSection/OverviewSection"
import * as XLSX from 'xlsx'
import { CashFlowRow } from "models/CashFlow"
import { FinancialSimulationData } from "models/FinancialSimulationData"
import ComparisonSection from "./ComparisonSection/ComparisonSection"
import { operationalOutput_mock } from "api/mock/OperationOutputMock"
import { financialOutput_mock } from "api/mock/FinancialOutputMock"
import { scenarioData_mock } from "api/mock/MiningScenarioDataMock"
import useGetScenarios from "api/hooks/useGetScenarios"
import { getToken } from "utils/TokenManager"

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

export function FinancialSimulationPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0)

  const [loading, setLoading] = useState(true)
  const [parsedData, setParsedData] = useState<FinancialSimulationData[]>([])
  // const scenarioData = scenarioData_mock
  const token = getToken("uploadAdmin")
  const orgId = "33264945-70c1-4725-8b01-17503d578783"
  const { isLoading: loadingScenarios, data: scenarioData } = useGetScenarios(token, orgId)

  useEffect(() => {
    const handleXLSX = async (index: number) => {
      try {
        const response = await fetch(demoScenarios[index].fileName)
        if (!response.ok) throw new Error("Failed to fetch file")
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

        let cumulativeNetCash = 0
        const filterRows = (rows: any[]): CashFlowRow[] =>
          rows.map(row => {
            const trimmedRow: Record<string, any> = {}
            Object.keys(row).forEach(k => {
              trimmedRow[k.trim()] = row[k]
            })
            const result: any = {}
            headers.forEach(h => {
              result[h] = Number(trimmedRow[h]) || 0
            })
            cumulativeNetCash += result["Net Revenue"]
            result["Cumulative Net Cash"] = cumulativeNetCash
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

        return {
          title: demoScenarios[index].title,
          cashFlow: cashFlow
        }
      } catch (error) {
        console.error(error)
        setLoading(false)
        return null
      }
    }

    Promise.all([handleXLSX(0), handleXLSX(1), handleXLSX(2)]).then(results => {
      setParsedData(results.filter(Boolean) as FinancialSimulationData[]) // filter out nulls
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loadingScenarios) {
      console.log("Loaded scenarios", scenarioData)
    }
  }, [loadingScenarios])
  // useEffect(() => {
  //   if (!loadingScenarios) {
  //     // Perform actions when scenarios are loaded
  //   }
  // }, [loadingScenarios])

  if (loading) {
    return <div className={styles.spinner}>Loading...</div>
  }
  return (
    <div className={styles.dashboard}>
      <OverviewSection
        activeScenarioIdx={activeScenarioIdx}
        setActiveScenarioIdx={setActiveScenarioIdx}
        scenarioData={scenarioData ? scenarioData[activeScenarioIdx] : undefined}
      />
      {/* <NPVSection
        cashFlowData={parsedData[activeScenarioIdx].cashFlow}
        scenario={demoScenarios[activeScenarioIdx].title}
        discountRate={0.05}
      /> */}
      {/* <MonthlySummarySection
        data={1}
        scenario={demoScenarios[activeScenarioIdx].title} /> */}
      {/* <ComparisonSection
        cashFlowData={Object.values(parsedData).map(d => d.cashFlow!.monthly!)}
        keyAssumptions={Object.values(scenarioData)}
        financialOutputData={Object.values(financialOutput_mock)}
        operationalOutputData={Object.values(operationalOutput_mock)}
      /> */}
    </div>

  )
}
