import { SummaryTableType } from "types/SummaryTableType";
import * as XLSX from "xlsx";

export const exportToExcel = (tableData: SummaryTableType[], fileName: string) => {
  const workbook = XLSX.utils.book_new();

  const worksheet1 = tableToSheet(tableData[0])
  XLSX.utils.book_append_sheet(workbook, worksheet1, "Scenario 1");

  const worksheet2 = tableToSheet(tableData[1])
  XLSX.utils.book_append_sheet(workbook, worksheet2, "Scenario 2");

  const worksheet3 = tableToSheet(tableData[2])
  XLSX.utils.book_append_sheet(workbook, worksheet3, "Scenario 3");

  // This will trigger a download in browser
  XLSX.writeFile(workbook, `${fileName}.xlsx`);
};

const tableToSheet = (tableData: SummaryTableType) => {
  const headers = ["Year", ...tableData.columns];
  let sheetData: any[] = [];
  let merges: any[] = [];

  tableData.sections.forEach((section) => {
    sheetData.push([section.title]);

    merges.push({ s: { r: sheetData.length - 1, c: 0 }, e: { r: sheetData.length - 1, c: headers.length - 1 } });
    
    sheetData.push(["Year", ...tableData.columns])

    section.rows.map((row) => {
      sheetData.push(row.type === "currency" ? [row.label, ...row.values.map((v) => `$${v}`)] : [row.label, ...row.values]);
    });

    sheetData.push([]); // Empty row between sections
  })

  const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

  
  /** Stylings */
  worksheet["!merges"] = merges;

  // set the first column width
  worksheet["!cols"] = [{ wch: 30 }];

  return worksheet
}