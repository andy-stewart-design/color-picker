import { useEffect } from "react";
import { formatHex } from "culori";
import { COLOR_MODE } from "@/constants";

function useSetGlobalColorVariables(hue: number, saturation: number) {
  useEffect(() => {
    const style = formatCSSVariables(hue, saturation);
    Object.keys(style).forEach((property) => {
      document.documentElement.style.setProperty(property, style[property]);
    });
  }, [hue, saturation]);
}

function formatCSSVariables(h: number, s: number) {
  const mode = COLOR_MODE;

  return {
    "--color-neutral-100": formatHex({ mode, h, s: 0.1, l: 0.95 }),
    "--color-neutral-900": formatHex({ mode, h, s: 0.1, l: 0.1 }),
    "--color-primary-100": formatHex({ mode, h, s, l: 0.95 }),
    "--color-primary-200": formatHex({ mode, h, s, l: 0.8 }),
    "--color-primary-500": formatHex({ mode, h, s, l: 0.5 }),
    "--color-primary-900": formatHex({ mode, h, s, l: 0.1 }),
    "--color-primary-saturated": formatHex({ mode, h, s: 0.9, l: 0.5 }),
    "--color-primary-desaturated": formatHex({ mode, h, s: 0.1, l: 0.5 }),
  } as Record<string, string>;
}

export { useSetGlobalColorVariables };
