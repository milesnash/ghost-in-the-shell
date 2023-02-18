import {
  durationMs,
  inputColor,
  randMultipliers,
  straplineLines,
} from "./constants";
import {
  getBlankProbabilityFn,
  getInput,
  getRandomInt,
  setFont,
  sleep,
} from "./util";

export const run = async (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext("2d");
  const startTime = Date.now();
  const endTime = startTime + durationMs;
  let currentTime = startTime;

  if (!ctx) {
    throw new Error("ctx is null");
  }

  ctx.fillStyle = inputColor;
  setFont(ctx);

  while (currentTime < endTime + 1000) {
    const getBlankProbability = getBlankProbabilityFn(startTime, durationMs);

    await sleep(Math.floor(Math.random() * randMultipliers.sleep))
      .then(() => {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        updateText(canvas, ctx, startTime, () =>
          getBlankProbability(Date.now()) > Math.random() ? "  " : null
        );
      })
      .catch((err) => {
        throw err;
      });

    currentTime = Date.now();
  }
};

const updateText = (
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  startTime: number,
  overrideFn: () => string | null = () => null
) => {
  const blankProb = getBlankProbabilityFn(startTime, durationMs)(Date.now());
  const { offsetHeight, offsetWidth } = canvas;
  const middle = { x: offsetWidth / 2, y: offsetHeight / 2 };
  let currentLine: string[] = [];
  let currentStrapline: number | null = 0;
  let totalTextHeight = 0;

  while (totalTextHeight < offsetHeight) {
    currentLine.push(overrideFn() ?? getInput());

    const { fontBoundingBoxAscent: height, width } = ctx.measureText(
      currentLine.join("")
    );
    const lineReady = width >= offsetWidth;
    const lineContainsStrapline =
      totalTextHeight <= middle.y && totalTextHeight + height >= middle.y;
    const addStraplineToCurrentLine =
      typeof currentStrapline === "number" &&
      (lineContainsStrapline || currentStrapline > 0);

    if (lineReady) {
      if (addStraplineToCurrentLine) {
        const straplineLine = straplineLines[currentStrapline!];
        const straplineStart = Math.floor(
          (currentLine.length - straplineLine.length) / 2
        );

        let currentChar = 0;

        for (const char of straplineLine) {
          const currentLineIdx = straplineStart + currentChar;

          currentLine[currentLineIdx] =
            blankProb < 1
              ? [currentLine[currentLineIdx], char, getInput()][getRandomInt(3)]
              : char;

          currentChar++;
        }

        currentStrapline =
          currentStrapline === straplineLines.length - 1
            ? null
            : currentStrapline! + 1;
      }

      if (blankProb === 1) {
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
      }

      ctx.fillText(
        blankProb < 1 ? currentLine.join("") : currentLine.join("").trim(),
        blankProb < 1 ? 0 : offsetWidth / 2,
        totalTextHeight,
        offsetWidth
      );
      totalTextHeight += height;
      setFont(ctx, blankProb < 1);
      currentLine = [];
    }
  }
};
