import { Outlet } from "react-router-dom";
import Sidebar from "../Sidebar.jsx";
import Header from "../Header.jsx";
import SmoothScroll from "../SmoothScroll.jsx";

export default function AppLayout() {
  return (
    <div className="app-shell">
      <SmoothScroll />
      <Sidebar />
      <main className="main">
        <Header />
        <Outlet />
      </main>
    </div>
  );
}
