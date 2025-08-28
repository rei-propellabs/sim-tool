

export interface FinancialOutputData {
  revenue: number;
  netCashFlow: number;
  capex: number;
  miningCost: number;
  processingCostOre: number;
  processingCostWaste: number;
  totalProcessingCost: number;
  allInCostTonne: number;
  aisc: number;
  allInCostMeter: number;
  revenueMeter: number;
  cashFlowMeter: number;
}

export interface OperationalOutputData {
  gradeGramPerTonne: number;
  LOMMoth: number;
  extractionHoles: number;
  totalLength: number;
  wasteMass: number;
  oreMass: number;
  totalCommodityVolume: number;
  holeLength: {
    min: number;
    max: number;
    average: number;
  },
  holeInclination: {
    min: number;
    max: number;
    average: number;
  },
  numHoles: {
    "35-49": number;
    "50-59": number;
    "60-69": number;
    "70-79": number;
    "80-90": number;
  }

}