import { useEffect, useRef, useState } from "react";

/**
 * Monitors frames-per-second using requestAnimationFrame.
 * Updates the reported FPS value every `updateIntervalMs` milliseconds.
 */
export function useFpsMonitor(updateIntervalMs = 500) {
  const [fps, setFps] = useState(0);
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());
  const rafIdRef = useRef(0);

  useEffect(() => {
    function tick() {
      frameCountRef.current++;
      const now = performance.now();
      const elapsed = now - lastTimeRef.current;

      if (elapsed >= updateIntervalMs) {
        setFps(Math.round((frameCountRef.current * 1000) / elapsed));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
      }

      rafIdRef.current = requestAnimationFrame(tick);
    }

    rafIdRef.current = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafIdRef.current);
    };
  }, [updateIntervalMs]);

  return fps;
}
