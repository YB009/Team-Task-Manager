import { useMemo, useState } from "react";
import TaskColumn from "./TaskColumn.jsx";

const normalizeStatus = (status = "") => {
  const s = status.toLowerCase();
  if (["done", "completed", "complete", "closed"].includes(s)) return "Completed";
  if (["in progress", "ongoing", "progress"].includes(s)) return "In Progress";
  return "Not Started";
};

export default function ProjectKanbanView({ tasks = [] }) {
  const initialBuckets = useMemo(() => {
    const buckets = { "Not Started": [], "In Progress": [], Completed: [] };
    tasks.forEach((t) => {
      buckets[normalizeStatus(t.status)].push(t);
    });
    return buckets;
  }, [tasks]);

  const [buckets, setBuckets] = useState(initialBuckets);
  const [dragging, setDragging] = useState(null);

  const onDragStart = (task, from) => {
    setDragging({ task, from });
  };

  const onDrop = (to) => {
    if (!dragging) return;
    const next = { ...buckets, [dragging.from]: [...buckets[dragging.from]], [to]: [...buckets[to]] };
    next[dragging.from] = next[dragging.from].filter((t) => t.id !== dragging.task.id);
    next[to].push({ ...dragging.task, status: to });
    setBuckets(next);
    setDragging(null);
  };

  return (
    <div className="board">
      {Object.entries(buckets).map(([title, list]) => (
        <TaskColumn
          key={title}
          title={title}
          tasks={list}
          onDragStart={onDragStart}
          onDrop={() => onDrop(title)}
        />
      ))}
    </div>
  );
}
