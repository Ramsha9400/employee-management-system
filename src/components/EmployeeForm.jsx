import { useState } from "react";
import Modal from "./Modal";
import { DEPARTMENTS, STATUSES } from "../constants";

const today = () => new Date().toISOString().slice(0, 10);

const EMPTY = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  position: "",
  department: DEPARTMENTS[0],
  age: "",
  salary: "",
  joinDate: today(),
  status: "active",
};

export default function EmployeeForm({ employee, busy, onClose, onSubmit }) {
  const isEdit = Boolean(employee);

  const [values, setValues] = useState(() =>
    isEdit
      ? {
          ...EMPTY,
          ...employee,
          phone: employee.phone ?? "",
          age: String(employee.age),
          salary: String(employee.salary),
        }
      : EMPTY
  );
  const [errors, setErrors] = useState({});

  const set = (name) => (e) => {
    const value = e.target.value;
    setValues((v) => ({ ...v, [name]: value }));
    setErrors((er) => ({ ...er, [name]: undefined }));
  };

  // Props spread onto every control so markup stays short
  const bind = (name) => ({
    id: name,
    name,
    value: values[name],
    onChange: set(name),
    className: errors[name] ? "is-invalid" : undefined,
  });

  const wrap = (name, label, control, full = false) => (
    <div className={`field${full ? " span-2" : ""}`}>
      <label htmlFor={name}>{label}</label>
      {control}
      {errors[name] && <small className="field-error">{errors[name]}</small>}
    </div>
  );

  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...values,
      age: Number(values.age),
      salary: Number(values.salary),
    };
    const result = await onSubmit(payload);
    if (result?.errors) setErrors(result.errors);
  };

  return (
    <Modal
      title={isEdit ? "Edit employee" : "Add employee"}
      subtitle={
        isEdit
          ? `Updating ${employee.firstName} ${employee.lastName}`
          : "Fill in the details below"
      }
      onClose={onClose}
      width={680}
    >
      <form className="form-grid" onSubmit={submit}>
        {wrap("firstName", "First name", <input {...bind("firstName")} required maxLength={60} />)}
        {wrap("lastName", "Last name", <input {...bind("lastName")} required maxLength={60} />)}
        {wrap("email", "Work email", <input type="email" {...bind("email")} required />)}
        {wrap("phone", "Phone", <input {...bind("phone")} placeholder="+92 300 0000000" />)}
        {wrap("position", "Position", <input {...bind("position")} required maxLength={80} />)}
        {wrap(
          "department",
          "Department",
          <select {...bind("department")} required>
            {DEPARTMENTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        )}
        {wrap("age", "Age", <input type="number" min={18} max={70} {...bind("age")} required />)}
        {wrap("salary", "Monthly salary (PKR)", <input type="number" min={0} step={1000} {...bind("salary")} required />)}
        {wrap("joinDate", "Join date", <input type="date" {...bind("joinDate")} required />)}
        {wrap(
          "status",
          "Status",
          <select {...bind("status")} required>
            {STATUSES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        )}

        <div className="form-actions span-2">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={busy}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={busy}>
            {busy ? "Saving…" : isEdit ? "Save changes" : "Add employee"}
          </button>
        </div>
      </form>
    </Modal>
  );
}
