export interface ScenarioData {
  id: number
  timeHorizonData: number[]
  keyAssumptions: {
    cutterHeadSize: string
    change?: string
  }
  financials: {
    revenue: number
    miningCost: number
    totalProcessingCost: number
    netCashFlow: number
  }
  operational: {
    lifeOfMine: string
    extractionHoles: number
    totalLength: string
    oreMass: string
    grade: string
  }
  holeLength: {
    min: number
    max: number
    avg: number
  }
  holeInclination: {
    min: number
    max: number
    avg: number
  }
  quantityOfHoleInclinations: {
    ranges: string[]
    values: number[]
  }
}
