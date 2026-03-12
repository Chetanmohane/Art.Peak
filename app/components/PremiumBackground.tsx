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

    // Configuration
    const SEPARATION = 55;
    const AMOUNTX = 65;
    const AMOUNTY = 65;
    
    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let autoRotateX = 0;
    let autoRotateY = 0;

    const halfWidth = width / 2;
    const halfHeight = height / 2;

    const onDocumentMouseMove = (event: MouseEvent) => {
      mouseX = (event.clientX - halfWidth) * 0.05;
      mouseY = (event.clientY - halfHeight) * 0.05; 
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
      
      // Premium colors
      // Dark mode: Cyan/Sky Blue
      // Light mode: Sunset Orange
      const color = isHtmlDark ? { r: 56, g: 189, b: 248 } : { r: 234, g: 88, b: 12 };
      const rgbStr = `${color.r}, ${color.g}, ${color.b}`;

      autoRotateX += 0.002;
      autoRotateY += 0.0015;

      // Draw particles
      for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
          
          let x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
          let z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
          
          // Apply some auto-rotation to the points themselves for extra depth
          let rx = x * Math.cos(autoRotateX) - z * Math.sin(autoRotateX);
          let rz = x * Math.sin(autoRotateX) + z * Math.cos(autoRotateX);
          
          // Globe/Bowl geometry
          let dist = Math.sqrt(rx * rx + rz * rz);
          // Wave logic
          let wave = Math.sin(dist * 0.035 - count) * 45;
          let y = (dist * dist) * 0.0007 + wave;
          
          let focalLength = 400;
          let zOffset = 1400; 
          
          let zPos = rz + zOffset;
          
          if (zPos > 0) {
            let scale = focalLength / zPos;
            
            // Interaction + Auto-rotation shift
            let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 20)) * scale + halfWidth;
            let yPos = (y - (mouseY + Math.cos(autoRotateY) * 15) + 250) * scale + halfHeight; 

            if (xPos >= -50 && xPos <= width + 50 && yPos >= -50 && yPos <= height + 50) {
              let opacity = Math.max(0, 1 - (zPos / 2500));
              
              if(opacity > 0.05) {
                // Adjusting size for better visibility
                let size = scale * 3.5;
                
                // Add a glow/bloom effect to the dot if it's closer
                if (opacity > 0.6) {
                   ctx.shadowBlur = size * 1.5;
                   ctx.shadowColor = `rgba(${rgbStr}, ${opacity * 0.5})`;
                } else {
                   ctx.shadowBlur = 0;
                }

                ctx.fillStyle = `rgba(${rgbStr}, ${opacity})`;
                ctx.beginPath();
                // Performance: small squares for far away, circles for close
                if (size < 2) {
                   ctx.fillRect(xPos, yPos, size, size);
                } else {
                   ctx.arc(xPos, yPos, size / 2, 0, Math.PI * 2);
                   ctx.fill();
                }
              }
            }
          }
        }
      }

      count += 0.03;
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
      {/* Visual Tuning Overlay */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-85" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Heavy Vignette for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,var(--bg-primary)_95%)] opacity-80" />
      
      {/* Edge smoothing */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
}
