import React, { useEffect, useRef } from 'react';

interface MatrixRainProps {
  className?: string;
}

const MatrixRain: React.FC<MatrixRainProps> = ({ className = '' }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full screen
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Matrix characters - mix of Latin, digits, and Japanese characters
    const matrixChars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZアイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン'.split('');
    
    // Initialize columns
    const fontSize = 24; // Font size for characters
    const columns = Math.ceil(canvas.width / fontSize);
    
    // Hold y position for each column
    const drops: number[] = [];
    
    // Initialize all drops to start at random positions
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100;
    }
    
    // Set for columns that will be brighter (highlighted)
    const highlightColumns = new Set<number>();
    const updateHighlightColumns = () => {
      highlightColumns.clear();
      const highlightCount = Math.floor(columns * 0.1); // 10% of columns are highlighted
      for (let i = 0; i < highlightCount; i++) {
        highlightColumns.add(Math.floor(Math.random() * columns));
      }
    };
    
    updateHighlightColumns();
    const highlightInterval = setInterval(updateHighlightColumns, 2000);

    // Drawing the characters
    const draw = () => {
      // Add semi-transparent black rectangle on top of previous frame
      ctx.fillStyle = 'rgba(0, 0, 0, 0.04)'; // Adjust for trail length
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < drops.length; i++) {
        // Get random character
        const text = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        
        // Determine brightness/color - highlighted columns are brighter
        if (highlightColumns.has(i)) {
          ctx.fillStyle = '#00FF00'; // Bright matrix green
          ctx.font = 'bold ' + fontSize + 'px monospace';
        } else {
          // Random shade of green for variation
          const greenIntensity = Math.floor(Math.random() * 156) + 100; // 100-255
          ctx.fillStyle = `rgba(0, ${greenIntensity}, 0, 0.8)`;
          ctx.font = fontSize + 'px monospace';
        }
        
        // Draw the character
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        
        // Move drop down (faster for highlighted columns)
        const speed = highlightColumns.has(i) ? 1.5 : 0.8 + Math.random() * 0.5;
        drops[i] += speed;
        
        // Reset when drop reaches bottom with random chance
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Random chance to reset some drops from the top
        if (Math.random() > 0.99) {
          drops[i] = 0;
        }
      }
    };
    
    const animationInterval = setInterval(draw, 50);
    
    // Cleanup on unmount
    return () => {
      clearInterval(animationInterval);
      clearInterval(highlightInterval);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className={`fixed inset-0 z-0 pointer-events-none ${className}`}
    />
  );
};

export default MatrixRain;