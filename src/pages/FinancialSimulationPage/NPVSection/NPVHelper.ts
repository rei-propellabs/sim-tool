import { CashflowEntry, CashflowSet } from "api/models/ScenarioData";
import { CashFlowData, CashFlowRow } from "models/CashFlow"
import * as XLSX from 'xlsx'

export interface ChartData {
  month: string;
  revenue: number;
  miningCost: number;
  processingCost: number;
  cumulativeNetCash: number;
}

function formatMonth(date: Date): string {
  const month = date.toLocaleString("en-US", { month: "short", timeZone: "UTC" })
  const year = date.toLocaleString("en-US", { year: "2-digit", timeZone: "UTC" })
  return `${month} '${year}`
}

function isPrime(n: number): boolean {
  if (n < 2) return false
  for (let i = 2; i <= Math.sqrt(n); i++) {
    if (n % i === 0) return false
  }
  return true
}

function findDivisor(n: number, max: number): number {
  for (let d = 2; d <= n; d++) {
    if (n % d === 0 && n / d <= max) return d
  }
  return n // fallback, shouldn't happen if prime check is used
}

export function getYAxisTicksAndDomain(chartData: ChartData[]) {
  if (!chartData.length) {
    return { ticks: [], domain: [0, 0] }
  }

  // Find the highest cumulative net cash
  const maxCumulativeNetCash = Math.max(...chartData.map(d => d.cumulativeNetCash))

  // Find the lowest sum of miningCost + processingCost for any entry
  const minCost = Math.min(...chartData.map(d => d.miningCost + d.processingCost))

  // Find the lowest value among minCost and 0 (to always include 0)
  const minValue = Math.min(minCost, 0)
  const maxValue = Math.max(maxCumulativeNetCash, 0)

  // Round up to nearest 10 million
  const ceil10M = (n: number) => Math.ceil(n / 10_000_000) * 10_000_000
  const floor10M = (n: number) => Math.floor(n / 10_000_000) * 10_000_000

  const domainMin = floor10M(minValue)
  const domainMax = ceil10M(maxValue)

  // Generate ticks every 10 million
  const ticks: number[] = []
  for (let t = domainMin; t <= domainMax; t += 10_000_000) {
    ticks.push(t)
  }

  return { ticks, domain: [domainMin, domainMax] }
}

export function cashFlowToChartData(cashFlowData: CashflowSet): ChartData[] {
  let data: CashflowEntry[] = cashFlowData.monthly
  let label = "monthly"

  // Step 1: Choose the right data granularity
  for (let key of ["monthly", "quarterly", "yearly"] as const) {
    const arr = cashFlowData[key]
    if (arr.length > 20 && isPrime(arr.length)) {
      if (key === "yearly") {
        data = arr
        label = key
        break
      }
      // try next granularity
      continue
    }
    if (arr.length > 20 && !isPrime(arr.length)) {
      data = arr
      label = key
      break
    }
    if (arr.length <= 20) {
      data = arr
      label = key
      break
    }
  }

  // Step 2: Group if needed
  let grouped: CashflowEntry[] = []
  if (data.length > 20) {
    const divisor = findDivisor(data.length, 20)
    const groupSize = divisor
    for (let i = 0; i < data.length; i += groupSize) {
      const group = data.slice(i, i + groupSize)
      // Combine values
      const first = group[0]
      grouped.push({
        ...first,
        miningCost: group.reduce((sum, row) => sum + (row.miningCost ?? 0), 0),
        totalProcessingCost: group.reduce((sum, row) => sum + (row.totalProcessingCost ?? 0), 0),
        grossRevenue: group.reduce((sum, row) => sum + (row.grossRevenue ?? 0), 0),
        netRevenue: group.reduce((sum, row) => sum + (row.netRevenue ?? 0), 0),
        periodBeginning: first.periodBeginning,
      })
    }
  } else {
    grouped = data
  }

  // Step 3: Convert to ChartData and calculate cumulativeNetCash
  let cumulative = 0
  const chartData: ChartData[] = grouped.map(row => {
    // Convert Excel date (number) to JS Date
    const date = typeof row.periodBeginning === "number"
      ? (() => {
          const parsed = (XLSX as any).SSF.parse_date_code(row.periodBeginning)
          return parsed
            ? new Date(Date.UTC(parsed.y, parsed.m - 1, parsed.d))
            : new Date(0)
        })()
      : new Date(row.periodBeginning ?? 0)

    const revenue = row.grossRevenue ?? 0
    const miningCost = -Math.abs(row.miningCost ?? 0)
    const processingCost = -Math.abs(row.totalProcessingCost ?? 0)
    cumulative += row.netRevenue ?? 0

    return {
      month: formatMonth(date),
      revenue,
      miningCost,
      processingCost,
      cumulativeNetCash: cumulative,
    }
  })

  return chartData
}

export function getTotalValues(cashFlowData: CashflowSet) {
  const data = cashFlowData.monthly
  const totalGrossRevenue = data.reduce((sum, row) => sum + (row.grossRevenue ?? 0), 0)
  const totalMiningCost = data.reduce((sum, row) => sum + (row.miningCost ?? 0), 0)
  const totalProcessingCost = data.reduce((sum, row) => sum + (row.totalProcessingCost ?? 0), 0)
  return {
    totalGrossRevenue,
    totalMiningCost,
    totalProcessingCost,
  }
}