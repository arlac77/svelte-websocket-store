import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

import svelte from "rollup-plugin-svelte";
import { terser } from "rollup-plugin-terser";
import dev from "rollup-plugin-dev";
import copy from "rollup-plugin-copy";
import consts from "rollup-plugin-consts";
import { name, description, version, config } from "./package.json";

const production = !process.env.ROLLUP_WATCH;
const dist = "public";
const port = 5000;

export default {
  input: "src/main.mjs",
  output: {
    sourcemap: true,
    format: "esm",
    file: `${dist}/bundle.mjs`
  },
  plugins: [
    consts({
      name,
      version,
      description,
      ...config
    }),
    copy({
      targets: [{ src: "node_modules/mf-styling/global.css", dest: dist }]
    }),
    svelte({
      dev: !production,
      css: css => {
        css.write(`${dist}/bundle.css`);
      }
    }),
    resolve({ browser: true }),
    commonjs(),
    production && terser(),
    dev({
      port,
      dirs: [dist],
      spa: `${dist}/index.html`,
      basePath: config.base,
      proxy: { [`${config.api}/*`]: [config.proxyTarget, { https: true }] }
    })
  ],
  watch: {
    clearScreen: false
  }
};
