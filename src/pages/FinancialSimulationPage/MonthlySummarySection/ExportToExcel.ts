import { SummaryTableType } from "types/SummaryTableType";
import * as XLSX from "xlsx";

export const exportToExcel = async (tableData: SummaryTableType[] | null, fileName: string) => {
  if (!tableData || tableData.length === 0) return;
  
  const workbook = XLSX.utils.book_new();

  
  // const metricsData = {
  //   "  Total Project Cost": "$500,000",
  //   "  Initial Capital": "$300,000",
  // };

  tableData.forEach((table, index) => {
    const worksheet = tableToSheet(table)
    XLSX.utils.book_append_sheet(workbook, worksheet, `Scenario ${index + 1}`);
  })

  // This will trigger a download in browser
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const tableToSheet = (tableData: SummaryTableType, metricsData?: Record<string, any>) => {
  const headers = ["Month", ...tableData.columns];
  let sheetData: any[] = [];
  let merges: any[] = [];

  // Add PROJECT OPERATING METRICS table if provided
  if (metricsData) {
    // Title row, merged across two columns
    sheetData.push(["PROJECT OPERATING METRICS"]);
    merges.push({ s: { r: 0, c: 0 }, e: { r: 0, c: 1 } });

    // Each metric as a row
    Object.entries(metricsData).forEach(([label, value]) => {
      sheetData.push([label, value]);
    });

    // Empty row after metrics table
    sheetData.push([]);
  }

  // ...existing code for summary table...
  const startRow = sheetData.length; // For correct merge indices below

  tableData.sections.forEach((section) => {
    sheetData.push([section.title]);
    merges.push({ s: { r: sheetData.length - 1, c: 0 }, e: { r: sheetData.length - 1, c: headers.length - 1 } });
    sheetData.push(["Month", ...tableData.columns]);
    section.rows.map((row) => {
      const rowValues = row.values.map((v) => (v === null || v === undefined) ? "" : (row.type === "currency" ? `$${v}` : v));
      sheetData.push([row.label, ...rowValues]);
    });
    sheetData.push([]);
  });

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  worksheet["!merges"] = merges;
  worksheet["!cols"] = [{ wch: 30 }];

  return worksheet;
};


