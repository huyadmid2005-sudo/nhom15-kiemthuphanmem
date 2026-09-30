import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Custom hook for Intersection Observer with performance optimizations
 * @param {Object} options - Configuration options
 * @param {number} options.threshold - Visibility threshold (0-1)
 * @param {string} options.rootMargin - Root margin for early/late triggering
 * @param {boolean} options.triggerOnce - Whether to trigger only once
 * @param {boolean} options.freezeOnceVisible - Whether to freeze state once visible
 */
const useIntersectionObserver = ({
  threshold = 0.1,
  rootMargin = "0px 0px -50px 0px",
  triggerOnce = true,
  freezeOnceVisible = true,
} = {}) => {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  // Memoized callback for intersection changes
  const handleIntersection = useCallback(
    (entries) => {
      const [entry] = entries;
      const isCurrentlyIntersecting = entry.isIntersecting;

      setIsIntersecting(isCurrentlyIntersecting);

      if (isCurrentlyIntersecting && !hasIntersected) {
        setHasIntersected(true);

        // If triggerOnce is true, disconnect observer after first intersection
        if (triggerOnce && observerRef.current) {
          observerRef.current.disconnect();
        }
      }
    },
    [hasIntersected, triggerOnce]
  );

  useEffect(() => {
    const target = targetRef.current;

    if (!target) return;

    // Create observer with performance optimizations
    observerRef.current = new IntersectionObserver(handleIntersection, {
      threshold,
      rootMargin,
      // Performance optimization: use browser's default root
      root: null,
    });

    observerRef.current.observe(target);

    // Cleanup function
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [handleIntersection, threshold, rootMargin]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    targetRef,
    isIntersecting: freezeOnceVisible ? hasIntersected : isIntersecting,
    hasIntersected,
  };
};

export default useIntersectionObserver;
