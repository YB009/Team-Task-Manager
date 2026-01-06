import "./TaskColumn.css";
import TaskItem from "./TaskItem.jsx";
import EmptyState from "./EmptyState.jsx";

export default function TaskColumn({ title, tasks = [], onDragStart, onDrop }) {
  return (
    <div
      className="task-column"
      onDragOver={(e) => {
        if (onDrop) e.preventDefault();
      }}
      onDrop={(e) => {
        if (onDrop) {
          e.preventDefault();
          onDrop();
        }
      }}
    >
      <div className="task-column__header">
        <h3>{title}</h3>
        <span className="task-column__count">{tasks.length}</span>
      </div>
      <div className="task-column__stack">
        {tasks.length === 0 && <EmptyState title="Nothing here" description="Drag tasks into this column." compact />}
        {tasks.map((task) => (
          <div
            key={task.id}
            draggable={!!onDragStart}
            onDragStart={() => onDragStart && onDragStart(task, title)}
          >
            <TaskItem task={task} />
          </div>
        ))}
      </div>
    </div>
  );
}
