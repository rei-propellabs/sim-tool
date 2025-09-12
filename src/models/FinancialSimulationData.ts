import { CashflowEntry } from "api/models/ScenarioData";
import { CashFlowData } from "./CashFlow";

export interface FinancialSimulationData {
  title: string,
  cashFlow?: {
    yearly: CashflowEntry[];
    quarterly: CashflowEntry[];
    monthly: CashflowEntry[];
  }

}
