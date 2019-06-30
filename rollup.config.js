import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import nodeResolve from "rollup-plugin-node-resolve";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";


export default {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "cjs",
      exports: "named",
      sourcemap: true
    },
    {
      file: pkg.module,
      format: "es",
      exports: "named",
      sourcemap: true
    },
    {
      file: "example/src/react-auto-controlled/index.js",
      format: "es",
      banner: "/* eslint-disable */"
    }
  ],
  external: Object.keys(pkg.peerDependencies || {}),
  plugins: [
    peerDepsExternal(),
    nodeResolve({
      browser: true
    }),
    babel({
      exclude: "node_modules/**",
      plugins: ["external-helpers"]
    }),
    typescript({
      typescript: require("typescript")
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
    sizeSnapshot()
  ]
};
