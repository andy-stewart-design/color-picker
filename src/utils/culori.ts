import { converter } from "culori";

type ColorMode = "hex" | "rgb" | "hsl" | "oklch";

// TODO: figure out why okhsl makes the colors go crazy
const converterOKHSL = converter("okhsl");
const converterHSL = converter("hsl");
const converterRGB = converter("rgb");
const converterOKLCH = converter("oklch");

function okhsl(color: string) {
  const colorHSL = converterHSL(color);
  const colorOKHSL = converterOKHSL(color);
  console.log("colorHSL", colorHSL);
  console.log("converterOKHSL", colorOKHSL);
  console.log("diff", getDistanceFromWhite(color));

  if (!colorHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorHSL;
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

export { okhsl as hsl, format };

function getDistanceFromWhite(hexColor: string): number {
  // Remove '#' if present and convert to uppercase
  const hex = hexColor.replace("#", "").toUpperCase();

  // Validate hex color format
  if (!/^[0-9A-F]{6}$/.test(hex)) {
    throw new Error(
      'Invalid hex color format. Expected format: "#FFFFFF" or "FFFFFF"'
    );
  }

  // Convert hex to RGB
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  // Calculate Euclidean distance from white (255, 255, 255)
  const distance = Math.sqrt(
    Math.pow(255 - r, 2) + Math.pow(255 - g, 2) + Math.pow(255 - b, 2)
  );

  // Maximum possible distance is from white to black: sqrt(3 * 255^2) ≈ 441.67
  const MAX_DISTANCE = Math.sqrt(3 * Math.pow(255, 2));

  // Normalize to 0-1 range
  return distance / MAX_DISTANCE;
}
