import { useEffect, useRef } from "react";

const NetworkBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationId;
    let width, height;
    let dots = [];

    const DOT_COUNT_DENSITY = 14000; 
    const CONNECT_DISTANCE = 140;
    const DOT_RADIUS = 2.2;
    const CLICK_GROW_RADIUS = 9;

    const resize = () => {
      width = canvas.parentElement.offsetWidth;
      height = canvas.parentElement.offsetHeight;
      canvas.width = width;
      canvas.height = height;
      initDots();
    };

    const initDots = () => {
      const count = Math.floor((width * height) / DOT_COUNT_DENSITY);
      dots = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        r: DOT_RADIUS,
        targetR: DOT_RADIUS,
        clicked: false,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Move dots
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > width) d.vx *= -1;
        if (d.y < 0 || d.y > height) d.vy *= -1;

        // Smoothly grow/shrink radius toward target
        d.r += (d.targetR - d.r) * 0.15;
      });

      // Draw connecting lines
      ctx.strokeStyle = "rgba(129, 140, 248, 0.25)";
      ctx.lineWidth = 1;
      for (let i = 0; i < dots.length; i++) {
        for (let j = i + 1; j < dots.length; j++) {
          const dx = dots[i].x - dots[j].x;
          const dy = dots[i].y - dots[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECT_DISTANCE) {
            ctx.globalAlpha = 1 - dist / CONNECT_DISTANCE;
            ctx.beginPath();
            ctx.moveTo(dots[i].x, dots[i].y);
            ctx.lineTo(dots[j].x, dots[j].y);
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // Draw dots
      dots.forEach((d) => {
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = d.clicked
          ? "rgba(33, 215, 9, 0.9)"
          : "rgba(15, 243, 53, 0.6)";
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    const handleClick = (e) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      dots.forEach((d) => {
        const dx = d.x - mx;
        const dy = d.y - my;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 25) {
          d.targetR = CLICK_GROW_RADIUS;
          d.clicked = true;
          setTimeout(() => {
            d.targetR = DOT_RADIUS;
            d.clicked = false;
          }, 800);
        }
      });
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    canvas.addEventListener("click", handleClick);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("click", handleClick);
    };
  }, []);

  return <canvas ref={canvasRef} className="network-canvas" />;
};

export default NetworkBackground;
