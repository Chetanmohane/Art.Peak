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
      if (canvas) {
        canvas.width = width;
        canvas.height = height;
      }
    };
    window.addEventListener('resize', handleResize);

    // ── DARK MODE CONFIG: Particles ──
    // Adaptive density: even fewer particles on mobile for to make it 'light'
    const isMobile = width < 768;
    const SEPARATION = isMobile ? 55 : 46; // More separation on mobile
    const AMOUNTX = isMobile ? 25 : 75;
    const AMOUNTY = isMobile ? 25 : 75;

    let animationId: number;
    let isVisible = true;

    // Intersection Observer to stop animation when not visible
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
      },
      { threshold: 0.1 }
    );
    if (canvas) observer.observe(canvas);

    const draw = () => {
      if (!isVisible) {
        animationId = requestAnimationFrame(draw);
        return;
      }
      
      ctx.clearRect(0, 0, width, height);
      const isHtmlDark = document.documentElement.classList.contains("dark");

      if (isHtmlDark) {
        // ── DARK MODE ANIMATION: 3D Dotted Wave ──
        const rgbStr = "6, 182, 212"; // Vivid Cyan
        autoRotateX += 0.002;
        autoRotateY += 0.0015;

        ctx.beginPath();
        for (let ix = 0; ix < AMOUNTX; ix++) {
          for (let iy = 0; iy < AMOUNTY; iy++) {
            let x = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2);
            let z = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2);
            
            let cosX = Math.cos(autoRotateX);
            let sinX = Math.sin(autoRotateX);
            let rx = x * cosX - z * sinX;
            let rz = x * sinX + z * cosX;
            
            let dist = Math.sqrt(rx * rx + rz * rz);
            let wave = Math.sin(dist * 0.035 - count) * (isMobile ? 15 : 60);
            let y = (dist * dist) * (isMobile ? 0.0015 : 0.0006) + wave;
            
            let focalLength = isMobile ? 300 : 480;
            let zOffset = isMobile ? 1000 : 1500; 
            let zPos = rz + zOffset;
            
            if (zPos > 0) {
              let scale = focalLength / zPos;
              let xPos = (rx - (mouseX + Math.sin(autoRotateY) * 20)) * scale + width/2;
              let yPos = (y - (mouseY + Math.cos(autoRotateY) * 20) + (isMobile ? 20 : 150)) * scale + (height * 0.4); 

              if (xPos >= 0 && xPos <= width && yPos >= 0 && yPos <= height) {
                let opacity = Math.max(0, (isMobile ? 0.7 : 1.3) - (zPos / (isMobile ? 1400 : 2200)));
                if(opacity > 0.1) {
                  let size = scale * (isMobile ? 3.5 : 6.0);
                  ctx.fillStyle = `rgba(${rgbStr}, ${opacity * (isMobile ? 0.4 : 1)})`;
                  ctx.fillRect(xPos, yPos, size/2, size/2); // Rect is faster than arc for performance
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
          { x: 0.5, y: 0.7, r: width * (isMobile ? 0.7 : 0.9), c: "255, 247, 237", speed: 0.004 }
        ];

        waves.forEach((w, i) => {
          const moveX = Math.sin(count * w.speed + i) * (width * 0.1) + (width * w.x);
          const moveY = Math.cos(count * (w.speed * 0.8) + i) * (height * 0.1) + (height * w.y);
          
          const finalX = moveX + (mouseX * 0.1);
          const finalY = moveY + (mouseY * 0.1);

          const gradient = ctx.createRadialGradient(finalX, finalY, 0, finalX, finalY, w.r);
          gradient.addColorStop(0, `rgba(${w.c}, ${isMobile ? 0.25 : 0.5})`);
          gradient.addColorStop(1, 'transparent');

          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, width, height); 
        });
      }

      count += 0.03;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('mousemove', onDocumentMouseMove);
      window.removeEventListener('resize', handleResize);
      if (canvas) observer.unobserve(canvas);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <div className="absolute inset-0 -z-30 pointer-events-none w-full h-full overflow-hidden will-change-transform" 
         style={{ backgroundColor: "var(--bg-primary)" }}>
      {/* Dark background base */}
      <div className="hidden dark:block absolute inset-0 bg-[#020617] opacity-65" />
      
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      
      {/* Vignette smoothing */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,var(--bg-primary)_100%)] opacity-40" />
      
      {/* Fade borders */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[var(--bg-primary)] to-transparent opacity-60" />
      <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[var(--bg-primary)] to-transparent opacity-60" />
    </div>
  );
}
