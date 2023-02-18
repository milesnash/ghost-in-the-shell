import { run } from "./app";

const exec = async () => {
  const container = document.querySelector<HTMLDivElement>(".mn-gits");

  if (!container) {
    throw new Error("Container not found");
  }

  const execRun = async () => {
    container.style.cursor = "wait";
    const cvs = document.createElement("canvas");
    cvs.height = container.offsetHeight > 40 ? container.offsetHeight : 40;
    cvs.width = container.offsetWidth > 200 ? container.offsetWidth : 200;
    container.replaceChildren(cvs);

    await run(cvs).finally(() => {
      container.style.cursor = "pointer";
    });
  };

  container.addEventListener("click", async (evt) => {
    evt.preventDefault();

    if (container.style.cursor === "wait") {
      return;
    }

    await execRun();
  });

  await execRun();
};

window.addEventListener("load", exec);

window.addEventListener("resize", exec);
