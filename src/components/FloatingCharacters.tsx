import React, { useEffect, useState } from 'react';

interface FloatingCharacterProps {
  className?: string;
}

const FloatingCharacters: React.FC<FloatingCharacterProps> = ({ className = '' }) => {
  const [characters, setCharacters] = useState<Array<{
    id: number;
    char: string;
    x: number;
    y: number;
    opacity: number;
    size: number;
    speed: number;
    delay: number;
    fadeDelay: number;
    fadeSpeed: number;
  }>>([]);
  
  useEffect(() => {
    // Characters for Matrix-style - mix of Latin, Japanese katakana, and special symbols
    const matrixChars = '01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン><+=-_¦|~¬ABCDEFGHJKMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789!@#$%^&*()[]{}:;.,?/\\\'"`'.split('');
    const numChars = Math.floor(window.innerWidth / 15); // More characters for denser matrix effect
    const newCharacters = [];
    
    for (let i = 0; i < numChars; i++) {
      newCharacters.push({
        id: i,
        char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
        x: Math.random() * 100, // random position across width (%)
        y: -5 - Math.random() * 20, // start above viewport
        opacity: Math.random() * 0.5 + 0.3, // random opacity between 0.3-0.8
        size: Math.random() * 1.2 + 0.6, // random size between 0.6-1.8rem
        speed: Math.random() * 4 + 1, // random fall speed - slower than typical matrix for better visibility
        delay: Math.random() * 15, // random start delay
        fadeDelay: Math.random() * 15 + 10, // when it starts to fade
        fadeSpeed: Math.random() * 2 + 1 // how fast it fades
      });
    }
    
    setCharacters(newCharacters);
    
    // Create new characters periodically to maintain density
    const createInterval = setInterval(() => {
      setCharacters(prevChars => {
        // Filter out characters that have fallen below viewport
        const remainingChars = prevChars.filter(char => 
          (char.y < 110) // keep if still in or just below viewport
        );
        
        // Add new characters to maintain density
        const charsToAdd = Math.max(0, numChars - remainingChars.length);
        const newChars = [];
        
        for (let i = 0; i < charsToAdd; i++) {
          newChars.push({
            id: Date.now() + i, // ensure unique ID
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)],
            x: Math.random() * 100, // random position across width (%)
            y: -5, // start above viewport
            opacity: Math.random() * 0.5 + 0.3,
            size: Math.random() * 1.2 + 0.6,
            speed: Math.random() * 4 + 1,
            delay: 0, // no delay for new characters
            fadeDelay: Math.random() * 15 + 10,
            fadeSpeed: Math.random() * 2 + 1
          });
        }
        
        return [...remainingChars, ...newChars];
      });
    }, 1000); // Create new characters every second

    // Animation frame loop to update character positions
    let animationFrameId: number;
    let lastTime = 0;

    const updatePositions = (timestamp: number) => {
      if (!lastTime) lastTime = timestamp;
      const deltaTime = (timestamp - lastTime) / 1000; // Convert to seconds
      lastTime = timestamp;

      setCharacters(prevChars => 
        prevChars.map(char => {
          // Only start moving after delay
          if (char.delay > 0) {
            return { ...char, delay: char.delay - deltaTime };
          }
          
          // Update position based on speed and time
          const newY = char.y + char.speed * deltaTime;
          
          // Calculate opacity based on fade timing
          let newOpacity = char.opacity;
          if (newY > char.fadeDelay) {
            newOpacity = Math.max(0, char.opacity - (deltaTime * char.fadeSpeed * 0.1));
          }
          
          // Randomly change character occasionally for flickering effect
          const newChar = Math.random() > 0.95 
            ? matrixChars[Math.floor(Math.random() * matrixChars.length)] 
            : char.char;
          
          return {
            ...char,
            y: newY,
            opacity: newOpacity,
            char: newChar
          };
        })
      );
      
      animationFrameId = requestAnimationFrame(updatePositions);
    };
    
    animationFrameId = requestAnimationFrame(updatePositions);

    // Clean up on unmount
    return () => {
      clearInterval(createInterval);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className={`pointer-events-none fixed inset-0 z-0 overflow-hidden ${className}`}>
      {characters.map((char) => (
        <div
          key={`${char.id}-${char.x}-${char.y}`}
          className="absolute font-mono text-matrix-green transform-gpu"
          style={{
            left: `${char.x}%`,
            top: `${char.y}%`,
            fontSize: `${char.size}rem`,
            opacity: char.opacity,
            textShadow: '0 0 6px rgba(0, 255, 0, 0.8)',
            color: '#00FF00',
            fontWeight: '500'
          }}
        >
          {char.char}
        </div>
      ))}
    </div>
  );
};

export default FloatingCharacters;