"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function AnimatedBackground() {
  const wave1 = useRef<SVGPathElement>(null);
  const wave2 = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (wave1.current) {
        animate(wave1.current, {
            translateY: ["0px", "30px"],
            duration: 8000,
            easing: "easeInOutSine",
            loop: true,
            alternate: true,
          });
    }
  
    if (wave2.current) {
      animate(wave2.current, {
        translateY: ["0px", "-40px"],
        duration: 5000,
        easing: "linear",
        loop: true,
        alternate: true, // <- cambio aquí
      });
    }
  }, []);
  

  return (
    <div className="animated-bg">
      <svg
        className="absolute w-[160%] h-[160%] -left-30% -top-30%"
        viewBox="0 0 1440 800"
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="grad1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#6a00ff" />
            <stop offset="100%" stopColor="#00d4ff" />
          </linearGradient>
          <linearGradient id="grad2" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ff00c8" />
            <stop offset="100%" stopColor="#00f0ff" />
          </linearGradient>
        </defs>

        <path
          ref={wave1}
          d="M0,400 C300,500 900,300 1440,450 L1440,800 L0,800 Z"
          fill="url(#grad1)"
          opacity="0.25"
        />

        <path
          ref={wave2}
          d="M0,500 C400,300 1000,600 1440,350 L1440,800 L0,800 Z"
          fill="url(#grad2)"
          opacity="0.2"
        />
      </svg>
    </div>
  );
}
