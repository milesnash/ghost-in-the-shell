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
  licensed: false,
  name: "css-anims",
  package: false,
  packageManager: javascript.NodePackageManager.NPM,
  prettier: true,
  projenrcTs: true,
  publishDryRun: true,
  tsconfig,
});

project.synth();
