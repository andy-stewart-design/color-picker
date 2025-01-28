import { createContext, useContext, type ReactNode } from "react";
import { formatHex } from "culori";
import { useActionContext } from "@/components/Providers/ActionProvider";
import { createLinearDistribution, getSaturationValue } from "@/utils/color";
import { generateColorNames } from "@/utils/generate-color-names";
import { useSetLocalStorage } from "@/hooks/use-set-local-storage";
import { useSetGlobalColorVariables } from "@/hooks/use-set-global-color-variables";
import type { ColorDefinition, ColorFormValues } from "@/App";

interface ColorContextProps {
  colorFormData?: ColorFormValues;
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
      formData.s
    );

    const HSL = { h: formData.h, s: saturation, l: value };
    return { ...HSL, hex: formatHex({ mode: "hsl", ...HSL }) };
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
      value={{ colorFormData: updatedFormData, colors: spectrum, colorNames }}
    >
      {children}
    </ColorContext.Provider>
  );
}

function useColorContext() {
  const { colorFormData, colors, colorNames } = useContext(ColorContext);

  if (!colorFormData || !colors || !colorNames) {
    throw new Error(
      "Color context values cannot be accessed outside of an ColorProvider"
    );
  }

  return { colorFormData, colors, colorNames };
}

export default ColorProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useColorContext };
