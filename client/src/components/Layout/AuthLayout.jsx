import "./AuthLayout.css";
import SmoothScroll from "../SmoothScroll.jsx";

export default function AuthLayout({ children, title = "Welcome back" }) {
  return (
    <div className="auth-shell" style={{ minHeight: "100dvh" }}>
      <SmoothScroll />
      <div className="auth-card">
        <div className="auth-card__header">
          <h1>{title}</h1>
        </div>
        {children}
      </div>
    </div>
  );
}
