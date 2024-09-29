import { useState } from "react";
import {
  converter,
  formatCss,
  // differenceCie94
} from "culori";
import "./main.css";

type Hsl = ReturnType<typeof hsl>;
// const dist = differenceCie94();

const converterHSL = converter("hsl");
const rgb = converter("rgb");

function hsl(color: string) {
  const colorHSL = converterHSL(color);
  if (!colorHSL) throw new Error(`Invalid color: ${color}`);

  const { h, s, l, mode } = colorHSL;
  if (h === undefined) throw new Error(`Invalid color: ${color}`);

  return { h, s, l, mode };
}

const hex = "#4b87ad";

function App() {
  const [colorHSL, setColorHSL] = useState(hsl(hex));
  const valueArray = generateDistribution(colorHSL.l);
  const chromaArray = generateParabola(valueArray.length, 0.5, 0.9, 1);

  // console.log(chromaArray);
  // console.log(valueArray);
  // console.log("distance", dist("#c3defc", "#FFFFFF"));

  return (
    <main>
      <span>
        <input
          type="range"
          value={colorHSL.h}
          onChange={(e) =>
            setColorHSL({ ...colorHSL, h: e.target.valueAsNumber })
          }
          min={0}
          max={360}
          step={0.1}
        />
        <span>{colorHSL.h}</span>
      </span>
      <input
        type="range"
        value={colorHSL.s}
        onChange={(e) =>
          setColorHSL({ ...colorHSL, s: e.target.valueAsNumber })
        }
        min={0}
        max={1.5}
        step={0.01}
      />
      <input
        type="range"
        value={colorHSL.l}
        onChange={(e) =>
          setColorHSL({ ...colorHSL, l: e.target.valueAsNumber })
        }
        min={0}
        max={1}
        step={0.01}
      />
      <span
        style={{
          display: "inline-block",
          width: 40,
          height: 40,
          backgroundColor: formatCss(rgb(colorHSL as Hsl)),
        }}
      />
      <SaturationGraph array={chromaArray} />
      <div
        style={{
          width: 400,
          backgroundColor: hex,
          borderBlockEnd: "4px solid white",
          padding: "1rem",
        }}
      >
        <ul>
          <li>h: {hsl(hex).h.toFixed(3)}</li>
          <li>s: {hsl(hex).s.toFixed(3)}</li>
          <li>l: {hsl(hex).l.toFixed(3)}</li>
        </ul>
      </div>
      {valueArray.map((value, index) => (
        <div
          key={value}
          style={{
            width: 400,
            backgroundColor: formatCss(
              rgb({
                ...colorHSL,
                l: value,
                s: applyEasing(chromaArray)[index],
              } as Hsl)
            ),
            borderBlockEnd: "4px solid white",
            padding: "1rem",
          }}
        >
          <ul>
            <li>h: {colorHSL.h.toFixed(3)}</li>
            <li>s: {applyEasing(chromaArray)[index].toFixed(3)}</li>
            <li>l: {value.toFixed(3)}</li>
          </ul>
        </div>
      ))}
    </main>
  );
}

function SaturationGraph({ array }: { array: number[] }) {
  const step = 150 / (array.length + 1);
  // console.log(applyEasing(array));

  return (
    <svg viewBox="0 0 150 100" width={300} style={{ backgroundColor: "black" }}>
      {applyEasing(array).map((value, index) => (
        <circle
          key={index}
          cx={(index + 1) * step}
          cy={100 - value * 100}
          r={2}
          fill="white"
        />
      ))}
    </svg>
  );
}

export default App;

function applyEasing(array: number[]) {
  const originalArray = [...array];
  const originalArraySorted = [...originalArray].sort();
  const originalMin = originalArraySorted[0];
  const originalMax = originalArraySorted[originalArraySorted.length - 1];

  const easedArray = array.map((value) => {
    return ease(value);
  });
  const easedArraySorted = [...easedArray].sort();
  const easedMin = easedArraySorted[0];
  const easedMax = easedArraySorted[easedArraySorted.length - 1];

  const mappedEasedArray = easedArray.map((value) => {
    return map(value, easedMin, easedMax, originalMin, originalMax);
  });

  return mappedEasedArray;
}

function ease(x: number) {
  return x * x * x * x * x;
}

function map(
  x: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return ((x - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
}

function generateDistribution(
  seed: number,
  count = 11,
  min = 0.15,
  max = 0.95
) {
  if (seed < 0 || seed > 1) throw new Error("Seed must be between 0 and 1");
  if (count < 0) throw new Error("Count must be greater than 0");
  if (max > 1) throw new Error("Max must be greater than min");

  const range = max - min;
  const idealStep = range / (count - 1);

  const distToMax = max - seed;
  const distToMin = seed - min;

  console.log(distToMin, distToMax, idealStep);

  const result = new Array(count).fill(0).map((_, i) => {
    return min + i * idealStep;
  });

  return result;
}

function generateParabola(
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

  function roundTo(num: number): number {
    return Number(num.toFixed(4));
  }

  for (let i = 0; i < arrayLength; i++) {
    let normalizedValue: number;

    if (i <= peakIndex) {
      // Linear increase to peak
      normalizedValue = i / peakIndex;
    } else {
      // Linear decrease from peak
      normalizedValue = 1 - (i - peakIndex) / (arrayLength - 1 - peakIndex);
    }

    // Ensure normalizedValue is within [0, 1]
    normalizedValue = Math.max(0, Math.min(1, normalizedValue));

    // Scale to the desired range and round
    output[i] = roundTo(minValue + normalizedValue * range);
  }

  return output;
}
