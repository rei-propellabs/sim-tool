import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import SummaryTable from "./SummaryTable/SummaryTable";
import { exportToExcel } from "./ExportToExcel";
import { SummaryTableType } from "types/SummaryTableType"

interface MonthlySummarySectionProps {
  data: any;
  scenario: string;
}
const tableData: SummaryTableType = {
  columns: ["-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  sections: [
    {
      title: "Project Summary by Year",
      rows: [
        {
          label: "Production in Tonnes",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number",
        },
        {
          label: "Production in Oz",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number",
        },
        {
          label: "Meters Drilled",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number",
        },
        {
          label: "Holes",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number",
        },
        {
          label: "Revenue",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "currency",
        },
        {
          label: "Operating Cost",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "currency",
        },
        {
          label: "Operating Income",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "currency",
        },
        {
          label: "CAPEX",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "currency",
        },
        {
          label: "Project FCF*",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "currency",
        },
      ],
    },
    {
      title: "Unit Economics / Tonne",
      rows: [
        {
          label: "Revenue",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "Mining Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "Operating Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "All-In Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
      ],
    },
    {
      title: "Unit Economics / Oz",
      rows: [
        {
          label: "Revenue",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "Mining Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "Operating Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
        {
          label: "All-In Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency",
        },
      ],
    },
  ],
}

const scenarioTableData = [tableData, tableData, tableData]
const fileName = "SummaryTable"

const MonthlySummarySection: React.FC<MonthlySummarySectionProps> = ({ data, scenario }) => {
  return (
    <div className={finSimStyles.sectionContainer}>

      <div className={finSimStyles.heading}>
        <div className={finSimStyles.left}>
          <div className={finSimStyles.scenarioLabel}>{scenario}</div>
          <div className={finSimStyles.title}>Project Summary by Year</div>
        </div>
        <div className={finSimStyles.right}>
          <button onClick={() => exportToExcel(scenarioTableData, fileName)} className={"primary-button"}>
            <Download size={18} color={"var(--primary-button-text)"} />
            Download</button>

        </div>
      </div>
      <SummaryTable columns={tableData.columns} sections={tableData.sections} />

    </div>
  )

}
export default MonthlySummarySection;