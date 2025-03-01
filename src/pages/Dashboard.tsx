import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ref, get } from 'firebase/database';
import { database } from '../config/firebase';
import { Domain } from '../types';
import toast from 'react-hot-toast';
import { ClockIcon, AcademicCapIcon, BellAlertIcon, CalendarIcon, ArrowRightIcon, UserPlusIcon } from '@heroicons/react/24/outline';
import CountdownTimer from '../components/CountdownTimer';

interface UserData {
  email: string;
  displayName?: string;
  photoURL?: string;
  selectedDomains: Domain[];
  quizzesAttempted?: Record<Domain, boolean>;
  lastLogin?: string;
  createdAt?: string;
}

interface Notice {
  id: string;
  title: string;
  content: string;
  date: string;
  important: boolean;
}

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  time: string;
}

const Dashboard = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<Domain | ''>('');
  const [loading, setLoading] = useState(true);
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);
        const userRef = ref(database, `users/${currentUser.uid}`);
        const snapshot = await get(userRef);
        
        if (snapshot.exists()) {
          const data = snapshot.val() as UserData;
          setUserData(data);
          
          // Set first domain as default selected domain if available
          if (data.selectedDomains && data.selectedDomains.length > 0) {
            setSelectedDomain(data.selectedDomains[0]);
          }
        } else {
          // If no user data, redirect to domain selection
          navigate('/domain-selection');
        }
        
        // Fetch notices
        const noticesRef = ref(database, 'notices');
        const noticesSnapshot = await get(noticesRef);
        if (noticesSnapshot.exists()) {
          const noticesData = noticesSnapshot.val();
          const noticesList = Object.entries(noticesData).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          
          // Sort notices by importance (important first) and then by date (newest first)
          noticesList.sort((a, b) => {
            if (a.important !== b.important) {
              return a.important ? -1 : 1;
            }
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          });
          
          setNotices(noticesList);
        }
        
        // Fetch events
        const eventsRef = ref(database, 'events');
        const eventsSnapshot = await get(eventsRef);
        if (eventsSnapshot.exists()) {
          const eventsData = eventsSnapshot.val();
          const eventsList = Object.entries(eventsData).map(([id, data]: [string, any]) => ({
            id,
            ...data
          }));
          
          // Sort events by date (upcoming first) and then by time
          eventsList.sort((a, b) => {
            const dateA = new Date(`${a.date}T${a.time}`);
            const dateB = new Date(`${b.date}T${b.time}`);
            return dateA.getTime() - dateB.getTime();
          });
          
          // Filter to only show upcoming events
          const now = new Date();
          const upcomingEvents = eventsList.filter(event => {
            const eventDate = new Date(`${event.date}T${event.time}`);
            return eventDate >= now;
          });
          
          setEvents(upcomingEvents);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        toast.error('Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [currentUser, navigate]);

  const handleStartQuiz = () => {
    if (!selectedDomain) {
      toast.error('Please select a domain first');
      return;
    }
    
    // Check if user has already attempted this quiz
    if (userData?.quizzesAttempted?.[selectedDomain]) {
      toast.error('You have already completed this quiz');
      return;
    }
    
    navigate(`/questionnaire/${selectedDomain}`);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-12 w-12 bg-primary-500/50 dark:bg-primary-700/50 rounded-full mb-4"></div>
          <div className="h-4 w-32 bg-terminal-highlight/30 rounded mb-3"></div>
          <div className="h-3 w-24 bg-terminal-highlight/20 rounded"></div>
          <p className="terminal-text mt-4">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  // Display guest view for non-logged in users
  if (!currentUser) {
    return (
      <div className="pt-20 pb-12">
        <section className="mb-12 text-center">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold text-terminal-highlight mb-4">
              Welcome to iQuest Portal
            </h1>
            <p className="terminal-text max-w-2xl mx-auto mb-8">
              Join our programming challenge and test your skills in various domains. 
              Sign up now to participate!
            </p>
            
            {/* Wrap CountdownTimer in try-catch pattern using conditional rendering */}
            {(() => {
              try {
                return (
                  <CountdownTimer 
                    type="registration" 
                    title="Registration Closes In"
                    description="Don't miss your chance to participate in iQuest!"
                    className="max-w-md mx-auto mb-6"
                  />
                );
              } catch (error) {
                console.error("Error rendering CountdownTimer:", error);
                return (
                  <div className="terminal-card p-4 max-w-md mx-auto mb-6">
                    <h3 className="terminal-title text-center">Registration Closes In</h3>
                    <div className="text-center text-terminal-highlight text-2xl font-bold my-2">
                      3 Days Remaining
                    </div>
                  </div>
                );
              }
            })()}
            
            <div className="flex justify-center">
              <button 
                onClick={() => navigate('/login')} 
                className="btn-primary flex items-center"
              >
                <UserPlusIcon className="h-5 w-5 mr-2" />
                Sign Up / Login
              </button>
            </div>
          </div>
        </section>
        
        <div className="max-w-4xl mx-auto">
          <div className="terminal-card">
            <div className="mb-4">
              <h2 className="terminal-title">About iQuest</h2>
            </div>
            <div>
              <p className="terminal-text mb-4">
                iQuest is a programming challenge designed to test your skills in various programming domains. 
                Sign up to select your preferred domains and take quizzes to test your knowledge.
              </p>
              <p className="terminal-text">
                Track your progress, compare your scores, and improve your skills in a competitive environment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-terminal-highlight mb-4">
          No user data found
        </h2>
        <p className="terminal-text mb-6">
          Please complete your domain selection to continue.
        </p>
        <button
          onClick={() => navigate('/domain-selection')}
          className="btn-primary"
        >
          Select Domains
        </button>
      </div>
    );
  }

  return (
    <div className="pt-20 pb-12">
      {/* Welcome Section */}
      <section className="mb-12 text-center">
        <div className="animate-fade-in">
          {userData.photoURL && (
            <img 
              src={userData.photoURL} 
              alt="Profile" 
              className="avatar avatar-lg mx-auto mb-4 border-4 border-primary-500 shadow-md"
            />
          )}
          <h1 className="text-3xl md:text-4xl font-bold text-terminal-highlight mb-2">
            Welcome, {userData.displayName || 'User'}!
          </h1>
          <p className="terminal-text max-w-2xl mx-auto">
            You've selected {userData.selectedDomains.length} domain{userData.selectedDomains.length !== 1 ? 's' : ''}: {' '}
            {userData.selectedDomains.map((domain, index) => (
              <span key={domain} className="terminal-domain-tag mx-1">
                {domain}
                {index < userData.selectedDomains.length - 1 ? '' : ''}
              </span>
            ))}
          </p>
        </div>
      </section>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Main Content - Quiz Section */}
        <div className="md:col-span-2 space-y-8">
          {/* Quiz Card */}
          <div className="terminal-card animate-slide-in">
            <div className="mb-4">
              <h2 className="terminal-title flex items-center">
                <AcademicCapIcon className="h-6 w-6 mr-2 text-terminal-highlight" />
                Start a Quiz
              </h2>
            </div>
            <div className="mb-4">
              <p className="terminal-text mb-6">
                Select a domain and start your assessment. Each quiz contains questions specific to your selected domain.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="domain-select" className="terminal-text block mb-2">
                    Select Domain
                  </label>
                  <select
                    id="domain-select"
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value as Domain)}
                    className="input-field"
                    disabled={userData.selectedDomains.length === 0}
                  >
                    <option value="">Select a domain</option>
                    {userData.selectedDomains.map((domain) => (
                      <option 
                        key={domain} 
                        value={domain}
                        disabled={userData.quizzesAttempted?.[domain]}
                      >
                        {domain} {userData.quizzesAttempted?.[domain] ? '(Completed)' : ''}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleStartQuiz}
                    className="btn-primary flex items-center"
                    disabled={!selectedDomain || userData.quizzesAttempted?.[selectedDomain as Domain]}
                  >
                    Start Quiz
                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                  </button>
                  
                  <div className="relative group">
                  <button
                    onClick={() => navigate('/domain-selection')}
                    className="btn-outline"
                      disabled={userData.quizzesAttempted && Object.values(userData.quizzesAttempted).some(attempted => attempted)}
                      title={userData.quizzesAttempted && Object.values(userData.quizzesAttempted).some(attempted => attempted) ? 
                        "You cannot change domains after completing a quiz" : ""}
                  >
                      {userData.selectedDomains.length === 0 ? "Select Domains" : "Change Domains"}
                  </button>
                    {userData.quizzesAttempted && Object.values(userData.quizzesAttempted).some(attempted => attempted) && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-1 
                        bg-gray-800 text-white text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity 
                        w-52 text-center pointer-events-none">
                        You cannot change domains after completing a quiz
                      </div>
                    )}
                  </div>
                </div>
                
                {Object.keys(userData.quizzesAttempted || {}).length > 0 && (
                  <div className="mt-4">
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Your Progress
                    </h3>
                    <div className="space-y-2">
                      {userData.selectedDomains.map((domain) => (
                        <div key={domain} className="flex items-center justify-between">
                          <span className="terminal-text text-sm">
                            {domain}
                          </span>
                          <span className={userData.quizzesAttempted?.[domain] 
                            ? 'terminal-status-completed text-sm'
                            : 'terminal-status-pending text-sm'}>
                            {userData.quizzesAttempted?.[domain] ? 'Completed' : 'Not started'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Notices Section */}
          <div className="terminal-card animate-slide-in" style={{animationDelay: '0.1s'}}>
            <div className="mb-4">
              <h2 className="terminal-title flex items-center">
                <BellAlertIcon className="h-6 w-6 mr-2 text-terminal-highlight" />
                Important Notices
              </h2>
            </div>
            <div className="p-0">
              {notices.length === 0 ? (
                <div className="p-5 text-center terminal-text">
                  No notices available at this time.
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {notices.map((notice) => (
                    <li 
                      key={notice.id} 
                      className={`p-5 ${notice.important ? 'bg-error-900/20' : 'bg-gray-900/20'}`}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className={notice.important 
                          ? 'terminal-title text-error-400'
                          : 'terminal-title'}>
                          {notice.title}
                        </h3>
                        <span className="text-xs terminal-text opacity-75">
                          {formatDate(notice.date)}
                        </span>
                      </div>
                      <p className="mt-2 terminal-text">
                        {notice.content}
                      </p>
                      {notice.important && (
                        <div className="mt-2">
                          <span className="badge-error">Important</span>
                        </div>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          {/* Timer Card */}
          <div className="terminal-card animate-slide-in" style={{animationDelay: '0.2s'}}>
            <div className="mb-4">
              <h2 className="terminal-title flex items-center">
                <ClockIcon className="h-6 w-6 mr-2 text-terminal-highlight" />
                Important Timers
              </h2>
            </div>
              <div className="space-y-4">
              {/* Wrap CountdownTimer in try-catch pattern */}
              {(() => {
                try {
                  return (
                    <>
                      <CountdownTimer 
                        type="registration" 
                        title="Registration Closes In"
                        showIcon={false}
                      />
                      <CountdownTimer 
                        type="results" 
                        title="Results Announcement"
                        showIcon={false}
                      />
                    </>
                  );
                } catch (error) {
                  console.error("Error rendering CountdownTimer:", error);
                  return (
                    <>
                      <div className="terminal-card p-3">
                        <h3 className="terminal-title">Registration Closes In</h3>
                        <div className="text-terminal-highlight text-xl font-bold my-1">
                          3 Days Remaining
                  </div>
                </div>
                      <div className="terminal-card p-3">
                        <h3 className="terminal-title">Results Announcement</h3>
                        <div className="text-terminal-highlight text-xl font-bold my-1">
                          10 Days Remaining
                  </div>
                </div>
                    </>
                  );
                }
              })()}
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="terminal-card animate-slide-in" style={{animationDelay: '0.3s'}}>
            <div className="mb-4">
              <h2 className="terminal-title flex items-center">
                <CalendarIcon className="h-6 w-6 mr-2 text-terminal-highlight" />
                Upcoming Events
              </h2>
            </div>
            <div className="p-0">
              {events.length === 0 ? (
                <div className="p-5 text-center terminal-text">
                  No upcoming events at this time.
                </div>
              ) : (
                <ul className="divide-y divide-gray-700">
                  {events.slice(0, 3).map((event) => (
                    <li key={event.id} className="p-5">
                      <div className="flex justify-between items-start">
                        <h3 className="terminal-title text-base">
                          {event.title}
                        </h3>
                      </div>
                      <p className="mt-1 terminal-text">
                        {event.description}
                      </p>
                      <div className="mt-2 flex items-center text-xs terminal-text opacity-80">
                        <span className="mr-3">{formatDate(event.date)}</span>
                        <span>{event.time}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {events.length > 3 && (
              <div className="text-center mt-4">
                <button className="text-sm text-terminal-highlight hover:underline font-medium">
                  View All Events
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 