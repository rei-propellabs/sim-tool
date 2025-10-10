import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import styles from './MonthlySummarySection.module.css';
import SummaryTable from "./SummaryTable/SummaryTable";
import { exportToExcel } from "./ExportToExcel";
import { SummaryTableType } from "types/SummaryTableType"
import { Financial } from "api/models/ScenarioData";

interface MonthlySummarySectionProps {
  scenarioTitle: string;
  scenarioData: any[];
  scenarioIdx: number;
}

const MonthlySummarySection: React.FC<MonthlySummarySectionProps> = ({ scenarioTitle, scenarioData, scenarioIdx }) => {

  const parseData = (financial: Financial) => {
    if (!financial) return;

    // Get unique metal names from the first month
    const uniqueMetals = financial.monthly[0]?.metals?.map(metal => metal.name) || [];

    // Create revenue and sold rows for each metal in the specified order
    const metalRows = uniqueMetals.flatMap(metalName => [
      // Revenue row for this metal
      {
        label: `Revenue from ${metalName}`,
        values: [null, ...financial.monthly.map(month => {
          const metal = month.metals.find(m => m.name === metalName);
          return metal ? metal.revenue : 0;
        })],
        type: "currency" as const,
      },
      // Sold row for this metal
      {
        label: `${metalName} Sold`,
        values: [null, ...financial.monthly.map(month => {
          const metal = month.metals.find(m => m.name === metalName);
          return metal ? metal.sold : 0;
        })],
        type: "currency" as const,
      }
    ]);

    const uniqueStreams = financial.monthly[0]?.streams?.map(s => s.name) || [];
    const streamProcessingCostRows = uniqueStreams.flatMap(streamName => [
      // Revenue row for this metal
      {
        label: `${streamName} Processing Cost`,
        values: [null, ...financial.monthly.map(month => {
          const stream = month.streams.find(s => s.name === streamName);
          return stream ? stream.processingCost : 0;
        })],
        type: "currency" as const,
      },
    ],
    );

    const streamTonnesProcessedRows = uniqueStreams.flatMap(streamName => [
      // Revenue row for this metal
      {
        label: `${streamName} Processed (Tonnes)`,
        values: [null, ...financial.monthly.map(month => {
          const stream = month.streams.find(s => s.name === streamName);
          return stream ? stream.tonnesProcessed : 0;
        })],
        type: "number" as const,
      },
    ],
    );

    const tableData: SummaryTableType = {
      columns: ["0", ...financial.monthly.map(month => month.month.toString())],
      sections: [
        {
          title: "Project Summary by Month",
          rows: [
            {
              label: "Revenue",
              values: [null, ...financial.monthly.map(item => item.totalRevenue)],
              type: "currency",
            },
            ...metalRows, // Add all the metal revenue and sold rows here
            {
              label: "Mining Cost",
              values: [null, ...financial.monthly.map(item => item.miningCost)],
              type: "currency",
            },
            {
              label: "Total Material Mined (Tonnes)",
              values: [null, ...financial.monthly.map(item => item.tonnesMined)],
              type: "number",
            },
            {
              label: "Total Processing Cost",
              values: [null, ...financial.monthly.map(item => item.totalProcessingCost)],
              type: "currency",
            },
            ...streamProcessingCostRows,
            ...streamTonnesProcessedRows,
            {
              label: "Capex",
              values: [financial.capex, ...financial.monthly.map(() => financial.capex)],
              type: "currency",
            },
            {
              label: "Net Cash Flow",
              values: [null, ...financial.monthly.map(item => item.netCashFlow)],
              type: "currency",
            }
          ],
        },
      ]
    }

    return tableData;
  }

  const scenarioTableData = scenarioData
    .map(scenario => scenario?.financial ? parseData(scenario.financial) : undefined)
    .filter(Boolean).filter((s): s is SummaryTableType => s !== undefined);

  const fileName = "SummaryTable";

  return (
    <div className={finSimStyles.sectionContainer} style={{ minHeight: "auto" }}>
      <div className={styles.headerContainer}>
        <div className={finSimStyles.heading}>
          <div className={finSimStyles.left}>
            <div className={finSimStyles.scenarioLabel}>{scenarioTitle}</div>
            <div className={finSimStyles.title}>Project Summary by Month</div>
          </div>
          <div className={finSimStyles.right}>
            <button onClick={() => exportToExcel(scenarioTableData, fileName)} className={"primary-button"}>
              <Download size={18} color={"var(--primary-button-text)"} />
              Download</button>

          </div>
        </div>
        </div>
        <div style={{ 
          position: 'relative',
          width: '100vw',
          paddingLeft: 'calc((100% - 1020px) / 2)',
          marginTop: '24px'
        }}>
          <SummaryTable 
            marginRight='calc((100vw - 1020px) / 2)'
            columns={scenarioTableData[scenarioIdx].columns} 
            sections={scenarioTableData[scenarioIdx].sections} />
        </div>
      
    </div>
  )

}
export default MonthlySummarySection;