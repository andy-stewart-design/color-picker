import { ColorDefinition } from "@/types";
import { converter, formatRgb } from "culori";

const rgb = converter("rgb");

export function generateCSS(colors: ColorDefinition[], names: number[]) {
  const openingTag = ":where(html) {";
  const closingTag = "}";
  const formattedColors = colors.map((color) => {
    const RGB = rgb(color.hex);
    if (!RGB) throw new Error("hgg");
    return formatRgb(RGB);
  });

  const variables = formattedColors.map(
    (color, index) => `${space(3)}--color-primary-${names[index]}: ${color};`
  );

  return [openingTag, ...variables, closingTag].join("\n").trim();
}

// ---------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------
function space(amount: number) {
  return " ".repeat(amount);
}
