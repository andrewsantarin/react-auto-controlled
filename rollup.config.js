import babel from 'rollup-plugin-babel';
import commonjs from 'rollup-plugin-commonjs';
import nodeResolve from 'rollup-plugin-node-resolve';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import replace from 'rollup-plugin-replace';
import { sizeSnapshot } from 'rollup-plugin-size-snapshot';
import { terser } from 'rollup-plugin-terser';
import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

// Shamelessly copied from 'react-draggable' to compress the distributable as small as possible.

// #region Shared settings
const name = 'ReactAutoControlled';
const deps = {
  react: 'React',
  'react-dom': 'ReactDOM',
  'lodash/isEqual': 'isEqual',
  'lodash/isFunction': 'isFunction',
  'lodash/isUndefined': 'isUndefined',
};

// Source maps are fine for a library even in production.
// They won't load unless DevTools is open.
// Plus, it's helpful for spotting bugs.
// https://css-tricks.com/should-i-use-source-maps-in-production/
const sourcemap = true;

const input = 'src/index.ts';
const output = {
  name: name,
  globals: deps,
  sourcemap: sourcemap,
};
const external = Object.keys(pkg.peerDependencies || {});

function createPlugins({ minify, snapshot } = {}) {
  const nodeEnvStr = !!minify ? 'development' : 'production';
  let plugins = [
    peerDepsExternal(),
    nodeResolve(),
    commonjs({ include: 'node_modules/**' }),
    typescript(),
    babel({ exclude: 'node_modules/**', plugins: [ 'external-helpers' ] }),
    replace({ 'process.env.NODE_ENV': JSON.stringify(nodeEnvStr) }),
  ];

  if (minify === true) {
    plugins.push(terser());
  }

  if (snapshot === true) {
    plugins.push(sizeSnapshot());
  }

  return plugins;
}

// #endregion

export default [
  {
    input,
    output: {
      ...output,
      file: 'dist/index.js',
      format: 'umd',
    },
    external: external,
    plugins: createPlugins({
      snapshot: true,
    }),
  },
  {
    input,
    output: {
      ...output,
      file: 'dist/index.min.js',
      format: 'umd',
    },
    external: external,
    plugins: createPlugins({
      minify: true,
      snapshot: true,
    }),
  },
  {
    input,
    output: {
      ...output,
      banner: '/* eslint-disable */',
      file: 'example/src/react-auto-controlled/index.js',
      format: 'umd',
    },
    external: external,
    plugins: createPlugins(),
  },
];
