import { run } from "./app";

const exec = async () => {
  const container = document.querySelector<HTMLDivElement>(".mn-gits");

  if (!container) {
    throw new Error("Container not found");
  }

  await run(container);
};

window.addEventListener("load", exec);

window.addEventListener("resize", exec);
