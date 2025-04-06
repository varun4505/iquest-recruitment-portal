import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ref, get, update } from 'firebase/database';
import { database } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Domain } from '../types';
import toast from 'react-hot-toast';
import Timer from '../components/Timer';

interface Question {
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

interface Questionnaire {
  questions: Question[];
}

const Questionnaire = () => {
  const { domain } = useParams<{ domain: Domain }>();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [timeExpired, setTimeExpired] = useState(false);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkEligibility = async () => {
      if (!currentUser || !domain) return;

      try {
        // First check if registration period is still open
        const registrationRef = ref(database, 'public/timers/registration');
        let registrationSnapshot = await get(registrationRef);
        
        // If primary path fails, try alternative paths
        if (!registrationSnapshot.exists()) {
          console.log('Primary registration timer path failed, trying alternative paths');
          
          // Try alternative paths
          const alternativePaths = [
            'timers/registration',
            'settings/timers/registration'
          ];
          
          for (const path of alternativePaths) {
            console.log(`Trying alternative path: ${path}`);
            const altRef = ref(database, path);
            const altSnapshot = await get(altRef);
            if (altSnapshot.exists()) {
              console.log(`Found timer data at alternative path: ${path}`);
              registrationSnapshot = altSnapshot;
              break;
            }
          }
        }
        
        if (registrationSnapshot.exists()) {
          const { endTime } = registrationSnapshot.val();
          const endTimeDate = new Date(endTime);
          
          console.log(`Registration end time: ${endTimeDate.toISOString()}, Current time: ${new Date().toISOString()}`);
          
          if (Date.now() < endTimeDate.getTime()) {
            // Registration is still active, so allow access to questionnaire
            console.log('Registration period is active, allowing access to questionnaire');
          } else {
            // Registration period has ended
            toast.error('Registration period has ended. Quiz access is no longer available.');
            return navigate('/dashboard');
          }
        } else {
          // If we can't verify registration status, use a default approach
          // Allow access to the questionnaire rather than blocking it
          console.log('Could not find registration timer data, allowing access by default');
          // No toast error, just proceed with the questionnaire
        }

        // Check user eligibility
        const userRef = ref(database, `users/${currentUser.uid}`);
        const userSnapshot = await get(userRef);

        if (!userSnapshot.exists()) {
          toast.error('Please select your domains first');
          return navigate('/domain-selection');
        }

        const userData = userSnapshot.val();
        if (!userData.selectedDomains?.includes(domain)) {
          toast.error('You have not selected this domain');
          return navigate('/dashboard');
        }

        if (userData.quizzesAttempted?.[domain]) {
          toast.error('You have already completed this questionnaire');
          return navigate('/dashboard');
        }

        // Fetch questions for the domain
        const questionsRef = ref(database, `questionnaires/${domain}`);
        const questionsSnapshot = await get(questionsRef);

        if (!questionsSnapshot.exists()) {
          toast.error('No questions found for this domain');
          return navigate('/dashboard');
        }

        const questionnaire = questionsSnapshot.val() as Questionnaire;
        setQuestions(questionnaire.questions);
        setLoading(false);
      } catch (error) {
        console.error('Error checking eligibility:', error);
        toast.error('Failed to load questionnaire');
        navigate('/dashboard');
      }
    };

    checkEligibility();
  }, [currentUser, domain, navigate]);

  const handleResponseChange = (response: string) => {
    setResponses((prev) => ({
      ...prev,
      [`q${currentQuestion + 1}`]: response,
    }));
  };

  const handleTimeExpired = async () => {
    if (timeExpired) return; // Prevent multiple submissions
    setTimeExpired(true);
    toast.error('Time expired! Submitting your answers...');
    await handleSubmit();
  };

  const handleSubmit = async () => {
    if (!currentUser || !domain) return;

    // Only show unanswered questions warning if not expired
    if (!timeExpired) {
      const unansweredQuestions = questions.filter(
        (_, index) => !responses[`q${index + 1}`] || responses[`q${index + 1}`].trim() === ''
      );

      if (unansweredQuestions.length > 0) {
        return toast.error('Please answer all questions before submitting');
      }
    }

    try {
      setSubmitting(true);
      const updates: Record<string, any> = {
        [`users/${currentUser.uid}/quizzesAttempted/${domain}`]: true,
        [`responses/${currentUser.uid}/${domain}`]: {
          responses,
          timestamp: new Date().toISOString(),
          timeExpired: timeExpired
        },
      };

      await update(ref(database), updates);
      toast.success('Questionnaire submitted successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting questionnaire:', error);
      toast.error('Failed to submit questionnaire');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !domain || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[80vh] relative">
        <div className="terminal-box p-8 border-terminal-highlight bg-terminal-bg/80 relative overflow-hidden max-w-lg w-full">
          <span className="terminal-corner terminal-corner-tl"></span>
          <span className="terminal-corner terminal-corner-tr"></span>
          <span className="terminal-corner terminal-corner-bl"></span>
          <span className="terminal-corner terminal-corner-br"></span>
          <div className="scan-line opacity-10 absolute inset-0 pointer-events-none"></div>
          <div className="noise-overlay opacity-20"></div>
          
          <div className="flex flex-col items-center justify-center">
            <div className="terminal-header px-4 py-1 mb-4 rounded-sm">
              <span className="terminal-header-title typewriter text-sm">SYSTEM: LOADING</span>
            </div>
            <div className="animate-spin h-12 w-12 border-2 border-terminal-highlight rounded-full border-t-transparent mb-4"></div>
            <div className="terminal-code-block mt-4 text-center">
              <code className="text-terminal-text text-sm">
                $ questionnaire --load {domain}<br />
                &gt; Initializing data structures<br />
                &gt; Retrieving questions<br />
                <span className="typing-cursor">Please wait...</span>
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestion];

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="mb-8">
        <div className="inline-block terminal-header px-4 py-1 mb-4 rounded-sm">
          <span className="terminal-header-title typewriter text-sm">DOMAIN: {domain?.toUpperCase()}</span>
        </div>
        <div className="flex justify-between items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-terminal-highlight glow-terminal-text mb-6">
            Knowledge Assessment
          </h1>
          <div className="terminal-box p-2 border-terminal-highlight bg-terminal-bg/80">
            <Timer duration={20 * 60} onExpire={handleTimeExpired} />
          </div>
        </div>
        
        <div className="terminal-box p-4 border-terminal-highlight bg-terminal-bg/80 mb-4 relative overflow-hidden">
          <span className="terminal-corner terminal-corner-tl"></span>
          <span className="terminal-corner terminal-corner-tr"></span>
          <span className="terminal-corner terminal-corner-bl"></span>
          <span className="terminal-corner terminal-corner-br"></span>
          <div className="scan-line opacity-10 absolute inset-0 pointer-events-none"></div>
          <div className="noise-overlay opacity-10"></div>
          
          <div className="flex justify-between items-center mb-2">
            <div className="flex items-center">
              <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
              <span className="text-terminal-highlight text-xs font-medium">PROGRESS</span>
            </div>
            <p className="text-sm text-white font-medium">
              Question {currentQuestion + 1} of {questions.length}
            </p>
          </div>
          
          <div className="w-full bg-black/50 rounded-full h-1.5">
            <div
              className="bg-terminal-highlight h-1.5 rounded-full transition-all duration-300 glow-sm"
              style={{
                width: `${((currentQuestion + 1) / questions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>
      </div>

      <div className="terminal-box p-6 border-terminal-highlight bg-terminal-bg/80 mb-8 relative overflow-hidden glow-terminal-box">
        <span className="terminal-corner terminal-corner-tl"></span>
        <span className="terminal-corner terminal-corner-tr"></span>
        <span className="terminal-corner terminal-corner-bl"></span>
        <span className="terminal-corner terminal-corner-br"></span>
        
        <div className="terminal-header -mx-6 -mt-6 mb-4">
          <div className="terminal-header-dots">
            <span className="terminal-header-dot bg-red-500"></span>
            <span className="terminal-header-dot bg-yellow-500"></span>
            <span className="terminal-header-dot bg-green-500"></span>
          </div>
          <div className="terminal-header-title">question_{currentQuestion + 1}.txt</div>
          <div className="w-16"></div>
        </div>
        
        <div className="scan-line opacity-10 absolute inset-0 pointer-events-none"></div>
        <div className="noise-overlay opacity-5"></div>
        
        <div className="terminal-code-block mb-3">
          <code className="text-terminal-highlight text-xs">
            $ cat question_{currentQuestion + 1}.txt
          </code>
        </div>
        
        <h2 className="text-lg sm:text-xl font-bold text-white mb-4 whitespace-pre-wrap">
          {currentQ.text}
        </h2>
        
        {currentQ.type === 'text' ? (
          <div className="bg-black/50 p-3 rounded-sm border border-terminal-highlight/50">
            <textarea
              value={responses[`q${currentQuestion + 1}`] || ''}
              onChange={(e) => handleResponseChange(e.target.value)}
              className="bg-transparent text-white w-full min-h-[150px] resize-none focus:outline-none focus:ring-1 focus:ring-terminal-highlight p-1 font-mono whitespace-pre-wrap"
              placeholder="> Type your answer here..."
              spellCheck="false"
              style={{ whiteSpace: 'pre-wrap' }}
            />
          </div>
        ) : (
          <div className="bg-black/50 p-3 rounded-sm border border-terminal-highlight/50">
            <div className="space-y-3">
              {currentQ.options?.map((option, index) => (
                <div key={index} className="flex items-center">
                  <input
                    type={currentQ.type}
                    id={`option-${index}`}
                    name={`question-${currentQuestion}`}
                    value={option}
                    checked={
                      currentQ.type === 'radio'
                        ? responses[`q${currentQuestion + 1}`] === option
                        : (responses[`q${currentQuestion + 1}`] || '').split(',').includes(option)
                    }
                    onChange={(e) => {
                      if (currentQ.type === 'radio') {
                        handleResponseChange(e.target.value);
                      } else {
                        // Handle checkbox multi-select
                        const currentSelections = (responses[`q${currentQuestion + 1}`] || '').split(',').filter(Boolean);
                        const newSelections = e.target.checked
                          ? [...currentSelections, option]
                          : currentSelections.filter(item => item !== option);
                        handleResponseChange(newSelections.join(','));
                      }
                    }}
                    className="mr-3 h-4 w-4 border-terminal-highlight accent-terminal-highlight"
                  />
                  <label htmlFor={`option-${index}`} className="text-white">
                    {option}
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}
        
        <div className="mt-3 text-xs text-white opacity-80">
          {currentQ.type === 'text' ? 'Press TAB to format, ENTER to add line break' : 
           currentQ.type === 'checkbox' ? 'Select all that apply' : 'Select one option'}
        </div>
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setCurrentQuestion((prev) => prev - 1)}
          disabled={currentQuestion === 0}
          className={`terminal-box relative overflow-hidden group border-2 border-terminal-highlight text-terminal-highlight font-mono py-2 px-4 inline-flex items-center gap-2 transition-all duration-300 hover:bg-terminal-highlight/20 text-sm ${
            currentQuestion === 0 ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
          <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none"></div>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>
        
        {currentQuestion === questions.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="terminal-box relative overflow-hidden group border-2 border-terminal-highlight text-terminal-highlight font-mono py-2 px-4 inline-flex items-center gap-2 transition-all duration-300 hover:bg-terminal-highlight/20 text-sm"
          >
            <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none"></div>
            {submitting ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-terminal-highlight rounded-full border-t-transparent"></div>
                Processing...
              </>
            ) : (
              <>
                Submit
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </>
            )}
          </button>
        ) : (
          <button
            onClick={() => setCurrentQuestion((prev) => prev + 1)}
            className="terminal-box relative overflow-hidden group border-2 border-terminal-highlight text-terminal-highlight font-mono py-2 px-4 inline-flex items-center gap-2 transition-all duration-300 hover:bg-terminal-highlight/20 text-sm"
          >
            <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none"></div>
            Next
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default Questionnaire;