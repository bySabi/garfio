import babel from 'rollup-plugin-babel';
import cleanup from 'rollup-plugin-cleanup';
import { terser } from 'rollup-plugin-terser';
import pkg from './package.json';

const common = {
  external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
  plugins: [babel(), cleanup(), terser()],
};

export default [
  {
    input: 'src/index.js',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
      },
    ],
    ...common,
  },
  {
    input: 'src/container.js',
    output: [
      {
        file: 'lib/container.js',
        format: 'cjs',
      },
    ],
    ...common,
  },
  {
    input: 'src/store.js',
    output: [
      {
        file: 'lib/store.js',
        format: 'cjs',
      },
    ],
    ...common,
  },
  {
    input: 'src/simple.js',
    output: [
      {
        file: 'lib/simple.js',
        format: 'cjs',
      },
    ],
    ...common,
  },
];
