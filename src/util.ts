import { fontDefaults, input, randMultipliers } from "./constants";

export const range = (from: number, to: number, incl = true) => {
  const output = [];

  for (let i = from; i < to; i++) {
    output.push(i);
  }

  if (incl) {
    output.push(to);
  }

  return output;
};

export const fontSizeRange = range(12, 20).map(String);

export const marginRange = range(0, 6).map(String);

export const setFont = (
  ctx: CanvasRenderingContext2D,
  randomSize: boolean = true
) => {
  ctx.font = `${
    randomSize && getRandomInt(10) > 8
      ? fontSizeRange[getRandomInt(fontSizeRange.length)]
      : fontDefaults.size
  }px ${fontDefaults.family}`;
};

export const sleep = (ms = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getInput = () => input[getRandomInt(randMultipliers.input)];

export const getRandomInt = (exclMax: number) =>
  Math.floor(Math.random() * exclMax);

type BlankProbabilityFn = (currentTimeMs: number) => number;

const blankProbabilityFnCache = new Map<number, BlankProbabilityFn>();

export const getBlankProbabilityFn = (
  startTimeMs: number,
  durationMs: number
) => {
  if (!blankProbabilityFnCache.has(startTimeMs)) {
    blankProbabilityFnCache.set(startTimeMs, (currentTimeMs: number) => {
      const p = (currentTimeMs - startTimeMs) / durationMs;

      if (p < 0) {
        throw new Error(
          `Current time before start time: ${JSON.stringify({
            currentTimeMs,
            startTimeMs,
          })}`
        );
      }

      if (p > 1) {
        return 1;
      }

      return p;
    });
  }

  return blankProbabilityFnCache.get(startTimeMs)!;
};
