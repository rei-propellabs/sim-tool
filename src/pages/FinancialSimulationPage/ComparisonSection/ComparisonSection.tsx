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
  let keyAssumptions

  if (scenarioData) {
    keyAssumptions = [
      {
        values: scenarioData.map(s => s.evaluationParameters.numDrills),
        title: "Number of Drills",
        unitPrefix: "",
        unitSuffix: "",
      },
      {
        values: scenarioData.map(s => s.extractionGeometry.bitDia),
        title: "Cutter Head Size",
        unitPrefix: "",
        unitSuffix: "m",
      },
      {
        title: "Commodity Price",
        values: scenarioData.map(s => s.metals.map((metal) => {
          return ({
            value: metal.price,
            name: metal.name
          })
        })) ,
        unitPrefix: "$",
      },
      ...(() => {
        const uniqueMetals = Array.from(
          new Set(scenarioData.flatMap(s => s.metals.map(metal => metal.name)))
        );
        
        return uniqueMetals.map(metalName => ({
          title: `${metalName} Mill Recovery`,
          values: scenarioData.map(s => {
            const metal = s.metals.find(m => m.name === metalName);
            return metal ? metal.streams.map(stream => ({
              value: stream.recovery,
              name: stream.name,
              unitSuffix: "%",
            })) : [];
          })
        }));
      })(),
      {
        values: scenarioData.map(s => s.parameters.processingCostPerTonne),
        title: "Processing Cost per Tonne",
      },
      {
        values: scenarioData.map(s => s.operational.holeInclinationMin),
        title: "Minimum Hole Inclination",
        unitSuffix: "°",
      },
      {
        values: scenarioData.map(s => s.operational.holeLengthMax),
        title: "Maximum Hole Length",
        unitSuffix: "m",
      },


    ]
  }

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
        numScenarios={scenarioData.length}
      />
    </div>
  )
}
export default ComparisonSection;