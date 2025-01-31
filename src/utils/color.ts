import { roundTo } from "./math";

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
    const stepSize = (end - start) / (length - 1);
    const position = (keyValue - start) / stepSize;
    const ki = Math.round(position);

    // const step = (start - end) / (length - 1);
    // const rawIndex = (start - keyValue) / step;
    // const nextKeyIndex = Math.min(Math.floor(rawIndex), length - 2);

    return { keyIndex: ki, start, end, keyValue };
  }
}

function getSaturationValue(
  index: number,
  keyIndex: number,
  keySaturation: number,
  numSteps: number
) {
  if (keyIndex === 0) {
    const minValue = Math.max(0, keySaturation - keySaturation / 2);
    const maxValue = keySaturation;
    const range = maxValue - minValue;
    const step = range / numSteps;
    return roundTo(maxValue - step * index, 4);
  } else {
    const minValue = Math.max(
      0,
      keySaturation - (keySaturation / 8) * keyIndex
    );
    const maxValue = keySaturation;
    const range = maxValue - minValue;
    const minStep = range / keyIndex;
    const maxStep = range / (numSteps - keyIndex);
    if (index <= keyIndex) {
      return roundTo(maxValue - minStep * (keyIndex - index), 4);
    } else {
      return roundTo(maxValue - maxStep * (index - keyIndex), 4);
    }
  }
}

export { createLinearDistribution, getDistributionParams, getSaturationValue };

// function findStepIndex(
//   keyValue: number,
//   start: number = 0.9,
//   end: number = 0.05,
//   steps: number = 11
// ): number {
//   // Calculate step size
//   const stepSize = (end - start) / (steps - 1);

//   // Calculate the relative position of the key value
//   const position = (keyValue - start) / stepSize;

//   // Round to nearest index
//   return Math.round(position);
// }
