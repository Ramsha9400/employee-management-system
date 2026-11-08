import Icon from "./Icon";

export default function Header({ theme, onToggleTheme, onAdd }) {
  return (
    <header className="topbar">
      <div>
        <p className="eyebrow">Employee management</p>
        <h1>Employee Directory</h1>
      </div>

      <div className="topbar-actions">
        <button
          className="icon-btn"
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          title="Toggle theme"
        >
          <Icon name={theme === "dark" ? "sun" : "moon"} />
        </button>
        <button className="btn btn-primary" onClick={onAdd}>
          <Icon name="plus" size={16} />
          Add employee
        </button>
      </div>
    </header>
  );
}
