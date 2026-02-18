import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

function getScrollEnd(distance) {
  if (typeof distance === "number") return `+=${distance}`;
  if (typeof distance === "string" && distance.trim().endsWith("vh")) {
    const n = Number(distance.replace("vh", "").trim());
    if (!Number.isNaN(n)) return `+=${(window.innerHeight * n) / 100}`;
  }
  return `+=${window.innerHeight * 3}`;
}

const ThreeDTextReveal = ({
  items = ["ALIGN", "ASSIGN", "EXECUTE", "DELIVER"],
  fontSize = "clamp(2.6rem, 10vw, 7rem)",
  fontWeight = 900,
  perspective = 1000,
  radius = 180,
  gap = 24,
  startRotation = -80,
  endRotation = 270,
  scrollDistance = "360vh",
  scrollSmoothing = 1,
}) => {
  const containerRef = useRef(null);
  const stageRef = useRef(null);

  const safeItems = useMemo(() => (items.length ? items : ["WORKVITE"]), [items]);

  useEffect(() => {
    const container = containerRef.current;
    const stage = stageRef.current;
    if (!container || !stage) return;

    const ctx = gsap.context(() => {
      // Pin the section while user scroll drives a single 3D cylinder rotation.
      gsap.fromTo(
        stage,
        { rotationX: startRotation },
        {
          rotationX: endRotation,
          ease: "none",
          scrollTrigger: {
            trigger: container,
            start: "top top",
            end: getScrollEnd(scrollDistance),
            pin: true,
            scrub: scrollSmoothing,
            anticipatePin: 1,
          },
        }
      );
    }, container);

    return () => {
      ctx.revert();
    };
  }, [scrollDistance, scrollSmoothing, startRotation, endRotation]);

  return (
    <section
      ref={containerRef}
      className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-slate-950"
      aria-label="3D Workvite value reveal"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(56,189,248,0.12),rgba(15,23,42,0.95)_55%)]" />
      <div className="relative w-full" style={{ perspective: `${perspective}px` }}>
        <div
          ref={stageRef}
          style={{
            position: "relative",
            transformStyle: "preserve-3d",
            height: "180px",
            width: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {safeItems.map((text, i) => {
            const rotation = i * gap;
            return (
              <span
                key={`${text}-${i}`}
                style={{
                  position: "absolute",
                  fontSize,
                  fontWeight,
                  color: "#ffffff",
                  letterSpacing: "0.02em",
                  whiteSpace: "nowrap",
                  backfaceVisibility: "hidden",
                  textTransform: "uppercase",
                  transform: `rotateX(${-rotation}deg) translateZ(${radius}px)`,
                }}
              >
                {text}
              </span>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ThreeDTextReveal;
