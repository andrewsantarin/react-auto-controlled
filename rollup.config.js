import babel from "rollup-plugin-babel";
import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";
import sourcemaps from "rollup-plugin-sourcemaps";
import typescript from "rollup-plugin-typescript2";

import pkg from "./package.json";

const input = "src/index.ts";
const external = Object.keys(pkg.peerDependencies || {});

function createPlugins({
  useSizeSnapshot
} = {
  useSizeSnapshot: false,
}) {
  const plugins = [
    peerDepsExternal(),
    nodeResolve(),
    babel({
      exclude: "node_modules/**"
    }),
    commonjs({
      include: ["node_modules/**"]
    }),
    typescript(),
    sourcemaps()
  ];

  useSizeSnapshot && plugins.push(sizeSnapshot());

  return plugins;
}

export default [
  {
    input: input,
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
      }
    ],
    external: external,
    plugins: createPlugins({
      useSizeSnapshot: true,
    })
  },
  {
    input: input,
    output: {
      file: "example/src/react-auto-controlled/index.js",
      format: "es",
      banner: "/* eslint-disable */",
      sourcemap: true
    },
    external: external,
    plugins: createPlugins(),
  }
];
