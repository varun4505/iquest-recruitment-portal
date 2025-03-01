import React, { useState, useEffect, useRef } from 'react';

interface TerminalCommandProps {
  initialCommand?: string;
  className?: string;
  onCommandSubmit?: (command: string) => void;
  autoType?: boolean;
  autoTypeDelay?: number;
  autoExecute?: boolean;
  promptText?: string;
  responseText?: string[];
}

const TerminalCommand: React.FC<TerminalCommandProps> = ({
  initialCommand = '',
  className = '',
  onCommandSubmit,
  autoType = false,
  autoTypeDelay = 100,
  autoExecute = false,
  promptText = 'iquest@terminal:~$',
  responseText = []
}) => {
  const [command, setCommand] = useState('');
  const [inputActive, setInputActive] = useState(!autoType);
  const [isTyping, setIsTyping] = useState(autoType);
  const [typeIndex, setTypeIndex] = useState(0);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [responses, setResponses] = useState<string[]>(responseText);
  const [showCursor, setShowCursor] = useState(true);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const commandLineRef = useRef<HTMLDivElement>(null);
  
  // Auto-typing effect
  useEffect(() => {
    if (autoType && isTyping && typeIndex < initialCommand.length) {
      const timer = setTimeout(() => {
        setCommand(prev => prev + initialCommand[typeIndex]);
        setTypeIndex(typeIndex + 1);
      }, autoTypeDelay);
      
      return () => clearTimeout(timer);
    } else if (autoType && isTyping && typeIndex === initialCommand.length) {
      setIsTyping(false);
      
      if (autoExecute) {
        setTimeout(() => {
          handleCommandSubmit();
        }, 500);
      } else {
        setInputActive(true);
      }
    }
  }, [autoType, isTyping, typeIndex, initialCommand, autoExecute, autoTypeDelay]);
  
  // Blinking cursor effect
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);
    
    return () => clearInterval(cursorInterval);
  }, []);
  
  // Focus input when active
  useEffect(() => {
    if (inputActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputActive]);
  
  // Scroll to bottom when responses change
  useEffect(() => {
    if (commandLineRef.current) {
      commandLineRef.current.scrollTop = commandLineRef.current.scrollHeight;
    }
  }, [responses]);
  
  const handleCommandChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCommand(e.target.value);
  };
  
  const handleCommandSubmit = () => {
    if (command.trim()) {
      // Add to history
      setHistory(prev => [...prev, command]);
      setHistoryIndex(-1);
      
      // Process command
      if (onCommandSubmit) {
        onCommandSubmit(command);
      }
      
      // Add command to responses
      setResponses(prev => [...prev, `${promptText} ${command}`]);
      
      // Clear command
      setCommand('');
    }
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleCommandSubmit();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length > 0 && historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setCommand(history[history.length - 1 - newIndex]);
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setCommand('');
      }
    }
  };
  
  return (
    <div 
      className={`bg-terminal-bg border border-terminal-highlight rounded-md overflow-hidden ${className}`}
      onClick={() => inputActive && inputRef.current?.focus()}
    >
      <div className="terminal-header px-4 py-2">
        <div className="terminal-header-dots">
          <span className="terminal-header-dot bg-red-500"></span>
          <span className="terminal-header-dot bg-yellow-500"></span>
          <span className="terminal-header-dot bg-green-500"></span>
        </div>
        <div className="terminal-header-title">terminal</div>
        <div className="w-16"></div>
      </div>
      
      <div 
        ref={commandLineRef}
        className="p-4 font-mono text-sm h-64 overflow-y-auto bg-black/80 text-gray-200"
      >
        {/* Previous responses */}
        {responses.map((response, index) => (
          <div key={index} className="mb-1 whitespace-pre-wrap">{response}</div>
        ))}
        
        {/* Current command line */}
        <div className="flex items-start">
          <span className="text-terminal-highlight mr-2">{promptText}</span>
          <span className="relative">
            {command}
            {showCursor && inputActive && (
              <span className="absolute top-0 h-full w-2 ml-0.5 bg-terminal-highlight opacity-70 animate-blink"></span>
            )}
          </span>
        </div>
      </div>
      
      <input
        ref={inputRef}
        type="text"
        value={command}
        onChange={handleCommandChange}
        onKeyDown={handleKeyDown}
        className="absolute opacity-0 pointer-events-none"
        disabled={!inputActive}
      />
    </div>
  );
};

export default TerminalCommand; 