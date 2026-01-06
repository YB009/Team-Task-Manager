import { Search, Bell, Settings, LogOut, User } from "lucide-react";
import "./Header.css";
import { useAuthContext } from "../context/AuthContext.jsx";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

export default function Header() {
  const { logout, firebaseUser, user } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, []);

  const displayName =
    user?.name ||
    firebaseUser?.displayName ||
    user?.email ||
    firebaseUser?.email ||
    "User";

  const onSearch = (value) => {
    setSearchTerm(value);
    navigate(`/dashboard?q=${encodeURIComponent(value)}`);
  };

  const handleKey = (e) => {
    if (e.key === "Enter") {
      onSearch(e.target.value);
    }
  };

  const handleBell = () => navigate("/activity");
  const handleSettings = () => navigate("/settings");

  return (
    <header className="app-header">
      <div className="search">
        <Search size={16} />
        <input
          type="text"
          placeholder="Search anything..."
          value={searchTerm}
          onChange={(e) => onSearch(e.target.value)}
          onKeyDown={handleKey}
        />
      </div>
      <div className="header-actions">
        <button className="icon-btn" onClick={handleBell} title="Activity">
          <Bell size={18} />
          <span className="badge-dot" />
        </button>
        <button className="icon-btn" onClick={handleSettings} title="Settings">
          <Settings size={18} />
        </button>
        <div className="avatar-chip" ref={menuRef} onClick={() => setMenuOpen((p) => !p)}>
          <img src={firebaseUser?.photoURL || "https://i.pravatar.cc/40?img=5"} alt="avatar" />
          <span>{displayName}</span>
          {menuOpen && (
            <div className="dropdown">
              <div className="dropdown-section">My Account</div>
              <button className="dropdown-item" onClick={() => navigate("/settings")}>
                <User size={16} />
                <span>Profile</span>
              </button>
              <button className="dropdown-item" onClick={handleSettings}>
                <Settings size={16} />
                <span>Settings</span>
              </button>
              <div className="dropdown-separator" />
              <button className="dropdown-item" onClick={logout}>
                <LogOut size={16} />
                <span>Log out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
