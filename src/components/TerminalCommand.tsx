import React, { useEffect, useState } from 'react';

interface TerminalCommandProps {
  initialCommand: string;
  autoType: boolean;
  autoExecute: boolean;
  promptText: string;
  responseText: string[];
  className?: string;
}

const TerminalCommand: React.FC<TerminalCommandProps> = ({
  initialCommand,
  autoType,
  autoExecute,
  promptText,
  responseText,
  className,
}) => {
  const [command, setCommand] = useState(initialCommand);
  const [output, setOutput] = useState<string[]>([]);
  const [isTyping] = useState(autoType);

  useEffect(() => {
    if (autoType) {
      let index = 0;
      const typeInterval = setInterval(() => {
        setCommand((prev) => prev + initialCommand[index]);
        index++;
        if (index === initialCommand.length) {
          clearInterval(typeInterval);
          if (autoExecute) {
            setOutput(responseText);
          }
        }
      }, 100);
      return () => clearInterval(typeInterval);
    }
  }, [autoType, autoExecute, initialCommand, responseText]);

  const handleExecute = () => {
    setOutput(responseText);
  };

  return (
    <div className={`terminal-command ${className}`}>
      <div className="prompt">
        <span>{promptText}</span>
        <span>{command}</span>
        {isTyping && <span className="typing-cursor">|</span>}
      </div>
      <div className="output">
        {output.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      {!autoExecute && (
        <button onClick={handleExecute} className="execute-button">
          Execute
        </button>
      )}
    </div>
  );
};

export default TerminalCommand;
