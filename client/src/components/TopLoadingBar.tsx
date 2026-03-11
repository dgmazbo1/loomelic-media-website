import { useCallback, useRef, useState } from "react";

/**
 * Minimal top loading bar hook used by DashboardLayout.
 * Renders a thin progress bar at the top of the viewport.
 */
export function useTopLoadingBar() {
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    setVisible(true);
    setProgress(10);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 90;
        }
        return prev + Math.random() * 15;
      });
    }, 300);
  }, []);

  const done = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    setProgress(100);
    setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
  }, []);

  const TopLoadingBar = () =>
    visible ? (
      <div
        className="fixed top-0 left-0 z-[9999] h-0.5 bg-primary transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    ) : null;

  return { start, done, TopLoadingBar };
}
