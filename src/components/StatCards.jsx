import { money } from "../constants";

export default function StatCards({ stats }) {
  const departmentCount = Object.values(stats?.byDepartment ?? {}).filter(
    (n) => n > 0
  ).length;

  const cards = [
    {
      label: "Total employees",
      value: stats?.total,
      hint: `Across ${departmentCount} department${departmentCount === 1 ? "" : "s"}`,
      tone: "teal",
    },
    {
      label: "Active",
      value: stats?.byStatus?.active,
      hint: "Currently working",
      tone: "green",
    },
    {
      label: "On leave",
      value: stats?.byStatus?.["on-leave"],
      hint: "Temporarily away",
      tone: "amber",
    },
    {
      label: "Average salary",
      value: stats ? money.format(stats.avgSalary) : undefined,
      hint: stats ? `Average age ${stats.avgAge} yrs` : "",
      tone: "violet",
    },
  ];

  return (
    <div className="stat-grid">
      {cards.map((c) => (
        <div className={`stat-card tone-${c.tone}`} key={c.label}>
          <p className="stat-label">{c.label}</p>
          <h2 className="stat-value">
            {c.value ?? <span className="skeleton" />}
          </h2>
          <span className="stat-hint">{c.hint}</span>
        </div>
      ))}
    </div>
  );
}
