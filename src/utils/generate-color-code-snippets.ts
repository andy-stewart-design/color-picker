import { ColorDefinition } from "@/types";
import { format } from "./culori";

export function generateCSS(colors: ColorDefinition[], names: number[]) {
  const openingTag = ":where(html) {";
  const closingTag = "}";
  const formattedColors = colors.map((color) => format(color.hex, "oklch"));

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
