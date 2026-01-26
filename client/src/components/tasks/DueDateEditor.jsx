import { useEffect, useState } from "react";

export default function DueDateEditor({ task, onUpdate }) {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!task?.dueDate) {
      setDate("");
      return;
    }
    try {
      const value = new Date(task.dueDate).toISOString().slice(0, 10);
      setDate(value);
    } catch {
      setDate("");
    }
  }, [task]);

  return (
    <div className="stack">
      <label className="label" htmlFor="due-date-editor">Due date</label>
      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <input
          id="due-date-editor"
          type="date"
          className="form-field"
          style={{ padding: "10px 12px" }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button
          className="btn-ghost"
          type="button"
          onClick={() => onUpdate && onUpdate(date)}
        >
          Update
        </button>
      </div>
    </div>
  );
}
