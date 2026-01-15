import { useEffect, useState } from "react";

/**
 * Hook to detect and highlight overflowing elements in development.
 * Toggle with: localStorage.setItem('debug-overflow', 'true')
 */
export function useOverflowDebug() {
  const [isEnabled, setIsEnabled] = useState(false);

  useEffect(() => {
    // Check localStorage for debug flag
    const checkDebugFlag = () => {
      const enabled = localStorage.getItem("debug-overflow") === "true";
      setIsEnabled(enabled);
    };

    checkDebugFlag();

    // Listen for storage changes
    window.addEventListener("storage", checkDebugFlag);
    return () => window.removeEventListener("storage", checkDebugFlag);
  }, []);

  useEffect(() => {
    if (!isEnabled) return;

    const style = document.createElement("style");
    style.id = "overflow-debug-styles";
    style.textContent = `
      .overflow-debug-highlight {
        outline: 3px solid red !important;
        outline-offset: -3px;
      }
      .overflow-debug-indicator {
        position: fixed;
        top: 8px;
        right: 8px;
        background: red;
        color: white;
        padding: 4px 8px;
        font-size: 12px;
        border-radius: 4px;
        z-index: 99999;
        font-family: monospace;
      }
    `;
    document.head.appendChild(style);

    // Create indicator
    const indicator = document.createElement("div");
    indicator.className = "overflow-debug-indicator";
    indicator.textContent = "🔍 Overflow Debug ON";
    document.body.appendChild(indicator);

    // Check for overflowing elements
    const checkOverflow = () => {
      const all = document.querySelectorAll("*");
      let overflowCount = 0;

      all.forEach((el) => {
        el.classList.remove("overflow-debug-highlight");
        
        if (el instanceof HTMLElement) {
          const rect = el.getBoundingClientRect();
          const docWidth = document.documentElement.clientWidth;
          
          // Check if element overflows viewport horizontally
          if (rect.right > docWidth || rect.left < 0) {
            el.classList.add("overflow-debug-highlight");
            overflowCount++;
            console.warn("Overflowing element:", el, {
              right: rect.right,
              docWidth,
              overflow: rect.right - docWidth,
            });
          }
        }
      });

      indicator.textContent = `🔍 Overflow Debug: ${overflowCount} issue${overflowCount !== 1 ? "s" : ""}`;
    };

    checkOverflow();
    const interval = setInterval(checkOverflow, 2000);

    return () => {
      clearInterval(interval);
      style.remove();
      indicator.remove();
      document.querySelectorAll(".overflow-debug-highlight").forEach((el) => {
        el.classList.remove("overflow-debug-highlight");
      });
    };
  }, [isEnabled]);

  return { isEnabled, setIsEnabled };
}
