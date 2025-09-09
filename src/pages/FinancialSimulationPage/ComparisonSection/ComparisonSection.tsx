import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import ComparisonTable from "./ComparisonTable/ComparisonTable";
import { CashFlowRow } from "models/CashFlow";
import { FinancialData, OperationalData, ParametersData } from "api/models/ScenarioData";


export interface ComparisonSectionProps {
  cashFlowData: CashFlowRow[][];
  keyAssumptions: ParametersData[];
  financialOutputData: FinancialData[]
  operationalOutputData: OperationalData[]
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
        {...props}
      />
    </div>
  )
}
export default ComparisonSection;