import { useEffect, useMemo } from "react";
import { formatHex } from "culori";
import { Root as DialogRoot } from "@radix-ui/react-dialog";
import Providers from "@/components/Providers";
import Sidebar from "@/components/Sidebar";
import ColorGrid from "@/components/ColorGrid";
import { useActionContext } from "@/components/Providers/ActionProvider";
import { roundTo } from "@/utils/math";
import { useSetGlobalColorVariables } from "@/hooks/use-set-global-color-variables";
import ExportDialog from "./components/ExportDialog";
import { generateColorNames } from "./utils/generate-color-names";
import s from "./app.module.css";

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

function App() {
  const { color } = useActionContext();

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

  const intergerNames = generateColorNames(spectrum.length);

  useSetLocalStorage(
    "keyColor",
    JSON.stringify({ ...color, keyIndex: lightnessArray.keyIndex })
  );

  useSetGlobalColorVariables(color.h, color.s);

  return (
    <DialogRoot>
      <main className={s.main}>
        <Sidebar keyIndex={lightnessArray.keyIndex} />
        <ColorGrid
          colors={spectrum}
          colorNames={intergerNames}
          numColors={color.numColors}
          keyIndex={lightnessArray.keyIndex}
        />
      </main>
      <ExportDialog colors={spectrum} names={intergerNames} />
    </DialogRoot>
  );
}

function Layout() {
  return (
    <Providers>
      <App />
    </Providers>
  );
}

export default Layout;

function createLinearDistribution(
  seed: number,
  length = 11,
  start = 0.1,
  end = 0.95,
  keyIndex = -1
): {
  range: number[];
  keyIndex: number;
} {
  const params = getDistributionParams(seed, start, end, length, keyIndex);

  const lowerSteps = params.keyIndex;
  const lowerStep = (params.keyValue - params.start) / lowerSteps;
  const upperSteps = length - 1 - params.keyIndex;
  const upperStep = (params.end - params.keyValue) / upperSteps;

  if (params.keyIndex === length - 1) {
    return {
      range: new Array(lowerSteps + 1).fill(0).map((_, i) => {
        return roundTo(params.start + i * lowerStep);
      }),
      keyIndex: params.keyIndex,
    };
  } else {
    const lowerArray = new Array(lowerSteps).fill(0).map((_, i) => {
      return roundTo(params.start + i * lowerStep);
    });

    const upperArray = new Array(upperSteps + 1).fill(0).map((_, i) => {
      return roundTo(params.keyValue + i * upperStep);
    });

    return {
      range: [...lowerArray, ...upperArray],
      keyIndex: params.keyIndex,
    };
  }
}

function getDistributionParams(
  keyValue: number,
  start = 0.9,
  end = 0.05,
  length = 11,
  keyIndex = -1
) {
  if (keyIndex >= 0) {
    return { keyValue, start, end, keyIndex };
  }

  if (keyValue >= start) {
    return { keyIndex: 0, start: keyValue, end, keyValue };
  } else if (keyValue <= end) {
    return { keyIndex: length - 1, start, end: keyValue, keyValue };
  } else {
    const step = (start - end) / (length - 1);
    const rawIndex = (start - keyValue) / step;
    const nextKeyIndex = Math.min(Math.floor(rawIndex), length - 2);

    return { keyIndex: nextKeyIndex, start, end, keyValue };
  }
}

function getSaturationValue(
  index: number,
  keyIndex: number,
  keySaturation: number
) {
  const minValue = Math.max(0, keySaturation - (keySaturation / 16) * keyIndex);
  const maxValue = keySaturation;

  const range = maxValue - minValue;
  if (keyIndex === 0 || index <= keyIndex) return maxValue;
  else return roundTo(maxValue - (range * (index - keyIndex)) / keyIndex, 4);
}

function useSetLocalStorage(key: string, value: string | number) {
  useEffect(() => {
    const currentValue = localStorage.getItem(key);
    if (currentValue === value) return;
    localStorage.setItem(key, value.toString());
  }, [key, value]);
}
