import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";

/**
 * Patches a race condition in @luma.gl/core 9.2.x where ResizeObserver fires
 * before `device.limits` is initialised, causing
 * "Cannot read properties of undefined (reading 'maxTextureDimension2D')".
 */
function patchLumaCanvasContext(): Plugin {
  return {
    name: "patch-luma-canvas-context",
    transform(code, id) {
      if (!id.includes("@luma.gl/core") || !id.includes("canvas-context")) {
        return null;
      }
      if (!code.includes("this.device.limits.maxTextureDimension2D")) {
        return null;
      }
      return code.replace(
        "this.device.limits.maxTextureDimension2D",
        "(this.device?.limits?.maxTextureDimension2D ?? 8192)",
      );
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), patchLumaCanvasContext()],
});
