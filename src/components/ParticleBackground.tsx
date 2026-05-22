import { useEffect, useRef } from "react";
import "./ParticleBackground.css";

interface Particle {
  x: number;
  y: number;
  size: number;
  speedX: number;
  speedY: number;
  opacity: number;
  type: "dust" | "footprint";
  life: number;
  maxLife: number;
  angle?: number;
  isRightFoot?: boolean;
}

export default function ParticleBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduceMotion =
      typeof window !== "undefined" &&
      window.matchMedia &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduceMotion) return;

    let animationFrameId: number | null = null;
    let isVisible = true;
    let isOnScreen = true;
    let particles: Particle[] = [];

    let lastMouseX = 0;
    let lastMouseY = 0;
    let distanceSinceLastFootprint = 0;
    let isRightFoot = true;

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    const createDust = (): Particle => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.floor(Math.random() * 3) + 2, // 2 to 4 px size (pixel art style)
      speedX: (Math.random() - 0.5) * 0.2,
      speedY: -Math.random() * 0.5 - 0.1, // Float up slowly
      opacity: Math.random() * 0.2 + 0.05,
      type: "dust",
      life: 0,
      maxLife: Math.random() * 200 + 100,
    });

    const spawnDust = () => {
      const maxDust = Math.floor((canvas.width * canvas.height) / 15000);
      const currentDust = particles.filter((p) => p.type === "dust").length;
      if (currentDust < maxDust && Math.random() < 0.1) {
        particles.push(createDust());
      }
    };

    const drawPixelRect = (
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      size: number,
      opacity: number,
    ) => {
      ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`;
      ctx.fillRect(Math.floor(x), Math.floor(y), size, size);
    };

    const footprintPath = new Path2D(
      "M19.102 1.055a2.81 2.81 0 0 1 3.632.586q.411.468.528.996.35.879.41 1.758a16.6 16.6 0 0 1-.235 4.687l-.937 3.164a3.8 3.8 0 0 1-.937 1.582h-.352l-2.93-.762-.761-.175v-.586a5.8 5.8 0 0 0-.235-1.992l-.644-1.641a5.2 5.2 0 0 1-.059-2.05q.234-1.35.586-2.579.293-.997.82-1.875.41-.644 1.114-1.113m-10.43 9.199c1.055-.527 2.402-.293 3.164.586a5.5 5.5 0 0 1 1.406 2.402q.47 1.465.645 3.047a4.06 4.06 0 0 1-.176 2.05l-.41 1.056a4.2 4.2 0 0 0-.352 2.168v.703l-.879.234-2.46.645-.645.117q-.585-.585-.88-1.348a32 32 0 0 1-1.23-4.336 16.6 16.6 0 0 1-.058-3.691q.058-1.172.586-2.285.351-.88 1.289-1.348m8.496 3.867.293.059 2.988.937.762.235-.059.468a11.3 11.3 0 0 1-.468 2.227 4.6 4.6 0 0 1-1.114 1.582c-.644.644-1.758.82-2.52.293q-1.17-.88-1.113-2.402.06-1.465.762-2.754Zm-4.102 9.434.235-.059.176.176q.996 1.523 1.054 3.281.06 1.29-.879 2.168-.585.528-1.406.469-.937-.06-1.465-.703-.645-.586-.937-1.407a8.4 8.4 0 0 1-.528-2.168v-.527l.235-.117Zm0 0",
    );

    const drawFootprint = (ctx: CanvasRenderingContext2D, p: Particle) => {
      ctx.save();
      ctx.translate(p.x, p.y);
      // Orient based on movement angle, point forward
      ctx.rotate((p.angle || 0) + Math.PI / 2);

      // The SVG bounding box is roughly 0 to 30.
      // Scale down to particle size.
      const scale = 0.8;
      ctx.scale(scale, scale);

      // Translate to center the SVG at 0,0
      ctx.translate(-15, -15);

      // Mirror if needed
      if (!p.isRightFoot) {
        ctx.translate(15, 15);
        ctx.scale(-1, 1);
        ctx.translate(-15, -15);
      }

      ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
      ctx.fill(footprintPath);
      ctx.restore();
    };

    const updateParticle = (p: Particle, index: number) => {
      p.life++;

      if (p.type === "dust") {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.life > p.maxLife * 0.8) {
          p.opacity *= 0.95;
        }
      } else if (p.type === "footprint") {
        if (p.life > p.maxLife * 0.5) {
          p.opacity *= 0.97;
        }
      }

      if (p.life > p.maxLife || p.opacity < 0.01) {
        particles.splice(index, 1);
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      spawnDust();

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];
        if (!p) continue;
        updateParticle(p, i);

        if (p.type === "dust") {
          drawPixelRect(ctx, p.x, p.y, p.size, p.opacity);
        } else if (p.type === "footprint") {
          drawFootprint(ctx, p);
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    const startAnimation = () => {
      if (animationFrameId === null && isVisible && isOnScreen) {
        animate();
      }
    };

    const stopAnimation = () => {
      if (animationFrameId !== null) {
        cancelAnimationFrame(animationFrameId);
        animationFrameId = null;
      }
    };

    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible) startAnimation();
      else stopAnimation();
    };

    const intersectionObserver = new IntersectionObserver(
      (entries) => {
        isOnScreen = entries[0]?.isIntersecting ?? true;
        if (isOnScreen) startAnimation();
        else stopAnimation();
      },
      { threshold: 0 },
    );
    intersectionObserver.observe(canvas);

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      if (lastMouseX !== 0 && lastMouseY !== 0) {
        const dx = mouseX - lastMouseX;
        const dy = mouseY - lastMouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        distanceSinceLastFootprint += dist;

        // Spawn a footprint every 35 pixels
        if (distanceSinceLastFootprint > 35) {
          // Calculate normal vector for left/right offset
          const angle = Math.atan2(dy, dx);
          const offsetDistance = 10; // Spread between feet

          // Add 90 degrees (Math.PI/2) for right, -90 for left
          const offsetAngle =
            angle + (isRightFoot ? Math.PI / 2 : -Math.PI / 2);

          const footX = mouseX + Math.cos(offsetAngle) * offsetDistance;
          const footY = mouseY + Math.sin(offsetAngle) * offsetDistance;

          particles.push({
            x: footX,
            y: footY,
            size: 0,
            speedX: 0,
            speedY: 0,
            opacity: 0.4,
            type: "footprint",
            life: 0,
            maxLife: 120, // Fade out after frames
          });

          // Spawn a little pixel dust burst when a foot steps
          for (let i = 0; i < 2; i++) {
            particles.push({
              x: footX + (Math.random() - 0.5) * 8,
              y: footY + (Math.random() - 0.5) * 8,
              size: Math.floor(Math.random() * 3) + 2,
              speedX: (Math.random() - 0.5) * 0.5,
              speedY: (Math.random() - 0.5) * 0.5 - 0.5,
              opacity: 0.3,
              type: "dust",
              life: 0,
              maxLife: 50,
            });
          }

          isRightFoot = !isRightFoot;
          distanceSinceLastFootprint = 0;
        }
      }

      lastMouseX = mouseX;
      lastMouseY = mouseY;
    };

    const handleMouseLeave = () => {
      lastMouseX = 0;
      lastMouseY = 0;
      distanceSinceLastFootprint = 0;
    };

    resizeCanvas();
    // Init with some dust
    for (let i = 0; i < 20; i++) particles.push(createDust());
    startAnimation();

    window.addEventListener("resize", resizeCanvas);
    document.addEventListener("visibilitychange", handleVisibility);
    canvas.addEventListener("mousemove", handleMouseMove);
    canvas.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      stopAnimation();
      intersectionObserver.disconnect();
      window.removeEventListener("resize", resizeCanvas);
      document.removeEventListener("visibilitychange", handleVisibility);
      canvas.removeEventListener("mousemove", handleMouseMove);
      canvas.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-background" />;
}
