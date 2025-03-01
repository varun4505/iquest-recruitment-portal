import { useState } from 'react';
import { Link } from 'react-router-dom';
import TerminalBackground from '../components/TerminalBackground';
import { useAuth } from '../contexts/AuthContext';
import CountdownTimer from '../components/CountdownTimer';
import CTASection from '../components/CTASection';

const Home = () => {
  const { currentUser } = useAuth();
  const [isGlitching, setIsGlitching] = useState(false);
  
  const handleGlitch = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 1000);
  };

  return (
    <div className="pt-8">
      {/* Hero Section with ASCII Art */}
      <div className="py-10 relative overflow-hidden">
        {/* Terminal background */}
        <TerminalBackground className="opacity-5" />
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="animate-fade-in">
            <h1 className="text-3xl md:text-4xl lg:text-6xl font-extrabold text-primary-500 mb-4 text-center glitch-title">
              <span className="typing-cursor">Innovators Quest</span>
            </h1>
            <p className="text-base sm:text-lg md:text-xl text-white font-medium mb-6 md:mb-8 max-w-2xl mx-auto text-center px-4 sm:px-0">
              Join us in our mission to nurture innovation, creativity, and
              technical excellence through hands-on learning and real-world projects.
            </p>
            
            
            <CountdownTimer 
              type="registration" 
              title="Registration Closes In"
              description="Don't miss your chance to join the Core team of iQuest!"
              className="max-w-md mx-auto mb-6"
            />

            {!currentUser && (
              <div className="text-center mb-10 px-4 sm:px-0">
                <div className="terminal-login-container flex flex-col sm:flex-row items-center justify-center gap-4">
                  
                  
                  <Link to="/login" 
                    className="terminal-box group relative inline-flex items-center justify-between gap-2 bg-black/60 border-terminal-highlight py-3 px-5 overflow-hidden transition-all duration-300 hover:bg-terminal-highlight/10"
                    onMouseEnter={() => handleGlitch()}
                  >
                    <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
                    <div className="absolute inset-0 noise-overlay opacity-5 pointer-events-none"></div>
                    <span className="font-mono text-terminal-highlight flex items-center">
                      $ START_SESSION
                      <span className="typing-cursor ml-1 opacity-75"></span>
                    </span>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-terminal-highlight transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
              </Link>
                </div>
              </div>
            )}
            


            
          </div>
        </div>
      </div>

      {/* Vision & Mission - Mobile optimized */}
      <div className="py-10 md:py-16 bg-terminal-bg/30 relative border-b border-terminal-highlight/20">
        <div className="terminal-grid-pattern"></div>
        <div className="noise-overlay opacity-5"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block terminal-header px-3 sm:px-6 py-1 mb-3 md:mb-4 rounded-sm">
              <span className="terminal-header-title typewriter text-xs sm:text-sm">SYSTEM: OBJECTIVES</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-highlight glow-terminal-text">
              Our Vision & Mission
            </h2>
            <div className="terminal-glow-line max-w-md mx-auto my-4 md:my-6"></div>
          </div>
          
          <div className="grid md:grid-cols-2 gap-4 md:gap-8">
            <div className="terminal-box p-4 md:p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-3 md:mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title text-xs sm:text-sm">vision.conf</div>
                <div className="w-10 sm:w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-terminal-highlight/20 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-6 md:h-6 text-terminal-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h2 className="text-terminal-highlight text-lg md:text-xl font-bold">
                  Our Vision
                </h2>
              </div>
              
              <div className="terminal-code-block mt-2 mb-3 md:mb-4 text-xs md:text-sm">
                <code>$ cat vision.txt</code>
              </div>
              
              <p className="text-terminal-text text-xs md:text-base">
                  To create a community of innovative thinkers and problem solvers who
                  will shape the future of technology and design through collaborative
                  learning and hands-on experience.
                </p>
              </div>
            
            {/* Mission card - Similar changes to above */}
            <div className="terminal-box p-4 md:p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-4 md:-mx-6 -mt-4 md:-mt-6 mb-3 md:mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title text-xs sm:text-sm">mission.conf</div>
                <div className="w-10 sm:w-16"></div>
            </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="flex items-center mb-3 md:mb-4">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-terminal-highlight/20 rounded-full flex items-center justify-center mr-2 md:mr-3">
                  <svg className="w-4 h-4 md:w-6 md:h-6 text-terminal-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h2 className="text-terminal-highlight text-lg md:text-xl font-bold">
                  Our Mission
                </h2>
              </div>
              
              <div className="terminal-code-block mt-2 mb-3 md:mb-4 text-xs md:text-sm">
                <code>$ cat mission.txt</code>
              </div>
              
              <p className="text-terminal-text text-xs md:text-base">
                  To provide a platform for students to explore their interests in
                  technology, design, content creation, and management while developing
                  practical skills through real-world projects and mentorship.
                </p>
              </div>
            </div>
          </div>
        </div>

      {/* Domain Sections - Now with Terminal Styling */}
      <div className="py-10 md:py-16 bg-gradient-to-b from-black to-terminal-bg/30 border-y border-terminal-highlight/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block terminal-header px-3 sm:px-6 py-1 mb-3 md:mb-4 rounded-sm">
              <span className="terminal-header-title typewriter text-xs sm:text-sm">SYSTEM: DOMAINS</span>
      </div>
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-highlight glow-terminal-text">
              Explore Innovation Domains
            </h2>
            <div className="terminal-glow-line max-w-md mx-auto my-4 md:my-6"></div>
            <p className="text-sm md:text-base text-terminal-text max-w-2xl mx-auto">
              Select your path in our innovation ecosystem and develop specialized skills
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {/* Technical Domain */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">technical.sys</div>
                <div className="w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 flex items-center">
                <span className="text-terminal-highlight mr-2">&gt;</span> Technical
              </div>
              <p className="text-white text-sm md:text-base mb-4">
                Dive deep into programming, system design, and cutting-edge technologies.
              </p>
              <div className="terminal-code-block mt-2 mb-4">
                <code className="text-terminal-highlight">$ skill --list technical<br />
                ['coding', 'systems-design', 'algorithms', 'data-structures']</code>
              </div>
              <Link to="/login" className="text-terminal-highlight inline-flex items-center hover:underline group" target="_blank" rel="noopener noreferrer">
                <span className="terminal-prompt">cd /explore/technical</span>
                <span className="terminal-cursor ml-1"></span>
              </Link>
              <div className="absolute top-0 right-0 h-12 w-12 opacity-30 overflow-hidden pointer-events-none">
                <div className="radar-scan"></div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="terminal-status online">ACTIVE</span>
              </div>
            </div>
            
            {/* Design Domain */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">design.sys</div>
                <div className="w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 flex items-center">
                <span className="text-terminal-highlight mr-2">&gt;</span> Design
              </div>
              <p className="text-white text-sm md:text-base mb-4">
                Create beautiful and functional designs for web, mobile, and brand identity.
              </p>
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ skill --list design<br />
                ['ui-ux', 'graphic-design', 'prototyping', 'brand-identity']</code>
              </div>
              <Link to="/login" className="text-terminal-highlight inline-flex items-center hover:underline group" target="_blank" rel="noopener noreferrer">
                <span className="terminal-prompt">cd /explore/design</span>
                <span className="terminal-cursor ml-1"></span>
              </Link>
              <div className="absolute top-0 right-0 h-12 w-12 opacity-30 overflow-hidden pointer-events-none">
                <div className="radar-scan"></div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="terminal-status online">ACTIVE</span>
              </div>
            </div>
            
            {/* Editorial Domain */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">editorial.sys</div>
                <div className="w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 flex items-center">
                <span className="text-terminal-highlight mr-2">&gt;</span> Editorial
                    </div>
              <p className="text-white text-sm md:text-base mb-4">
                Craft compelling content and stories that engage and inform our audience.
              </p>
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ skill --list editorial<br />
                ['content-writing', 'storytelling', 'editing', 'publishing']</code>
              </div>
              <Link to="/login" className="text-terminal-highlight inline-flex items-center hover:underline group" target="_blank" rel="noopener noreferrer">
                <span className="terminal-prompt">cd /explore/editorial</span>
                <span className="terminal-cursor ml-1"></span>
              </Link>
              <div className="absolute top-0 right-0 h-12 w-12 opacity-30 overflow-hidden pointer-events-none">
                <div className="radar-scan"></div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="terminal-status online">ACTIVE</span>
              </div>
                  </div>
            
            {/* Management Domain */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">management.sys</div>
                <div className="w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 flex items-center">
                <span className="text-terminal-highlight mr-2">&gt;</span> Management
              </div>
              <p className="text-white text-sm md:text-base mb-4">
                Lead teams and projects while developing essential organizational skills.
              </p>
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ skill --list management<br />
                ['leadership', 'project-mgmt', 'team-building', 'strategy']</code>
              </div>
              <Link to="/login" className="text-terminal-highlight inline-flex items-center hover:underline group" target="_blank" rel="noopener noreferrer">
                <span className="terminal-prompt">cd /explore/management</span>
                <span className="terminal-cursor ml-1"></span>
              </Link>
              <div className="absolute top-0 right-0 h-12 w-12 opacity-30 overflow-hidden pointer-events-none">
                <div className="radar-scan"></div>
              </div>
              <div className="absolute bottom-3 right-3">
                <span className="terminal-status online">ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section - Enhanced with Terminal Styling */}
      <div className="py-10 md:py-16 animated-bg-gradient relative">
        <div className="terminal-grid-pattern"></div>
        <div className="scan-line-moving"></div>
        <div className="container mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <div className="inline-block terminal-header px-3 sm:px-6 py-1 mb-3 md:mb-4 rounded-sm">
              <span className="terminal-header-title typewriter text-xs sm:text-sm">SYSTEM: WORKFLOW</span>
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-terminal-highlight glow-terminal-text">
              How Innovators Quest Works
            </h2>
            <div className="terminal-glow-line max-w-md mx-auto my-4 md:my-6"></div>
            <p className="text-sm md:text-base text-terminal-text max-w-2xl mx-auto">
              Follow these steps to begin your innovation journey and join our community
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-10">
            {/* Step 1 */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">step01.exe</div>
                <div className="w-16"></div>
                  </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-terminal-bg flex items-center justify-center border border-terminal-highlight">
                  <span className="text-2xl text-terminal-highlight">01</span>
                </div>
              </div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 text-center">Register Account</div>
              
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ user --create<br />
                {'>'}  Enter credentials<br />
                {'>'}  Validating input</code>
              </div>
              
              <p className="text-terminal-text text-center mt-4">
                Create your innovator profile and join our community of creators and problem solvers.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">step02.exe</div>
                <div className="w-16"></div>
          </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-terminal-bg flex items-center justify-center border border-terminal-highlight">
                  <span className="text-2xl text-terminal-highlight">02</span>
        </div>
      </div>

              <div className="text-terminal-highlight text-lg font-bold mb-3 text-center">Choose Domain</div>
              
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ domain --select<br />
                {'>'}  Scanning abilities<br />
                {'>'}  Matching domains</code>
              </div>
              
              <p className="text-terminal-text text-center mt-4">
                Select from technical, design, editorial, or management domains based on your interests.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="terminal-box p-6 border-terminal-highlight hover:border-terminal-highlight/90 bg-terminal-bg/80 group transition-all duration-300 relative overflow-hidden glow-terminal-box">
              {/* Corner Brackets */}
              <span className="terminal-corner terminal-corner-tl"></span>
              <span className="terminal-corner terminal-corner-tr"></span>
              <span className="terminal-corner terminal-corner-bl"></span>
              <span className="terminal-corner terminal-corner-br"></span>
              
              {/* Terminal Header */}
              <div className="terminal-header -mx-6 -mt-6 mb-4">
                <div className="terminal-header-dots">
                  <span className="terminal-header-dot bg-red-500"></span>
                  <span className="terminal-header-dot bg-yellow-500"></span>
                  <span className="terminal-header-dot bg-green-500"></span>
                </div>
                <div className="terminal-header-title">step03.exe</div>
                <div className="w-16"></div>
              </div>
              
              {/* Scan Lines and Noise */}
              <div className="absolute inset-0 scan-line opacity-10 pointer-events-none"></div>
              <div className="noise-overlay"></div>
              
              <div className="flex justify-center mb-4">
                <div className="w-16 h-16 rounded-full bg-terminal-bg flex items-center justify-center border border-terminal-highlight">
                  <span className="text-2xl text-terminal-highlight">03</span>
                </div>
              </div>
              
              <div className="text-terminal-highlight text-lg font-bold mb-3 text-center">Take the Quiz</div>
              
              <div className="terminal-code-block mt-2 mb-4">
                <code>$ quiz --start<br />
                {'>'}  Evaluating skills<br />
                {'>'}  Identifying strengths</code>
              </div>
              
              <p className="text-terminal-text text-center mt-4">
                Discover your strengths and weaknesses, and get personalized recommendations for your innovation journey.
              </p>
            </div>
          </div>
          
          <div className="mt-8 md:mt-12 text-center">
            <button className="interactive-button text-sm md:text-base py-2 px-4 md:py-3 md:px-6">
              Learn More About Our Process <span className="ml-2">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section with Interactive Terminal */}
      <CTASection />
      
      {/* Footer */}
      <footer className="bg-terminal-bg border-t border-terminal-highlight/30 py-6 md:py-8 relative overflow-hidden font-mono">
        {/* Scan line effect */}
        <div className="absolute inset-0 pointer-events-none opacity-10">
          <div className="absolute inset-0 scan-line"></div>
        </div>
        
        {/* Terminal header decoration */}
        <div className="max-w-7xl mx-auto px-4 mb-8">
          <div className="border-b border-terminal-highlight/20 pb-2 flex items-center justify-between">
            <div className="text-terminal-highlight flex items-center">
              <div className="mr-2 h-2 w-2 rounded-full bg-terminal-highlight/80 animate-pulse"></div>
              <div className="typing-cursor">TERMINAL SESSION</div>
            </div>
            <div className="text-terminal-text text-xs opacity-70">
              <span className="text-terminal-highlight mr-1">$</span> cd ~/iquest/footer
            </div>
          </div>
        </div>

        <div className="w-full relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 max-w-7xl mx-auto px-4">
            {/* Brand Section */}
            <div className="md:col-span-5">
              <div className="terminal-card">
                <pre className="text-terminal-highlight text-xs mb-4 neon-flicker">
{`    _  ____                 __ 
   (_)/ __ \\__  _____  _____/ /_
  / // / / / / / / _ \\/ ___/ __/
 / // /_/ / /_/ /  __(__  ) /_  
/_/ \\___\\_\\__,_/\\___/____/\\__/  `}
                </pre>
                <p className="terminal-text mb-6">
                  Nurturing innovation, creativity, and technical excellence through hands-on learning. Join us in shaping the future of technology and design.
                </p>
                <div className="flex gap-4">
                  <a href="https://x.com/innovatorsvit/" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">twitter</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                    </svg>
                  </a>
                  <a href="https://www.linkedin.com/company/innovatorsquest/" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">linkedin</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                  </a>
                  <a href="https://www.instagram.com/iquest.vit/" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">instagram</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                  <a href="https://www.youtube.com/@iQuestvit" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">youtube</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a href="https://www.facebook.com/innovatorsquest/" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">facebook</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a href="https://chat.whatsapp.com/CbiPAaVYFrCCHv0QDUsb09" 
                     className="terminal-icon-link group"
                     target="_blank" 
                     rel="noopener noreferrer">
                    <span className="text-xs text-terminal-highlight opacity-0 group-hover:opacity-100 absolute -top-5 left-1/2 -translate-x-1/2 transition-opacity">whatsapp</span>
                    <svg className="h-5 w-5 text-terminal-text group-hover:text-terminal-highlight" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div className="md:col-span-3">
              <div className="terminal-card">
                <h4 className="terminal-title mb-6 typing-cursor">Directory</h4>
                <ul className="space-y-4">
                  <li>
                    <Link to="/" className="text-terminal-text hover:text-terminal-highlight transition-colors flex items-center gap-3 group command-line-appear" style={{ animationDelay: '0.1s' }}>
                      <span className="text-terminal-highlight">$</span> cd ~/home
                    </Link>
                  </li>
                  <li>
                    <Link to="/login" className="text-terminal-text hover:text-terminal-highlight transition-colors flex items-center gap-3 group command-line-appear" style={{ animationDelay: '0.2s' }}>
                      <span className="text-terminal-highlight">$</span> cd ~/login
                    </Link>
                  </li>
                  {currentUser && (
                    <li>
                      <Link to="/dashboard" className="text-terminal-text hover:text-terminal-highlight transition-colors flex items-center gap-3 group command-line-appear" style={{ animationDelay: '0.3s' }}>
                        <span className="text-terminal-highlight">$</span> cd ~/dashboard
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            </div>

            {/* Contact Info */}
            <div className="md:col-span-4">
              <div className="terminal-card">
                <h4 className="terminal-title mb-6 typing-cursor">Contact</h4>
                <div className="space-y-4">
                  <a href="mailto:contact.iquestvit@gmail.com" 
                     className="text-terminal-text hover:text-terminal-highlight transition-colors flex items-center gap-3 group command-line-appear" style={{ animationDelay: '0.1s' }}>
                    <span className="text-terminal-highlight">@</span> contact.iquestvit@gmail.com
                  </a>
                  <div className="text-terminal-text flex items-center gap-3 command-line-appear" style={{ animationDelay: '0.2s' }}>
                    <span className="text-terminal-highlight">&gt;</span> Vellore,Tamil Nadu, India
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-8 pt-4 border-t border-terminal-highlight/20 text-center max-w-7xl mx-auto relative">
            {/* Command line prompt */}
            <div className="flex items-center justify-center mb-2">
              <span className="text-terminal-highlight mr-2">user@iquest:~$</span>
              <span className="text-terminal-text typing-cursor">echo $COPYRIGHT</span>
            </div>
            <p className="text-terminal-text">
              © {new Date().getFullYear()} iQuest. All rights reserved.
            </p>
          </div>
        </div>
        
        {/* Terminal command line - Mobile responsive footer */}
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-terminal-highlight/20">
          <div className="text-terminal-text flex flex-col sm:flex-row items-center justify-between text-[10px] sm:text-xs gap-3 sm:gap-0">
            <div>
              <span className="text-terminal-highlight mr-2">connection:</span>
              <span className="text-terminal-text">secure</span>
            </div>
            <div className="text-center relative order-first sm:order-none mb-2 sm:mb-0">
              <div className="text-terminal-text">
                <a href="https://www.linkedin.com/in/varun-b-a4a6611b8/" target="_blank" rel="noopener noreferrer" className="text-terminal-highlight hover:text-terminal-highlight/70 transition-colors">
                  This website is made by Varun B
                </a>
              </div>
            </div>
            <div>
              <span className="text-terminal-highlight mr-2">status:</span>
              <span className="text-terminal-text">system ready <span className="cursor-line"></span></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const steps = [
  {
    title: "Create Account",
    command: "$ user --create",
    description: "Sign up for access to iQuest's innovation platform",
  },
  {
    title: "Select Domain",
    command: "$ domain --select",
    description: "Choose your areas of expertise and interest",
  },
  {
    title: "Begin Innovation",
    command: "$ innovation --start",
    description: "Start contributing to cutting-edge projects",
  }
];

export default Home; 