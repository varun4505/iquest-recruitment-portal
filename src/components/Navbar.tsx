import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

// List of admin emails - keep in sync with AdminPanel.tsx
const ADMIN_EMAILS = [
  'varun452005@gmail.com',
  'varun.b2023@vitstudent.ac.in',
  'swagata.banerjee2023@vitstudent.ac.in'
  // Add more admin emails here
];

const Navbar = () => {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef<HTMLDivElement>(null);

  const isAdmin = currentUser && ADMIN_EMAILS.includes(currentUser.email || '');

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 font-mono">
      {/* Terminal header */}
      <div className="bg-terminal-bg border-b border-terminal-highlight/20 py-1 px-4 relative overflow-hidden">
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 scan-line"></div>
        </div>
        
        {/* Random data packets floating in the background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: 5 }).map((_, i) => (
            <div 
              key={`packet-${i}`}
              className="absolute rounded-sm border border-terminal-highlight/30 bg-terminal-highlight/5"
              style={{
                width: `${16 + Math.floor(Math.random() * 10)}px`,
                height: `${16 + Math.floor(Math.random() * 10)}px`,
                left: '0',
                top: '0',
                animation: `dataPacket ${8 + Math.random() * 6}s linear infinite ${Math.random() * 5}s`
              }}
            >
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-[7px] text-terminal-highlight/40">
                {Math.random() > 0.5 ? '01' : '10'}
              </div>
            </div>
          ))}
        </div>
        
        <div className="container mx-auto">
          <div className="text-terminal-highlight text-sm flex justify-between items-center">
            <div className="flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-terminal-highlight/80 animate-pulse"></div>
              <div className="typing-cursor">Terminal Connection v2.1_</div>
            </div>
            {currentUser && (
              <div className="text-xs text-terminal-text hidden sm:block">
                <span className="text-terminal-highlight mr-2">user@iquest:</span>
                <span className="opacity-80">{currentUser.displayName || currentUser.email}</span>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Main navbar */}
      <nav 
        className={`transition-all duration-300 ${
        scrolled 
            ? 'bg-terminal-bg/90 backdrop-blur-sm border-b border-terminal-highlight/30' 
            : 'bg-terminal-bg border-b border-terminal-highlight/20'
        }`}
      >
        <div className="container mx-auto">
          <div className="flex items-center h-12 relative">
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden text-terminal-highlight px-4 flex items-center"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-5 w-5" />
              ) : (
                <Bars3Icon className="h-5 w-5" />
              )}
            </button>
            
            <div className="terminal-nav-content w-full flex justify-between">
              {/* Left side navigation - hidden on mobile unless menu is open */}
              <div className="hidden md:flex items-center">
                <Link 
                  to="/dashboard" 
                  className={`text-terminal-highlight mx-3 px-3 py-2 ${isActive('/dashboard') ? 'underline decoration-terminal-highlight neon-flicker' : ''}`}
                >
                iQuest
                </Link>
                <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12"></div>
                <Link 
                  to="/domain-selection" 
                  className={`text-terminal-highlight mx-3 px-3 py-2 ${isActive('/domain-selection') ? 'underline decoration-terminal-highlight neon-flicker' : ''}`}
                >
                  Domains
            </Link>
                <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12"></div>
                
                <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12"></div>
                
          </div>

              {/* Right side navigation */}
              <div className="flex items-center ml-auto">
                <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12 hidden md:block"></div>
            <Link
              to="/"
                  className={`text-terminal-highlight mx-3 px-3 py-2 group ${isActive('/') ? 'underline decoration-terminal-highlight neon-flicker' : ''}`}
            >
              Home
                  {!isActive('/') && (
                    <span className="cursor-line hidden group-hover:inline-block ml-1"></span>
                  )}
            </Link>
            {currentUser ? (
              <>
                    <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12 hidden md:block"></div>
                <Link
                  to="/dashboard"
                      className={`text-terminal-highlight mx-3 px-3 py-2 hidden md:block group ${isActive('/dashboard') ? 'underline decoration-terminal-highlight neon-flicker' : ''}`}
                >
                  Dashboard
                      {!isActive('/dashboard') && (
                        <span className="cursor-line hidden group-hover:inline-block ml-1"></span>
                      )}
                </Link>
                
                {isAdmin && (
                      <>
                        <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12 hidden md:block"></div>
                  <Link
                    to="/admin"
                          className={`text-terminal-highlight mx-3 px-3 py-2 hidden md:block group ${isActive('/admin') ? 'underline decoration-terminal-highlight neon-flicker' : ''}`}
                  >
                          Admin
                          {!isActive('/admin') && (
                            <span className="cursor-line hidden group-hover:inline-block ml-1"></span>
                          )}
                  </Link>
                      </>
                )}
                
                    <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12"></div>
                <div className="relative" ref={profileRef}>
                  <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                        className="text-terminal-highlight mx-3 px-3 py-2 flex items-center gap-2 group"
                      >
                        <span>User</span>
                        {isProfileOpen ? (
                          <span className="glitch-text"> [-]</span>
                        ) : (
                          <>
                            <span> [+]</span>
                            <span className="cursor-line hidden group-hover:inline-block ml-1"></span>
                          </>
                        )}
                      </button>
                      
                      {/* Dropdown Menu */}
                      {isProfileOpen && (
                        <div className="absolute right-0 mt-1 w-64 bg-terminal-bg border border-terminal-highlight/50 shadow-lg z-10 animate-fade-in">
                          <div className="px-4 py-2 border-b border-terminal-highlight/30 relative overflow-hidden">
                            {/* Scan line effect */}
                            <div className="absolute inset-0 pointer-events-none opacity-10">
                              <div className="absolute inset-0 scan-line"></div>
                            </div>
                            
                            <pre className="text-terminal-highlight text-xs mb-2 font-mono neon-flicker">
                                {`iquest`}
                            </pre>
                            <div className="flex items-center gap-2">
                    {currentUser.photoURL ? (
                      <img 
                        src={currentUser.photoURL} 
                        alt="Profile" 
                                  className="h-6 w-6 rounded-sm border border-terminal-highlight/50"
                      />
                    ) : (
                                <div className="h-8 w-8 bg-purple-700 border border-terminal-highlight flex items-center justify-center text-white font-mono text-sm">
                                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                                </div>
                              )}
                              <p className="text-sm font-mono text-terminal-highlight truncate">
                                {(currentUser.displayName || currentUser.email?.split('@')[0] || 'user').toLowerCase()}
                              </p>
                            </div>
                            <p className="text-xs font-mono text-terminal-text truncate mt-1">
                              <span className="text-terminal-highlight">$</span> {currentUser.email}
                        </p>
                      </div>
                      <Link
                        to="/domain-selection"
                            className="terminal-dropdown-item command-line-appear"
                            style={{ animationDelay: '0.1s' }}
                      >
                            <span className="text-terminal-highlight mr-2">$</span> cd ~/domain-selection
                      </Link>
                      <button
                        onClick={handleLogout}
                            className="terminal-dropdown-item w-full text-left command-line-appear"
                            style={{ animationDelay: '0.2s' }}
                      >
                            <span className="text-terminal-highlight mr-2">$</span> logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
                  <>
                    <div className="h-12 w-px bg-terminal-highlight/30 -skew-x-12"></div>
              <Link
                to="/login"
                      className="text-terminal-highlight mx-3 px-3 py-2 flex items-center group"
              >
                      <span className="terminal-prompt">Login</span>
                      <span className="cursor-line hidden group-hover:inline-block ml-1"></span>
              </Link>
                  </>
            )}
          </div>
            </div>
          </div>
        </div>
      </nav>
      
      {/* Mobile menu - only shown when toggled */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-terminal-bg border-t border-terminal-highlight/20 animate-slide-in">
          <div className="py-2">
            <Link 
              to="/dashboard" 
              className={`block px-4 py-2 command-line-appear ${isActive('/dashboard') 
                ? 'bg-terminal-highlight/10 text-terminal-highlight border-l-2 border-terminal-highlight' 
                : 'text-terminal-text hover:text-terminal-highlight border-l-2 border-transparent hover:border-terminal-highlight/50'}`}
              style={{ animationDelay: '0.05s' }}
            >
              $ cd ~/iquest
            </Link>
            <Link
              to="/domain-selection" 
              className={`block px-4 py-2 command-line-appear ${isActive('/domain-selection') 
                ? 'bg-terminal-highlight/10 text-terminal-highlight border-l-2 border-terminal-highlight' 
                : 'text-terminal-text hover:text-terminal-highlight border-l-2 border-transparent hover:border-terminal-highlight/50'}`}
              style={{ animationDelay: '0.1s' }}
            >
              $ cd ~/domains
            </Link>
                <Link
              to="/quizzes" 
              className={`block px-4 py-2 command-line-appear ${isActive('/quizzes') 
                ? 'bg-terminal-highlight/10 text-terminal-highlight border-l-2 border-terminal-highlight' 
                : 'text-terminal-text hover:text-terminal-highlight border-l-2 border-transparent hover:border-terminal-highlight/50'}`}
              style={{ animationDelay: '0.15s' }}
            >
              $ cd ~/quizzes
                </Link>
                
                {isAdmin && (
                  <Link
                    to="/admin"
                className={`block px-4 py-2 command-line-appear ${isActive('/admin') 
                  ? 'bg-terminal-highlight/10 text-terminal-highlight border-l-2 border-terminal-highlight' 
                  : 'text-terminal-text hover:text-terminal-highlight border-l-2 border-transparent hover:border-terminal-highlight/50'}`}
                style={{ animationDelay: '0.2s' }}
              >
                $ sudo ~/admin
              </Link>
            )}
          </div>
        </div>
      )}
      
      {/* Terminal command line - mobile only */}
      <div className="md:hidden bg-terminal-bg border-t border-terminal-highlight/30 py-1 px-4 relative overflow-hidden">
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 scan-line"></div>
        </div>
        
        <div className="container mx-auto">
          <div className="text-xs text-terminal-text flex items-center">
            <span className="text-terminal-highlight mr-1 terminal-prompt">System ready</span>
            <span className="inline-block h-3 w-1 bg-terminal-highlight animate-blink"></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar; 