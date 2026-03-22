// prettier.config.js

import * as prettierPluginTailwindcss from "prettier-plugin-tailwindcss";

/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
export default {
  plugins: [prettierPluginTailwindcss],
  tailwindFunctions: ["clsx"],
};
