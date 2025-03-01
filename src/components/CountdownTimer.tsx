import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { ClockIcon } from '@heroicons/react/24/outline';

interface CountdownTimerProps {
  type: 'registration' | 'results';
  title: string;
  description?: string;
  showIcon?: boolean;
  className?: string;
}

const CountdownTimer = ({
  type,
  title,
  description,
  showIcon = true,
  className = '',
}: CountdownTimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let intervalId: number;
    
    const fetchEndTime = async () => {
      try {
        // Default fallback times
        let endTime: number;
        const now = new Date();
        
        try {
          const timerRef = ref(database, `timers/${type === 'registration' ? 'registration' : 'quiz'}`);
          const snapshot = await get(timerRef);
          
          if (snapshot.exists()) {
            const data = snapshot.val();
            if (data?.endTime) {
              endTime = new Date(data.endTime).getTime();
            } else {
              // Use defaults if endTime doesn't exist in the data
              if (type === 'registration') {
                const defaultEnd = new Date(now);
                defaultEnd.setDate(defaultEnd.getDate() + 3);
                endTime = defaultEnd.getTime();
              } else {
                const defaultEnd = new Date(now);
                defaultEnd.setDate(defaultEnd.getDate() + 10);
                endTime = defaultEnd.getTime();
              }
            }
          } else {
            // Use defaults if no data exists
            if (type === 'registration') {
              const defaultEnd = new Date(now);
              defaultEnd.setDate(defaultEnd.getDate() + 3);
              endTime = defaultEnd.getTime();
            } else {
              const defaultEnd = new Date(now);
              defaultEnd.setDate(defaultEnd.getDate() + 10);
              endTime = defaultEnd.getTime();
            }
          }
        } catch (err) {
          console.error('Error accessing Firebase:', err);
          // Use defaults on error
          if (type === 'registration') {
            const defaultEnd = new Date(now);
            defaultEnd.setDate(defaultEnd.getDate() + 3);
            endTime = defaultEnd.getTime();
          } else {
            const defaultEnd = new Date(now);
            defaultEnd.setDate(defaultEnd.getDate() + 10);
            endTime = defaultEnd.getTime();
          }
        }
        
        // Set up timer to update every second
        const updateTimer = () => {
          try {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
              // Time has passed
              setExpired(true);
              setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
              return;
            }
            
            // Calculate time units
            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);
            
            setTimeRemaining({ days, hours, minutes, seconds });
          } catch (error) {
            console.error('Error updating timer:', error);
            clearInterval(intervalId);
            setError(error instanceof Error ? error : new Error('Unknown error updating timer'));
          }
        };
        
        // Initial update
        updateTimer();
        
        // Set interval to update every second
        intervalId = window.setInterval(updateTimer, 1000);
        
        // Set loading to false
        setLoading(false);
      } catch (err) {
        console.error('Error in timer setup:', err);
        setError(err instanceof Error ? err : new Error('Unknown error in timer setup'));
        setLoading(false);
      }
    };
    
    fetchEndTime();
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [type]);

  // Handle error state
  if (error) {
    return (
      <div className={`terminal-card p-4 text-center ${className}`}>
        <h3 className="terminal-title mb-2">{title}</h3>
        <div className="text-2xl font-bold text-terminal-highlight">
          {type === 'registration' ? '3 Days Remaining' : '10 Days Remaining'}
        </div>
      </div>
    );
  }

  // Handle loading state
  if (loading) {
    return (
      <div className={`terminal-card p-4 text-center ${className}`}>
        <h3 className="terminal-title mb-2">{title}</h3>
        <div className="flex justify-center">
          <div className="animate-spin h-6 w-6 border-2 border-terminal-highlight rounded-full border-t-transparent"></div>
        </div>
      </div>
    );
  }

  // Handle expired state
  if (expired) {
    return (
      <div className={`terminal-card p-4 text-center ${className}`}>
        <h3 className="terminal-title mb-2">{title}</h3>
        <div className="terminal-text text-error-400">
          {type === 'registration' ? 'Registration Closed' : 'Time Expired'}
        </div>
      </div>
    );
  }

  // Main timer display
  const { days, hours, minutes, seconds } = timeRemaining;

  return (
    <div className={`terminal-card p-4 ${className}`}>
      <h3 className="terminal-title mb-2 flex items-center justify-center">
        {showIcon && <ClockIcon className="h-5 w-5 mr-2 text-terminal-highlight" />}
        {title}
      </h3>
      
      {description && (
        <p className="terminal-text text-sm mb-3 text-center">{description}</p>
      )}
      
      <div className="grid grid-cols-4 gap-2 mb-2">
        <div className="bg-gray-900/30 p-2 rounded text-center">
          <div className="text-2xl font-mono text-terminal-highlight">{days}</div>
          <div className="text-xs terminal-text opacity-80">Days</div>
        </div>
        <div className="bg-gray-900/30 p-2 rounded text-center">
          <div className="text-2xl font-mono text-terminal-highlight">{hours}</div>
          <div className="text-xs terminal-text opacity-80">Hours</div>
        </div>
        <div className="bg-gray-900/30 p-2 rounded text-center">
          <div className="text-2xl font-mono text-terminal-highlight">{minutes}</div>
          <div className="text-xs terminal-text opacity-80">Mins</div>
        </div>
        <div className="bg-gray-900/30 p-2 rounded text-center">
          <div className="text-2xl font-mono text-terminal-highlight">{seconds}</div>
          <div className="text-xs terminal-text opacity-80">Secs</div>
        </div>
      </div>
      
      <div className="text-center text-xs terminal-text opacity-70">
        {type === 'registration' 
          ? 'Register before time expires' 
          : 'Results will be announced soon'}
      </div>
    </div>
  );
};

export default CountdownTimer; 