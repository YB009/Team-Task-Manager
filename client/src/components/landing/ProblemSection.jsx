import { motion } from "framer-motion";
import { EyeOff, Shuffle, UsersRound } from "lucide-react";

const issues = [
  {
    title: "Teams lose visibility",
    body: "Updates live across chat, docs, and meetings. Progress gets guessed instead of measured.",
    icon: EyeOff,
    from: -28,
  },
  {
    title: "Roles stay unclear",
    body: "Important tasks drift because ownership is vague and accountability disappears.",
    icon: UsersRound,
    from: 28,
  },
  {
    title: "Execution feels chaotic",
    body: "Work moves fast, but priorities shift without context or an activity timeline.",
    icon: Shuffle,
    from: -28,
  },
];

function ProblemSection() {
  return (
    <section id="problem" className="scroll-mt-28 px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.h2
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.55 }}
          className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl"
        >
          Most teams do not fail from effort. They fail from unclear coordination.
        </motion.h2>

        {/* Cards stagger in as the section enters viewport */}
        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.2 }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.16 } },
          }}
          className="mt-10 grid gap-6 md:grid-cols-3"
        >
          {issues.map((item) => {
            const Icon = item.icon;
            return (
              <motion.article
                key={item.title}
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
                }}
                className="rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-lg shadow-slate-200/40 backdrop-blur"
              >
                <motion.div
                  initial={{ opacity: 0, x: item.from }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, ease: "easeOut" }}
                  className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-slate-900 text-white"
                >
                  <Icon size={20} />
                </motion.div>
                <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.body}</p>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

export default ProblemSection;
