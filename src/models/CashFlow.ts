export interface CashFlowRow {
  "Mining Cost": number
  "Total Processing Cost": number
  "Net Revenue": number
  "Period Beginning": number
  "Cumulative Net Cash": number
}

export interface CashFlowData {
  monthly: CashFlowRow[]
  quarterly: CashFlowRow[]
  annually: CashFlowRow[]
}

