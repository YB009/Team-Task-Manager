import "./App.css";
import LoginPage from "./pages/auth/LoginPage.jsx";
import RegisterPage from "./pages/auth/RegisterPage.jsx";
import OAuthSuccessPage from "./pages/auth/OAuthSuccessPage.jsx";
import { useAuthContext } from "./context/AuthContext.jsx";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar.jsx";
import Header from "./components/Header.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import DashboardAnimated from "./pages/Dashboard-animated.jsx";
import ProjectListPage from "./pages/projects/ProjectListPage.jsx";
import ProjectDetailsPage from "./pages/projects/ProjectDetailsPage.jsx";
import CreateProjectPage from "./pages/projects/CreateProjectPage.jsx";
import EditProjectPage from "./pages/projects/EditProjectPage.jsx";
import TaskBoardPage from "./pages/tasks/TaskBoardPage.jsx";
import TaskDetailsPage from "./pages/tasks/TaskDetailsPage.jsx";
import CreateTaskPage from "./pages/tasks/CreateTaskPage.jsx";
import MyTask from "./pages/MyTask.jsx";
import Activity from "./pages/Activity.jsx";
import Settings from "./pages/Settings.jsx";

function App() {
  const { firebaseUser, loading } = useAuthContext();

  const Protected = ({ children }) => {
    if (loading) {
      return <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", color: "#6b7280" }}>Loading auth...</div>;
    }
    if (!firebaseUser) return <Navigate to="/login" replace />;
    return children;
  };

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/oauth/success" element={<OAuthSuccessPage />} />

      <Route
        path="/*"
        element={
          <Protected>
            <div className="app-shell">
              <Sidebar />
              <main className="main">
                <Header />
                <Routes>
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/dashboard-animated" element={<DashboardAnimated />} />
                  <Route path="/projects" element={<ProjectListPage />} />
                  <Route path="/projects/list" element={<ProjectListPage />} />
                  <Route path="/projects/details" element={<ProjectDetailsPage />} />
                  <Route path="/projects/create" element={<CreateProjectPage />} />
                  <Route path="/projects/edit" element={<EditProjectPage />} />
                  <Route path="/tasks" element={<TaskBoardPage />} />
                  <Route path="/tasks/list" element={<MyTask />} />
                  <Route path="/tasks/details" element={<TaskDetailsPage />} />
                  <Route path="/tasks/create" element={<CreateTaskPage />} />
                  <Route path="/activity" element={<Activity />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </main>
            </div>
          </Protected>
        }
      />
    </Routes>
  );
}

export default App;
