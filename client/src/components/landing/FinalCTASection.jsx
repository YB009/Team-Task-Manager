import { useNavigate } from "react-router-dom";
import DevOpsCTA from "./DevOpsCTA.jsx";

function FinalCTASection() {
  const navigate = useNavigate();

  return (
    <section id="final-cta" className="scroll-mt-28 px-6 pb-24 pt-12 md:px-10 lg:px-16">
      <div className="mx-auto max-w-6xl">
        <DevOpsCTA
          title="Manage Tasks and Projects Efficiently"
          description="Organize projects, assign tasks clearly, and monitor team progress with a structured workflow that keeps work on track from planning to completion."
          buttonText="Get Started"
          onBtnClick={() => navigate("/login")}
          accentColor="#facc15"
        />
      </div>
    </section>
  );
}

export default FinalCTASection;
