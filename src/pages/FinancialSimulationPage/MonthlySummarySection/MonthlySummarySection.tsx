import { Download } from "images/Dynamic/Download";
import finSimStyles from '../FinancialSimulationPage.module.css';
import SummaryTable from "../SummaryTable/SummaryTable";


interface MonthlySummarySectionProps {
  data: any;
  scenario: string;
}
const tableData = {
  columns: ["-1", "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"],
  sections: [
    {
      title: "Project Summary by Year",
      rows: [
        {
          label: "Production in Tonnes",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Production in Oz",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Meters Drilled",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Holes",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Revenue",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Operating Cost",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Operating Income",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "CAPEX",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
        {
          label: "Project FCF*",
          values: [123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123, 123],
          type: "number" as const,
        },
      ],
    },
    {
      title: "Unit Economics / Tonne",
      rows: [
        {
          label: "Revenue",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "Mining Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "Operating Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "All-In Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
      ],
    },
    {
      title: "Unit Economics / Oz",
      rows: [
        {
          label: "Revenue",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "Mining Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "Operating Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
        {
          label: "All-In Cost",
          values: [123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456, 123456],
          type: "currency" as const,
        },
      ],
    },
  ],
}

const MonthlySummarySection: React.FC<MonthlySummarySectionProps> = ({ data, scenario }) => {
  return (
    <div className={finSimStyles.sectionContainer}>

      <div className={finSimStyles.heading}>
        <div className={finSimStyles.left}>
          <div className={finSimStyles.scenarioLabel}>{scenario}</div>
          <div className={finSimStyles.title}>Project Summary by Month</div>
        </div>
        <div className={finSimStyles.right}>
          <button className={"primary-button"}>
            <Download size={18} color={"var(--primary-button-text)"} />
            Download</button>
        </div>
      </div>
      <SummaryTable columns={tableData.columns} sections={tableData.sections} />

    </div>
  )

}
export default MonthlySummarySection;