import { converter } from "culori";

const converterHSL = converter("hsl");

export function hsl(color: string) {
  const colorHSL = converterHSL(color);
  if (!colorHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorHSL;
  if (h === undefined) {
    return { h: 0, s, l, mode };
  }

  return { h, s, l, mode };
}
