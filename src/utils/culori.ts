import { converter } from "culori";

type ColorMode = "hex" | "rgb" | "hsl" | "oklch";

// TODO: figure out why okhsl makes the colors go crazy
const converterOKHSL = converter("okhsl");
const converterHSL = converter("hsl");
const converterRGB = converter("rgb");
const converterOKLCH = converter("oklch");

function hsl(color: string) {
  const colorHSL = converterHSL(color);
  const colorOKHSL = converterOKHSL(color);
  console.log("colorHSL", colorHSL);
  console.log("colorOKHSL", colorOKHSL?.l);
  console.log("okhsl index:", findStepIndex(colorOKHSL?.l ?? 0));

  if (!colorOKHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorOKHSL;
  if (h === undefined) {
    return { h: 0, s, l, mode };
  }

  return { h, s, l, mode };
}

function format(color: string, mode: ColorMode = "rgb") {
  if (mode === "rgb") {
    const rgb = converterRGB(color);
    if (!rgb) throw new Error(`Invalid color: ${color}`);
    const r = Math.floor(rgb.r * 255);
    const g = Math.floor(rgb.g * 255);
    const b = Math.floor(rgb.b * 255);
    return `rgb(${r} ${g} ${b})`;
  } else if (mode === "hsl") {
    const hsl = converterHSL(color);
    if (!hsl) throw new Error(`Invalid color: ${color}`);
    const h = Math.floor(hsl.h ?? 0);
    const s = Math.floor(hsl.s * 100);
    const l = Math.floor(hsl.l * 100);
    return `hsl(${h} ${s}% ${l}%)`;
  } else if (mode === "oklch") {
    const oklch = converterOKLCH(color);
    if (!oklch) throw new Error(`Invalid color: ${color}`);
    const l = (oklch.l * 100).toFixed(2);
    const c = oklch.c.toFixed(3);
    const h = Math.floor(oklch.h ?? 0);
    return `oklch(${l}% ${c} ${h})`;
  } else {
    return color;
  }
}

export { hsl as hsl, format };

function findStepIndex(
  keyValue: number,
  start: number = 0.9,
  end: number = 0.05,
  steps: number = 11
): number {
  // Calculate step size
  const stepSize = (end - start) / (steps - 1);

  // Calculate the relative position of the key value
  const position = (keyValue - start) / stepSize;

  // Round to nearest index
  return Math.round(position);
}
