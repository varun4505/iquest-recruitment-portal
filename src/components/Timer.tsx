import { useState, useEffect } from 'react';

interface TimerProps {
  duration: number; // Duration in seconds
  onExpire: () => void;
  className?: string;
}

const Timer = ({ duration, onExpire, className = '' }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(duration);

  useEffect(() => {
    if (timeRemaining <= 0) {
      onExpire();
      return;
    }

    const intervalId = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalId);
          onExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeRemaining, onExpire]);

  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;

  return (
    <div className={`text-terminal-highlight font-mono ${className}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </div>
  );
};

export default Timer;