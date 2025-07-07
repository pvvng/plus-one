"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

interface AnimatedNumberProps {
  value: number;
  className?: string;
}

export default function AnimatedNumber({
  value,
  className,
}: AnimatedNumberProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ref.current) return;

    if (!hasAnimated.current) {
      const counter = { val: 0 };

      gsap.to(counter, {
        val: value,
        duration: 0.6,
        ease: "power1.out",
        onUpdate: () => {
          if (ref.current) {
            ref.current.innerText = Math.round(counter.val).toLocaleString();
          }
        },
        onComplete: () => {
          hasAnimated.current = true; // 애니메이션은 한 번만 실행
        },
      });
    } else {
      // 그 이후부터는 그냥 숫자만 바꿔줌
      ref.current.innerText = value.toLocaleString();
    }
  }, [value]);

  return (
    <span key="animated-number" ref={ref} className={className}>
      {value.toLocaleString()}
    </span>
  );
}
