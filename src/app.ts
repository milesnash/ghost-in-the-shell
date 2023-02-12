import { getBlankProbability, getRandomInt, range, sleep } from "./util";

const durationMs = 3000 as const;
const inputColor = "#41ae6e" as const;
const input = "0123456789" as const;
const fontSizeDefault = "16" as const;
const fontSizeRange = range(12, 20).map(String);
const marginRange = range(0, 6).map(String);
const randMultipliers = {
  input: input.length,
  sleep: 200,
} as const;

const getInput = () => input[getRandomInt(randMultipliers.input)];
const updateSpanInput = (
  span: HTMLSpanElement,
  overrideFn: () => string | null = () => null
) => {
  let newInput = "";

  for (let i = 0; i < (span.innerText?.length ?? 0); i++) {
    newInput += overrideFn() ?? getInput();
  }

  span.innerText = newInput;
};

const animateStrapline = async (
  els: NodeListOf<HTMLParagraphElement>,
  startTime: number
) => {
  const endTime = startTime + durationMs;
  const shuffleText = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

  const straplines: HTMLParagraphElement[] = [];

  els.forEach((el) => {
    straplines.push(el);
  });

  await Promise.all(
    straplines.map(async (strapline) => {
      const origText = strapline.innerText;

      while (Date.now() < endTime) {
        await sleep(Math.floor(Math.random() * randMultipliers.sleep))
          .then(() => {
            let newText = "";

            for (let i = 0; i < origText.length; i++) {
              newText +=
                getRandomInt(4) > 1
                  ? shuffleText[getRandomInt(shuffleText.length)]
                  : " ";
            }

            strapline.innerText = newText;
          })
          .catch((err) => {
            throw err;
          });
      }

      strapline.innerText = origText;
    })
  );
};

const animateOverlay = async (overlay: HTMLDivElement, startTime: number) => {
  overlay.style.display = "inline-block";
  const left = document.createElement("div");

  const spans: HTMLSpanElement[] = [];

  overlay.replaceChildren(left);

  while (left.offsetHeight < overlay.offsetHeight) {
    const p = document.createElement("p");
    const pVerticalMargin =
      marginRange[getRandomInt(4) > 2 ? getRandomInt(marginRange.length) : 0];
    const fontSize =
      getRandomInt(10) > 8
        ? fontSizeRange[getRandomInt(fontSizeRange.length)]
        : fontSizeDefault;
    p.style.margin = `${pVerticalMargin}px 0px ${pVerticalMargin}px`;
    p.style.fontSize = fontSize;
    p.style.minHeight = fontSize;

    const span = document.createElement("span");
    span.style.color = p.style.backgroundColor;
    span.innerText = getInput();
    spans.push(span);
    p.append(span);

    left.append(p);
  }

  const right = left.cloneNode(true) as HTMLDivElement;
  right.querySelectorAll("span").forEach((span) => spans.push(span));
  left.classList.add("mn-gits-overlay-segment", "left");
  right.classList.add("mn-gits-overlay-segment", "right");

  overlay.append(right);

  await Promise.all(
    spans.map(async (span) => {
      const parentDiv = span.closest<HTMLDivElement>(
        ".mn-gits-overlay-segment"
      );

      if (!parentDiv) {
        throw new Error("Cannot find parent div");
      }

      let { offsetWidth } = span;

      while (span.offsetWidth < parentDiv?.offsetWidth) {
        span.innerText += getInput();
        if (span.offsetWidth === offsetWidth) {
          throw new Error(`Unchanged offset width after update ${offsetWidth}`);
        }
      }

      span.style.color = inputColor;

      let animating = true;

      while (animating) {
        const blankProbability = getBlankProbability(
          Date.now(),
          startTime,
          durationMs
        );

        await sleep(Math.floor(Math.random() * randMultipliers.sleep))
          .then(() => {
            updateSpanInput(span, () =>
              blankProbability > Math.random() ? "  " : null
            );

            if (span.innerText.trim().length === 0) {
              animating = false;
            }
          })
          .catch((err) => {
            throw err;
          });
      }
    })
  );

  overlay.style.display = "none";
};

export const run = async (container: HTMLDivElement) => {
  const startTime = Date.now();
  const overlay = container.querySelector<HTMLDivElement>(".mn-gits-overlay");
  const straplines = container.querySelectorAll<HTMLParagraphElement>(
    ".mn-gits-strapline p"
  );

  if (!overlay || !straplines) {
    throw new Error("Unable to find overlay or strapline container");
  }

  await Promise.all([
    animateOverlay(overlay, startTime),
    animateStrapline(straplines, startTime),
  ]);
};
