import { ColorDefinition } from "@/App";

export function generateCSS(colors: ColorDefinition[], names: number[]) {
  const openingTag = ":where(html) {";
  const closingTag = "}";
  const variables = colors.map(
    (color, index) =>
      `${space(3)}--color-primary-${names[index]}: ${color.hex};`
  );

  return [openingTag, ...variables, closingTag].join("\n").trim();
}

// ---------------------------------------------------------------
// HELPER FUNCTIONS
// ---------------------------------------------------------------
function space(amount: number) {
  return " ".repeat(amount);
}
