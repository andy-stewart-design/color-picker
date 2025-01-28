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

export { createLinearDistribution, getSaturationValue };
