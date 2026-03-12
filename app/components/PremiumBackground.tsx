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
    // Adaptive density: even fewer particles on mobile for to make it 'light'
    const isMobile = width < 768;
    const SEPARATION = isMobile ? 52 : 46; // More separation on mobile
    const AMOUNTX = isMobile ? 30 : 75;
    const AMOUNTY = isMobile ? 30 : 75;

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
            let wave = Math.sin(dist * 0.035 - count) * (isMobile ? 20 : 60);
            let y = (dist * dist) * (isMobile ? 0.0015 : 0.0006) + wave;
            
            let focalLength = isMobile ? 300 : 480;
            let zOffset = isMobile ? 1000 : 1500; 
            let zPos = rz + zOffset;
            
            if (zPos > 0) {
              let scale = focalLength / zPos;
              let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 20)) * scale + halfWidth;
              const verticalShift = isMobile ? 20 : 150;
              let yPos = (y - (mouseY + Math.cos(autoRotateY) * 20) + verticalShift) * scale + (height * (isMobile ? 0.4 : 0.4)); 

              if (xPos >= -100 && xPos <= width + 100 && yPos >= -100 && yPos <= height + 100) {
                // Lower opacity on mobile (0.8 base instead of 1.3)
                let opacity = Math.max(0, (isMobile ? 0.8 : 1.3) - (zPos / (isMobile ? 1400 : 2200)));
                if(opacity > 0.05) {
                  // Smaller particles on mobile (multiplier 4.0 instead of 6.0)
                  let size = scale * (isMobile ? 4.0 : 6.0);
                  
                  if (opacity > 0.6 && !isMobile) {
                     ctx.shadowBlur = size * 1.5;
                     ctx.shadowColor = `rgba(${rgbStr}, ${opacity * 0.5})`;
                  } else { ctx.shadowBlur = 0; }
                  
                  ctx.fillStyle = `rgba(${rgbStr}, ${opacity * (isMobile ? 0.5 : 1)})`;
                  ctx.beginPath();
                  ctx.arc(xPos, yPos, size / 2.2, 0, Math.PI * 2);
                  ctx.fill();
                }
              }
            }
          }
        }
      } else {
        // ── LIGHT MODE ANIMATION: Premium Mesh Gradient Waves ──
        const waves = [
          { x: 0.2, y: 0.3, r: width * (isMobile ? 0.6 : 0.8), c: "255, 237, 213", speed: 0.005 }, 
          { x: 0.8, y: 0.2, r: width * (isMobile ? 0.5 : 0.7), c: "254, 215, 170", speed: 0.007 }, 
          { x: 0.5, y: 0.7, r: width * (isMobile ? 0.7 : 0.9), c: "255, 247, 237", speed: 0.004 }, 
          { x: 0.3, y: 0.8, r: width * (isMobile ? 0.4 : 0.6), c: "253, 186, 116", speed: 0.006 }  
        ];

        waves.forEach((w, i) => {
          const moveX = Math.sin(count * w.speed + i) * (width * 0.1) + (width * w.x);
          const moveY = Math.cos(count * (w.speed * 0.8) + i) * (height * 0.1) + (height * w.y);
          
          const finalX = moveX + (mouseX * 0.2);
          const finalY = moveY + (mouseY * 0.2);

          const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, w.r);
          gradient.addColorStop(0, `rgba(${w.c}, ${isMobile ? 0.3 : 0.6})`);
          gradient.addColorStop(0.5, `rgba(${w.c}, ${isMobile ? 0.05 : 0.2})`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.fillRect(0, 0, width, height); 
        });

        if (!isMobile) {
          ctx.strokeStyle = "rgba(234, 88, 12, 0.03)";
          ctx.lineWidth = 1;
          for(let i = 0; i < width; i += 100) {
             ctx.beginPath();
             const xOff = Math.sin(count * 0.2 + i) * 10;
             ctx.moveTo(i + xOff, 0);
             ctx.lineTo(i - xOff, height);
             ctx.stroke();
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
    <div className="absolute inset-0 -z-30 pointer-events-none w-full h-full overflow-hidden" 
         style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Dark background base */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-65" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Vignette smoothing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--bg-primary)_100%)] opacity-40" />
      
      {/* Fade borders */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--bg-primary)] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-50" />
    </div>
  );
}
