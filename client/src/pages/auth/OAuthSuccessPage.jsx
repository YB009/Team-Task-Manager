import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../context/AuthContext.jsx";
// Antigravity removed here to avoid WebGL context loss during OAuth flow

export default function OAuthSuccessPage() {
  const navigate = useNavigate();
  const { firebaseUser, loading } = useAuthContext();
  const [readyToRedirect, setReadyToRedirect] = useState(false);
  const [showCanvas, setShowCanvas] = useState(false);
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });
  const [blink, setBlink] = useState(false);

  useEffect(() => {
    const track = (e) => {
      const x = e.clientX / window.innerWidth;
      const y = e.clientY / window.innerHeight;
      setPointer({ x, y });
    };
    window.addEventListener("mousemove", track);

    const blinkTimer = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 120);
    }, 3200);

    const visibilityHandler = () => {
      setShowCanvas(!document.hidden);
    };
    document.addEventListener("visibilitychange", visibilityHandler);

    return () => {
      window.removeEventListener("mousemove", track);
      document.removeEventListener("visibilitychange", visibilityHandler);
      clearInterval(blinkTimer);
    };
  }, []);

  useEffect(() => {
    if (loading) return;
    if (!firebaseUser) {
      navigate("/login", { replace: true });
      return;
    }
    setReadyToRedirect(true);
  }, [firebaseUser, loading, navigate]);

  const handleContinue = () => {
    if (document.hidden) return;
    if (!readyToRedirect) return;
    navigate("/dashboard", { replace: true });
  };

  return (
    <div className="antigravity-bg">
      {showCanvas && (
        <div className="antigravity-canvas" />
      )}
      <div className="oauth-hero" onClick={handleContinue} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && handleContinue()}>
        <Eyes pointer={pointer} blink={blink} />
        <h1
          className="hero-title"
          style={{
            transform: `translate3d(${(pointer.x - 0.5) * 20}px, ${(pointer.y - 0.5) * 12}px, 0)`,
          }}
        >
          Welcome to WorkVite
        </h1>
        <p className="muted hero-sub">Tap, click, or press Enter to continue</p>
      </div>
    </div>
  );
}

const Eyes = ({ pointer, blink }) => {
  const amplitude = 18; // allow more travel, especially to the left
  const pupilX = (pointer.x - 0.5) * amplitude;
  const pupilY = (pointer.y - 0.5) * amplitude;
  return (
    <div className="eye-wrap duo">
      {[0, 1].map((i) => (
        <div key={i} className={`eye ${blink ? "blink" : ""}`}>
          <div className="pupil" style={{ transform: `translate(${pupilX}px, ${pupilY}px)` }} />
        </div>
      ))}
    </div>
  );
};
