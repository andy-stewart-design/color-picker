export interface ColorDefinition {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface ColorFormData extends ColorDefinition {
  numColors: number;
  keyIndex: number;
}
