import React from 'react';
import { Link } from 'react-router-dom';

const CTASection: React.FC = () => {
  return (
    <div className="py-16 bg-terminal-bg border-y border-terminal-highlight/30 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="binary-rain" style={{ left: '10%', animationDuration: '6s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
        <div className="binary-rain" style={{ left: '30%', animationDuration: '8s', animationDelay: '1s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
        <div className="binary-rain" style={{ left: '50%', animationDuration: '7s', animationDelay: '2s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
        <div className="binary-rain" style={{ left: '70%', animationDuration: '9s', animationDelay: '0.5s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
        <div className="binary-rain" style={{ left: '90%', animationDuration: '10s', animationDelay: '1.5s' }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <div key={i}>{Math.random() > 0.5 ? '1' : '0'}</div>
          ))}
        </div>
      </div>
      
      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-12">
          <div className="inline-block terminal-header px-6 py-1 mb-4 rounded-sm">
            <span className="terminal-header-title typewriter">SYSTEM: CONNECT</span>
          </div>
          <h2 className="text-3xl font-bold text-terminal-highlight glow-terminal-text">
            Start Your Innovation Journey
          </h2>
          <div className="terminal-glow-line max-w-md mx-auto my-6"></div>
          <p className="text-terminal-text max-w-2xl mx-auto">
            Join our community of innovators and begin your journey today
          </p>
        </div>
        
        <div className="max-w-3xl mx-auto bg-black/50 border border-terminal-highlight/40 rounded-lg p-6 md:p-8 shadow-lg shadow-terminal-highlight/10">
          <div className="flex flex-col items-center">
            <h3 className="text-xl md:text-2xl text-terminal-highlight mb-4">Ready to Begin?</h3>
            <p className="text-terminal-text mb-6 text-center">
              Join Innovators Quest and gain access to mentorship, resources, and a community of like-minded individuals passionate about innovation.
            </p>
            
            <div className="space-y-4 w-full max-w-md">
              <div className="command-line-wrapper bg-black/70 px-4 py-2 border-l-2 border-terminal-highlight">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">sudo apt-get install innovation-mindset</span>
              </div>
              
              <div className="command-line-wrapper bg-black/70 px-4 py-2 border-l-2 border-terminal-highlight">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">cd /path/to/success</span>
              </div>
              
              <div className="command-line-wrapper bg-black/70 px-4 py-2 border-l-2 border-terminal-highlight">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">chmod +x your_potential.sh</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/login"
                className="cyber-button relative inline-block px-8 py-4 text-lg text-terminal-text bg-black border border-terminal-highlight hover:text-terminal-highlight transition-colors duration-300"
                style={{ 
                  textShadow: "0 0 5px rgba(0, 255, 196, 0.3)",
                  boxShadow: "0 0 10px rgba(0, 255, 196, 0.2), inset 0 0 10px rgba(0, 255, 196, 0.1)"
                }}
              >
                <span className="glitch-text">Initialize Login Sequence <span className="ml-2">→</span></span>
                <span className="absolute inset-0 overflow-hidden">
                  <span className="absolute top-0 left-0 w-2 h-2 border-t border-l border-terminal-highlight opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute top-0 right-0 w-2 h-2 border-t border-r border-terminal-highlight opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-terminal-highlight opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-terminal-highlight opacity-0 hover:opacity-100 transition-opacity duration-300"></span>
                  <span className="absolute top-0 left-1/4 w-[1px] h-full bg-terminal-highlight/40 -skew-x-45 opacity-0 hover:opacity-100 transition-all duration-300 hover:translate-x-8"></span>
                  <span className="absolute top-0 right-1/4 w-[1px] h-full bg-terminal-highlight/40 skew-x-45 opacity-0 hover:opacity-100 transition-all duration-300 hover:-translate-x-8"></span>
                </span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection;