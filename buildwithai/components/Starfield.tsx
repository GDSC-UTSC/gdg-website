"use client";
import { useEffect, useRef } from "react";

// Lightweight canvas starfield for a subtle parallax background
export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const starsRef = useRef<Array<{ x: number; y: number; z: number }>>([]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    // initialize stars - more stars for denser starfield
    const starCount = Math.min(600, Math.floor((width * height) / 4000));
    starsRef.current = new Array(starCount).fill(0).map(() => ({
      x: Math.random() * width - width / 2,
      y: Math.random() * height - height / 2,
      z: Math.random() * 1000 + 100,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.save();
      ctx.translate(width / 2, height / 2);
      for (const star of starsRef.current) {
        star.z -= 0.8; // Slower movement for more ambient effect
        if (star.z <= 1) star.z = 1000;
        const k = 128 / star.z;
        const px = star.x * k;
        const py = star.y * k;
        if (px > -width && px < width && py > -height && py < height) {
          const opacity = Math.max(0, Math.min(0.8, 1 - star.z / 1000));
          const size = Math.max(0.8, 2 - star.z / 500); // Variable star sizes

          // Add slight color variation - some stars bluish, some white
          const blueShift = Math.random() > 0.7 ? 0.9 : 1;
          ctx.fillStyle = `rgba(${255 * blueShift},${255 * blueShift},255,${opacity})`;
          ctx.fillRect(px, py, size, size);
        }
      }
      ctx.restore();
      animationRef.current = requestAnimationFrame(render);
    };
    render();

    return () => {
      window.removeEventListener("resize", onResize);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 -z-10 h-full w-full" />;
}
