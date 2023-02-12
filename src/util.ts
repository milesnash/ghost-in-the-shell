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

export const sleep = (ms = 100) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

export const getRandomInt = (exclMax: number) =>
  Math.floor(Math.random() * exclMax);

export const getBlankProbability = (
  currentTimeMs: number,
  startTimeMs: number,
  durationMs: number
) => {
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
};
