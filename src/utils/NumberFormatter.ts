export function formatNumberWithAbbreviation(value: number, decimals: number = 1) {
  if (value == undefined || value === null || Number.isNaN(value)) return undefined;
  
  const absValue = Math.abs(value);
  const sign = value < 0 ? "-" : "";
  if (absValue >= 1_000_000_000) {
    return sign + (absValue / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "B";
  } else if (absValue >= 1_000_000) {
    return sign + (absValue / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "M";
  } else if (absValue >= 10_000) {
    return sign + (absValue / 1_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "K";
  } else {
    return value.toLocaleString(undefined, { maximumFractionDigits: decimals })
  }
}