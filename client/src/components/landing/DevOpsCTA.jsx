import { motion } from "framer-motion";
import { Code, Rocket, Terminal, Zap } from "lucide-react";

const satellites = [
  { Icon: Code, className: "left-[4%] top-[60%]" },
  { Icon: Terminal, className: "left-[82%] top-[58%]" },
  { Icon: Rocket, className: "left-[44%] top-[2%]" },
];

function DevOpsCTA({
  title = "Manage Tasks and Projects Efficiently",
  description = "Plan work, assign ownership, track project progress, and keep every team update in one organized workspace built for fast execution.",
  buttonText = "Get Started",
  onBtnClick = () => {},
  accentColor = "#facc15",
}) {
  return (
    <div
      className="rounded-3xl border border-slate-200 bg-gradient-to-b from-slate-50 to-white px-6 py-16 text-center text-slate-900 shadow-xl shadow-slate-200/50 md:px-10 md:py-20"
      style={{ perspective: "1000px" }}
    >
      <motion.div
        initial={{ rotateX: 20, y: 20, opacity: 0 }}
        whileInView={{ rotateX: 0, y: 0, opacity: 1 }}
        viewport={{ once: true, amount: 0.45 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto mb-10 h-[220px] w-[220px]"
      >
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full">
          <motion.circle
            cx="50"
            cy="50"
            r="46"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.65"
            strokeDasharray="10 5"
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          />
          <motion.circle
            cx="50"
            cy="50"
            r="35"
            fill="none"
            stroke={accentColor}
            strokeWidth="0.45"
            strokeDasharray="6 4"
            style={{ transformOrigin: "50% 50%" }}
            animate={{ rotate: -360 }}
            transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
          />
        </svg>

        <div className="absolute left-1/2 top-1/2 z-10 flex h-[110px] w-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-slate-300 bg-white shadow-[0_14px_40px_rgba(15,23,42,0.16)]">
          <Zap size={38} fill={accentColor} color={accentColor} />
        </div>

        {satellites.map(({ Icon, className }, i) => (
          <motion.div
            key={`${i}-${className}`}
            animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 4, delay: i * 0.5, repeat: Infinity, ease: "easeInOut" }}
            className={`absolute z-20 rounded-lg border border-slate-300 bg-white p-2 text-slate-700 ${className}`}
          >
            <Icon size={20} />
          </motion.div>
        ))}
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.6 }}
        className="mx-auto max-w-3xl text-3xl font-black tracking-tight md:text-5xl"
      >
        {title}
      </motion.h2>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.55 }}
        transition={{ delay: 0.08 }}
        className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 md:text-base"
      >
        {description}
      </motion.p>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onBtnClick}
        className="mx-auto mt-9 inline-flex items-center gap-2 rounded-full bg-slate-900 px-7 py-3 text-sm font-semibold text-white"
      >
        <Rocket size={18} />
        {buttonText}
      </motion.button>
    </div>
  );
}

export default DevOpsCTA;
