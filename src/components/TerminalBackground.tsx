import React, { useEffect, useState } from 'react';

interface TerminalBackgroundProps {
  className?: string;
}

const TerminalBackground: React.FC<TerminalBackgroundProps> = ({ className = '' }) => {
  const [matrixColumns, setMatrixColumns] = useState<{ chars: string[], position: number, speed: number }[]>([]);
  const [binaryRain, setBinaryRain] = useState<{ x: number, y: number, char: string, opacity: number }[]>([]);
  const [dataPackets, setDataPackets] = useState<{ x: number, y: number, size: number, speed: number, direction: string }[]>([]);
  
  // Characters for matrix effect (without any "iQuest" text)
  const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン';
  
  // Random code snippets for visuals
  const codeSnippets = [
    'function init() { return new Promise(); }',
    'const data = await fetch("/api/data");',
    'class Terminal extends Component { }',
    'export default function System() { }',
    '<div className="terminal"></div>',
    'git commit -m "Update system"',
    'npm install --save-dev',
    'docker-compose up -d',
    'SELECT * FROM users WHERE active = 1',
    'CREATE TABLE innovations',
  ];

  // Terminal command snippets
  const terminalCommands = [
    'cd /home/user/projects',
    'ls -la',
    'grep -r "pattern" .',
    'sudo systemctl start service',
    'vim config.json',
    'curl https://api.example.com',
    'ssh user@remote-server',
    'git checkout -b feature/branch',
    'mkdir -p new/directory/structure',
    'python -m http.server 8000',
  ];

  // Initialize matrix effect on component mount
  useEffect(() => {
    // Matrix falling characters
    const columns = [];
    const columnCount = Math.floor(window.innerWidth / 20);
    
    for (let i = 0; i < columnCount; i++) {
      const chars = Array(Math.floor(5 + Math.random() * 15))
        .fill('')
        .map(() => matrixChars[Math.floor(Math.random() * matrixChars.length)]);
      
      columns.push({
        chars,
        position: Math.floor(Math.random() * 100),
        speed: 1 + Math.random() * 3
      });
    }
    
    setMatrixColumns(columns);
    
    // Binary rain effect
    const rain = [];
    for (let i = 0; i < 100; i++) {
      rain.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        char: Math.random() > 0.5 ? '0' : '1',
        opacity: 0.1 + Math.random() * 0.7
      });
    }
    
    setBinaryRain(rain);
    
    // Floating data packets
    const packets = [];
    for (let i = 0; i < 30; i++) {
      packets.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 3 + Math.random() * 10,
        speed: 10 + Math.random() * 50,
        direction: Math.random() > 0.5 ? 'left' : 'right'
      });
    }
    
    setDataPackets(packets);
  }, []);

  // Function to render random symbols scattered across the background
  const renderRandomSymbols = () => {
    const symbols = [];
    const symbolCount = 50;
    
    for (let i = 0; i < symbolCount; i++) {
      const x = Math.random() * 100;
      const y = Math.random() * 100;
      const size = 0.7 + Math.random() * 0.5;
      const opacity = 0.1 + Math.random() * 0.7;
      
      symbols.push(
        <div 
          key={`symbol-${i}`} 
          className="absolute text-terminal-highlight" 
          style={{ 
            left: `${x}%`, 
            top: `${y}%`, 
            opacity,
            transform: `scale(${size})`,
            fontSize: '10px'
          }}
        >
          {['>', '#', '$', '%', '&', '*', ';', ':', '~', '+', '=', '_'][Math.floor(Math.random() * 12)]}
        </div>
      );
    }
    
    return symbols;
  };

  // Function to generate code blocks for different sections
  const generateCodeBlock = (x: number, y: number, title: string, isCommand = false) => {
    const snippet = isCommand 
      ? terminalCommands[Math.floor(Math.random() * terminalCommands.length)]
      : codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
    
    return (
      <div 
        className="absolute text-terminal-highlight/20" 
        style={{ 
          left: `${x}%`, 
          top: `${y}%`, 
          fontSize: '8px',
          maxWidth: '200px',
          overflow: 'hidden',
          whiteSpace: 'nowrap'
        }}
      >
        <div className="text-terminal-highlight/30 text-[6px] mb-1">{title}</div>
        <div className="font-mono">{snippet}</div>
      </div>
    );
  };

  return (
    <div className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}>
      {/* Scan line effect */}
      <div className="absolute inset-0 scan-line opacity-10"></div>
      
      {/* Matrix falling characters */}
      {matrixColumns.map((column, colIndex) => (
        <div 
          key={`col-${colIndex}`} 
          className="absolute top-0 bottom-0" 
          style={{ 
            left: `${(colIndex / matrixColumns.length) * 100}%`, 
            width: '20px',
            overflow: 'hidden'
          }}
        >
          {column.chars.map((char, charIndex) => (
            <div 
              key={`char-${colIndex}-${charIndex}`} 
              className="text-terminal-highlight absolute"
              style={{ 
                top: `${(column.position + charIndex * 30) % 150 - 30}%`, 
                opacity: 0.1 + (1 - charIndex / column.chars.length) * 0.4,
                animation: `matrixFall ${column.speed}s infinite linear`,
                fontSize: '12px'
              }}
            >
              {char}
            </div>
          ))}
        </div>
      ))}
      
      {/* Binary data overlay */}
      {binaryRain.map((drop, index) => (
        <div 
          key={`binary-${index}`} 
          className="absolute text-terminal-highlight/20" 
          style={{ 
            left: `${drop.x}%`, 
            top: `${drop.y}%`, 
            opacity: drop.opacity,
            fontSize: '10px',
            fontFamily: 'monospace'
          }}
        >
          {drop.char}
        </div>
      ))}
      
      {/* Floating data packets */}
      {dataPackets.map((packet, index) => (
        <div 
          key={`packet-${index}`} 
          className="absolute bg-terminal-highlight/10 rounded-sm" 
          style={{ 
            left: `${packet.x}%`, 
            top: `${packet.y}%`, 
            width: `${packet.size}px`,
            height: `${packet.size}px`,
            animation: `float-${packet.direction} ${packet.speed}s infinite linear`
          }}
        ></div>
      ))}
      
      {/* Random symbols scattered across */}
      {renderRandomSymbols()}
      
      {/* Grid layout with sections */}
      <div className="absolute inset-0 grid grid-cols-12 grid-rows-6 text-terminal-highlight/10 text-[8px] uppercase">
        {/* Section titles */}
        <div className="border-b border-r border-terminal-highlight/5 p-1">Terminal</div>
        <div className="border-b border-r border-terminal-highlight/5 p-1 col-span-2">Contact</div>
        <div className="border-b border-r border-terminal-highlight/5 p-1 col-span-2">Social</div>
        <div className="border-b border-r border-terminal-highlight/5 p-1 col-span-2">Algorithms</div>
        <div className="border-b border-r border-terminal-highlight/5 p-1 col-span-2">Products</div>
        <div className="border-b border-r border-terminal-highlight/5 p-1 col-span-2">Platforms</div>
        <div className="border-b border-terminal-highlight/5 p-1">Tools</div>
        
        {/* Code snippets in different sections */}
        <div className="col-span-3 row-span-3 relative border-r border-terminal-highlight/5">
          {generateCodeBlock(10, 20, "System")}
          {generateCodeBlock(15, 60, "Network", true)}
        </div>
        
        <div className="col-span-3 row-span-2 relative border-r border-terminal-highlight/5">
          {generateCodeBlock(20, 30, "Database")}
        </div>
        
        <div className="col-span-4 row-span-2 relative border-r border-terminal-highlight/5">
          {generateCodeBlock(40, 30, "Frontend")}
          {generateCodeBlock(10, 70, "API", true)}
        </div>
        
        <div className="col-span-2 row-span-3 relative">
          {generateCodeBlock(30, 40, "Backend")}
          {generateCodeBlock(30, 80, "Deploy", true)}
        </div>
      </div>
      
      {/* Terminal command line at the bottom */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-terminal-highlight/10 p-1 text-terminal-highlight/30 text-xs font-mono">
        <span>&gt; system.init()</span>
        <span className="inline-block h-4 w-2 bg-terminal-highlight/30 ml-1 animate-blink"></span>
      </div>
    </div>
  );
};

export default TerminalBackground; 