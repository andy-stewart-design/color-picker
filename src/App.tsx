import { CSSProperties, useActionState, startTransition, useRef } from "react";
import { converter, formatHex } from "culori";
import {
  Label,
  Slider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
} from "react-aria-components";
import "./main.css";

interface ColorDefinition {
  hex: string;
  h: number;
  s: number;
  l: number;
}

const converterHSL = converter("hsl");

function hsl(color: string) {
  const colorHSL = converterHSL(color);
  if (!colorHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorHSL;
  if (h === undefined) throw new Error(`Invalid color: ${color}`);

  return { h, s, l, mode };
}

const defaultColor = {
  hex: "43c5ef",
  h: 194.65116279069767,
  s: 0.8431372549019608,
  l: 0.6,
};

function App() {
  const [formState, formAction] = useActionState(handleSubmit, defaultColor);
  const formRef = useRef<HTMLFormElement>(null);

  function handleHexInput(e: React.ChangeEvent<HTMLInputElement>) {
    let value = e.target.value.toUpperCase();
    value = value.replace(/[^0-9A-F]/g, "");
    value = value.slice(0, 6);
    e.target.value = value;
  }

  function handleSubmit(previousState: ColorDefinition, formData: FormData) {
    const nextState = validateFormData(previousState, formData);
    const changedValues = compareColorDefinitions(previousState, nextState);

    if ("hex" in changedValues && changedValues.hex !== undefined) {
      const nextHsl = hsl(`#${changedValues.hex}`);
      return {
        hex: changedValues.hex.toString(),
        h: nextHsl.h,
        s: nextHsl.s,
        l: nextHsl.l,
      };
    } else {
      const nextHex = formatHex({
        mode: "hsl",
        h: nextState.h,
        s: nextState.s,
        l: nextState.l,
      });

      return {
        ...nextState,
        hex: nextHex.replace("#", ""),
      };
    }
  }

  function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const form = event.target;
    if (form instanceof HTMLFormElement) {
      const formData = new FormData(form);
      startTransition(() => formAction(formData));
    }
  }

  const lightnessArray = createLinearDistribution(formState.l, 11, 0.05, 0.9);

  const chromaArray = createParabolicDistribution(
    lightnessArray.range.length,
    Math.max(0, formState.s - (formState.s / 16) * lightnessArray.keyIndex),
    formState.s,
    lightnessArray.keyIndex - Math.floor(lightnessArray.range.length / 2)
  );

  return (
    <>
      <header>
        <form onSubmit={onSubmit} key={JSON.stringify(formState)} ref={formRef}>
          <div>
            <span style={{ opacity: 0.4 }}>#</span>
            <input
              key={formState.hex}
              name="hex"
              onChange={handleHexInput}
              defaultValue={formState.hex.replace("#", "")}
            />
          </div>
          <Slider
            className="react-aria-slider"
            defaultValue={formState.h}
            minValue={0}
            maxValue={360}
            step={0.1}
            onChangeEnd={() => formRef.current?.requestSubmit()}
          >
            <Label className="label">Hue</Label>
            <SliderOutput className="output" />
            <SliderTrack className="track">
              <SliderThumb name="hue" className="thumb" />
            </SliderTrack>
          </Slider>
          <Slider
            className="react-aria-slider"
            defaultValue={formState.s}
            minValue={0}
            maxValue={1}
            step={0.01}
            onChangeEnd={() => formRef.current?.requestSubmit()}
          >
            <Label className="label">Saturation</Label>
            <SliderOutput className="output" />
            <SliderTrack className="track">
              <SliderThumb name="saturation" className="thumb" />
            </SliderTrack>
          </Slider>
          <Slider
            className="react-aria-slider"
            defaultValue={formState.l}
            minValue={0}
            maxValue={1}
            step={0.01}
            onChangeEnd={() => formRef.current?.requestSubmit()}
          >
            <Label className="label">Lightness</Label>
            <SliderOutput className="output" />
            <SliderTrack className="track">
              <SliderThumb name="lightness" className="thumb" />
            </SliderTrack>
          </Slider>
          {/* <div className="slider">
            <label>
              <span>Lightness</span>
              <input
                type="range"
                name="lightness"
                defaultValue={formState.l}
                step="any"
                min={0}
                max={1}
                onMouseUp={() => formRef.current?.requestSubmit()}
              />
            </label>
          </div> */}
        </form>
      </header>
      <main>
        {lightnessArray.range.map((value, index) => (
          <div
            key={index}
            className="color-card"
            style={
              {
                backgroundColor: formatHex({
                  mode: "hsl",
                  h: formState.h,
                  l: value,
                  s: chromaArray[index],
                }),
                "--saturation": `${chromaArray[index] * 100}%`,
                "--lightness": `${value * 100}%`,
              } as CSSProperties
            }
          >
            <ul>
              <li>{formState.hex}</li>
              <li>h: {roundTo(formState.h, 1)}</li>
              <li>s: {roundTo(chromaArray[index])}</li>
              <li>l: {roundTo(value)}</li>
            </ul>
            <div className="indicators">
              <span
                className={`indicator lightness ${
                  index === lightnessArray.keyIndex ? "anchor" : ""
                }`.trim()}
              />
              <span
                className={`indicator saturation ${
                  index === lightnessArray.keyIndex ? "anchor" : ""
                }`.trim()}
              />
            </div>
          </div>
        ))}
      </main>
    </>
  );
}

export default App;

function validateFormData(
  previousState: ColorDefinition,
  formData: FormData
): ColorDefinition {
  const hex = formData.get("hex");
  const hue = formData.get("hue");
  const saturation = formData.get("saturation");
  const lightness = formData.get("lightness");

  return {
    hex: isString(hex) ? hex : previousState.hex,
    h: isString(hue) ? Number(hue) : previousState.h,
    s: isString(saturation) ? Number(saturation) : previousState.s,
    l: isString(lightness) ? Number(lightness) : previousState.l,
  };
}

type ColorChange = Partial<ColorDefinition>;

function compareColorDefinitions(prev: ColorDefinition, next: ColorDefinition) {
  const changes: ColorChange = {};

  (Object.keys(next) as Array<keyof ColorDefinition>).forEach((key) => {
    if (next[key] !== prev[key]) {
      (changes[key] as ColorDefinition[typeof key]) = next[key];
    }
  });

  return changes;
}

function isString(value: unknown): value is string {
  return typeof value === "string";
}

function createLinearDistribution(
  seed: number | null,
  length = 11,
  min = 0.1,
  max = 0.95
): {
  range: number[];
  keyIndex: number;
} {
  if (seed === null) {
    // Create an ideal linear didtribution given the desired length, min and max values
    return {
      range: Array.from({ length }, (_, i) => {
        return min + (i * (max - min)) / (length - 1);
      }),
      keyIndex: -1,
    };
  }

  const params = getLinearDistributionParams(seed, length, min, max);

  const lowerSteps = params.keyIndex;
  const lowerStep = (params.keyValue - params.min) / lowerSteps;
  const upperSteps = length - 1 - params.keyIndex;
  const upperStep = (params.max - params.keyValue) / upperSteps;

  if (params.keyIndex === 0 || params.keyIndex === length - 1) {
    const numSteps = params.keyIndex === 0 ? upperSteps : lowerSteps;
    const step = params.keyIndex === 0 ? upperStep : lowerStep;

    return {
      range: new Array(numSteps + 1).fill(0).map((_, i) => {
        return roundTo(params.min + i * step);
      }),
      keyIndex: params.keyIndex,
    };
  } else {
    const lowerArray = new Array(lowerSteps).fill(0).map((_, i) => {
      return roundTo(params.min + i * lowerStep);
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

function getLinearDistributionParams(
  seed: number,
  length = 11,
  min = 0.1,
  max = 0.95
) {
  const idealDistribution = createLinearDistribution(null, length, min, max);

  const parameters = idealDistribution.range.reduce(
    (acc, value, index) => {
      if (index === 0) {
        if (seed <= value) return { keyIndex: 0, min: seed, max };
      } else if (index === length - 1) {
        if (acc.keyIndex > -1) return acc;
        else
          return {
            ...acc,
            keyIndex: length - 1,
            max: seed,
          };
      }

      const nextValue = idealDistribution.range[index + 1];

      if (seed >= value && seed < nextValue) {
        const lowerDist = seed - value;
        const upperDist = nextValue - seed;

        if (lowerDist <= upperDist) return { ...acc, keyIndex: index };
        else return { ...acc, keyIndex: index + 1 };
      }

      return acc;
    },
    { keyIndex: -1, min, max }
  );

  return { ...parameters, keyValue: seed };
}

function createParabolicDistribution(
  arrayLength: number,
  minValue: number = 0,
  maxValue: number = 1,
  shift: number = 0
): number[] {
  const output: number[] = new Array(arrayLength);
  const range = maxValue - minValue;

  // Calculate the peak index (shifted)
  const peakIndex = Math.min(
    Math.max(Math.floor((arrayLength - 1) / 2) + shift, 0),
    arrayLength - 1
  );

  if (peakIndex === 0) {
    return new Array(arrayLength).fill(roundTo(minValue + range, 4));
  }

  for (let i = 0; i < arrayLength; i++) {
    let normalizedValue: number;

    if (i <= peakIndex) {
      // Linear increase to peak
      normalizedValue = i / peakIndex;
    } else {
      // Linear decrease from peak
      normalizedValue = 1 - (i - peakIndex) / (arrayLength - 1 - peakIndex);
      normalizedValue = 1;
    }

    // Ensure normalizedValue is within [0, 1]
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));

    // Scale to the desired range and round
    output[i] = roundTo(minValue + normalizedValue * range, 4);
  }

  return output;
}

function roundTo(num: number, digits = 3): number {
  return Number(num.toFixed(digits));
}

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
