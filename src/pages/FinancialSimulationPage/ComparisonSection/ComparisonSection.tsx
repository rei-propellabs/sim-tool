import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import ComparisonTable from "./ComparisonTable/ComparisonTable";
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData";
import { CashFlowData } from "models/CashFlow";
import { ScenarioData } from "types/ScenarioData";


interface ComparisonSectionProps {
  scenarios: ScenarioData[];
  financialOutputData: FinancialOutputData[]
  operationalOutputData: OperationalOutputData[]
}

const ComparisonSection: React.FC<ComparisonSectionProps> = (props) => {
  return (
    <div className={finSimStyles.sectionContainer}>

      <div className={finSimStyles.heading}>
        <div className={finSimStyles.left}>
          <div className={finSimStyles.scenarioLabel}>ALL SCENARIOS</div>
          <div className={finSimStyles.title}>Comparison View</div>
        </div>
      </div>
      <ComparisonTable
        scenarios={props.scenarios}
        financialOutputData={props.financialOutputData}
        operationalOutputData={props.operationalOutputData}
        hideRows={[]}
      />
    </div>
  )
}
export default ComparisonSection;