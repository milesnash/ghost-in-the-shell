import { readFileSync } from "fs";
import { EOL } from "os";
import { sep } from "path";
import { javascript, TextFile, typescript } from "projen";

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
  depsUpgradeOptions: {
    workflow: false, // Customised workflow below
  },
  devDeps: [
    "copy-webpack-plugin",
    "ts-loader",
    "webpack",
    "webpack-cli",
    "webpack-dev-server",
  ],
  license: "MIT",
  mergify: false,
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

// NPM scripts
project.tasks
  .tryFind("package")
  ?.prependExec("webpack --mode production -o docs");

project.addTask("start", {
  exec: "webpack && webpack-dev-server --mode development",
});

// Ad-hoc Files
new TextFile(project, ".github/workflows/upgrade.yml", {
  lines: [
    `# ~~ Generated by projen. To modify, edit .projenrc.js and run "npx projen".${EOL}`,
    String(
      readFileSync(
        [__dirname, "projen-files", ".github", "workflows", "upgrade.yml"].join(
          sep
        )
      )
    ),
  ],
  marker: true,
});

project.synth();
