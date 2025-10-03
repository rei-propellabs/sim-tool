import React from "react"
import styles from "./SummaryTable.module.css"
import { SummaryTableType } from "types/SummaryTableType"


const formatValue = (value: string | number | null, type?: string): string => {
  if (value === null) return "-"
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

export default function SummaryTable({ columns, sections }: SummaryTableType) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <tbody>
          {sections.map((section, sectionIndex) => (
            <React.Fragment key={`stsection-${sectionIndex}`}>
              {section.title && (
                <tr className={styles.headerRow}>
                  <th className={styles.headerCell}>{section.title}</th>
                  {columns.map((column, index) => (
                    <th key={`stheader-${sectionIndex}-${index}`} className={styles.headerCell}>
                      {column}
                    </th>
                  ))}
                </tr>
              )}
              {section.rows.map((row, rowIndex) => (
                <tr key={`strow-${sectionIndex}-${rowIndex}`} className={styles.dataRow}>
                  <td className={styles.labelCell}>{row.label}</td>
                  {row.values.map((value, valueIndex) => (
                    <td key={`stcell-${sectionIndex}-${rowIndex}-${valueIndex}`} className={styles.dataCell}>
                      {(value === undefined || value === null) ? "-" : formatValue(value, row.type)}
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
