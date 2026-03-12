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

    // Shared State
    let count = 0;
    let mouseX = 0;
    let mouseY = 0;
    let autoRotateX = 0;
    let autoRotateY = 0;

    // ── LIGHT MODE STATE: Bubbles ──
    const BUBBLE_COUNT = 40;
    const bubbles: any[] = [];
    for (let i = 0; i < BUBBLE_COUNT; i++) {
       bubbles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          r: Math.random() * 80 + 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: (Math.random() - 0.5) * 0.5,
          color: `rgba(249, 115, 22, ${Math.random() * 0.1 + 0.05})` // Variations of orange
       });
    }

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

    // ── DARK MODE CONFIG: Particles ──
    const SEPARATION = 46;
    const AMOUNTX = 75;
    const AMOUNTY = 75;

    let animationId: number;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      const isHtmlDark = document.documentElement.classList.contains("dark");

      if (isHtmlDark) {
        // ── DARK MODE ANIMATION: 3D Dotted Wave ──
        const rgbStr = "6, 182, 212"; // Vivid Cyan
        autoRotateX += 0.0025;
        autoRotateY += 0.002;

        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            let x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            let z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            
            let rx = x * Math.cos(autoRotateX) - z * Math.sin(autoRotateX);
            let rz = x * Math.sin(autoRotateX) + z * Math.cos(autoRotateX);
            
            let dist = Math.sqrt(rx * rx + rz * rz);
            let wave = Math.sin(dist * 0.035 - count) * 60;
            let y = (dist * dist) * 0.0006 + wave;
            
            let focalLength = 480;
            let zOffset = 1500; 
            let zPos = rz + zOffset;
            
            if (zPos > 0) {
              let scale = focalLength / zPos;
              let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 25)) * scale + halfWidth;
              // Higher position for Hero focus in Dark Mode
              let yPos = (y - (mouseY + Math.cos(autoRotateY) * 20) + 150) * scale + (height * 0.4); 

              if (xPos >= -100 && xPos <= width + 100 && yPos >= -100 && yPos <= height + 100) {
                let opacity = Math.max(0, 1.2 - (zPos / 2200));
                if(opacity > 0.05) {
                  let size = scale * 6.0;
                  if (opacity > 0.5) {
                     ctx.shadowBlur = size * 2;
                     ctx.shadowColor = `rgba(${rgbStr}, ${opacity * 0.6})`;
                  } else { ctx.shadowBlur = 0; }
                  ctx.fillStyle = `rgba(${rgbStr}, ${opacity})`;
                  ctx.beginPath();
                  ctx.arc(xPos, yPos, size / 2.2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
          }
        }
      } else {
        // ── LIGHT MODE ANIMATION: Soft Floating Bubbles ──
        bubbles.forEach(b => {
           b.x += b.vx + (mouseX * 0.02);
           b.y += b.vy + (mouseY * 0.02);
           if (b.x < -b.r) b.x = width + b.r;
           if (b.x > width + b.r) b.x = -b.r;
           if (b.y < -b.r) b.y = height + b.r;
           if (b.y > height + b.r) b.y = -b.r;

           ctx.beginPath();
           const gradient = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r);
           gradient.addColorStop(0, b.color);
           gradient.addColorStop(1, 'transparent');
           ctx.fillStyle = gradient;
           ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
           ctx.fill();
        });
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
    <div className="fixed inset-0 -z-50 pointer-events-none w-full h-full overflow-hidden" 
         style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Dark background base */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-80" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Vignette smoothing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,var(--bg-primary)_100%)] opacity-70" />
      
      {/* Fade borders */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-[var(--bg-primary)] to-transparent" />
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-[var(--bg-primary)] to-transparent" />
    </div>
  );
}
