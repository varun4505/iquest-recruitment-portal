import React from 'react';
import { Link } from 'react-router-dom';
import TerminalCommand from './TerminalCommand';

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
        
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <div>
            <h3 className="text-xl text-terminal-highlight mb-4">Try Our Terminal</h3>
            <TerminalCommand 
              initialCommand="help"
              autoType={true}
              autoExecute={true}
              promptText="innovator@iquest:~$"
              responseText={[
                "Welcome to Innovators Quest Terminal",
                "Type 'help' to see available commands",
                "------------------------------------------",
                "innovator@iquest:~$ help",
                "",
                "Available commands:",
                "  domains       - List all innovation domains",
                "  register      - Begin the registration process",
                "  learn <topic> - Learn about specific topics",
                "  about         - About Innovators Quest",
                "  clear         - Clear the terminal"
              ]}
              className="shadow-lg"
            />
          </div>
          
          <div className="flex flex-col justify-center">
            <h3 className="text-xl text-terminal-highlight mb-4">Ready to Begin?</h3>
            <p className="text-terminal-text mb-6">
              Join Innovators Quest and gain access to mentorship, resources, and a community of like-minded individuals passionate about innovation.
            </p>
            
            <div className="space-y-4">
              <div className="command-line-wrapper">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">sudo apt-get install innovation-mindset</span>
              </div>
              
              <div className="command-line-wrapper">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">cd /path/to/success</span>
              </div>
              
              <div className="command-line-wrapper">
                <span className="command-line-prompt">$</span>
                <span className="ml-2">chmod +x your_potential.sh</span>
              </div>
            </div>
            
            <div className="mt-8">
              <Link
                to="/login"
                className="interactive-button px-8 py-4 text-lg"
              >
                Initialize Login Sequence <span className="ml-2">→</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CTASection; 