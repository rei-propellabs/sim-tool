import React from "react"
import styles from "./SummaryTable.module.css"

export interface TableRow {
  label: string
  values: (string | number)[]
  type?: "currency" | "number" | "header"
}

export interface TableSection {
  title?: string
  rows: TableRow[]
}

export interface FinancialDataTableProps {
  columns: string[]
  sections: TableSection[]
}

const formatValue = (value: string | number, type?: string): string => {
  if (typeof value === "string") return value

  switch (type) {
    case "currency":
      return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    case "number":
      return new Intl.NumberFormat("en-US").format(value)
    default:
      return value.toString()
  }
}

export default function SummaryTable({ columns, sections }: FinancialDataTableProps) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <tbody>
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={sectionIndex}>
              {section.title && (
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>{section.title}</th>
                  {columns.map((column, index) => (
                    <th key={index} className={styles.headerCell}>
                      {column}
                    </th>
                  ))}
                </tr>
              )}
              {section.rows.map((row, rowIndex) => (
                <tr key={rowIndex} className={styles.dataRow}>
                  <td className={styles.labelCell}>{row.label}</td>
                  {row.values.map((value, valueIndex) => (
                    <td key={valueIndex} className={styles.dataCell}>
                      {formatValue(value, row.type)}
                    </td>
                  ))}
                </tr>
              ))}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  )
}
