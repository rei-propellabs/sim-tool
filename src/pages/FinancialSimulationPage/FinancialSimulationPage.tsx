import { useEffect, useState } from "react"
import { useSearchParams } from "react-router-dom"
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
import { CashflowEntry } from "api/models/ScenarioData"
import MonthlySummarySection from "./MonthlySummarySection/MonthlySummarySection"
import useGetScenariosByProjectId from "api/hooks/useGetScenariosByProjectId"

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

  // Get orgId from URL parameter, fallback to default if not present
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId") || "88e2e8e5-e9c4-40bd-94e4-856d963bb8ed";
  const projectId = searchParams.get("projectId") || "88e2e8e5-e9c4-40bd-94e4-856d963bb8ed";

  const { isLoading: loadingScenarios, data: scenarioData } = useGetScenariosByProjectId(token, orgId, projectId)

  useEffect(() => {
    if (!loadingScenarios && scenarioData) {
      let parsedArr: FinancialSimulationData[] = [];
      scenarioData.forEach((_, index: number) => {
        let cumulativeNetCash = 0;
        scenarioData[index].cashflow.yearly.forEach((row: CashflowEntry) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        cumulativeNetCash = 0;
        scenarioData[index].cashflow.quarterly.forEach((row: CashflowEntry) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        cumulativeNetCash = 0;
        scenarioData[index].cashflow.monthly.forEach((row: CashflowEntry) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        parsedArr.push({
          title: demoScenarios[index].title,
          cashFlow: scenarioData[index].cashflow,
        });
      });
      setParsedData(parsedArr);
      setLoading(false);
    }
  }, [loadingScenarios, scenarioData]);

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
      <NPVSection
        cashFlowData={parsedData[activeScenarioIdx].cashFlow}
        scenario={demoScenarios[activeScenarioIdx].title}
        discountRate={scenarioData ? scenarioData[activeScenarioIdx].evaluationParameters.discRate : 0}
      />
      <MonthlySummarySection
        scenarioTitle={demoScenarios[activeScenarioIdx].title}
        scenarioData={scenarioData ? scenarioData : []} />

      <ComparisonSection
        scenarioData={scenarioData ? scenarioData : []}
      />
    </div>

  )
}
