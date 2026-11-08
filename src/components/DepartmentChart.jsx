import { DEPARTMENTS } from "../constants";

export default function DepartmentChart({ stats }) {
  const counts = stats?.byDepartment ?? {};
  const max = Math.max(1, ...Object.values(counts));

  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h3>Headcount by department</h3>
          <p>Live distribution across teams</p>
        </div>
      </div>

      <ul className="bars">
        {DEPARTMENTS.map((dept) => {
          const count = counts[dept] ?? 0;
          return (
            <li key={dept}>
              <div className="bar-meta">
                <span>{dept}</span>
                <strong>{count}</strong>
              </div>
              <div className="bar-track">
                <div
                  className="bar-fill"
                  style={{ width: `${(count / max) * 100}%` }}
                />
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
