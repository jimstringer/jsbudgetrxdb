import { useState, useEffect } from "react";

interface WindowSize {
  width: number | undefined;
  height: number | undefined;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

interface Breakpoints {
  mobile: number;
  tablet: number;
  desktop: number;
}

interface UseWindowSizeOptions {
  delay?: number;
  breakpoints?: Breakpoints;
  initializeOnClient?: boolean;
}

const defaultBreakpoints: Breakpoints = {
  mobile: 768,
  tablet: 1024,
  desktop: 1280,
};

function getWindowSize(breakpoints: Breakpoints): WindowSize {
  if (typeof window === "undefined") {
    return {
      width: undefined,
      height: undefined,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;

  return {
    width,
    height,
    isMobile: width < breakpoints.mobile,
    isTablet: width >= breakpoints.mobile && width < breakpoints.tablet,
    isDesktop: width >= breakpoints.tablet,
  };
}

export function useWindowSize(options: UseWindowSizeOptions = {}): WindowSize {
  const {
    delay = 150,
    breakpoints = defaultBreakpoints,
    initializeOnClient = true,
  } = options;

  const [windowSize, setWindowSize] = useState<WindowSize>(() => {
    if (!initializeOnClient && typeof window !== "undefined") {
      return getWindowSize(breakpoints);
    }
    return {
      width: undefined,
      height: undefined,
      isMobile: false,
      isTablet: false,
      isDesktop: false,
    };
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    // Initialize on client if needed
    if (initializeOnClient) {
      setWindowSize(getWindowSize(breakpoints));
    }

    let timeoutId: NodeJS.Timeout | undefined;

    function handleResize() {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }

      timeoutId = setTimeout(() => {
        setWindowSize(getWindowSize(breakpoints));
      }, delay);
    }

    window.addEventListener("resize", handleResize);

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [delay, breakpoints, initializeOnClient]);

  return windowSize;
}
