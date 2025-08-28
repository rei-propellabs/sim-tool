import { useEffect, useState } from "react"
import styles from "./FinancialSimulationPage.module.css"
import { NPVSection } from "./NPVSection/NPVSection"
import { SummarySection } from "./SummarySection/SummarySection"
import * as XLSX from 'xlsx'
import { CashFlowRow } from "models/CashFlow"
import { FinancialSimulationData } from "models/FinancialSimulationData"

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
    [0,1,2].forEach((index) => {
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
    </div>

  )
}
