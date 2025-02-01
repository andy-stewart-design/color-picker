import { EasingOption } from "./utils/interpolate";

export interface ColorDefinition {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface ColorFormData extends ColorDefinition {
  numColors: number;
  keyIndex: number;
  saturationEase: EasingOption;
}
