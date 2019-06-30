import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';


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
    nodeResolve(),
    commonjs({
      include: ["node_modules/**"],
      namedExports: {
        "node_modules/react/react.js": [
          "Children",
          "Component",
          "PropTypes",
          "createElement"
        ]
      }
    }),
    typescript({
      typescript: require("typescript")
    }),
    sizeSnapshot(),
  ]
};
