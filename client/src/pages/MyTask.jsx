import "./MyTask.css";
import { FadeIn } from "../utils/animations.jsx";

const tasks = [
  { id: "t1", title: "Design feedback on wireframe", due: "7 Oct", priority: "Hard", objective: "3 Objective", status: "Ongoing", project: "Bookum App" },
  { id: "t2", title: "Moodboarding", due: "7 Oct", priority: "Hard", objective: "3 Objective", status: "Ongoing", project: "Bookum App" },
  { id: "t3", title: "UI Iteration", due: "7 Oct", priority: "Medium", objective: "3 Objective", status: "Finished", project: "Bookum App" },
  { id: "t4", title: "Activity Inbox advance filter", due: "7 Oct", priority: "Medium", objective: "3 Objective", status: "Ongoing", project: "Bookum App" },
];

export default function MyTask() {
  return (
    <div className="page-stack">
      <div className="toolbar">
        <h1>My Task</h1>
        <div className="actions">
          <button className="btn-ghost">All Task</button>
          <button className="btn-primary">Add Task</button>
        </div>
      </div>
      <div className="content-surface">
        <div className="task-table">
          <div className="task-table__head">
            <span>Task</span>
            <span>Due Date</span>
            <span>Priority</span>
            <span>Objective</span>
            <span>Status</span>
            <span>Project</span>
          </div>
          <div className="task-table__body">
            {tasks.map((t, idx) => (
              <FadeIn key={t.id} delay={idx * 50}>
                <div className="task-row">
                  <span className="task-title">{t.title}</span>
                  <span>{t.due}</span>
                  <span className={`pill priority-${t.priority.toLowerCase()}`}>{t.priority}</span>
                  <span>{t.objective}</span>
                  <span className={`pill status-${t.status.toLowerCase()}`}>{t.status}</span>
                  <span>{t.project}</span>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
