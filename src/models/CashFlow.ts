export interface CashFlowRow {
  "Mining Cost": number
  "Total Processing Cost": number
  "Net Revenue": number
  "Period Beginning": number
  [key: string]: any // just in case I need other data
}

export interface CashFlowData {
  monthly: CashFlowRow[]
  quarterly: CashFlowRow[]
  annually: CashFlowRow[]
}

