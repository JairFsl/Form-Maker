import type { ReactNode } from "react";
import { useInView } from "react-intersection-observer";

interface InfiniteScrollProps {
  children: ReactNode;
  onEndScroll: VoidFunction;
  className?: string;
}

export default function InfiniteScroll({
  children,
  onEndScroll,
  className,
}: InfiniteScrollProps) {
  const { ref } = useInView({
    rootMargin: "20px",
    onChange(inView) {
      if (inView) {
        onEndScroll();
      }
    },
  });

  return (
    <div className={className}>
      {children}
      <div ref={ref} />
    </div>
  );
}