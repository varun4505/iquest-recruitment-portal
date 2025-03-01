import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ref, get, set } from 'firebase/database';
import { database, auth } from '../config/firebase';
import { useAuth } from '../contexts/AuthContext';
import { Domain, QuizResponse } from '../types';
import toast from 'react-hot-toast';

interface Question {
  text: string;
  type: 'text' | 'radio' | 'checkbox';
  options?: string[];
}

interface Questionnaire {
  questions: Question[];
}

interface UserData {
  email: string;
  displayName: string;
  photoURL: string;
  selectedDomains: Domain[];
  quizzesAttempted: Record<Domain, boolean>;
  lastLogin: string;
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

interface ExcelRow {
  'User ID': string;
  'Name': string;
  'Email': string;
  'Selected Domains': string;
  'Last Login': string;
  [key: string]: string; // Allow dynamic question keys
}

// List of admin emails
const ADMIN_EMAILS = [
  'varun452005@gmail.com',
  'varun.b2023@vitstudent.ac.in',
  'swagata.banerjee2023@vitstudent.ac.in'
  // Add more admin emails here
]; // Replace with actual admin emails

const defaultQuestionnaires: Record<Domain, Questionnaire> = {
  Technical: {
    questions: [
      {
        text: "What programming languages are you proficient in?",
        type: "text"
      },
      {
        text: "Describe a technical project you've worked on.",
        type: "text"
      },
      {
        text: "What is your experience with web development?",
        type: "text"
      }
    ]
  },
  Design: {
    questions: [
      {
        text: "What design tools are you familiar with?",
        type: "text"
      },
      {
        text: "Share your design portfolio or previous work.",
        type: "text"
      },
      {
        text: "What is your design process?",
        type: "text"
      }
    ]
  },
  Editorial: {
    questions: [
      {
        text: "What type of content do you enjoy writing?",
        type: "text"
      },
      {
        text: "Share a writing sample or previous work.",
        type: "text"
      },
      {
        text: "How do you approach content research?",
        type: "text"
      }
    ]
  },
  Management: {
    questions: [
      {
        text: "What is your leadership experience?",
        type: "text"
      },
      {
        text: "How do you handle team conflicts?",
        type: "text"
      },
      {
        text: "Describe your project management approach.",
        type: "text"
      }
    ]
  }
};

// Add export function
const exportToExcel = (users: Record<string, UserData>, responses: Record<string, Record<Domain, QuizResponse>>) => {
  // Create data rows for Excel
  const rows = Object.entries(users).map(([userId, user]) => {
    const userResponses = responses[userId] || {};
    const baseData: ExcelRow = {
      'User ID': userId,
      'Name': user.displayName || 'Anonymous',
      'Email': user.email,
      'Selected Domains': user.selectedDomains.join(', '),
      'Last Login': new Date(user.lastLogin).toLocaleString(),
    };

    // Add responses for each domain
    user.selectedDomains.forEach(domain => {
      const domainResponse = userResponses[domain];
      if (domainResponse) {
        Object.entries(domainResponse.responses).forEach(([qNum, answer]) => {
          baseData[`${domain} - Q${qNum.slice(1)}`] = answer;
        });
      }
    });

    return baseData;
  });

  // Convert to CSV
  const headers = Array.from(new Set(rows.flatMap(row => Object.keys(row))));
  const csv = [
    headers.join(','),
    ...rows.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
  ].join('\n');

  // Create and download file
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  
  try {
    // Try the modern way first
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'user_responses.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error('Error downloading file:', error);
    toast.error('Failed to download file. Please try again.');
  }
};

const AdminPanel = () => {
  const [users, setUsers] = useState<Record<string, UserData>>({});
  const [responses, setResponses] = useState<Record<string, Record<Domain, QuizResponse>>>({});
  const [questionnaires, setQuestionnaires] = useState<Partial<Record<Domain, Questionnaire>>>({});
  const [selectedDomain, setSelectedDomain] = useState<Domain | 'all'>('all');
  const [loading, setLoading] = useState(true);
  const [editingDomain, setEditingDomain] = useState<Domain | null>(null);
  const [newQuestion, setNewQuestion] = useState<Question>({
    text: '',
    type: 'text',
    options: []
  });
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [registrationEndTime, setRegistrationEndTime] = useState('');
  const [quizEndTime, setQuizEndTime] = useState('');
  const [notices, setNotices] = useState<Notice[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [newNotice, setNewNotice] = useState<Omit<Notice, 'id'>>({
    title: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    important: false
  });
  const [newEvent, setNewEvent] = useState<Omit<Event, 'id'>>({
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toTimeString().split(' ')[0].slice(0, 5)
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'responses' | 'questions' | 'timers' | 'notices' | 'events'>('overview');

  useEffect(() => {
    const checkAdminAccess = async () => {
      if (!currentUser || !ADMIN_EMAILS.includes(currentUser.email || '')) {
        toast.error('Unauthorized access');
        navigate('/');
        return;
      }

      try {
        // Fetch users
        const usersRef = ref(database, 'users');
        const usersSnapshot = await get(usersRef);
        if (usersSnapshot.exists()) {
          setUsers(usersSnapshot.val());
        }

        // Fetch responses
        const responsesRef = ref(database, 'responses');
        const responsesSnapshot = await get(responsesRef);
        if (responsesSnapshot.exists()) {
          setResponses(responsesSnapshot.val());
        }

        // Fetch notices
        const noticesRef = ref(database, 'notices');
        const noticesSnapshot = await get(noticesRef);
        if (noticesSnapshot.exists()) {
          const noticesList = Object.entries(noticesSnapshot.val()).map(([id, notice]: [string, any]) => ({
            id,
            ...notice,
          }));
          setNotices(noticesList.sort((a, b) => {
            if (a.important && !b.important) return -1;
            if (!a.important && b.important) return 1;
            return new Date(b.date).getTime() - new Date(a.date).getTime();
          }));
        }

        // Fetch events
        const eventsRef = ref(database, 'events');
        const eventsSnapshot = await get(eventsRef);
        if (eventsSnapshot.exists()) {
          const eventsList = Object.entries(eventsSnapshot.val()).map(([id, event]: [string, any]) => ({
            id,
            ...event,
          }));
          setEvents(eventsList.sort((a, b) => 
            new Date(a.date + ' ' + a.time).getTime() - new Date(b.date + ' ' + b.time).getTime()
          ));
        }

        // Fetch or initialize questionnaires
        const questionnairesRef = ref(database, 'questionnaires');
        const questionnairesSnapshot = await get(questionnairesRef);
        
        if (!questionnairesSnapshot.exists()) {
          // Initialize questionnaires with default questions
          await set(questionnairesRef, defaultQuestionnaires);
          setQuestionnaires(defaultQuestionnaires);
          console.log('Initialized default questionnaires');
        } else {
          setQuestionnaires(questionnairesSnapshot.val());
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load admin data');
      } finally {
        setLoading(false);
      }
    };

    checkAdminAccess();
  }, [currentUser, navigate]);

  useEffect(() => {
    const fetchTimers = async () => {
      try {
        const registrationRef = ref(database, 'timers/registration');
        const quizRef = ref(database, 'timers/quiz');

        const [registrationSnapshot, quizSnapshot] = await Promise.all([
          get(registrationRef),
          get(quizRef),
        ]);

        if (registrationSnapshot.exists()) {
          const regDate = new Date(registrationSnapshot.val().endTime);
          setRegistrationEndTime(formatDateTimeLocal(regDate));
        }

        if (quizSnapshot.exists()) {
          const quizDate = new Date(quizSnapshot.val().endTime);
          setQuizEndTime(formatDateTimeLocal(quizDate));
        }
      } catch (error) {
        console.error('Error fetching timers:', error);
        toast.error('Failed to load timer settings');
      }
    };

    fetchTimers();
  }, []);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  const handleUpdateTimer = async (type: 'registration' | 'quiz', endTime: string) => {
    if (!auth.currentUser?.email) {
      toast.error('You must be logged in to update timers');
      return;
    }

    // Check if user has admin permissions
    const userRef = ref(database, `users/${auth.currentUser.uid}`);
    const userSnapshot = await get(userRef);
    const userData = userSnapshot.val();

    if (!userData || userData.email !== 'varun452005@gmail.com') {
      toast.error('You do not have permission to update timers');
      return;
    }

    try {
      const date = new Date(endTime);
      if (isNaN(date.getTime())) {
        toast.error('Please enter a valid date and time');
        return;
      }

      if (date < new Date()) {
        toast.error('End time must be in the future');
        return;
      }

      const timerRef = ref(database, `timers/${type}`);
      await toast.promise(
        set(timerRef, {
          endTime: date.toISOString(),
          updatedBy: auth.currentUser.email,
          updatedAt: new Date().toISOString()
        }),
        {
          loading: 'Updating timer...',
          success: 'Timer updated successfully!',
          error: (err) => {
            console.error('Error updating timer:', err);
            return 'Failed to update timer. Please try again.';
          }
        }
      );

      // Update local state
      if (type === 'registration') {
        setRegistrationEndTime(date.toISOString());
      } else {
        setQuizEndTime(date.toISOString());
      }
    } catch (error) {
      console.error('Error updating timer:', error);
      toast.error('Failed to update timer. Please try again.');
    }
  };

  const handleAddQuestion = async (domain: Domain) => {
    if (!newQuestion.text.trim()) {
      toast.error('Question text is required');
      return;
    }

    // Validate options for radio and checkbox types
    if ((newQuestion.type === 'radio' || newQuestion.type === 'checkbox') && 
        (!newQuestion.options || newQuestion.options.length < 2)) {
      toast.error('Multiple choice questions require at least 2 options');
      return;
    }

    try {
      // Create a clean question object without empty options
      const questionToAdd = {
        ...newQuestion,
        // Only include options for radio and checkbox types
        options: (newQuestion.type === 'radio' || newQuestion.type === 'checkbox') 
          ? newQuestion.options?.filter(option => option.trim() !== '') 
          : undefined
      };

      const updatedQuestions = [
        ...(questionnaires[domain]?.questions || []),
        questionToAdd
      ];

      const questionnairesRef = ref(database, `questionnaires/${domain}`);
      await toast.promise(
        set(questionnairesRef, {
          questions: updatedQuestions
        }),
        {
          loading: 'Adding question...',
          success: 'Question added successfully!',
          error: 'Failed to add question'
        }
      );

      setQuestionnaires(prev => ({
        ...prev,
        [domain]: {
          questions: updatedQuestions
        }
      }));

      setNewQuestion({
        text: '',
        type: 'text',
        options: []
      });
    } catch (error) {
      console.error('Error adding question:', error);
      toast.error('Failed to add question');
    }
  };

  const handleDeleteQuestion = async (domain: Domain, index: number) => {
    try {
      const updatedQuestions = questionnaires[domain]?.questions.filter((_, i) => i !== index);
      const questionnairesRef = ref(database, `questionnaires/${domain}`);
      
      await toast.promise(
        set(questionnairesRef, {
          questions: updatedQuestions
        }),
        {
          loading: 'Deleting question...',
          success: 'Question deleted successfully!',
          error: 'Failed to delete question'
        }
      );

      setQuestionnaires(prev => ({
        ...prev,
        [domain]: {
          questions: updatedQuestions || []
        }
      }));
    } catch (error) {
      console.error('Error deleting question:', error);
      toast.error('Failed to delete question');
    }
  };

  const handleAddNotice = async () => {
    if (!newNotice.title.trim() || !newNotice.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const noticeRef = ref(database, 'notices/' + Date.now());
      await toast.promise(
        set(noticeRef, {
          ...newNotice,
          date: new Date(newNotice.date).toISOString()
        }),
        {
          loading: 'Adding notice...',
          success: 'Notice added successfully!',
          error: 'Failed to add notice'
        }
      );

      setNewNotice({
        title: '',
        content: '',
        date: new Date().toISOString().split('T')[0],
        important: false
      });
    } catch (error) {
      console.error('Error adding notice:', error);
    }
  };

  const handleDeleteNotice = async (id: string) => {
    try {
      const noticeRef = ref(database, `notices/${id}`);
      await toast.promise(
        set(noticeRef, null),
        {
          loading: 'Deleting notice...',
          success: 'Notice deleted successfully!',
          error: 'Failed to delete notice'
        }
      );
    } catch (error) {
      console.error('Error deleting notice:', error);
    }
  };

  const handleAddEvent = async () => {
    if (!newEvent.title.trim() || !newEvent.description.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const eventRef = ref(database, 'events/' + Date.now());
      await toast.promise(
        set(eventRef, newEvent),
        {
          loading: 'Adding event...',
          success: 'Event added successfully!',
          error: 'Failed to add event'
        }
      );

      setNewEvent({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].slice(0, 5)
      });
    } catch (error) {
      console.error('Error adding event:', error);
    }
  };

  const handleDeleteEvent = async (id: string) => {
    try {
      const eventRef = ref(database, `events/${id}`);
      await toast.promise(
        set(eventRef, null),
        {
          loading: 'Deleting event...',
          success: 'Event deleted successfully!',
          error: 'Failed to delete event'
        }
      );
    } catch (error) {
      console.error('Error deleting event:', error);
    }
  };

  const filteredUsers = Object.entries(users).filter(([_, user]) => {
    if (!user.selectedDomains) return false;
    if (selectedDomain === 'all') return true;
    return user.selectedDomains.includes(selectedDomain as Domain);
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-8">
        <br></br>
        <h1 className="text-3xl font-bold text-white-900 dark:text-white mb-4">
          Admin Panel
        </h1>
        
        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'overview'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('responses')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'responses'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            User Responses
          </button>
          <button
            onClick={() => setActiveTab('questions')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'questions'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Questions
          </button>
          <button
            onClick={() => setActiveTab('timers')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'timers'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Timers
          </button>
          <button
            onClick={() => setActiveTab('notices')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'notices'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Notices
          </button>
          <button
            onClick={() => setActiveTab('events')}
            className={`px-4 py-2 rounded-lg transition-colors ${
              activeTab === 'events'
                ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-400'
                : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
            }`}
          >
            Events
          </button>
        </div>

        {/* Overview Tab Content - Domain Filter */}
        {activeTab === 'overview' && (
          <div className="flex items-center gap-4">
            <label className="text-gray-700 dark:text-gray-300">Filter by Domain:</label>
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value as Domain | 'all')}
              className="input-field max-w-xs"
            >
              <option value="all">All Domains</option>
              <option value="Technical">Technical</option>
              <option value="Design">Design</option>
              <option value="Editorial">Editorial</option>
              <option value="Management">Management</option>
            </select>
          </div>
        )}
      </div>

      {/* User Responses Tab Content */}
      {activeTab === 'responses' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold text-white-900 dark:text-white">
              User Responses
            </h2>
            <button
              onClick={() => exportToExcel(users, responses)}
              className="btn-primary"
            >
              Export to CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Domains</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(users).map(([userId, user]) => (
                  <tr key={userId} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <td className="px-6 py-4 font-medium text-white-900 dark:text-white">
                      {user.displayName || 'Anonymous'}
                    </td>
                    <td className="px-6 py-4 text-white-900 dark:text-white">{user.email}</td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {user.selectedDomains?.map((domain) => (
                          <span
                            key={domain}
                            className="px-2 py-1 text-xs rounded-full bg-primary-100 text-primary-800 dark:bg-primary-700 dark:text-white font-medium"
                          >
                            {domain}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {user.selectedDomains?.map((domain) => (
                        <div key={domain} className="text-sm text-white-900 dark:text-white">
                          {domain}: {user.quizzesAttempted?.[domain] ? 
                            <span className="text-green-600 dark:text-green-400 font-medium">✓</span> : 
                            <span className="text-yellow-600 dark:text-yellow-400">⋯</span>}
                        </div>
                      ))}
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          const userResponses = responses[userId];
                          if (userResponses) {
                            exportToExcel({ [userId]: user }, { [userId]: userResponses });
                          } else {
                            toast.error('No responses available for this user');
                          }
                        }}
                        className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
                      >
                        Export
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Overview Tab Content - User Cards */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {filteredUsers.map(([userId, user]) => (
            <div key={userId} className="terminal-card">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="terminal-title">
                    {user.displayName || 'Anonymous User'}
                  </h2>
                  <p className="terminal-text mt-1">
                    {user.email}
                  </p>
                  <div className="terminal-domains-list">
                    {user.selectedDomains?.map((domain) => (
                      <span
                        key={domain}
                        className="terminal-domain-tag"
                      >
                        {domain}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="terminal-text font-semibold">
                    Registered User
                  </div>
                  <div className="terminal-text opacity-80 mt-1 text-sm">
                    Last login: {new Date(user.lastLogin).toLocaleString()}
                  </div>
                </div>
              </div>

              {user.selectedDomains?.map((domain) => {
                const response = responses[userId]?.[domain];
                const questionnaire = questionnaires[domain];
                const attempted = user.quizzesAttempted?.[domain];

                return (
                  <div key={domain} className="terminal-section mb-4 last:mb-0">
                    <h3 className="terminal-title text-base">
                      {domain} Domain
                      {attempted ? (
                        <span className="ml-2 text-sm terminal-status-completed">
                          ✓ Completed
                        </span>
                      ) : (
                        <span className="ml-2 text-sm terminal-status-pending">
                          ⋯ Pending
                        </span>
                      )}
                    </h3>

                    {response && questionnaire && (
                      <div className="pl-4 border-l-2 border-terminal-highlight/50">
                        <p className="terminal-text mb-2 text-sm">
                          Submitted: {new Date(response.timestamp).toLocaleString()}
                        </p>
                        <div className="space-y-4">
                          {questionnaire.questions.map((question, index) => (
                            <div
                              key={index}
                              className="bg-gray-950 border border-terminal-highlight/30 p-4 rounded"
                            >
                              <p className="terminal-text font-semibold mb-2">
                                Q{index + 1}: {question.text}
                              </p>
                              <p className="terminal-text">
                                Answer: {response.responses[`q${index + 1}`] || 'Not answered'}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center py-12 terminal-text">
              No users found for the selected domain.
            </div>
          )}
        </div>
      )}

      {/* Questions Tab Content */}
      {activeTab === 'questions' && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white-900 dark:text-white mb-6">
            Question Management
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            {(['Technical', 'Design', 'Editorial', 'Management'] as Domain[]).map((domain) => (
              <div key={domain} className="card">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-bold text-white-900 dark:text-white">
                    {domain} Questions
                  </h3>
                  <button
                    onClick={() => setEditingDomain(editingDomain === domain ? null : domain)}
                    className="btn-secondary"
                  >
                    {editingDomain === domain ? 'Close' : 'Edit'}
                  </button>
                </div>

                {/* Question List */}
                <div className="space-y-4">
                  {questionnaires[domain]?.questions.map((question, index) => (
                    <div
                      key={index}
                      className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded flex justify-between items-start"
                    >
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-gray">
                          Q{index + 1}: {question.text}
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          Type: {question.type}
                        </p>
                      </div>
                      {editingDomain === domain && (
                        <button
                          onClick={() => handleDeleteQuestion(domain, index)}
                          className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Question Form */}
                {editingDomain === domain && (
                  <div className="mt-6 space-y-4 border-t pt-4 dark:border-gray-700">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        New Question
                      </label>
                      <textarea
                        value={newQuestion.text}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, text: e.target.value }))}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                        rows={3}
                        placeholder="Enter question text..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Question Type
                      </label>
                      <select
                        value={newQuestion.type}
                        onChange={(e) => setNewQuestion(prev => ({ ...prev, type: e.target.value as 'text' | 'radio' | 'checkbox' }))}
                        className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                      >
                        <option value="text">Text</option>
                        <option value="radio">Single Choice</option>
                        <option value="checkbox">Multiple Choice</option>
                      </select>
                    </div>

                    {/* Options for radio and checkbox types */}
                    {(newQuestion.type === 'radio' || newQuestion.type === 'checkbox') && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                          Answer Options
                        </label>
                        <div className="space-y-2">
                          {newQuestion.options?.map((option, index) => (
                            <div key={index} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={option}
                                onChange={(e) => {
                                  const newOptions = [...(newQuestion.options || [])];
                                  newOptions[index] = e.target.value;
                                  setNewQuestion(prev => ({ ...prev, options: newOptions }));
                                }}
                                className="flex-1 p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                                placeholder={`Option ${index + 1}`}
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const newOptions = [...(newQuestion.options || [])];
                                  newOptions.splice(index, 1);
                                  setNewQuestion(prev => ({ ...prev, options: newOptions }));
                                }}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const newOptions = [...(newQuestion.options || []), ''];
                              setNewQuestion(prev => ({ ...prev, options: newOptions }));
                            }}
                            className="btn-secondary text-sm py-1 px-2"
                          >
                            + Add Option
                          </button>
                        </div>
                      </div>
                    )}

                    <button
                      onClick={() => handleAddQuestion(domain)}
                      className="btn-primary w-full"
                    >
                      Add Question
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Timers Tab Content */}
      {activeTab === 'timers' && (
        <div className="grid md:grid-cols-2 gap-8">
          {/* Registration Timer Control */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white-900 dark:text-white mb-4">
              Registration Timer
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="registrationEndTime"
                  className="block text-sm font-medium text-white-700 dark:text-gray-300 mb-1"
                >
                  Registration End Time
                </label>
                <input
                  type="datetime-local"
                  id="registrationEndTime"
                  value={registrationEndTime}
                  onChange={(e) => setRegistrationEndTime(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <button
                onClick={() => handleUpdateTimer('registration', registrationEndTime)}
                className="btn-primary w-full"
              >
                Update Registration Timer
              </button>
            </div>
          </div>

          {/* Quiz Timer Control */}
          <div className="card">
            <h2 className="text-2xl font-bold text-white-900 dark:text-white mb-4">
              Quiz Timer
            </h2>
            <div className="space-y-4">
              <div>
                <label
                  htmlFor="quizEndTime"
                  className="block text-sm font-medium text-white-700 dark:text-gray-300 mb-1"
                >
                  Quiz End Time
                </label>
                <input
                  type="datetime-local"
                  id="quizEndTime"
                  value={quizEndTime}
                  onChange={(e) => setQuizEndTime(e.target.value)}
                  className="w-full p-2 border rounded-lg dark:bg-gray-800 dark:border-gray-700"
                />
              </div>
              <button
                onClick={() => handleUpdateTimer('quiz', quizEndTime)}
                className="btn-primary w-full"
              >
                Update Quiz Timer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notices Tab Content */}
      {activeTab === 'notices' && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white-900 dark:text-white mb-6">
            Important Notices Management
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Add Notice Form */}
            <div className="card">
              <h3 className="text-xl font-bold text-white-900 dark:text-white mb-4">
                Add New Notice
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newNotice.title}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Notice title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Content
                  </label>
                  <textarea
                    value={newNotice.content}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, content: e.target.value }))}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Notice content"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newNotice.date}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="important"
                    checked={newNotice.important}
                    onChange={(e) => setNewNotice(prev => ({ ...prev, important: e.target.checked }))}
                    className="mr-2"
                  />
                  <label htmlFor="important" className="text-sm text-gray-700 dark:text-gray-300">
                    Mark as Important
                  </label>
                </div>
                <button
                  onClick={handleAddNotice}
                  className="btn-primary w-full"
                >
                  Add Notice
                </button>
              </div>
            </div>

            {/* Existing Notices */}
            <div className="card">
              <h3 className="text-xl font-bold text-white-900 dark:text-white mb-4">
                Existing Notices
              </h3>
              <div className="space-y-4">
                {notices.map((notice) => (
                  <div
                    key={notice.id}
                    className={`p-4 rounded-lg ${
                      notice.important
                        ? 'bg-red-50 dark:bg-red-900/20'
                        : 'bg-gray-50 dark:bg-gray-800'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className={`font-semibold ${
                          notice.important ? 'text-red-600 dark:text-red-400' : 'text-white-900 dark:text-white'
                        }`}>
                          {notice.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {notice.content}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          {new Date(notice.date).toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleDeleteNotice(notice.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {notices.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No notices available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Events Tab Content */}
      {activeTab === 'events' && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white-900 dark:text-white mb-6">
            Upcoming Events Management
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Add Event Form */}
            <div className="card">
              <h3 className="text-xl font-bold text-white-900 dark:text-white mb-4">
                Add New Event
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Title
                  </label>
                  <input
                    type="text"
                    value={newEvent.title}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, title: e.target.value }))}
                    className="input-field w-full"
                    placeholder="Event title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Description
                  </label>
                  <textarea
                    value={newEvent.description}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, description: e.target.value }))}
                    className="input-field w-full"
                    rows={3}
                    placeholder="Event description"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={newEvent.date}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, date: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={newEvent.time}
                    onChange={(e) => setNewEvent(prev => ({ ...prev, time: e.target.value }))}
                    className="input-field w-full"
                  />
                </div>
                <button
                  onClick={handleAddEvent}
                  className="btn-primary w-full"
                >
                  Add Event
                </button>
              </div>
            </div>

            {/* Existing Events */}
            <div className="card">
              <h3 className="text-xl font-bold text-white-900 dark:text-white mb-4">
                Existing Events
              </h3>
              <div className="space-y-4">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-semibold text-white-900 dark:text-white">
                          {event.title}
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {event.description}
                        </p>
                        <div className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                          <span className="ml-2">{event.time}</span>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
                        className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-gray-500 dark:text-gray-400 text-center py-4">
                    No events available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel; 