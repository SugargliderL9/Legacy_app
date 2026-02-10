"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";

export default function TaskLoader() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (outerRef.current) {
      animate(outerRef.current, {
        scale: [1, 1.4, 1],
        opacity: [0.4, 1, 0.4],
        duration: 2000,
        easing: "easeInOutSine",
        loop: true,
      });
    }

    if (innerRef.current) {
      animate(innerRef.current, {
        scale: [1, 1.2, 1],
        duration: 1200,
        easing: "easeInOutSine",
        loop: true,
      });
    }

    if (textRef.current) {
      animate(textRef.current, {
        opacity: [0.3, 1, 0.3],
        duration: 1500,
        easing: "easeInOutSine",
        loop: true,
      });
    }
  }, []);

  return (
    <div className="flex items-center justify-center py-20">
      <div className="relative flex items-center justify-center">
        {/* círculo exterior */}
        <div
          ref={outerRef}
          className="absolute w-20 h-20 rounded-full border border-pink-400/40"
        />

        {/* círculo interior */}
        <div
          ref={innerRef}
          className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-500 shadow-lg"
        />

        {/* texto */}
        <span
          ref={textRef}
          className="absolute -bottom-10 text-sm text-white/70 tracking-widest"
        >
          CARGANDO
        </span>
      </div>
    </div>
  );
}
