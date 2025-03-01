import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, set, get } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Domain } from '../types';
import toast from 'react-hot-toast';

const domains: { id: Domain; title: string; description: string }[] = [
  {
    id: 'Technical',
    title: 'Technical',
    description: 'Dive deep into programming, system design, and cutting-edge technologies.',
  },
  {
    id: 'Design',
    title: 'Design',
    description: 'Create beautiful and functional designs for web, mobile, and brand identity.',
  },
  {
    id: 'Editorial',
    title: 'Editorial',
    description: 'Craft compelling content and stories that engage and inform our audience.',
  },
  {
    id: 'Management',
    title: 'Management',
    description: 'Lead teams and projects while developing essential organizational skills.',
  },
];

const DomainSelection = () => {
  const [selectedDomains, setSelectedDomains] = useState<Domain[]>([]);
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkAccess = async () => {
      if (!currentUser) return;

      try {
        setPageLoading(true);
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const userData = snapshot.val();
          
          // Check if any quiz has been completed
          if (userData.quizzesAttempted && Object.values(userData.quizzesAttempted).some(attempted => attempted)) {
            toast.error('You cannot change domains after completing a quiz');
            navigate('/dashboard');
            return;
          }
          
          setSelectedDomains(userData.selectedDomains || []);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        toast.error('Failed to load your selected domains');
      } finally {
        setPageLoading(false);
      }
    };

    checkAccess();
  }, [currentUser, navigate]);

  const toggleDomain = (domain: Domain) => {
    setSelectedDomains((prev) => {
      if (prev.includes(domain)) {
        return prev.filter((d) => d !== domain);
      }
      if (prev.length >= 2) {
        toast.error('You can only select up to 2 domains');
        return prev;
      }
      return [...prev, domain];
    });
  };

  const handleSubmit = async () => {
    if (selectedDomains.length === 0) {
      return toast.error('Please select at least one domain');
    }

    if (!currentUser) {
      return toast.error('You must be logged in to continue');
    }

    try {
      setLoading(true);
      
      // Before saving, check once more if the user has taken any quizzes
      const userRef = ref(database, `users/${currentUser.uid}`);
      const snapshot = await get(userRef);
      
      if (snapshot.exists()) {
        const userData = snapshot.val();
        if (userData.quizzesAttempted && Object.values(userData.quizzesAttempted).some(attempted => attempted)) {
          toast.error('You cannot change domains after completing a quiz');
          navigate('/dashboard');
          return;
        }
      }
      
      // Create the user data object with proper typing
      const newUserData = {
        email: currentUser.email,
        displayName: currentUser.displayName,
        photoURL: currentUser.photoURL,
        selectedDomains,
        quizzesAttempted: Object.fromEntries(
          selectedDomains.map((domain) => [domain, false])
        ),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      // Merge with existing data if it exists
      const finalData = snapshot.exists() ? {
        ...snapshot.val(),
        selectedDomains,
        quizzesAttempted: {
          ...Object.fromEntries(
            selectedDomains.map((domain) => [domain, false])
          ),
          // Preserve the status of domains that have been attempted but are being kept
          ...(snapshot.val().quizzesAttempted ? 
            Object.fromEntries(
              Object.entries(snapshot.val().quizzesAttempted)
                .filter(([domain]) => selectedDomains.includes(domain as Domain))
            ) : {}),
        },
        updatedAt: new Date().toISOString()
      } : newUserData;

      // Write the data with proper error handling
      try {
        await set(userRef, finalData);
        toast.success('Domains selected successfully!');
        navigate('/dashboard');
      } catch (writeError: any) {
        console.error('Error writing to database:', writeError);
        throw new Error(writeError.message || 'Failed to save domains');
      }

    } catch (error: any) {
      console.error('Error saving domains:', error);
      toast.error(error.message || 'Failed to save your domain selections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-200 dark:bg-primary-700 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-gray-200 dark:bg-gray-700 rounded mb-3"></div>
          <div className="h-3 w-24 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <br></br>
        <h1 className="text-3xl font-bold text-terminal-highlight mb-4">
          Choose Your Domains
        </h1>
        <p className="terminal-text text-lg">
          Select up to two domains that interest you the most. Your selection will
          determine your learning path and questionnaire.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {domains.map((domain) => (
          <button
            key={domain.id}
            onClick={() => toggleDomain(domain.id)}
            className={`terminal-card transition-all duration-200 ${
              selectedDomains.includes(domain.id)
                ? 'ring-2 ring-terminal-highlight'
                : ''
            }`}
          >
            <h3 className="terminal-title">
              {domain.title}
            </h3>
            <p className="terminal-text">
              {domain.description}
            </p>
            <div className="mt-4 flex items-center">
              {selectedDomains.includes(domain.id) ? (
                <span className="terminal-status-completed text-sm">
                  Selected ✓
                </span>
              ) : (
                <span className="text-gray-400 text-sm font-mono">
                  Click to select
                </span>
              )}
            </div>
          </button>
        ))}
      </div>

      <div className="text-center">
        <button
          onClick={handleSubmit}
          disabled={loading || selectedDomains.length === 0}
          className="btn-primary px-8 py-3 text-lg flex items-center gap-2 mx-auto font-mono"
        >
          {loading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
              Processing...
            </>
          ) : (
            'Continue to Dashboard'
          )}
        </button>
      </div>
    </div>
  );
};

export default DomainSelection; 