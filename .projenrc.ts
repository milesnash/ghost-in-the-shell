import { javascript, typescript } from "projen";

const tsconfig = {
  compilerOptions: {
    baseUrl: ".",
    lib: ["dom", "es2021"],
    useUnknownInCatchVariables: true,
  },
};

const project = new typescript.TypeScriptAppProject({
  defaultReleaseBranch: "main",
  devDeps: [
    "copy-webpack-plugin",
    "ts-loader",
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
  ],
  licensed: false,
  name: "css-anims",
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

project.addTask("start", {
  exec: "webpack && webpack-dev-server --mode development",
});

project.synth();
