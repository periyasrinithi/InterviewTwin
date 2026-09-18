import React, { useEffect, useRef } from 'react';

export default function AudioVisualizer({ isActive = false, isSpeaking = false, isListening = false, height = 60 }) {
  const canvasRef = useRef(null);
  const animationRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = canvas.parentElement?.clientWidth || 300);
    let barCount = 32;

    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const barWidth = (width / barCount) - 3;
      phase += 0.08;

      for (let i = 0; i < barCount; i++) {
        let amp = 0.1;
        if (isActive || isSpeaking || isListening) {
          // Sine wave modulation mixed with pseudo-random audio fluctuations
          const sine = Math.sin(phase + i * 0.2);
          const cos = Math.cos(phase * 0.7 + i * 0.15);
          amp = Math.abs(sine * cos) * 0.85 + Math.random() * 0.15;
          if (amp < 0.15) amp = 0.15;
        }

        const barHeight = Math.max(amp * height * 0.8, 4);
        const x = i * (barWidth + 3);
        const y = (height - barHeight) / 2;

        // Gradient for bars
        const gradient = ctx.createLinearGradient(0, y, 0, y + barHeight);
        if (isSpeaking) {
          gradient.addColorStop(0, '#818cf8');
          gradient.addColorStop(1, '#6366f1');
        } else if (isListening) {
          gradient.addColorStop(0, '#6ee7b7');
          gradient.addColorStop(1, '#10b981');
        } else {
          gradient.addColorStop(0, 'rgba(255, 255, 255, 0.2)');
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0.05)');
        }

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.roundRect(x, y, barWidth, barHeight, 3);
        ctx.fill();
      }

      animationRef.current = requestAnimationFrame(render);
    };

    render();

    const handleResize = () => {
      if (canvas && canvas.parentElement) {
        width = canvas.width = canvas.parentElement.clientWidth;
      }
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, [isActive, isSpeaking, isListening, height]);

  return (
    <div style={{ width: '100%', display: 'flex', justifyContent: 'center', margin: '0.75rem 0' }}>
      <canvas ref={canvasRef} height={height} style={{ width: '100%', maxWidth: '500px', display: 'block' }} />
    </div>
  );
}
