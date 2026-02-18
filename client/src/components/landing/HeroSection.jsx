import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Ballpit from "../Ballpit.jsx";

const headingMotion = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: "easeOut" } },
};

const subMotion = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, delay: 0.12, ease: "easeOut" } },
};

function HeroSection() {
  const navigate = useNavigate();
  const scrollToShowcase = () => {
    const showcase = document.querySelector("#showcase");
    if (showcase) {
      showcase.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <section id="hero" className="relative isolate flex min-h-screen scroll-mt-28 items-center overflow-hidden px-6 py-16 md:px-10 lg:px-16">
      <div className="pointer-events-none absolute inset-0 -z-20">
        <Ballpit
          count={65}
          gravity={0.01}
          friction={0.9965}
          wallBounce={0.94}
          followCursor={false}
          className="opacity-60"
        />
      </div>
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-[#f2f9ff]/70 via-[#f7fffb]/70 to-[#f8fafc]" />

      <div className="mx-auto grid w-full max-w-7xl items-center gap-12 lg:grid-cols-2">
        <div>
          {/* Headline uses fade + upward slide for first-impression emphasis */}
          <motion.h1
            variants={headingMotion}
            initial="hidden"
            animate="show"
            className="max-w-xl text-4xl font-black leading-tight tracking-tight text-slate-900 md:text-5xl lg:text-6xl"
          >
            Plan projects, assign tasks, and track team progress in one organized workspace.
          </motion.h1>
          <motion.p
            variants={subMotion}
            initial="hidden"
            animate="show"
            className="mt-6 max-w-lg text-base text-slate-600 md:text-lg"
          >
            Workvite gives your team clear ownership, structured workflows, and real-time visibility from kickoff to delivery.
          </motion.p>
          <motion.div
            variants={subMotion}
            initial="hidden"
            animate="show"
            className="mt-8 flex flex-wrap gap-4"
          >
            <motion.button
              onClick={() => navigate("/login")}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white shadow-xl shadow-slate-900/30"
            >
              Get Started
            </motion.button>
            <motion.button
              onClick={scrollToShowcase}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              className="rounded-xl border border-slate-300 bg-white/80 px-6 py-3 text-sm font-semibold text-slate-900"
            >
              View Demo
            </motion.button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          whileHover={{ y: -8, rotateX: 3, rotateY: -3 }}
          className="mx-auto w-full max-w-2xl rounded-3xl border border-white/60 bg-white/75 p-3 shadow-2xl shadow-sky-900/20 backdrop-blur"
        >
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-rose-400" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-emerald-400" />
            </div>
            <div className="grid gap-4 md:grid-cols-[1.3fr_1fr]">
              <div className="rounded-xl bg-white p-4 shadow-sm">
                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Project Timeline</p>
                <div className="mt-4 h-2 rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: "78%" }}
                    transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full bg-gradient-to-r from-sky-500 to-emerald-500"
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <div className="h-8 rounded-lg bg-slate-100" />
                  <div className="h-8 rounded-lg bg-slate-100" />
                  <div className="h-8 rounded-lg bg-slate-100" />
                </div>
              </div>
              <div className="space-y-4">
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Team Activity</p>
                  <motion.div
                    animate={{ opacity: [0.35, 1, 0.35] }}
                    transition={{ repeat: Infinity, duration: 2.6 }}
                    className="mt-3 h-20 rounded-lg bg-gradient-to-br from-cyan-100 to-sky-200"
                  />
                </div>
                <div className="rounded-xl bg-white p-4 shadow-sm">
                  <p className="text-sm font-semibold text-slate-800">9 tasks need assignment</p>
                  <p className="mt-1 text-xs text-slate-500">Workvite auto-highlights unowned tasks</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
