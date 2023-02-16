import { github, javascript, typescript } from "projen";

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

// GitHub Actions
const githubComponent = github.GitHub.of(project)!;

const autoMergeWorkflow = githubComponent.addWorkflow("automerge");

autoMergeWorkflow.on({
  pullRequest: {
    types: ["labeled", "opened", "ready_for_review", "reopened", "synchronize"],
  },
  checkSuite: {
    types: ["completed"],
  },
  status: {},
});

autoMergeWorkflow.addJobs({
  automerge: {
    if: "github.actor == github.repository_owner",
    permissions: {
      pullRequests: github.workflows.JobPermission.WRITE,
    },
    runsOn: ["ubuntu-latest"],
    steps: [
      {
        uses: "peter-evans/enable-pull-request-automerge@v2",
        with: {
          token: "${{ secrets.PROJEN_GITHUB_TOKEN }}",
          "pull-request-number": "${{ github.event.pull_request.number }}",
          "merge-method": "squash",
        },
      },
    ],
  },
});

project.synth();
