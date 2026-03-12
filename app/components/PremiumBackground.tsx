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
    // Adaptive density: fewer particles on mobile for performance
    const isMobile = width < 768;
    const SEPARATION = isMobile ? 42 : 46;
    const AMOUNTX = isMobile ? 50 : 75;
    const AMOUNTY = isMobile ? 50 : 75;

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
            let wave = Math.sin(dist * 0.035 - count) * (isMobile ? 35 : 60);
            let y = (dist * dist) * (isMobile ? 0.001 : 0.0006) + wave;
            
            // Adjust perspective for mobile: closer focal length
            let focalLength = isMobile ? 350 : 480;
            let zOffset = isMobile ? 1200 : 1500; 
            let zPos = rz + zOffset;
            
            if (zPos > 0) {
              let scale = focalLength / zPos;
              let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 20)) * scale + halfWidth;
              // Responsive Vertical Shift: Move it up more on mobile so it sits behind the hero text
              const verticalShift = isMobile ? 50 : 150;
              let yPos = (y - (mouseY + Math.cos(autoRotateY) * 20) + verticalShift) * scale + (height * (isMobile ? 0.45 : 0.4)); 

              if (xPos >= -100 && xPos <= width + 100 && yPos >= -100 && yPos <= height + 100) {
                let opacity = Math.max(0, 1.3 - (zPos / (isMobile ? 1800 : 2200)));
                if(opacity > 0.05) {
                  // Bold particles on mobile: larger multiplier
                  let size = scale * (isMobile ? 8.0 : 6.0);
                  
                  if (opacity > 0.5) {
                     ctx.shadowBlur = size * 1.5;
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
        // ── LIGHT MODE ANIMATION: Premium Mesh Gradient Waves ──
        // Using a sophisticated drifting radial mesh for light mode
        const waves = [
          { x: 0.2, y: 0.3, r: width * 0.8, c: "255, 237, 213", speed: 0.005 }, // Peach
          { x: 0.8, y: 0.2, r: width * 0.7, c: "254, 215, 170", speed: 0.007 }, // Apricot
          { x: 0.5, y: 0.7, r: width * 0.9, c: "255, 247, 237", speed: 0.004 }, // Shell
          { x: 0.3, y: 0.8, r: width * 0.6, c: "253, 186, 116", speed: 0.006 }  // Warm Orange
        ];

        waves.forEach((w, i) => {
          const moveX = Math.sin(count * w.speed + i) * (width * 0.1) + (width * w.x);
          const moveY = Math.cos(count * (w.speed * 0.8) + i) * (height * 0.1) + (height * w.y);
          
          // Add subtle mouse lag/parallax
          const finalX = moveX + (mouseX * 0.3);
          const finalY = moveY + (mouseY * 0.3);

          const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, w.r);
          gradient.addColorStop(0, `rgba(${w.c}, 0.6)`);
          gradient.addColorStop(0.5, `rgba(${w.c}, 0.2)`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.beginPath();
          ctx.fillRect(0, 0, width, height); // Fill entire canvas with blend
        });

        // Add a very subtle moving pattern over the mesh
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
    <div className="fixed inset-0 -z-30 pointer-events-none w-full h-full overflow-hidden" 
         style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Dark background base - reduced opacity for visibility */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-65" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Vignette smoothing - reduced opacity */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,var(--bg-primary)_100%)] opacity-40" />
      
      {/* Fade borders */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--bg-primary)] to-transparent opacity-50" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-50" />
    </div>
  );
}
