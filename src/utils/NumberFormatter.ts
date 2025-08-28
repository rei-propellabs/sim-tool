export function formatNumberWithAbbreviation(value: number,
  decimals: number = 1) {
  if (value >= 1_000_000_000) {
    return (value / 1_000_000_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "B";
  } else if (value >= 1_000_000) {
    return (value / 1_000_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "M";
  } else if (value >= 10_000) {
    return (value / 1_000).toLocaleString(undefined, { maximumFractionDigits: decimals }) + "K";
  } else {
    return value.toLocaleString();
  }
}