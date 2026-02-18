import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

function ProductShowcaseSection() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  // Parallax lift keeps the showcase feeling alive as the user scrolls.
  const y = useTransform(scrollYProgress, [0, 1], [60, -60]);

  return (
    <section id="showcase" ref={ref} className="scroll-mt-28 px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-6 shadow-2xl shadow-slate-200/40 md:p-10">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Product Showcase</h2>
            <p className="mt-3 text-slate-600">
              Workvite gives leaders control while giving teams a faster way to execute and report progress.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-700">
              <p className="rounded-xl border border-slate-200 bg-white p-3 font-bold">Live activity stream synced to every project</p>
              <p className="rounded-xl border border-slate-200 bg-white p-3 font-bold">Adaptive board views for managers and contributors</p>
              <p className="rounded-xl border border-slate-200 bg-white p-3 font-bold">Instant alerts when blockers impact timelines</p>
            </div>
          </div>

          <motion.div style={{ y }} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-950">
              <video
                src="/media/landing/showcase.mp4"
                autoPlay
                muted
                loop
                playsInline
                controls
                className="h-full min-h-[280px] w-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ProductShowcaseSection;
