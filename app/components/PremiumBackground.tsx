"use client";
import { useEffect, useRef } from "react";

export default function PremiumBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;

    const SEPARATION = 60;
    const AMOUNTX = 60;
    const AMOUNTY = 60;
    
    let count = 0;
    let mouseX = 0;
    let mouseY = 0;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - halfWidth) * 0.1;
      mouseY = (event.clientY - halfHeight) * 0.1; 
    };

    window.addEventListener('mousemove', onDocumentMouseMove);
    
    const handleResize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };
    window.addEventListener('resize', handleResize);

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      
      // Check theme dynamically so we don't have to force unmount it
      const isHtmlDark = document.documentElement.classList.contains("dark");
      
      // Bright neon blue (like the screenshot) in dark mode, and vibrant orange in light mode
      const rgb = isHtmlDark ? '56, 189, 248' : '234, 88, 12'; 

      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          
          let x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          let z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          // Calculate distance from center to make a globe/bowl shape
          let dist = Math.sqrt(x * x + z * z);
          
          // Apply a moving sine wave ripple onto a curved surface
          let y = (dist * dist) * 0.0006 + Math.sin(dist * 0.04 - count) * 40;
          
          let focalLength = 350;
          let zOffset = 1200; 
          
          let zPos = z + zOffset;
          if (zPos > 0) {
            let scale = focalLength / zPos;
            
            // Camera perspective shift based on mouse
            let xPos = (x - mouseX) * scale + halfWidth;
            // Shift the whole globe shape downwards towards the bottom of the screen
            let yPos = (y - mouseY + 200) * scale + halfHeight; 

            // Only draw if visible on screen
            if (xPos >= 0 && xPos <= width && yPos >= 0 && yPos <= height) {
              let opacity = Math.max(0, 1 - (zPos / 3000));
              
              if(opacity > 0.1) {
                let size = scale * 2.5;
                ctx.fillStyle = `rgba(${rgb}, ${opacity})`;
                // fillRect is much faster than drawing arcs for thousands of points
                ctx.fillRect(xPos, yPos, size, size);
              }
            }
          }
        }
      }

      count += 0.035;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="fixed inset-0 -z-50 pointer-events-none w-full h-full overflow-hidden" style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Deep blue/black overlay for dark mode to match the exact aesthetic of the screenshot */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-90" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Vignette effect so the particle wave fades out beautifully near the edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,var(--bg-primary)_100%)] opacity-95" />
      
      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
}
