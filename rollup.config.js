import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";
import { terser } from "rollup-plugin-terser";

import pkg from "./package.json";


const input = "src/index.ts";
const external = Object.keys(pkg.peerDependencies || {});
const output = {
  format: "umd",
  sourcemap: true,
  name: "ReactAutoControlled",
  globals: {
    react: "React",
    "react-dom": "ReactDOM"
  }
};
const plugins = [
  peerDepsExternal(),
  nodeResolve(),
  typescript(),
  babel({
    exclude: "node_modules/**",
    plugins: ["external-helpers"]
  }),
  commonjs({
    include: ["node_modules/**"],
    namedExports: {
      "node_modules/react/react.js": [
        "Children",
        "Component",
        "PropTypes",
        "createElement"
      ],
      "node_modules/react-dom/index.js": ["render"]
    }
  }),
  sourcemaps(),
  sizeSnapshot()
];

export default [
  {
    input: input,
    output: {
      ...output,
      file: "dist/react-auto-controlled.js"
    },
    external: external,
    plugins: plugins
  },
  {
    input: input,
    output: {
      ...output,
      file: "dist/react-auto-controlled.min.js"
    },
    external: external,
    plugins: [...plugins, terser()]
  },
  {
    input: input,
    output: {
      file: "example/src/react-auto-controlled/index.js",
      format: "es",
      sourcemap: true,
      banner: "/* eslint-disable */"
    },
    external: external,
    plugins: plugins,
  }
];
