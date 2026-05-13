import { useState, useEffect, useRef, useCallback } from "react";

export function useTimer(initialSeconds, onExpire) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const [currentMax, setCurrentMax] = useState(initialSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const intervalRef = useRef(null);
  const onExpireRef = useRef(onExpire);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const start = useCallback(() => {
    setIsExpired(false);
    setIsRunning(true);
  }, []);

  const pause = useCallback(() => setIsRunning(false), []);

  const reset = useCallback(
    (seconds = initialSeconds, autoStart = false) => {
      const normalizedSeconds = Number(seconds) || initialSeconds;
      clear();
      setIsExpired(false);
      setTimeLeft(normalizedSeconds);
      setCurrentMax(normalizedSeconds);
      setIsRunning(autoStart && normalizedSeconds > 0);
    },
    [initialSeconds, clear]
  );

  useEffect(() => {
    if (!isRunning) {
      clear();
      return;
    }

    intervalRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          setIsRunning(false);
          setIsExpired(true);
          onExpireRef.current?.();
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    return () => {
      clear();
    };
  }, [isRunning, clear]);

  const progress = currentMax > 0 ? timeLeft / currentMax : 0;
  const isWarning = timeLeft <= 10 && timeLeft > 0;
  const isDanger = timeLeft <= 5 && timeLeft > 0;

  return {
    timeLeft,
    isRunning,
    isExpired,
    isWarning,
    isDanger,
    progress,
    start,
    pause,
    reset,
  };
}