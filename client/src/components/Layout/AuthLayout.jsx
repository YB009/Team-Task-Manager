import "./AuthLayout.css";
import SmoothScroll from "../SmoothScroll.jsx";
import Particles from "../background/Particles.jsx";

export default function AuthLayout({ children, title = "Welcome to Workvite" }) {
  return (
    <div className="auth-shell" style={{ minHeight: "100dvh" }}>
      <SmoothScroll />
      <Particles
        particleColors={["#111111"]}
        particleCount={180}
        particleSpread={10}
        speed={0.1}
        particleBaseSize={90}
        moveParticlesOnHover={true}
        alphaParticles={false}
        disableRotation={false}
        pixelRatio={1}
      />
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
