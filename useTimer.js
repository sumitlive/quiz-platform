import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => { onExpireRef.current = onExpire; }, [onExpire]);

  const clear = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
  };

  const start = useCallback(() => {
    setIsRunning(true);
    setIsExpired(false);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback((seconds) => {
    clear();
    setIsRunning(false);
    setIsExpired(false);
    setTimeLeft(seconds ?? initialSeconds);
  }, [initialSeconds]);

  useEffect(() => {
    if (!isRunning) { clear(); return; }
    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(intervalRef.current);
          setIsRunning(false);
          setIsExpired(true);
          onExpireRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return clear;
  }, [isRunning]);

  const progress = initialSeconds > 0 ? timeLeft / initialSeconds : 0;
  const isWarning = timeLeft <= 10 && timeLeft > 0;
  const isDanger = timeLeft <= 5 && timeLeft > 0;

  return { timeLeft, isRunning, isExpired, isWarning, isDanger, progress, start, pause, reset };
}
