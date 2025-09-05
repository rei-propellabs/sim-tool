import { OperationalOutputData } from "api/models/OutputData";

export const operationalOutput_mock: OperationalOutputData[] = [
  {
    gradeGramPerTonne: 5,
    LOMMoth: 14,
    extractionHoles: 10,
    totalLength: 1000,
    wasteMass: 500,
    oreMass: 1500,
    totalCommodityVolume: 2000,
    holeLength: {
      min: 10,
      max: 20,
      average: 15
    },
    holeInclination: {
      min: 30,
      max: 60,
      average: 45
    },
    numHoles: {
      "35-49": 2,
      "50-59": 3,
      "60-69": 4,
      "70-79": 1,
      "80-90": 0
    }
  },
  {
    gradeGramPerTonne: 6,
    LOMMoth: 14,
    extractionHoles: 12,
    totalLength: 1200,
    wasteMass: 600,
    oreMass: 1800,
    totalCommodityVolume: 2400,
    holeLength: {
      min: 12,
      max: 22,
      average: 17
    },
    holeInclination: {
      min: 32,
      max: 62,
      average: 47
    },
    numHoles: {
      "35-49": 3,
      "50-59": 4,
      "60-69": 5,
      "70-79": 2,
      "80-90": 1
    }
  },
  {
    gradeGramPerTonne: 7,
    LOMMoth: 14,
    extractionHoles: 14,
    totalLength: 1400,
    wasteMass: 700,
    oreMass: 2100,
    totalCommodityVolume: 2800,
    holeLength: {
      min: 14,
      max: 24,
      average: 19
    },
    holeInclination: {
      min: 34,
      max: 64,
      average: 49
    },
    numHoles: {
      "35-49": 4,
      "50-59": 5,
      "60-69": 6,
      "70-79": 3,
      "80-90": 2
    }
  }
]