// TODO: Fix Saturation Easing Types

import { createContext, useContext, type ReactNode } from "react";
import { formatHex } from "culori";
import { useActionContext } from "@/components/Providers/ActionProvider";
import { createLinearDistribution, getSaturationValue } from "@/utils/color";
import { generateColorNames } from "@/utils/generate-color-names";
import { useSetLocalStorage } from "@/hooks/use-set-local-storage";
import { useSetGlobalColorVariables } from "@/hooks/use-set-global-color-variables";
import { COLOR_MODE } from "@/constants";
import type { ColorDefinition, ColorFormData } from "@/types";

interface ColorContextProps {
  colorData?: ColorFormData;
  colors?: ColorDefinition[];
  colorNames?: number[];
}

const ColorContext = createContext<ColorContextProps>({});

function ColorProvider({ children }: { children: ReactNode }) {
  const { formData } = useActionContext();

  const lightnessArray = createLinearDistribution(
    formData.l,
    formData.numColors,
    0.9,
    0.05,
    formData.keyIndex
  );

  const spectrum = lightnessArray.range.map((value, index) => {
    const saturation = getSaturationValue(
      index,
      lightnessArray.keyIndex,
      formData.s,
      formData.numColors,
      { easing: formData.saturationEase, precision: 2 }
    );

    const HSL = { h: formData.h, s: saturation, l: value };
    return { ...HSL, hex: formatHex({ mode: COLOR_MODE, ...HSL }) };
  });

  const colorNames = generateColorNames(spectrum.length);
  const updatedFormData = { ...formData, keyIndex: lightnessArray.keyIndex };

  useSetLocalStorage(
    "keyColor",
    JSON.stringify({ ...formData, keyIndex: lightnessArray.keyIndex })
  );

  useSetGlobalColorVariables(formData.h, formData.s);

  return (
    <ColorContext.Provider
      value={{ colorData: updatedFormData, colors: spectrum, colorNames }}
    >
      {children}
    </ColorContext.Provider>
  );
}

function useColorContext() {
  const { colorData, colors, colorNames } = useContext(ColorContext);

  if (!colorData || !colors || !colorNames) {
    throw new Error(
      "Color context values cannot be accessed outside of an ColorProvider"
    );
  }

  return { colorData, colors, colorNames };
}

export default ColorProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useColorContext };
