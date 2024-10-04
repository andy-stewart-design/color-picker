import { roundTo } from "@/utils/math";

const DEFAULT_VALUES = {
  hex: "43c5ef",
  h: roundTo(194.65116279069767, 2),
  s: roundTo(0.8431372549019608, 2),
  l: roundTo(0.6, 2),
  numColors: 11,
};

const CARD_IDS = Array.from({ length: 23 }, () => crypto.randomUUID());

export { DEFAULT_VALUES, CARD_IDS };
