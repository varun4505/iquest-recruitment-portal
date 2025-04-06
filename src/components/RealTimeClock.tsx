import React, { useState, useEffect } from 'react';

interface RealTimeClockProps {
  className?: string;
}

const RealTimeClock: React.FC<RealTimeClockProps> = ({ className }) => {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <div className={className}>
      <span className="font-mono">
        {date.toLocaleDateString()} {date.toLocaleTimeString()}
      </span>
    </div>
  );
};

export default RealTimeClock;