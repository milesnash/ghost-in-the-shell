import { javascript, typescript } from "projen";

const tsconfig = {
  compilerOptions: {
    baseUrl: ".",
    lib: ["dom", "es2021"],
    useUnknownInCatchVariables: true,
  },
};

const project = new typescript.TypeScriptAppProject({
  authorName: "Miles Nash",
  authorEmail: "miles@milesnash.com",
  defaultReleaseBranch: "main",
  devDeps: [
    "copy-webpack-plugin",
    "ts-loader",
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
  ],
  license: "MIT",
  name: "ghost-in-the-shell",
  package: false,
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  publishDryRun: true,
  tsconfig,
  tsconfigDev: {
    compilerOptions: {},
    include: ["webpack.config.ts"],
  },
});

project.tasks
  .tryFind("package")
  ?.prependExec("webpack --mode production -o docs");

project.addTask("start", {
  exec: "webpack && webpack-dev-server --mode development",
});

project.synth();
