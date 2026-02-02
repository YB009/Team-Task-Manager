import { useEffect, useRef, useCallback, useMemo } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { LenisProvider } from "../context/LenisContext";

export default function SmoothScroll({ children }) {
  const lenisRef = useRef(null);
  const frameIdRef = useRef(null);
  const isIOSSafari = useMemo(() => {
    if (typeof navigator === "undefined") return false;
    const ua = navigator.userAgent || "";
    const isIOS = /iPad|iPhone|iPod/i.test(ua) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
    const isSafari = /Safari/i.test(ua) && !/Chrome|CriOS|FxiOS|EdgiOS|OPiOS/i.test(ua);
    return isIOS && isSafari;
  }, []);

  const initLenis = useCallback(() => {
    if (lenisRef.current) return lenisRef.current;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    return lenis;
  }, []);

  useEffect(() => {
    if (isIOSSafari) return;
    const lenis = initLenis();

    function raf(time) {
      lenis.raf(time);
      frameIdRef.current = requestAnimationFrame(raf);
    }

    frameIdRef.current = requestAnimationFrame(raf);

    return () => {
      if (frameIdRef.current) {
        cancelAnimationFrame(frameIdRef.current);
      }
      if (lenisRef.current) {
        lenisRef.current.destroy();
        lenisRef.current = null;
      }
    };
  }, [initLenis, isIOSSafari]);

  // Initialize lenis instance eagerly for context
  if (!lenisRef.current && !isIOSSafari) {
    initLenis();
  }

  return (
    <LenisProvider lenis={isIOSSafari ? null : lenisRef.current}>
      {children}
    </LenisProvider>
  );
}
