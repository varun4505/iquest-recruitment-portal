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
      
      // Create the user data object, preserving existing user data
      let finalData = {};
      
      if (snapshot.exists()) {
        // Keep existing user data and update only necessary fields
        finalData = {
          ...snapshot.val(),
          selectedDomains,
          quizzesAttempted: {
            // Create new entries for the selected domains
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
        };
      } else {
        // This should rarely happen since we're creating the user in Login.tsx
        // but just in case, create a new user object
        finalData = {
          email: currentUser.email,
          displayName: currentUser.displayName || 'Anonymous',
          photoURL: currentUser.photoURL || '',
          selectedDomains,
          quizzesAttempted: Object.fromEntries(
            selectedDomains.map((domain) => [domain, false])
          ),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          lastLogin: new Date().toISOString()
        };
      }

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
        <div className="terminal-box p-8 rounded-sm border border-terminal-highlight/50 animate-pulse flex flex-col items-center relative overflow-hidden glow-terminal-box">
          {/* Corner Brackets */}
          <span className="terminal-corner terminal-corner-tl"></span>
          <span className="terminal-corner terminal-corner-tr"></span>
          <span className="terminal-corner terminal-corner-bl"></span>
          <span className="terminal-corner terminal-corner-br"></span>
          
          {/* Terminal Header */}
          <div className="terminal-header -mx-8 -mt-8 mb-6 px-4 py-2">
            <div className="terminal-header-dots">
              <span className="terminal-header-dot bg-red-500"></span>
              <span className="terminal-header-dot bg-yellow-500"></span>
              <span className="terminal-header-dot bg-green-500"></span>
            </div>
            <div className="terminal-header-title">loading-domains.sys</div>
            <div className="w-16"></div>
          </div>
          
          <div className="w-16 h-16 bg-terminal-bg border border-terminal-highlight/30 rounded-full flex items-center justify-center">
            <div className="w-10 h-10 rounded-full bg-terminal-highlight/20 animate-pulse"></div>
          </div>
          <div className="mt-4 h-4 bg-terminal-dim/20 rounded w-48"></div>
          
          {/* Scan Lines and Noise */}
          <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
          <div className="noise-overlay"></div>
          <div className="loading-bar mt-6 w-48 h-1"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="terminal-box p-6 mb-12 rounded-sm border border-terminal-highlight/50 relative overflow-hidden glow-terminal-box">
          {/* Corner Brackets */}
          <span className="terminal-corner terminal-corner-tl"></span>
          <span className="terminal-corner terminal-corner-tr"></span>
          <span className="terminal-corner terminal-corner-bl"></span>
          <span className="terminal-corner terminal-corner-br"></span>
          
          {/* Terminal Header */}
          <div className="terminal-header -mx-6 -mt-6 mb-4 px-4 py-2">
            <div className="terminal-header-dots">
              <span className="terminal-header-dot bg-red-500"></span>
              <span className="terminal-header-dot bg-yellow-500"></span>
              <span className="terminal-header-dot bg-green-500"></span>
            </div>
            <div className="terminal-header-title">domain-selection.exe</div>
            <div className="w-16"></div>
          </div>
          
          <div className="text-center">
            <h1 className="text-3xl font-bold text-terminal-highlight glow-terminal-text">
              Select Your Domains
            </h1>
            <div className="terminal-glow-line my-4"></div>
            <p className="mt-2 text-terminal-text">
              Choose up to <span className="text-terminal-highlight">2 domains</span> that align with your interests and skills.
            </p>
          </div>
          
          {/* Scan Lines and Noise */}
          <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
          <div className="noise-overlay"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-10">
          {domains.map((domain) => (
            <button
              key={domain.id}
              onClick={() => toggleDomain(domain.id)}
              className={`terminal-box p-4 rounded-sm relative overflow-hidden transition-all duration-300 ${
                selectedDomains.includes(domain.id)
                  ? 'border-terminal-highlight border-2 bg-terminal-highlight/10'
                  : 'border border-terminal-highlight/30 hover:border-terminal-highlight hover:bg-terminal-highlight/5'
              }`}
            >
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header - Small version */}
              <div className="flex items-center justify-between text-xs text-terminal-highlight/70 mb-3 pb-2 border-b border-terminal-highlight/20">
                <div className="flex items-center">
                  <span className="mr-2">$</span>
                  <span className="typewriter">select {domain.id.toLowerCase()}</span>
                </div>
                <div className={`terminal-status ${selectedDomains.includes(domain.id) ? 'online' : 'standby'}`}>
                  {selectedDomains.includes(domain.id) ? 'SELECTED' : 'AVAILABLE'}
                </div>
              </div>
              
              <h3 className="text-xl font-bold mb-1 text-terminal-highlight">
                {domain.title} Domain
              </h3>
              <p className="text-sm text-terminal-text">
                {domain.description}
              </p>
              
              <div className="terminal-code-block mt-3 text-xs">
                <code>$ skill --list {domain.id.toLowerCase()}</code>
              </div>
              
              <div className={`absolute bottom-3 right-3 transition-all duration-300 ${
                selectedDomains.includes(domain.id) 
                  ? 'opacity-100 scale-100' 
                  : 'opacity-0 scale-0'
              }`}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-terminal-highlight" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
            </button>
          ))}
        </div>

        <div className="terminal-box p-4 rounded-sm border border-terminal-highlight/50 relative overflow-hidden glow-terminal-box">
          {/* Corner Brackets */}
          <span className="terminal-corner terminal-corner-tl"></span>
          <span className="terminal-corner terminal-corner-tr"></span>
          <span className="terminal-corner terminal-corner-bl"></span>
          <span className="terminal-corner terminal-corner-br"></span>
          
          <div className="text-center">
            <p className="text-terminal-text mb-4">
              {selectedDomains.length === 0
                ? 'Please select at least one domain to continue.'
                : (selectedDomains.length === 1 
                  ? `You've selected 1 domain: ${selectedDomains[0]}.` 
                  : `You've selected 2 domains: ${selectedDomains.join(' and ')}.`)}
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={selectedDomains.length === 0 || loading}
              className={`interactive-button w-full sm:w-auto px-8 py-3 rounded-sm
                ${selectedDomains.length === 0 || loading 
                  ? 'opacity-50 cursor-not-allowed' 
                  : 'hover:bg-terminal-highlight/10'}
              `}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-terminal-highlight mr-3"></div>
                  <span className="loading-dots">Processing</span>
                </div>
              ) : (
                <>
                  <span className="terminal-prompt">save-domain-preferences</span>
                  <span className="terminal-cursor ml-1"></span>
                </>
              )}
            </button>
          </div>
          
          {/* Scan Lines and Noise */}
          <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
          <div className="noise-overlay"></div>
        </div>
      </div>
    </div>
  );
};

export default DomainSelection;