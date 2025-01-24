import { useEffect, useRef, useState } from "react";

function useMeasure<T extends HTMLElement>() {
  const inputRef = useRef<T>(null);
  const [rect, setRect] = useState<DOMRectReadOnly | null>(null);

  useEffect(() => {
    if (!inputRef.current) return;

    const observer = new ResizeObserver((e) => {
      setRect(e[0].contentRect);
    });

    observer.observe(inputRef.current);

    return () => observer.disconnect();
  }, []);

  return [rect, inputRef] as const;
}

export { useMeasure };
