export interface TableRow {
  label: string
  values: number[]
  type?: "currency" | "number"
}

export interface TableSection {
  title?: string
  rows: TableRow[]
}

export interface SummaryTableType {
  columns: string[]
  sections: TableSection[]
}
