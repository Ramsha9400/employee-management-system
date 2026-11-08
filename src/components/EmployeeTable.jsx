import Icon from "./Icon";
import { DEPARTMENTS, STATUSES, money, statusLabel } from "../constants";

const COLUMNS = [
  { key: "firstName", label: "Employee" },
  { key: "department", label: "Department" },
  { key: "age", label: "Age" },
  { key: "salary", label: "Salary" },
  { key: "joinDate", label: "Joined" },
];

const initials = (e) =>
  `${e.firstName?.[0] ?? ""}${e.lastName?.[0] ?? ""}`.toUpperCase();

export default function EmployeeTable({
  result,
  query,
  loading,
  searchValue,
  onSearchChange,
  onQueryChange,
  onSort,
  onEdit,
  onDelete,
}) {
  const { data, total, page, totalPages, limit } = result;
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <section id="employees" className="card">
      <div className="card-head">
        <div>
          <h3>Employees</h3>
          <p>Search, filter, sort and manage your team</p>
        </div>
      </div>

      <div className="toolbar">
        <label className="search">
          <Icon name="search" size={16} />
          <input
            type="search"
            placeholder="Search name, email or position"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </label>

        <select
          aria-label="Filter by department"
          value={query.department}
          onChange={(e) => onQueryChange({ department: e.target.value })}
        >
          <option value="">All departments</option>
          {DEPARTMENTS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <select
          aria-label="Filter by status"
          value={query.status}
          onChange={(e) => onQueryChange({ status: e.target.value })}
        >
          <option value="">All statuses</option>
          {STATUSES.map((s) => (
            <option key={s.value} value={s.value}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div className="table-wrap">
        <table>
          <thead>
            <tr>
              <th className="col-num">#</th>
              {COLUMNS.map((col) => (
                <th key={col.key}>
                  <button className="sort-btn" onClick={() => onSort(col.key)}>
                    {col.label}
                    {query.sort === col.key && (
                      <Icon
                        name={query.order === "asc" ? "arrowUp" : "arrowDown"}
                        size={14}
                      />
                    )}
                  </button>
                </th>
              ))}
              <th>Status</th>
              <th className="col-actions">Actions</th>
            </tr>
          </thead>

          <tbody>
            {data.map((e, i) => (
              <tr key={e.id}>
                <td className="muted">{from + i}</td>
                <td>
                  <div className="person">
                    <span className="avatar">{initials(e)}</span>
                    <div>
                      <strong>
                        {e.firstName} {e.lastName}
                      </strong>
                      <small>{e.email}</small>
                    </div>
                  </div>
                </td>
                <td>{e.department}</td>
                <td>{e.age}</td>
                <td>{money.format(e.salary)}</td>
                <td>{e.joinDate}</td>
                <td>
                  <span className={`badge badge-${e.status}`}>
                    {statusLabel(e.status)}
                  </span>
                </td>
                <td>
                  <div className="actions">
                    <button className="btn btn-soft" onClick={() => onEdit(e)}>
                      <Icon name="edit" size={15} />
                      Edit
                    </button>
                    <button
                      className="btn btn-soft-danger"
                      onClick={() => onDelete(e)}
                    >
                      <Icon name="trash" size={15} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {loading && <div className="table-state">Loading employees…</div>}
        {!loading && data.length === 0 && (
          <div className="table-state">
            <h4>No employees found</h4>
            <p>Try a different search or clear the filters.</p>
          </div>
        )}
      </div>

      <div className="pagination">
        <span className="muted">
          Showing {from}–{to} of {total}
        </span>
        <div className="pager">
          <button
            className="icon-btn"
            disabled={page <= 1}
            onClick={() => onQueryChange({ page: page - 1 })}
            aria-label="Previous page"
          >
            <Icon name="chevronLeft" />
          </button>
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="icon-btn"
            disabled={page >= totalPages}
            onClick={() => onQueryChange({ page: page + 1 })}
            aria-label="Next page"
          >
            <Icon name="chevronRight" />
          </button>
        </div>
      </div>
    </section>
  );
}
