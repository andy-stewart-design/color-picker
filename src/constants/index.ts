import { ColorFormData } from "@/types";

const keyColor = getKeyColor();
const COLOR_MODE = "okhsl";

const DEFAULT_VALUES: ColorFormData = {
  hex: keyColor ? keyColor.hex : "dd44bb",
  h: keyColor ? keyColor.h : 338.14,
  s: keyColor ? keyColor.s : 0.84,
  l: keyColor ? keyColor.l : 0.59,
  numColors: keyColor ? keyColor.numColors : 11,
  keyIndex: keyColor ? keyColor.keyIndex : -1,
  saturationEase: keyColor?.saturationEase
    ? keyColor?.saturationEase
    : "easeIn",
  saturationFalloff: keyColor?.saturationFalloff
    ? keyColor?.saturationFalloff
    : 0.25,
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
