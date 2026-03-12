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

    // Configuration - Increased density
    const SEPARATION = 48;
    const AMOUNTX = 75;
    const AMOUNTY = 75;
    
    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let autoRotateX = 0;
    let autoRotateY = 0;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - halfWidth) * 0.08;
      mouseY = (event.clientY - halfHeight) * 0.08; 
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
      
      const isHtmlDark = document.documentElement.classList.contains("dark");
      
      // Premium colors - Brighter
      // Dark mode: Vivid Cyan
      // Light mode: Deep Electric Orange
      const color = isHtmlDark ? { r: 6, g: 182, b: 212 } : { r: 249, g: 115, b: 22 };
      const rgbStr = `${color.r}, ${color.g}, ${color.b}`;

      autoRotateX += 0.0025;
      autoRotateY += 0.002;

      // Draw particles
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          
          let x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          let z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          let rx = x * Math.cos(autoRotateX) - z * Math.sin(autoRotateX);
          let rz = x * Math.sin(autoRotateX) + z * Math.cos(autoRotateX);
          
          let dist = Math.sqrt(rx * rx + rz * rz);
          let wave = Math.sin(dist * 0.035 - count) * 55;
          let y = (dist * dist) * 0.00075 + wave;
          
          let focalLength = 450;
          let zOffset = 1500; 
          
          let zPos = rz + zOffset;
          
          if (zPos > 0) {
            let scale = focalLength / zPos;
            
            let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 25)) * scale + halfWidth;
            let yPos = (y - (mouseY + Math.cos(autoRotateY) * 20) + 200) * scale + halfHeight; 

            if (xPos >= -100 && xPos <= width + 100 && yPos >= -100 && yPos <= height + 100) {
              let opacity = Math.max(0, 1.1 - (zPos / 2200));
              
              if(opacity > 0.05) {
                // Increased size multiplier to 5.5 for "bold" look
                let size = scale * 5.5;
                
                // Enhanced glow/bloom
                if (opacity > 0.5) {
                   ctx.shadowBlur = size * 2;
                   ctx.shadowColor = `rgba(${rgbStr}, ${opacity * 0.7})`;
                } else {
                   ctx.shadowBlur = 0;
                }

                ctx.fillStyle = `rgba(${rgbStr}, ${opacity})`;
                ctx.beginPath();
                if (size < 2.5) {
                   ctx.fillRect(xPos, yPos, size, size);
                } else {
                   ctx.arc(xPos, yPos, size / 2.2, 0, Math.PI * 2);
                   ctx.fill();
                }
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
      {/* Background base layer */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-75" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Reduced Vignette for more visibility */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--bg-primary)_100%)] opacity-65" />
      
      {/* Refined Edge smoothing */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
}
