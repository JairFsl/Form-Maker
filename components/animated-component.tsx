import { cn } from "@/lib/utils";
import { ClassValue } from "clsx";
import React, { useEffect, useState, ReactNode } from "react";

type AnimationType = "slide-from-right" | "slide-from-left" | "slide-from-bottom" | "slide-from-top";

interface AnimatedInProps {
  type?: AnimationType;
  children: ReactNode;
  delay?: number;
  duration?: ClassValue;
  className?: ClassValue;
}

const AnimatedComponent: React.FC<AnimatedInProps> = ({ type = "slide-from-left", children, delay = 0, duration = "duration-700", className }) => {
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldAnimate(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);


  const initialTransformClasses: Record<AnimationType, string> = {
    "slide-from-right": "animate-slide-from-right",
    "slide-from-left": "animate-slide-from-left",
    "slide-from-bottom": "animate-slide-from-bottom",
    "slide-from-top": "animate-slide-from-top",
  };

  const finalTransformClasses: Record<AnimationType, string> = {
    "slide-from-right": "animate-slide-from-right",
    "slide-from-left": "animate-slide-from-left",
    "slide-from-bottom": "animate-slide-from-bottom",
    "slide-from-top": "animate-slide-from-top",
  };

  return (
    <div
      className={cn(
        `opacity-0 ${initialTransformClasses[type]} transition-all ${duration} ease-out`,
        shouldAnimate && `opacity-100 ${finalTransformClasses[type]}`,
        className
      )}
    >
      {children}
    </div>
  );
};

export default AnimatedComponent;