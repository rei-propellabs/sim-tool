export function getMetricBgClasses(values: number[], higherIsBetter: boolean): string[] {
  const good = "var(--good-metrics)";
  const bad = "var(--bad-metrics)";
  const medium = "var(--medium-metrics)";
  const none = "transparent";

  // If only one value, return none
  if (values.length === 1) return [none];

  // If two values
  if (values.length === 2) {
    const [val1, val2] = values;
    // If both values are the same, return none for both
    if (val1 === val2) return [none, none];
    
    // Otherwise, assign good/bad based on higherIsBetter
    if (higherIsBetter) {
      return val1 > val2 ? [good, bad] : [bad, good];
    } else {
      return val1 < val2 ? [good, bad] : [bad, good];
    }
  }

  // For three or more values, use original logic
  if (values.length !== 3) return values.map(() => medium); // fallback

  const min = Math.min(...values);
  const max = Math.max(...values);

  // Count how many times min and max appear
  const minCount = values.filter(v => v === min).length;
  const maxCount = values.filter(v => v === max).length;

  // If all values are the same
  if (min === max) return values.map(() => "transparent");

  // If two values are the same
  if (minCount === 2 || maxCount === 2) {
    return values.map(v => {
      if (higherIsBetter) {
        if (v === max) return maxCount === 2 ? medium : good;
        if (v === min) return minCount === 2 ? medium : bad;
      } else {
        if (v === min) return minCount === 2 ? medium : good;
        if (v === max) return maxCount === 2 ? medium : bad;
      }
      return medium;
    });
  }

  // All values are different
  return values.map(v => {
    if (higherIsBetter) {
      if (v === max) return good;
      if (v === min) return bad;
      return medium;
    } else {
      if (v === min) return good;
      if (v === max) return bad;
      return medium;
    }
  });
}

export function getValuesRelativeToMax(values: number[]): number[] {
  const max = Math.max(...values);
  if (max === 0) return values.map(() => 0);

  return values.map(v => ((v / max)));
}