import { useEffect, useRef, useState, useLayoutEffect } from "react"
// Constants for offset in px
const INITIAL_OFFSET_REM = 3.5;
const MIN_OFFSET_REM = 1;
function getRemPx() {
  if (typeof window === 'undefined') return 16;
  return parseFloat(getComputedStyle(document.documentElement).fontSize || "16");
}
import { useSearchParams } from "react-router-dom"
import styles from "./FinancialSimulationPage.module.css"
import { NPVSection } from "./NPVSection/NPVSection"
import { OverviewSection } from "./OverviewSection/OverviewSection"

import { FinancialSimulationData } from "models/FinancialSimulationData"
import ComparisonSection from "./ComparisonSection/ComparisonSection"
import { getToken } from "utils/TokenManager"
import MonthlySummarySection from "./MonthlySummarySection/MonthlySummarySection"
import useGetScenariosByProjectId from "api/hooks/useGetScenariosByProjectId"
import { Breadcrumbs } from "@mui/material"
import { ProjectBreadcrumbs } from "components/ProjectBreadcrumbs/ProjectBreadcrumbs"
import { TopBar } from "components/TopBar/TopBar"
import useGetProjectById from "api/hooks/useGetProjectById"
import { TabBar } from "components/TabBar/TabBar"


// const scenarioTitles = ["SCENARIO 1", "SCENARIO 2", "SCENARIO 3"]

export function FinancialSimulationPage() {
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number>(0)
  // Track scroll position for TabBar offset, scoped to local container
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const tabBarRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const container = scrollContainerRef.current;
    const tabBar = tabBarRef.current;
    if (!container || !tabBar) return;
    const remPx = getRemPx();
    const INITIAL_OFFSET_PX = INITIAL_OFFSET_REM * remPx;
    const MIN_OFFSET_PX = MIN_OFFSET_REM * remPx;
    function handleScroll() {
      if (!container || !tabBar) return;
      const scrollY = container.scrollTop;
      const newTop = Math.max(INITIAL_OFFSET_PX - scrollY, MIN_OFFSET_PX);
      tabBar.style.top = `${newTop}px`;
    }
    container.addEventListener("scroll", handleScroll);
    // Set initial position
    handleScroll();
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollContainerRef.current, tabBarRef.current]);

  const [loading, setLoading] = useState(true)
  const [parsedData, setParsedData] = useState<FinancialSimulationData[]>([])
  const [scenarioTitles, setScenarioTitles] = useState<string[]>([])
  // const scenarioData = scenarioData_mock
  const token = getToken("uploadAdmin")

  // Get orgId from URL parameter, fallback to default if not present
  const [searchParams] = useSearchParams();
  const orgId = searchParams.get("orgId") || "88e2e8e5-e9c4-40bd-94e4-856d963bb8ed";
  const projectId = searchParams.get("projectId") || "88e2e8e5-e9c4-40bd-94e4-856d963bb8ed";
  // const { isLoading: projectDataLoading, project } = useGetProjectById(token, { id: projectId, organizationId: orgId });

  const { isLoading: loadingScenarios, data: scenarioData } = useGetScenariosByProjectId(token, orgId, projectId)

  const isPreviewing = false
  useEffect(() => {
    if (!loadingScenarios && scenarioData) {

      const scenarioTitles = Array(scenarioData.length).fill(0).map((_, i) => `SCENARIO ${i + 1}`)
      setScenarioTitles(scenarioTitles);

      let parsedArr: FinancialSimulationData[] = [];
      scenarioData.forEach((_, index: number) => {
        let cumulativeNetCash = 0;
        scenarioData[index].cashflow.yearly.forEach((row: any) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        cumulativeNetCash = 0;
        scenarioData[index].cashflow.quarterly.forEach((row: any) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        cumulativeNetCash = 0;
        scenarioData[index].cashflow.monthly.forEach((row: any) => {
          cumulativeNetCash += row.netRevenue;
          row.cumulativeNetCash = cumulativeNetCash;
        });
        parsedArr.push({
          title: scenarioTitles[index],
          cashFlow: scenarioData[index].cashflow,
        });
      });


      setParsedData(parsedArr);
      setLoading(false);

    }
  }, [loadingScenarios, scenarioData]);

  // useEffect(() => {
  //   if (!projectDataLoading && project) {
  //     document.title = `Financial Simulation - ${project.name || "Project"}`;
  //   }
  // }, [projectDataLoading, project]);

  if (loading) {
    return <div className={styles.spinner}>Loading...</div>
  }

  const Header = () => {
    return (
      <div className={styles.headerContainer}>
        <div className={styles.headerContentLeft}>

        </div>

        <div className={styles.headerContentRight}>
          {
            isPreviewing &&
            <>
              <button className="border-button">Edit Selections</button>
              <button className="primay-button">Save & Exit</button>
            </>
          }

        </div>

      </div>
    )
  }

  return (
    <div className={styles.dashboard} ref={scrollContainerRef} style={{height: '100vh', overflowY: 'auto'}}>
      {/* <Header /> */}
      <TopBar
        leftElements={
          <ProjectBreadcrumbs
            texts={["Financial Simulation"]}
          />
        }
      />
      <div
        ref={tabBarRef}
        style={{
          zIndex: 1000,
          position: "fixed",
          top: INITIAL_OFFSET_REM + 'rem',
          left: "1rem",
        }}
      >
        <TabBar
          texts={scenarioTitles}
          activeIdx={activeScenarioIdx}
          onActiveIdxChange={setActiveScenarioIdx}
        />
      </div>
      <div style={{ position: "relative" }}>
        <OverviewSection
          activeScenarioIdx={activeScenarioIdx}
          setActiveScenarioIdx={setActiveScenarioIdx}
          scenarioData={scenarioData ? scenarioData[activeScenarioIdx] : undefined}
          scenarioTitles={scenarioTitles}
        />
      </div>
      <NPVSection
        cashFlowData={parsedData[activeScenarioIdx].cashFlow}
        scenarioTitle={scenarioTitles[activeScenarioIdx]}
        discountRate={scenarioData ? scenarioData[activeScenarioIdx].evaluationParameters.discRate : 0}
      />
      <MonthlySummarySection
        scenarioIdx={activeScenarioIdx}
        scenarioTitle={scenarioTitles[activeScenarioIdx]}
        scenarioData={scenarioData ? scenarioData : []}
      />
      <ComparisonSection
        scenarioData={scenarioData ? scenarioData : []}
      />
    </div>
  )
}
