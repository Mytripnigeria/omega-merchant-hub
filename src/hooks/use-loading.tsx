import { useState, useEffect } from "react";

/**
 * Hook to simulate loading state for demo purposes.
 * In production, this would be replaced with actual data fetching.
 */
export function useLoading(delay: number = 1500) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isLoading;
}

/**
 * Hook to reset loading state when navigating to a new page.
 * Useful for simulating data refresh.
 */
export function usePageLoading(key: string, delay: number = 800) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, delay);

    return () => clearTimeout(timer);
  }, [key, delay]);

  return isLoading;
}