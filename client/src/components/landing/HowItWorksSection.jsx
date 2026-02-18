import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const steps = [
  {
    id: 1,
    title: "Create Workspace",
    linkText: "Invite your team",
    bgImage: "radial-gradient(circle at 20% 20%, rgba(34,211,238,0.38), transparent 45%), radial-gradient(circle at 80% 70%, rgba(129,140,248,0.35), transparent 40%), linear-gradient(135deg, #020617 0%, #0b1227 100%)",
    items: ["Set up organization", "Invite members", "Define teams"],
  },
  {
    id: 2,
    title: "Assign Ownership",
    linkText: "Configure role access",
    bgImage: "radial-gradient(circle at 25% 25%, rgba(16,185,129,0.35), transparent 45%), radial-gradient(circle at 75% 65%, rgba(56,189,248,0.3), transparent 40%), linear-gradient(145deg, #020617 0%, #10231f 100%)",
    items: ["Role-based permissions", "Task accountability", "Review access controls"],
  },
  {
    id: 3,
    title: "Launch Projects",
    linkText: "Build delivery plan",
    bgImage: "radial-gradient(circle at 20% 20%, rgba(244,114,182,0.3), transparent 45%), radial-gradient(circle at 80% 60%, rgba(251,191,36,0.35), transparent 40%), linear-gradient(135deg, #111827 0%, #2b1b1f 100%)",
    items: ["Map milestones", "Break into tasks", "Track deadlines"],
  },
  {
    id: 4,
    title: "Track Progress",
    linkText: "Monitor live activity",
    bgImage: "radial-gradient(circle at 30% 15%, rgba(96,165,250,0.33), transparent 45%), radial-gradient(circle at 80% 75%, rgba(168,85,247,0.3), transparent 40%), linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)",
    items: ["See status updates", "Flag blockers fast", "Deliver on time"],
  },
];

function StepCard({ step, isHovered, isDimmed, onHover, onLeave }) {
  return (
    <motion.article
      onMouseEnter={onHover}
      onMouseLeave={onLeave}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.5 }}
      className="relative min-h-[380px] flex-1 cursor-pointer overflow-hidden border-r border-slate-200 p-7 last:border-r-0 md:min-h-[450px] md:p-9"
      style={{ opacity: isDimmed ? 0.45 : 1 }}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, scale: 1.08 }}
            animate={{ opacity: 0.48, scale: 1 }}
            exit={{ opacity: 0, scale: 1.08 }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="absolute inset-0 z-0"
            style={{ backgroundImage: step.bgImage, backgroundSize: "cover", backgroundPosition: "center" }}
          />
        )}
      </AnimatePresence>

      <div className="relative z-10 flex h-full flex-col">
        <span className="text-lg font-semibold text-slate-500">{String(step.id).padStart(2, "0")}</span>
        <h3 className="mt-4 text-3xl font-black leading-tight text-slate-900 md:text-4xl">{step.title}</h3>
        <p className={`mt-3 text-sm font-medium transition-colors ${isHovered ? "text-slate-900" : "text-slate-500"}`}>{step.linkText} →</p>

        <div className="mt-auto pt-8">
          {step.items.map((item) => (
            <p key={item} className="my-2 text-sm text-slate-600">
              {item}
            </p>
          ))}
        </div>
      </div>
    </motion.article>
  );
}

function HowItWorksSection() {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <section id="how-it-works" className="scroll-mt-28 px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-b from-white to-slate-50 text-slate-900 shadow-xl shadow-slate-200/50">
        <div className="border-b border-slate-200 px-7 py-8 md:px-9">
          <h2 className="text-3xl font-black tracking-tight md:text-4xl">How It Works</h2>
          <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
            Workvite turns team coordination into a clear, step-by-step workflow from setup to delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4">
          {steps.map((step) => (
            <StepCard
              key={step.id}
              step={step}
              isHovered={hoveredId === step.id}
              isDimmed={hoveredId !== null && hoveredId !== step.id}
              onHover={() => setHoveredId(step.id)}
              onLeave={() => setHoveredId(null)}
            />
          ))}
        </div>

        <div className="border-t border-slate-200 px-7 py-7 text-center text-sm text-slate-600 md:px-9">
          Start quickly, organize confidently, and keep projects moving with full team visibility.
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
