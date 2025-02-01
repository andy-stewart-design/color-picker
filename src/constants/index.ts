import { ColorFormData } from "@/types";
import { roundTo } from "@/utils/math";

const keyColor = getKeyColor();
const COLOR_MODE = "okhsl";

const DEFAULT_VALUES: ColorFormData = {
  hex: keyColor ? keyColor.hex : "43c5ef",
  h: keyColor ? keyColor.h : roundTo(194.65116279069767, 2),
  s: keyColor ? keyColor.s : roundTo(0.8431372549019608, 2),
  l: keyColor ? keyColor.l : roundTo(0.6, 2),
  numColors: keyColor ? keyColor.numColors : 11,
  keyIndex: keyColor ? keyColor.keyIndex : -1,
  saturationEase: "easeOut",
};

const CARD_IDS = Array.from({ length: 23 }, () => crypto.randomUUID());
const GRID_ROWS = Array.from({ length: 23 }, () => ({
  id: crypto.randomUUID(),
}));

export { DEFAULT_VALUES, CARD_IDS, GRID_ROWS, COLOR_MODE };

// -------------------------------------------------------
// HELPER FUNCTIONS
// -------------------------------------------------------

function getKeyColor() {
  const keyColorRaw = localStorage.getItem("keyColor");
  return keyColorRaw ? (JSON.parse(keyColorRaw) as ColorFormData) : undefined;
}
