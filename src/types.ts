export interface ColorDefinition {
  hex: string;
  h: number;
  s: number;
  l: number;
}

export interface ColorFormValues extends ColorDefinition {
  numColors: number;
  keyIndex: number;
}
