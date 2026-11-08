import { useCallback, useEffect, useState } from "react";
import { api } from "./api";
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import StatCards from "./components/StatCards";
import DepartmentChart from "./components/DepartmentChart";
import EmployeeTable from "./components/EmployeeTable";
import EmployeeForm from "./components/EmployeeForm";
import ConfirmDialog from "./components/ConfirmDialog";
import Toast from "./components/Toast";

const PAGE_SIZE = 8;
const DEFAULT_QUERY = {
  search: "",
  department: "",
  status: "",
  sort: "id",
  order: "asc",
  page: 1,
  limit: PAGE_SIZE,
};
const EMPTY_RESULT = { data: [], total: 0, page: 1, totalPages: 1, limit: PAGE_SIZE };

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem("ems-theme") ?? "light");
  const [query, setQuery] = useState(DEFAULT_QUERY);
  const [searchText, setSearchText] = useState("");
  const [result, setResult] = useState(EMPTY_RESULT);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState(null); // null, or { employee: null | employee }
  const [pendingDelete, setPendingDelete] = useState(null);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("ems-theme", theme);
  }, [theme]);

  // Debounce typing so we don't call the API on every keystroke
  useEffect(() => {
    const timer = setTimeout(() => {
      const term = searchText.trim();
      setQuery((q) => (q.search === term ? q : { ...q, search: term, page: 1 }));
    }, 300);
    return () => clearTimeout(timer);
  }, [searchText]);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      setResult(await api.listEmployees(query));
      setError("");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [query]);

  const loadStats = useCallback(async () => {
    try {
      setStats(await api.getStats());
    } catch {
      // The list request already reports connection problems
    }
  }, []);

  useEffect(() => {
    loadEmployees();
  }, [loadEmployees]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const refreshAll = () => {
    loadEmployees();
    loadStats();
  };

  const notify = useCallback((message, type = "success") => setToast({ message, type }), []);
  const closeToast = useCallback(() => setToast(null), []);

  // Any filter/sort change goes back to page 1 unless a page is given
  const updateQuery = (patch) =>
    setQuery((q) => ({ ...q, ...patch, page: patch.page ?? 1 }));

  const handleSort = (key) => {
    if (query.sort === key) updateQuery({ order: query.order === "asc" ? "desc" : "asc" });
    else updateQuery({ sort: key, order: "asc" });
  };

  // Returns { errors } when the server rejects fields, so the form can show them inline
  const handleSave = async (payload) => {
    const editing = form?.employee;
    setBusy(true);
    try {
      if (editing) await api.updateEmployee(editing.id, payload);
      else await api.createEmployee(payload);
      setForm(null);
      notify(editing ? "Employee updated" : "Employee added");
      refreshAll();
      return {};
    } catch (err) {
      if (Object.keys(err.errors ?? {}).length) return { errors: err.errors };
      notify(err.message, "error");
      return {};
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async () => {
    setBusy(true);
    try {
      await api.deleteEmployee(pendingDelete.id);
      setPendingDelete(null);
      notify("Employee deleted");
      refreshAll();
    } catch (err) {
      notify(err.message, "error");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="app">
      <Sidebar />

      <main className="main">
        <Header
          theme={theme}
          onToggleTheme={() => setTheme((t) => (t === "dark" ? "light" : "dark"))}
          onAdd={() => setForm({ employee: null })}
        />

        {error && (
          <div className="alert" role="alert">
            <span>{error}</span>
            <button className="btn btn-soft" onClick={refreshAll}>
              Retry
            </button>
          </div>
        )}

        <section id="overview" className="overview">
          <StatCards stats={stats} />
          <DepartmentChart stats={stats} />
        </section>

        <EmployeeTable
          result={result}
          query={query}
          loading={loading}
          searchValue={searchText}
          onSearchChange={setSearchText}
          onQueryChange={updateQuery}
          onSort={handleSort}
          onEdit={(employee) => setForm({ employee })}
          onDelete={setPendingDelete}
        />
      </main>

      {form && (
        <EmployeeForm
          key={form.employee?.id ?? "new"}
          employee={form.employee}
          busy={busy}
          onClose={() => setForm(null)}
          onSubmit={handleSave}
        />
      )}

      {pendingDelete && (
        <ConfirmDialog
          employee={pendingDelete}
          busy={busy}
          onCancel={() => setPendingDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      <Toast toast={toast} onClose={closeToast} />
    </div>
  );
}
