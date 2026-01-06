import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Activity,
  Users,
  MessageSquare,
  Settings,
} from "lucide-react";
import "./Sidebar.css";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/projects", label: "Project", icon: FolderKanban },
  { to: "/tasks", label: "My Task", icon: CheckSquare },
  { to: "/activity", label: "Activity", icon: Activity },
  { to: "/team", label: "Team", icon: Users },
  { to: "/messages", label: "Messages", icon: MessageSquare },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar__top">
        <h2>Dashhboard</h2>
      </div>
      <nav className="sidebar__nav">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
          >
            <Icon size={18} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar__workspace">
        <p className="sidebar__workspace-label">Workspace</p>
        <div className="sidebar__workspace-chip">
          <span className="dot" />
          Superboard
        </div>
      </div>
    </aside>
  );
}
