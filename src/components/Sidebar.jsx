import Icon from "./Icon";

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">E</div>
        <div>
          <strong>EMS</strong>
          <span>People Platform</span>
        </div>
      </div>

      <nav className="nav">
        <p className="nav-label">Workspace</p>
        <a href="#overview" className="nav-link">
          <Icon name="dashboard" />
          Overview
        </a>
        <a href="#employees" className="nav-link">
          <Icon name="users" />
          Employees
        </a>
      </nav>

      <div className="sidebar-footer">
        <p>Signed in as</p>
        <strong>Admin</strong>
      </div>
    </aside>
  );
}
