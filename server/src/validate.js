export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
];

export const STATUSES = ["active", "on-leave", "inactive"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_RE = /^[+\d\s()-]{7,20}$/;
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// Returns { valid, data, errors }. `data` only contains sanitized known fields.
export function validateEmployee(body) {
  const input = body && typeof body === "object" ? body : {};
  const errors = {};
  const data = {};

  const text = (field, label, max = 60) => {
    const value = typeof input[field] === "string" ? input[field].trim() : "";
    if (!value) errors[field] = `${label} is required`;
    else if (value.length > max) errors[field] = `${label} must be ${max} characters or fewer`;
    else data[field] = value;
  };

  text("firstName", "First name");
  text("lastName", "Last name");
  text("position", "Position", 80);

  const email = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (!email) errors.email = "Email is required";
  else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";
  else data.email = email;

  const phone = typeof input.phone === "string" ? input.phone.trim() : "";
  if (phone && !PHONE_RE.test(phone)) errors.phone = "Enter a valid phone number";
  else data.phone = phone;

  if (!DEPARTMENTS.includes(input.department)) errors.department = "Select a valid department";
  else data.department = input.department;

  const status = input.status ?? "active";
  if (!STATUSES.includes(status)) errors.status = "Select a valid status";
  else data.status = status;

  const age = Number(input.age);
  if (!Number.isInteger(age) || age < 18 || age > 70) errors.age = "Age must be between 18 and 70";
  else data.age = age;

  const salary = Number(input.salary);
  if (!Number.isFinite(salary) || salary <= 0) errors.salary = "Enter a salary greater than 0";
  else data.salary = Math.round(salary);

  const joinDate = input.joinDate || new Date().toISOString().slice(0, 10);
  if (!DATE_RE.test(joinDate) || Number.isNaN(Date.parse(joinDate))) errors.joinDate = "Enter a valid join date";
  else data.joinDate = joinDate;

  return { valid: Object.keys(errors).length === 0, data, errors };
}
