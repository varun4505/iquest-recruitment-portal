import { useState, useEffect, useRef } from 'react';

const LoadingScreen = () => {
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [loadingState, setLoadingState] = useState('Initializing...');
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    // Handle window resize
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Update loading state based on progress
    if (loadingProgress > 10 && loadingProgress <= 30) {
      setLoadingState('Loading modules...');
    } else if (loadingProgress > 30 && loadingProgress <= 60) {
      setLoadingState('Establishing connection...');
    } else if (loadingProgress > 60 && loadingProgress <= 90) {
      setLoadingState('Preparing terminal...');
    } else if (loadingProgress > 90) {
      setLoadingState('Ready...');
    }

    // Simulate loading progress with a smoother, more controlled animation
    const interval = setInterval(() => {
      setLoadingProgress((prev) => {
        const next = prev + 1;
        
        if (next >= 100) {
          clearInterval(interval);
          setTimeout(() => {
            setIsVisible(false);
          }, 300);
          return 100;
        }
        return next;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [loadingProgress]);

  if (!isVisible) return null;

  // Simple logo for mobile
  const SimpleLogo = () => (
    <div className="text-terminal-highlight text-2xl font-bold mb-2 font-mono">
      iQuest
    </div>
  );

  return (
    <div 
      className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center transition-opacity duration-500 px-4"
      style={{ opacity: loadingProgress >= 100 ? 0 : 1 }}
    >
      {/* Clean background with subtle scan line */}
      <div className="absolute inset-0 scan-line opacity-20 pointer-events-none"></div>
      <div className="absolute inset-0 terminal-grid-pattern opacity-5"></div>
      
      {/* Logo - responsive version */}
      <div className="mb-4 sm:mb-8 text-center">
        {windowWidth < 380 ? (
          <SimpleLogo />
        ) : (
          <pre className="font-mono text-terminal-highlight text-sm sm:text-lg md:text-2xl font-bold mb-2 whitespace-pre-wrap break-words sm:whitespace-pre">
{`   _  ____                 __ 
  (_)/ __ \\__  _____  _____/ /_
 / // / / / / / / _ \\/ ___/ __/
/ // /_/ / /_/ /  __(__  ) /_  
\\_/ \\___\\_\\__,_/\\___/____/\\__/  `}
          </pre>
        )}
        <div className="text-xxs sm:text-xs text-terminal-highlight/70">
          INNOVATORS QUEST v2.6
        </div>
      </div>
      
      {/* Terminal box */}
      <div className="terminal-box border-terminal-highlight p-3 sm:p-6 w-full max-w-xs sm:max-w-sm md:max-w-md mb-4 sm:mb-6 relative">
        <span className="terminal-corner terminal-corner-tl"></span>
        <span className="terminal-corner terminal-corner-tr"></span>
        <span className="terminal-corner terminal-corner-bl"></span>
        <span className="terminal-corner terminal-corner-br"></span>
        
        {/* Terminal Header */}
        <div className="terminal-header -mx-3 sm:-mx-6 -mt-3 sm:-mt-6 mb-3 sm:mb-6 px-2 sm:px-4 py-1 sm:py-2">
          <div className="terminal-header-dots">
            <span className="terminal-header-dot bg-red-500"></span>
            <span className="terminal-header-dot bg-yellow-500"></span>
            <span className="terminal-header-dot bg-green-500"></span>
          </div>
          <div className="terminal-header-title text-xxs sm:text-xs">system-load.exe</div>
          <div className="w-8 sm:w-16"></div>
        </div>
        
        {/* Loading bar component */}
        <div className="mb-3 sm:mb-6">
          <div className="mb-2 flex justify-between items-center">
            <div className="text-xxs sm:text-xs text-terminal-highlight flex items-center">
              <div className="h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-terminal-highlight animate-pulse mr-1 sm:mr-2"></div>
              {loadingState}
            </div>
            <div className="text-xxs sm:text-xs text-terminal-highlight">{loadingProgress}%</div>
          </div>
          
          <div className="w-full h-1 sm:h-1.5 bg-terminal-bg border border-terminal-highlight/30 rounded-sm overflow-hidden">
            <div 
              className="h-full bg-terminal-highlight transition-all duration-100 ease-out"
              style={{ width: `${loadingProgress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Status indicators */}
        <div className="grid grid-cols-2 gap-1 sm:gap-2 text-xxs sm:text-xs text-terminal-text mb-3 sm:mb-4">
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2 ${loadingProgress >= 25 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Modules</span>
          </div>
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2 ${loadingProgress >= 50 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Connection</span>
          </div>
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2 ${loadingProgress >= 75 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>Terminal</span>
          </div>
          <div className="flex items-center">
            <div className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full mr-1 sm:mr-2 ${loadingProgress >= 95 ? 'bg-green-500' : 'bg-gray-600'}`}></div>
            <span>System</span>
          </div>
        </div>
        
        {/* Terminal code block */}
        <div className="bg-black/50 border border-terminal-highlight/20 p-1.5 sm:p-2 text-xxs sm:text-xs font-mono max-h-16 sm:max-h-20 overflow-hidden">
          <div className="text-gray-400">$ system --initialize</div>
          {loadingProgress >= 30 && (
            <div className="text-green-400">✓ Core modules loaded</div>
          )}
          {loadingProgress >= 60 && (
            <div className="text-green-400">✓ Connection established</div>
          )}
          {loadingProgress >= 80 && (
            <div className="text-green-400">✓ Terminal ready</div>
          )}
          {loadingProgress >= 95 && (
            <div className="text-terminal-highlight">
              System ready <span className="animate-blink">|</span>
            </div>
          )}
        </div>
      </div>
      
      <div className="text-xxs sm:text-xs text-terminal-text/70">
        © {new Date().getFullYear()} iQuest - Initializing Recruitment Portal
      </div>
    </div>
  );
};

// Add this to your tailwind.config.cjs to include the xxs text size
// fontSize: {
//   'xxs': '0.65rem',
//   ...defaultTheme.fontSize
// }

export default LoadingScreen;