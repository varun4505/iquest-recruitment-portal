import React from 'react';

interface TerminalBackgroundProps {
  className?: string;
}

const TerminalBackground: React.FC<TerminalBackgroundProps> = ({ className }) => {
  return (
    <div className={`terminal-background ${className}`}>
      {/* Add your terminal background effect here */}
    </div>
  );
};

export default TerminalBackground;