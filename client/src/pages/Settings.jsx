import "./Settings.css";

export default function Settings() {
  return (
    <div className="page-stack">
      <div className="toolbar">
        <h1>Settings</h1>
        <div className="actions">
          <button className="btn-primary">Save Changes</button>
        </div>
      </div>
      <div className="content-surface settings-grid">
        <div className="form-card">
          <h3>Profile</h3>
          <label className="form-field">
            <span>Name</span>
            <input type="text" placeholder="Jackson Pierce" />
          </label>
          <label className="form-field">
            <span>Email</span>
            <input type="email" placeholder="jackson@example.com" />
          </label>
        </div>

        <div className="form-card">
          <h3>Security</h3>
          <label className="form-field">
            <span>Password</span>
            <input type="password" placeholder="••••••••" />
          </label>
          <label className="form-field">
            <span>Two-factor</span>
            <select defaultValue="Enabled">
              <option>Enabled</option>
              <option>Disabled</option>
            </select>
          </label>
        </div>
      </div>
    </div>
  );
}
