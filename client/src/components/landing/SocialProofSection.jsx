import { useEffect, useRef } from "react";
import { animate, motion, useInView } from "framer-motion";

const logos = ["NovaOps", "Driftline", "AtlasPath", "CloudNook", "Blueforge", "Vertexa"];
const stats = [
  { label: "Active users", value: 12000 },
  { label: "Teams onboarded", value: 1800 },
  { label: "Tasks tracked daily", value: 76000 },
];

function Counter({ value }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });

  useEffect(() => {
    if (!inView || !ref.current) return;
    const controls = animate(0, value, {
      duration: 1.2,
      ease: "easeOut",
      onUpdate: (latest) => {
        ref.current.textContent = Math.round(latest).toLocaleString();
      },
    });
    return () => controls.stop();
  }, [inView, value]);

  return <span ref={ref}>0</span>;
}

function SocialProofSection() {
  return (
    <section id="social-proof" className="scroll-mt-28 px-6 py-24 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-3xl font-bold tracking-tight text-slate-900 md:text-4xl">Trusted by high-output teams</h2>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.25 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.08 } } }}
          className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6"
        >
          {logos.map((name) => (
            <motion.div
              key={name}
              variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
              className="rounded-xl border border-slate-200 bg-white/80 px-3 py-4 text-center text-sm font-semibold text-slate-700"
            >
              {name}
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {stats.map((item) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="rounded-2xl border border-slate-200 bg-white/80 p-6"
            >
              <p className="text-3xl font-black text-slate-900">
                <Counter value={item.value} />+
              </p>
              <p className="mt-2 text-sm text-slate-600">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default SocialProofSection;
