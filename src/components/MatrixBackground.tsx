import { useEffect, useRef } from 'react';

interface MatrixBackgroundProps {
  density?: number;
  speed?: number;
  opacity?: number;
}

const MatrixBackground = ({ 
  density = 30, 
  speed = 1.2, 
  opacity = 0.75
}: MatrixBackgroundProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions to match window
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Characters to use for the raining code
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃ*+-/|\\:;[]{}()<>!@#$%^&';
    const matrixChars = chars.split('');
    
    // ASCII symbols for more terminal-like appearance
    const asciiSymbols = '*-+:.|/\\[]{}()<>!@#$%^&=';
    const terminalChars = asciiSymbols.split('');

    // Column settings
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize * (density / 20));
    
    // Array to track the y position of each column
    const drops: number[] = [];
    
    // Initialize drops for each column
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -100; // Start above the screen at random positions
    }

    // Character types by column (0: matrix, 1: terminal)
    const columnTypes: number[] = [];
    for (let i = 0; i < columns; i++) {
      columnTypes[i] = Math.random() > 0.5 ? 0 : 1;
    }

    const draw = () => {
      // Create a semi-transparent black rectangle to fade previous characters
      ctx.fillStyle = `rgba(10, 26, 10, ${0.02 + (0.03 * speed)})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set font and color for drawing characters
      ctx.font = `${fontSize}px 'JetBrains Mono', monospace`;

      // Draw each drop
      for (let i = 0; i < drops.length; i++) {
        // Choose character set based on column type
        const charSet = columnTypes[i] === 0 ? matrixChars : terminalChars;
        
        // Pick a random character
        const text = charSet[Math.floor(Math.random() * charSet.length)];
        
        // Calculate x position for the character
        const x = i * fontSize;
        
        // Vary the green brightness for different columns
        const brightness = Math.random() * 50 + 50;
        
        // Head of the chain is brighter
        const isHead = Math.random() > 0.95;
        
        if (isHead) {
          ctx.fillStyle = `rgba(0, 238, 0, ${opacity * 4})`; // Bright for the head
        } else {
          // Vary the green color and opacity for a more dynamic effect
          ctx.fillStyle = `rgba(0, ${brightness + 100}, 0, ${opacity})`;
        }
        
        // Draw the character
        ctx.fillText(text, x, drops[i] * fontSize);
        
        // Randomly reset drop to top after it passes the bottom or randomly
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        
        // Move the drop down
        drops[i] += speed * (0.5 + Math.random() * 0.5);
      }
    };

    // Animation frame
    let animationId: number;
    
    const animate = () => {
      draw();
      animationId = requestAnimationFrame(animate);
    };
    
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [density, speed, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full -z-10 pointer-events-none"
      style={{ opacity: opacity * 10 }} // Multiply by 10 for better control
    />
  );
};

export default MatrixBackground; 