import React, { createContext, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  startTimer,
  pauseTimer,
  skipSession,
  closeBreakModal,
  updateCurrentTime,
} from './pomodoroSlice';

export const TimerContext = createContext();

export const TimerProvider = ({ children }) => {
  const dispatch = useDispatch();
  const {
    currentTime,
    isRunning,
    startTimestamp,
    pausedTimeRemaining,
    session,
    showBreakModal,
  } = useSelector((state) => state.pomodoro);

  const timerRef = useRef(null);

  // Handle timer updates
  useEffect(() => {
    if (isRunning && !timerRef.current) {
      // Start a new interval that updates every second
      timerRef.current = setInterval(() => {
        dispatch(updateCurrentTime());
      }, 1000);
    } else if (!isRunning && timerRef.current) {
      // Clear interval when timer is paused or stopped
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    // Cleanup on unmount
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isRunning, dispatch]);

  // Adjusted visibility change handler
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && isRunning) {
        // Update the current time immediately to catch up
        dispatch(updateCurrentTime());
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isRunning, dispatch]);

  // Watch for computer sleep/wake
  useEffect(() => {
    let lastTime = Date.now();

    const handleTimeUpdate = () => {
      const currentTime = Date.now();
      const timeDiff = currentTime - lastTime;

      // If more than 2 seconds have passed between updates,
      // assume the computer went to sleep
      if (timeDiff > 2000 && isRunning) {
        dispatch(updateCurrentTime());
      }

      lastTime = currentTime;
    };

    const interval = setInterval(handleTimeUpdate, 1000);

    return () => clearInterval(interval);
  }, [isRunning, dispatch]);

  const contextValue = {
    currentTime,
    isRunning,
    startTimer: () => dispatch(startTimer()),
    pauseTimer: () => dispatch(pauseTimer()),
    skipSession: () => dispatch(skipSession()),
    closeBreakModal: () => dispatch(closeBreakModal()),
    session,
    showBreakModal,
    startTimestamp,
    pausedTimeRemaining,
  };

  return (
    <TimerContext.Provider value={contextValue}>
      {children}
    </TimerContext.Provider>
  );
};
