import { useActionState, useEffect, useMemo } from "react";
import { formatHex } from "culori";
import Providers from "./components/Providers";
import ColorForm from "./components/ColorForm";
import ColorGrid from "./components/ColorGrid";
import { hsl } from "@/utils/culori";
import { roundTo } from "@/utils/math";
import { compareObjects } from "@/utils/object";
import { DEFAULT_VALUES } from "@/constants";
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
  const [formValue, formAction] = useActionState<ColorFormValues, FormData>(
    handleSubmit,
    DEFAULT_VALUES
  );

  const lightnessArray = useMemo(() => {
    return createLinearDistribution(
      formValue.l,
      formValue.numColors,
      0.9,
      0.05,
      formValue.keyIndex
    );
  }, [formValue]);

  const spectrum = useMemo(() => {
    return lightnessArray.range.map((value, index) => {
      const saturation = getSaturationValue(
        index,
        lightnessArray.keyIndex,
        formValue.s
      );

      const HSL = { h: formValue.h, s: saturation, l: value };

      return {
        ...HSL,
        hex: formatHex({ mode: "hsl", ...HSL }),
      };
    });
  }, [lightnessArray, formValue]);

  useSetLocalStorage(
    "keyColor",
    JSON.stringify({ ...formValue, keyIndex: lightnessArray.keyIndex })
  );

  useEffect(() => {
    const style = formatCSSVariables(formValue.h, formValue.s);
    Object.keys(style).forEach((property) => {
      document.documentElement.style.setProperty(property, style[property]);
    });
  }, [formValue]);

  return (
    <main className={s.main}>
      <Providers>
        <div>
          <ColorForm
            // key={Object.values(formValue).join("-")}
            action={formAction}
            formState={{ ...formValue, keyIndex: lightnessArray.keyIndex }}
          />
        </div>
        <ColorGrid
          colors={spectrum}
          numColors={formValue.numColors}
          keyIndex={lightnessArray.keyIndex}
        />
      </Providers>
    </main>
  );
}

export default App;

function formatCSSVariables(h: number, s: number) {
  const mode = "hsl";
  return {
    "--color-primary-100": formatHex({ mode, h, s, l: 0.9 }),
    "--color-primary-500": formatHex({ mode, h, s, l: 0.5 }),
    "--color-primary-900": formatHex({ mode, h, s, l: 0.1 }),
    "--color-primary-saturated": formatHex({ mode, h, s: 0.9, l: 0.5 }),
    "--color-primary-desaturated": formatHex({ mode, h, s: 0.1, l: 0.5 }),
  } as Record<string, string>;
}

function handleSubmit(previousState: ColorFormValues, formData: FormData) {
  const nextState = validateFormData(formData, previousState);
  const changedValues = compareObjects(previousState, nextState);

  if (Object.keys(changedValues).length === 0) {
    return previousState;
  } else if (
    Object.keys(changedValues).length === 1 &&
    "keyIndex" in changedValues
  ) {
    return nextState;
  } else if ("numColors" in changedValues) {
    return nextState;
  } else if ("hex" in changedValues) {
    const nextHsl = hsl(`#${nextState.hex}`);
    return {
      hex: nextState.hex,
      h: nextHsl.h,
      s: nextHsl.s,
      l: nextHsl.l,
      numColors: nextState.numColors,
      keyIndex: -1,
    };
  } else {
    const nextH = "h" in changedValues ? nextState.h : previousState.h;
    const nextS = "s" in changedValues ? nextState.s : previousState.s;
    const nextL = "l" in changedValues ? nextState.l : previousState.l;

    const nextHex = formatHex({
      mode: "hsl",
      h: nextH,
      s: nextS,
      l: nextL,
    });

    return {
      h: nextH,
      s: nextS,
      l: nextL,
      hex: nextHex.replace("#", ""),
      numColors: nextState.numColors,
      keyIndex: -1,
    };
  }
}

function validateFormData(
  formData: FormData,
  previousState: ColorFormValues
): ColorFormValues {
  const hex = formData.get("hex");
  const hue = formData.get("hue");
  const saturation = formData.get("saturation");
  const lightness = formData.get("lightness");
  const numColors = formData.get("numColors");
  const keyIndex = formData.get("keyIndex");

  return {
    hex: isString(hex) ? hex : previousState.hex,
    h: isString(hue) ? Number(hue) : previousState.h,
    s: isString(saturation) ? Number(saturation) : previousState.s,
    l: isString(lightness) ? Number(lightness) : previousState.l,
    numColors: isString(numColors)
      ? Number(numColors)
      : previousState.numColors,
    keyIndex: isString(keyIndex) ? Number(keyIndex) : previousState.keyIndex,
  };
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

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
    console.log(currentValue, value);

    if (currentValue === value) return;

    console.log("setting local storage item");
    localStorage.setItem(key, value.toString());
  }, [key, value]);
}

// function getLinearDistributionParams(
//   seed: number,
//   length = 11,
//   start = 0.1,
//   end = 0.95,
//   keyIndex = -1
// ) {
//   const idealDistribution = createLinearDistribution(null, length, start, end);

//   if (keyIndex < 0) {
//     const parameters = idealDistribution.range.reduce(
//       (acc, value, index) => {
//         if (index === 0) {
//           if (seed >= value) return { keyIndex: 0, start: seed, end: end };
//         } else if (index === length - 1) {
//           if (acc.keyIndex > -1) {
//             return acc;
//           } else {
//             return { ...acc, keyIndex: length - 1, end: seed };
//           }
//         }

//         const nextValue = idealDistribution.range[index + 1];

//         if (seed <= value && seed > nextValue) {
//           const lowerDist = value - seed;
//           const upperDist = seed - nextValue;

//           if (lowerDist <= upperDist) {
//             return { ...acc, keyIndex: index };
//           } else {
//             return { ...acc, keyIndex: index + 1 };
//           }
//         }

//         return acc;
//       },
//       { keyIndex: -1, start: start, end: end }
//     );

//     return { ...parameters, keyValue: seed };
//   } else {
//     return {
//       keyValue: seed,
//       start: start,
//       end: end,
//       keyIndex,
//     };
//   }
// }

// function createParabolicDistribution(
//   arrayLength: number,
//   minValue: number = 0,
//   maxValue: number = 1,
//   shift: number = 0
// ): number[] {
//   const output: number[] = new Array(arrayLength);
//   const range = maxValue - minValue;

//   // Calculate the peak index (shifted)
//   const peakIndex = Math.min(
//     Math.max(Math.floor((arrayLength - 1) / 2) + shift, 0),
//     arrayLength - 1
//   );

//   if (peakIndex === 0) {
//     return new Array(arrayLength).fill(roundTo(minValue + range, 4));
//   }

//   for (let i = 0; i < arrayLength; i++) {
//     let normalizedValue: number;

//     if (i <= peakIndex) {
//       // Linear increase to peak
//       normalizedValue = i / peakIndex;
//     } else {
//       // Linear decrease from peak
//       normalizedValue = 1 - (i - peakIndex) / (arrayLength - 1 - peakIndex);
//       normalizedValue = 1;
//     }

//     // Ensure normalizedValue is within [0, 1]
//     normalizedValue = Math.max(0, Math.min(1, normalizedValue));

//     // Scale to the desired range and round
//     output[i] = roundTo(minValue + normalizedValue * range, 4);
//   }

//   return output;
// }

// function applyEasing(array: number[]) {
//   const originalArray = [...array];
//   const originalArraySorted = [...originalArray].sort();
//   const originalMin = originalArraySorted[0];
//   const originalMax = originalArraySorted[originalArraySorted.length - 1];

//   const easedArray = array.map((value) => {
//     return ease(value);
//   });
//   const easedArraySorted = [...easedArray].sort();
//   const easedMin = easedArraySorted[0];
//   const easedMax = easedArraySorted[easedArraySorted.length - 1];

//   const mappedEasedArray = easedArray.map((value) => {
//     return map(value, easedMin, easedMax, originalMin, originalMax);
//   });

//   return mappedEasedArray;
// }

// function ease(x: number) {
//   return x * x * x * x * x;
// }

// function map(
//   x: number,
//   in_min: number,
//   in_max: number,
//   out_min: number,
//   out_max: number
// ) {
//   return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
// }
