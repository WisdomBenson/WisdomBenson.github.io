import { defineConfig, globalIgnores } from "eslint/config"
import nextVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"

export default defineConfig([
  ...nextVitals,
  ...nextTypescript,
  globalIgnores([
    ".next/**",
    "out/**",
    "dist/**",
    "next-env.d.ts",
    "public/vendor/mediapipe/vision_bundle.mjs",
    "public/vendor/mediapipe/wasm/**",
  ]),
])
