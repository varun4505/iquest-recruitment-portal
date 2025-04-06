// Simple script to set up public timer data in Firebase Realtime Database

import { ref, set } from 'firebase/database';
import { database } from '../config/firebase';

/**
 * Sets up timer data in both the private and public locations in Firebase Realtime Database
 * This ensures both authenticated and unauthenticated users can access timer information
 * 
 * @param {string} timerType - Either 'registration' or 'quiz'
 * @param {Date} endDate - The end date for the timer
 * @returns {Promise} - Promise that resolves when both writes are complete
 */
export const setupPublicTimer = async (timerType, endDate) => {
  if (!timerType || !endDate) {
    throw new Error('Timer type and end date are required');
  }

  const timerData = {
    endTime: endDate.toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    // Set data in both private and public locations
    const privateRef = ref(database, `timers/${timerType}`);
    const publicRef = ref(database, `public/timers/${timerType}`);
    
    // Execute both writes
    await Promise.all([
      set(privateRef, timerData),
      set(publicRef, timerData)
    ]);

    console.log(`Successfully set up ${timerType} timer in both locations`);
    return true;
  } catch (error) {
    console.error(`Failed to set up ${timerType} timer:`, error);
    throw error;
  }
};

// Example usage in an admin component:
/*
import { setupPublicTimer } from '../utils/setupPublicTimers';

// In your admin component:
const handleSetRegistrationTimer = () => {
  // Set registration to end in 7 days
  const registrationEndDate = new Date();
  registrationEndDate.setDate(registrationEndDate.getDate() + 7);
  
  setupPublicTimer('registration', registrationEndDate)
    .then(() => {
      console.log('Registration timer set up');
      // Show success message to admin
    })
    .catch(err => {
      console.error('Failed to set up registration timer', err);
      // Show error message to admin
    });
};

// Set quiz results availability
const handleSetQuizTimer = () => {
  const quizEndDate = new Date();
  quizEndDate.setDate(quizEndDate.getDate() + 14);
  
  setupPublicTimer('quiz', quizEndDate)
    .then(() => console.log('Quiz timer set up'))
    .catch(err => console.error('Failed to set up quiz timer', err));
};
*/