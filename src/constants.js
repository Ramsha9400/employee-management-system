export const DEPARTMENTS = [
  "Engineering",
  "Human Resources",
  "Finance",
  "Marketing",
  "Sales",
  "Operations",
];

export const STATUSES = [
  { value: "active", label: "Active" },
  { value: "on-leave", label: "On leave" },
  { value: "inactive", label: "Inactive" },
];

export const statusLabel = (value) =>
  STATUSES.find((s) => s.value === value)?.label ?? value;

export const money = new Intl.NumberFormat("en-PK", {
  style: "currency",
  currency: "PKR",
  maximumFractionDigits: 0,
});
