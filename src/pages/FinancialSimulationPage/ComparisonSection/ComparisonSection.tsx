import finSimStyles from '../FinancialSimulationPage.module.css';
import ComparisonTable from "./ComparisonTable/ComparisonTable";
import { ScenarioData } from "api/models/ScenarioData";


export interface ComparisonSectionProps {
  // cashFlowData: CashflowEntry[][];
  scenarioData: ScenarioData[];
}

const ComparisonSection: React.FC<ComparisonSectionProps> = (props) => {
  const { scenarioData } = props

  const cashFlowData = scenarioData ? scenarioData.map(d => d.cashflow!.monthly!) : []
  const keyAssumptions =
    scenarioData
      ? scenarioData.map(s => ({ ...s.parameters, ...s.evaluationParameters }))
      : []

  const financialOutputData = scenarioData ? scenarioData.map(s => s.financial) : []
  const operationalOutputData = scenarioData ? scenarioData.map(s => s.operational) : []

  return (
    <div className={finSimStyles.sectionContainer}>

      <div className={finSimStyles.heading}>
        <div className={finSimStyles.left}>
          <div className={finSimStyles.scenarioLabel}>ALL SCENARIOS</div>
          <div className={finSimStyles.title}>Comparison View</div>
        </div>
      </div>
      <ComparisonTable
        cashFlowData={cashFlowData}
        keyAssumptions={keyAssumptions}
        financialOutputData={financialOutputData}
        operationalOutputData={operationalOutputData}
      />
    </div>
  )
}
export default ComparisonSection;