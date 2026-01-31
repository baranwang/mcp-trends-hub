import path from "node:path";
import { defineConfig } from "@rslib/core";
import { version } from "./package.json";
import { readmePlugin } from "./scripts/readme";

export default defineConfig({
  lib: [
    {
      format: "esm",
      dts: true,
    },
    {
      format: "cjs",
    },
  ],
  source: {
    define: {
      "process.env.PACKAGE_VERSION": JSON.stringify(version),
      "process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV),
    },
  },
  plugins: [readmePlugin({ readmePath: path.resolve("README.md") })],
});
