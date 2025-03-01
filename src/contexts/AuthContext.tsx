import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  UserCredential
} from 'firebase/auth';
import { auth, database } from '../config/firebase';
import { ref, set, get } from 'firebase/database';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<UserCredential>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      
      // Validate email domain
      const email = result.user.email;
      if (!email || !email.endsWith('@vitstudent.ac.in')) {
        // Sign out the user if the email domain is not allowed
        await signOut(auth);
        throw new Error('Only @vitstudent.ac.in email addresses are allowed');
      }
      
      // Reference to the user's data
      const userRef = ref(database, `users/${result.user.uid}`);
      
      // Get existing user data
      const snapshot = await get(userRef);
      const existingData = snapshot.val();
      
      // Merge existing data with new login data
      const updatedData = {
        ...existingData,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        lastLogin: new Date().toISOString(),
        // Preserve existing fields if they exist
        selectedDomains: existingData?.selectedDomains || [],
        quizzesAttempted: existingData?.quizzesAttempted || {},
        createdAt: existingData?.createdAt || new Date().toISOString()
      };

      // Update the user data
      await set(userRef, updatedData);
      
      return result;
    } catch (error) {
      console.error('Error signing in with Google:', error);
      throw error;
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  const value = {
    currentUser,
    loading,
    signInWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}; 