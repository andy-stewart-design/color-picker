// Interpolation functions
type EasingFunction = (t: number) => number;

const easings = {
  // Linear interpolation (no easing)
  linear: (t: number): number => t,

  // Quadratic easing in
  easeIn: (t: number): number => t * t,

  // Quadratic easing out
  easeOut: (t: number): number => t * (2 - t),

  // Quadratic easing in-out
  easeInOut: (t: number): number => {
    t *= 2;
    if (t < 1) return 0.5 * t * t;
    t--;
    return -0.5 * (t * (t - 2) - 1);
  },

  // Cubic easing in
  easeInCubic: (t: number): number => t * t * t,

  // Cubic easing out
  easeOutCubic: (t: number): number => {
    t--;
    return t * t * t + 1;
  },
};

const easingOptions = Object.keys(easings);
type EasingOption = keyof typeof easings;

interface InterpolationOptions {
  easing?: EasingOption;
  precision?: number;
}

function interpolate(
  start: number,
  end: number,
  progress: number,
  easingFunction: EasingFunction
): number {
  const t = easingFunction(Math.max(0, Math.min(1, progress)));
  return start + (end - start) * t;
}

export {
  interpolate,
  easings,
  easingOptions,
  type InterpolationOptions,
  type EasingOption,
};
