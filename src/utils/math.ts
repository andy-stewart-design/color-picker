// export function roundTo(num: number, digits = 3): number {
//   return Number(num.toFixed(digits));
// }

function roundTo(value: number, precision: number = 3): number {
  const multiplier = Math.pow(10, precision);
  return Math.round(value * multiplier) / multiplier;
}

export { roundTo };
