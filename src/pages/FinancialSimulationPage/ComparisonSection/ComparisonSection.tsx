import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import ComparisonTable from "./ComparisonTable/ComparisonTable";
import { FinancialOutputData, OperationalOutputData } from "api/models/OutputData";
import { CashFlowRow } from "models/CashFlow";
import { MiningScenarioData } from "api/models/MiningScenarioData";


interface ComparisonSectionProps {
  cashFlowData: CashFlowRow[][];
  keyAssumptions: MiningScenarioData[];
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
        cashFlowData={props.cashFlowData}
        keyAssumptions={props.keyAssumptions}
        financialOutputData={props.financialOutputData}
        operationalOutputData={props.operationalOutputData}
      />
    </div>
  )
}
export default ComparisonSection;