"use client";

import { useEffect, useRef } from 'react';

export default function LoadingScreen() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size to window dimensions
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Color palette
    const palette = [
      '#001219', '#005f73', '#0a9396', '#94d2bd', '#e9d8a6',
      '#ee9b00', '#ca6702', '#bb3e03', '#ae2012', '#9b2226',
    ];

    // Animation function
    const animate = (timeStart: number) => (time: number) => {
      requestAnimationFrame(() => animate(timeStart)(Date.now() + timeStart));
      
      let x = 0;
      const arr = Array(20);
      
      ctx.fillStyle = `rgba(0, 0, 0, 0.03)`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      for (let i = 0; i < arr.length; i++) {
        arr[i] = (2 - (Math.sin(i + (time / 200)) / 2) * (canvas.height));
        const r = arr[i];
        ctx.fillStyle = palette[(Math.floor(i + (time / 200)) % palette.length)];
        
        const w = 100;
        ctx.fillRect(x, canvas.height / 2, w, arr[i]);
        x += w;
      }
    };
    
    // Start two animations with different time offsets
    animate(0)(0);
    animate(100)(0);

    // Clean up
    return () => {
      // Nothing specific to clean up here since requestAnimationFrame 
      // will stop when component unmounts
    };
  }, []);

  return (
    <div className="w-full h-screen overflow-hidden">
      <canvas
        ref={canvasRef}
        className="w-full h-full"
      />
    </div>
  );
}