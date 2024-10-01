export function roundTo(num: number, digits = 3): number {
  return Number(num.toFixed(digits));
}
