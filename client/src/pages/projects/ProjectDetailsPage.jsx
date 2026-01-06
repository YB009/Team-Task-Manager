import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import "../../App.css";
import axios from "../../api/axiosInstance";
import { useAuthContext } from "../../context/AuthContext.jsx";
import ProjectKanbanView from "../../components/ProjectKanbanView.jsx";
import ProjectListView from "../../components/ProjectListView.jsx";
import ProjectCalendarView from "../../components/ProjectCalendarView.jsx";

const normalizeStatus = (status = "") => {
  const s = status.toLowerCase();
  if (["done", "completed", "complete", "closed"].includes(s)) return "Completed";
  if (["in progress", "ongoing", "progress"].includes(s)) return "In Progress";
  return "Not Started";
};

export default function ProjectDetailsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { firebaseUser } = useAuthContext();

  const [project, setProject] = useState(location.state?.project || null);
  const [tasks, setTasks] = useState(location.state?.tasks || []);
  const [view, setView] = useState("kanban");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const projectIdFromQuery = searchParams.get("id");

  useEffect(() => {
    const load = async () => {
      if (!firebaseUser || (!projectIdFromQuery && !project)) {
        setLoading(false);
        return;
      }
      if (project && tasks.length) {
        setLoading(false);
        return;
      }
      setError("");
      try {
        setLoading(true);
        const headers = { Authorization: `Bearer ${await firebaseUser.getIdToken()}` };
        const orgRes = await axios.get("/api/orgs", { headers });
        const org = orgRes.data?.[0];
        if (!org) {
          setError("Join or create an organization first.");
          return;
        }
        const [projRes, taskRes] = await Promise.all([
          axios.get(`/api/projects/org/${org.id}`, { headers }),
          axios.get(`/api/tasks/org/${org.id}`, { headers })
        ]);
        const list = projRes.data || [];
        const match = project || list.find((p) => p.id === projectIdFromQuery) || list[0];
        setProject(match || null);
        setTasks((taskRes.data || []).filter((t) => !match || t.projectId === match.id));
      } catch (err) {
        console.error(err);
        setError("Couldn't load project details.");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [firebaseUser, projectIdFromQuery, project, tasks.length]);

  const calendarItems = useMemo(() => {
    return tasks.map((t, idx) => ({
      ...t,
      day: (idx % 7) + 12,
      lane: normalizeStatus(t.status)
    }));
  }, [tasks]);

  return (
    <div className="page-stack">
      <div className="toolbar">
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button className="btn-ghost" onClick={() => navigate("/projects")}>
            ← Back
          </button>
          <div>
            <p className="muted" style={{ margin: 0, fontWeight: 700 }}>Project / Details</p>
            <h2 style={{ margin: 0 }}>{project?.name || "Project"}</h2>
          </div>
        </div>
        <div className="actions" style={{ gap: 8 }}>
          <button className={view === "kanban" ? "btn-primary" : "btn-ghost"} onClick={() => setView("kanban")}>
            Kanban
          </button>
          <button className={view === "list" ? "btn-primary" : "btn-ghost"} onClick={() => setView("list")}>
            List
          </button>
          <button className={view === "calendar" ? "btn-primary" : "btn-ghost"} onClick={() => setView("calendar")}>
            Calendar
          </button>
          {project && (
            <button className="btn-ghost" onClick={() => navigate(`/projects/edit?id=${project.id}`, { state: { project } })}>
              Edit Project
            </button>
          )}
          <button className="btn-ghost" onClick={() => navigate("/tasks/create")}>Create Task</button>
        </div>
      </div>
      {error && <div className="error-banner">{error}</div>}

      {loading && (
        <div className="content-surface">
          <p className="muted">Loading project...</p>
        </div>
      )}

      {!loading && !project && (
        <div className="content-surface">
          <p className="muted">No project selected. Go back to Projects.</p>
          <button className="btn-primary" onClick={() => navigate("/projects")}>
            Back to Projects
          </button>
        </div>
      )}

      {!loading && project && view === "kanban" && (
        <div className="content-surface">
          <ProjectKanbanView tasks={tasks} />
        </div>
      )}

      {!loading && project && view === "list" && (
        <ProjectListView tasks={tasks} />
      )}

      {!loading && project && view === "calendar" && (
        <ProjectCalendarView tasks={tasks} />
      )}
    </div>
  );
}
