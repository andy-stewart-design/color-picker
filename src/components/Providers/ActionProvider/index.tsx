import {
  createContext,
  startTransition,
  useActionState,
  useContext,
  useMemo,
  type ReactNode,
} from "react";
import { formatHex } from "culori";
import { DEFAULT_VALUES } from "@/constants";
import { useFormContext } from "@/components/Providers/FormProvider";
import { createLinearDistribution, getSaturationValue } from "@/utils/color";
import { generateColorNames } from "@/utils/generate-color-names";
import { useSetLocalStorage } from "@/hooks/use-set-local-storage";
import { useSetGlobalColorVariables } from "@/hooks/use-set-global-color-variables";
import { colorReducer, type ColorAction, type ColorActionType } from "./action";
import type { ColorFormValues, ColorDefinition } from "@/App";

interface ColorActionContextProps {
  keyColor?: ColorFormValues;
  colors?: ColorDefinition[];
  colorNames?: number[];
  updateColor?: (type: ColorActionType) => void;
}

const ColorActionContext = createContext<ColorActionContextProps>({});

function ColorActionProvider({ children }: { children: ReactNode }) {
  const formRef = useFormContext();

  const [color, colorAction] = useActionState<ColorFormValues, ColorAction>(
    colorReducer,
    DEFAULT_VALUES
  );

  function updateColor(type: ColorActionType) {
    if (!formRef.current) return;
    const formData = new FormData(formRef.current);
    startTransition(() => {
      colorAction({ type, data: formData });
    });
  }

  const lightnessArray = useMemo(() => {
    return createLinearDistribution(
      color.l,
      color.numColors,
      0.9,
      0.05,
      color.keyIndex
    );
  }, [color]);

  const spectrum = useMemo(() => {
    return lightnessArray.range.map((value, index) => {
      const saturation = getSaturationValue(
        index,
        lightnessArray.keyIndex,
        color.s
      );

      const HSL = { h: color.h, s: saturation, l: value };

      return {
        ...HSL,
        hex: formatHex({ mode: "hsl", ...HSL }),
      };
    });
  }, [lightnessArray, color]);

  const colorNames = generateColorNames(spectrum.length);

  useSetLocalStorage(
    "keyColor",
    JSON.stringify({ ...color, keyIndex: lightnessArray.keyIndex })
  );

  useSetGlobalColorVariables(color.h, color.s);

  const keyColor = { ...color, keyIndex: lightnessArray.keyIndex };

  return (
    <ColorActionContext.Provider
      value={{ keyColor, colors: spectrum, colorNames, updateColor }}
    >
      {children}
    </ColorActionContext.Provider>
  );
}

function useActionContext() {
  const { keyColor, colors, colorNames, updateColor } =
    useContext(ColorActionContext);

  if (!keyColor || !updateColor || !colors || !colorNames) {
    throw new Error(
      "color, updateColor cannot be accessed outside of an ColorActionProvider"
    );
  }

  return { keyColor, colors, colorNames, updateColor };
}

export default ColorActionProvider;
// eslint-disable-next-line react-refresh/only-export-components
export { useActionContext };
