import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import teamsImage from "../../assets/landing/features/teams.png";
import tasksImage from "../../assets/landing/features/tasks.png";
import projectsImage from "../../assets/landing/features/projects.png";
import activityImage from "../../assets/landing/features/activity.png";

const tabs = {
  Teams: {
    title: "Build aligned teams in minutes",
    text: "Group members by function and visibility so everyone understands who owns what.",
    bullets: ["Smart grouping", "Department views", "Cross-team collaboration"],
    image: teamsImage,
  },
  Tasks: {
    title: "Task execution without bottlenecks",
    text: "Create, assign, and prioritize tasks with clear ownership so work moves from backlog to done faster.",
    bullets: ["Smart task assignment", "Priority and due dates", "Status tracking and follow-ups"],
    image: tasksImage,
  },
  Projects: {
    title: "Keep projects moving with structure",
    text: "Track goals, deadlines, and dependencies in one board built for real team velocity.",
    bullets: ["Timeline view", "Status automation", "Dependency alerts"],
    image: projectsImage,
  },
  Activity: {
    title: "See every key decision in real time",
    text: "Workvite captures a clean activity feed so leaders always know what changed and why.",
    bullets: ["Unified timeline", "Audit clarity", "Instant highlights"],
    image: activityImage,
  },
};

function FeaturesSection() {
  const [active, setActive] = useState("Teams");
  const data = tabs[active];

  return (
    <section id="features" className="scroll-mt-28 px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Core Features</h2>
        <p className="mt-3 max-w-2xl text-slate-600">
          Navigate the platform with interactive previews that mirror how Workvite handles daily execution.
        </p>

        <div className="mt-8 flex flex-wrap gap-3 rounded-2xl border border-slate-200 bg-white/70 p-2 backdrop-blur">
          {Object.keys(tabs).map((tab) => (
            <motion.button
              key={tab}
              whileTap={{ scale: 0.97 }}
              onClick={() => setActive(tab)}
              className={`rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                active === tab ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <div className="mt-6 overflow-hidden rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-xl shadow-slate-200/40 backdrop-blur md:p-8">
          <AnimatePresence mode="wait">
            {/* Feature panel swaps with fade + scale for smooth tab transitions */}
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="grid gap-6 md:grid-cols-2"
            >
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{data.title}</h3>
                <p className="mt-3 text-slate-600">{data.text}</p>
                <div className="mt-6 space-y-3">
                  {data.bullets.map((item, idx) => (
                    <motion.div
                      key={item}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.35, delay: idx * 0.1 }}
                      className="rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium text-slate-700"
                    >
                      {item}
                    </motion.div>
                  ))}
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.08 }}
                className="relative overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-white p-4"
              >
                <motion.img
                  key={active}
                  src={data.image}
                  alt={`${active} preview`}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  className="h-full min-h-[280px] w-full rounded-xl object-cover object-center shadow-lg shadow-slate-300/40"
                />
                <div className="pointer-events-none absolute inset-x-4 bottom-4 rounded-lg bg-white/80 p-3 backdrop-blur">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{active} Workspace</p>
                  <p className="mt-1 text-sm font-medium text-slate-700">Live preview of the {active.toLowerCase()} view in Workvite.</p>
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;
