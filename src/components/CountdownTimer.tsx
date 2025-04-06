import { useState, useEffect } from 'react';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { ClockIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

interface CountdownTimerProps {
  type?: 'registration' | 'results';
  title?: string;
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
    days?: number;
    hours?: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  
  const [loading, setLoading] = useState(true);
  const [expired, setExpired] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [endTimeValue, setEndTimeValue] = useState<number | null>(null);
  const { currentUser } = useAuth();
  const [usingFirebaseData, setUsingFirebaseData] = useState(false);

  // Hard-coded default end times using a specific date
  const getHardCodedEndTime = () => {
    // Set a specific end date: March 4, 2025, 23:59:00
    const endDate = new Date(2025, 2, 5, 23, 59, 0); // Month is 0-based (0=Jan, 1=Feb, 2=Mar)
    
    console.log(`Setting hard-coded end time for ${type}: ${endDate.toISOString()}`);
    return endDate.getTime();
  };

  // First useEffect: Fetch the end time
  useEffect(() => {
    console.log("Fetching end time...");
    
    const fetchEndTime = async () => {
      try {
        // Try multiple paths to access the timer data for maximum compatibility
        // with both authenticated and unauthenticated states
        const timerType = type === 'registration' ? 'registration' : 'quiz';
        const possiblePaths = [
          `public/timers/${timerType}`, // Try the public path first
          `timers/${timerType}`,        // Try the direct path as a backup
        ];
        
        let timerData = null;
        let accessError = null;
        
        // Try each path until we find one that works
        for (const path of possiblePaths) {
          try {
            console.log(`Attempting to read timer data from path: ${path}`);
            const timerRef = ref(database, path);
            const snapshot = await get(timerRef);
            
            if (snapshot.exists()) {
              const data = snapshot.val();
              console.log('Firebase timer data:', data);
              
              if (data?.endTime) {
                timerData = data;
                console.log(`Successfully loaded timer data from ${path}`);
                break; // Exit the loop if successful
              }
            } else {
              console.log(`No timer data found at ${path}`);
            }
          } catch (pathError) {
            console.error(`Error accessing Firebase path ${path}:`, pathError);
            accessError = pathError;
            // Continue trying other paths
          }
        }
        
        if (timerData) {
          // Successfully found timer data
          const parsedEndTime = new Date(timerData.endTime).getTime();
          console.log(`Setting end time from Firebase: ${new Date(parsedEndTime).toISOString()}`);
          setEndTimeValue(parsedEndTime);
          setUsingFirebaseData(true);
          setLoading(false);
          
          // Save to cache for future use
          try {
            const dataToCache = {
              endTime: new Date(parsedEndTime).toISOString(),
              cachedAt: new Date().toISOString()
            };
            localStorage.setItem(`timer_${type}`, JSON.stringify(dataToCache));
            console.log(`Cached timer data for ${type}`);
          } catch (cacheErr) {
            console.error('Error caching timer data:', cacheErr);
          }
          
          return; // Exit early if we got data
        }
        
        // If we're here, all Firebase paths failed
        if (accessError) {
          console.warn('All Firebase paths failed, trying cache as fallback');
        }
        
        // Try to use cached data if Firebase failed
        const cachedTimerData = localStorage.getItem(`timer_${type}`);
        if (cachedTimerData) {
          try {
            const parsedData = JSON.parse(cachedTimerData);
            if (parsedData?.endTime) {
              const parsedEndTime = new Date(parsedData.endTime).getTime();
              console.log(`Using cached timer data: ${new Date(parsedEndTime).toISOString()}`);
              setEndTimeValue(parsedEndTime);
              setUsingFirebaseData(true);
              setLoading(false);
              return;
            }
          } catch (cacheError) {
            console.error('Error parsing cached timer data:', cacheError);
          }
        }
        
        // If we're here, we couldn't get Firebase data or use cache
        // Use hard-coded defaults
        console.log('No valid timer data found, using hard-coded default');
        setEndTimeValue(getHardCodedEndTime());
        setUsingFirebaseData(false);
        setLoading(false);
      } catch (err) {
        console.error('Error in timer setup:', err);
        setError(err instanceof Error ? err : new Error('Unknown error in timer setup'));
        setLoading(false);
      }
    };
    
    fetchEndTime();
    
    return () => {
      // Cleanup if needed
    };
  }, [type, currentUser]);

  // Second useEffect: Update the timer every second once we have an endTimeValue
  useEffect(() => {
    if (endTimeValue === null) {
      console.log("No end time value set yet, waiting...");
      return; // Don't set up interval yet
    }
    
    console.log(`Setting up timer interval with end time: ${new Date(endTimeValue).toISOString()}`);
    let intervalId: number;
    
    // Immediately calculate initial time
    updateRemainingTime();
    
    // Set up timer update interval
    intervalId = window.setInterval(() => {
      updateRemainingTime();
    }, 1000);
    
    // Cleanup interval on unmount or when endTimeValue changes
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
    
    function updateRemainingTime() {
      try {
        const now = Date.now();
        if (!endTimeValue) {
          return;
        }
        const distance = endTimeValue - now;
        
        console.log(`Timer update - current time: ${new Date(now).toISOString()}, end time: ${new Date(endTimeValue).toISOString()}, distance: ${distance}ms`);
        
        if (distance < 0) {
          // Time has passed
          console.log('Timer expired');
          setExpired(true);
          setTimeRemaining({ days: 0, hours: 0, minutes: 0, seconds: 0 });
          return;
        }
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        console.log(`Time remaining: ${days} days, ${hours} hours, ${minutes} minutes, ${seconds} seconds`);
        setTimeRemaining({ days, hours, minutes, seconds });
      } catch (error) {
        console.error('Error updating timer:', error);
        setError(error instanceof Error ? error : new Error('Unknown error updating timer'));
      }
    }
  }, [endTimeValue]); // This effect depends on endTimeValue

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
      
      {/* Add a small indicator if using cached/default time when not logged in */}
      {!currentUser && !usingFirebaseData && (
        <div className="text-center text-xs text-gray-400 mt-1">
          Log in to see accurate countdown
        </div>
      )}
    </div>
  );
};

export default CountdownTimer;