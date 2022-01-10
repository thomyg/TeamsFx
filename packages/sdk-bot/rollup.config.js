import json from "@rollup/plugin-json";
import typescriptPlugin from "rollup-plugin-typescript2";
import typescript from "typescript";
import pkg from "./package.json";

const deps = Object.keys(Object.assign({}, pkg.peerDependencies, pkg.dependencies));

const nodeDeps = [...deps, "crypto"];

/**
 * ES2017 Builds
 */
const es2017Plugins = [
  typescriptPlugin({
    typescript,
    tsconfigOverride: {
      compilerOptions: {
        target: "es2017",
      },
    },
    abortOnError: false,
  }),
  json({ preferConst: true }),
];

const es5Builds = [
  /**
   * Node.js Build
   */
  {
    input: "src/index.ts",
    output: [{ file: pkg.main, format: "cjs", sourcemap: true }],
    external: (id) => nodeDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    plugins: [
      typescriptPlugin({
        typescript,
        abortOnError: false,
        useTsconfigDeclarationDir: true,
      }),
      json(),
    ],
  },
];

const es2017Builds = [
  // Node
  {
    input: "./src/index.ts",
    output: {
      file: pkg.module,
      format: "es",
      sourcemap: true,
    },
    plugins: [...es2017Plugins],
    external: (id) => nodeDeps.some((dep) => id === dep || id.startsWith(`${dep}/`)),
    treeshake: {
      moduleSideEffects: false,
    },
  },
];

export default [...es5Builds, ...es2017Builds];
