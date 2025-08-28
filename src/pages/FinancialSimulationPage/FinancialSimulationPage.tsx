import styles from "./FinancialSimulationPage.module.css"
import { NPVSection } from "./NPVSection/NPVSection"
import { SummarySection } from "./SummarySection/SummarySection"
export function FinancialSimulationPage() {

  return (
    <div className={styles.dashboard}>
      <SummarySection />
      <NPVSection scenario="SCENARIO 1" />
    </div>

  )
}
