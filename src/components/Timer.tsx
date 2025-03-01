import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';

interface TimerProps {
  type: 'registration' | 'results';
  title?: string;
}

const calculateTimeRemaining = (endTime: number) => {
  const currentTime = new Date().getTime();
  return Math.max(0, endTime - currentTime);
};

const Timer = ({ type, title }: TimerProps) => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    const timerRef = ref(database, `timers/${type === 'registration' ? 'registration' : 'quiz'}`);
    const fetchTimer = async () => {
      try {
        const snapshot = await get(timerRef);
        if (snapshot.exists() && snapshot.val().endTime) {
          const endTimeString = snapshot.val().endTime;
          const endTime = new Date(endTimeString).getTime();
          const timeRemaining = calculateTimeRemaining(endTime);
          setTimeRemaining(timeRemaining);
        }
      } catch (error) {
        console.error('Error fetching timer data:', error);
      }
    };
    fetchTimer();
  }, [type]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let intervalId: number;
    
    const fetchAndSetupTimer = async () => {
      try {
        // Set default fallback time
        let endTime: number;
        
        // Try to fetch from Firebase
        try {
          const timerRef = ref(database, `timers/${type === 'registration' ? 'registration' : 'quiz'}`);
          const snapshot = await get(timerRef);
          
          if (snapshot.exists() && snapshot.val().endTime) {
            const endTimeString = snapshot.val().endTime;
            endTime = new Date(endTimeString).getTime();
          } else {
            // Use defaults if not in database
            const now = new Date();
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
        } catch (fetchError) {
          console.error('Error fetching timer data:', fetchError);
          // Use defaults on error
          const now = new Date();
          if (type === 'registration') {
            const fallback = new Date(now);
            fallback.setDate(fallback.getDate() + 3);
            endTime = fallback.getTime();
          } else {
            const fallback = new Date(now);
            fallback.setDate(fallback.getDate() + 10);
            endTime = fallback.getTime();
          }
        }

        // Set up timer update function
        const updateTimer = () => {
          try {
            const now = new Date().getTime();
            const distance = endTime - now;
            
            if (distance < 0) {
              // Time has passed
              setTimeRemaining(0);
              return;
            }
            
            setTimeRemaining(distance);
          } catch (updateError) {
            console.error('Error updating timer:', updateError);
            setError(updateError instanceof Error ? updateError : new Error('Unknown timer update error'));
            if (intervalId) clearInterval(intervalId);
          }
        };
        
        // Initial update
        updateTimer();
        
        // Set interval for updates
        intervalId = window.setInterval(updateTimer, 1000);
        setLoading(false);
      } catch (setupError) {
        console.error('Error setting up timer:', setupError);
        setError(setupError instanceof Error ? setupError : new Error('Unknown timer setup error'));
        setLoading(false);
      }
    };
    
    fetchAndSetupTimer();
    
    // Cleanup interval on unmount
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [type]);

  // Handle error state - show a fallback
  if (error) {
    return (
      <span className="font-mono">
        {type === 'registration' ? '3 Days' : '10 Days'} Remaining
      </span>
    );
  }

  // Handle loading state
  if (loading) {
    return <span className="opacity-70">Loading...</span>;
  }

  const minutes = Math.floor(timeRemaining / (1000 * 60));
  const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

  // For the complete timer display with title
  if (title) {
    return (
      <div>
        <h3 className="terminal-text mb-1">{title}</h3>
        <div className="text-2xl font-bold text-terminal-highlight">
          {renderTimeDisplay(minutes, seconds)}
        </div>
      </div>
    );
  }

  // Just the time for inline usage
  return renderTimeDisplay(minutes, seconds);
};

// Helper function to render the time display
const renderTimeDisplay = (minutes: number, seconds: number) => {
  // Format for full display with minutes and seconds
  return (
    <span className="font-mono">
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
};

export default Timer; 