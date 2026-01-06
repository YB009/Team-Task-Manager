import "./Activity.css";
import { FadeIn } from "../utils/animations.jsx";
import { MessageSquare } from "lucide-react";

const feed = [
  { id: "a1", title: "Landing Page V2 Work Area", meta: "Yesterday at 09.30am", desc: "Due date changed Sep 20 - 21." },
  { id: "a2", title: "Sunstone Design Feedbacks", meta: "Today 11.00am", desc: "New attachment added." },
  { id: "a3", title: "Client Meeting", meta: "Today 12.30pm", desc: "Video file uploaded." },
];

export default function Activity() {
  return (
    <div className="page-stack">
      <div className="toolbar">
        <h1>Activity</h1>
        <div className="actions">
          <button className="btn-ghost">Filter</button>
          <button className="btn-primary">New Comment</button>
        </div>
      </div>
      <div className="content-surface">
        <div className="activity-feed">
          {feed.map((item, idx) => (
            <FadeIn key={item.id} delay={idx * 60}>
              <div className="activity-row">
                <div className="activity-bubble">
                  <MessageSquare size={16} />
                </div>
                <div>
                  <p className="activity-title">{item.title}</p>
                  <p className="activity-meta">{item.meta}</p>
                  <p className="activity-desc">{item.desc}</p>
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </div>
  );
}
